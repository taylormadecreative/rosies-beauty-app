import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')!

  const now = new Date()
  const windowStart = new Date(now.getTime() + 45 * 60 * 1000) // 45 min from now
  const windowEnd = new Date(now.getTime() + 75 * 60 * 1000)   // 75 min from now

  // Fetch all booked appointments where reminder hasn't been sent yet
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('id, user_id, date, time, service_id')
    .eq('status', 'booked')
    .eq('reminder_sent', false)

  if (apptError) {
    return new Response(JSON.stringify({ error: apptError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let sentCount = 0

  for (const appt of appointments ?? []) {
    // Combine date + time into a DateTime
    const apptDateTime = new Date(`${appt.date}T${appt.time}`)

    // Only process if appointment falls within the 45–75 min window
    if (apptDateTime < windowStart || apptDateTime > windowEnd) continue

    // Check user notification preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('notification_prefs')
      .eq('id', appt.user_id)
      .single()

    if (!profile) continue

    const prefs = profile.notification_prefs ?? {}
    if (prefs.reminders === false) continue

    // Fetch push tokens from separate table
    const { data: tokenRows } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', appt.user_id)

    const pushTokens = tokenRows ?? []

    if (pushTokens.length === 0) continue

    // Send Web Push to each token via FCM
    for (const tokenRow of pushTokens) {
      try {
        await fetch(tokenRow.token, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${FCM_SERVER_KEY}`,
          },
          body: JSON.stringify({
            notification: {
              title: "Your appointment is coming up!",
              body: "You have an appointment at Rosie's Beauty Spa in about 45 minutes.",
            },
          }),
        })
      } catch (_err) {
        // Continue even if one push fails
      }
    }

    // Mark reminder_sent = true
    await supabase
      .from('appointments')
      .update({ reminder_sent: true })
      .eq('id', appt.id)

    // Insert notification record
    await supabase.from('notifications').insert({
      user_id: appt.user_id,
      type: 'reminder',
      title: "Your appointment is coming up!",
      body: "You have an appointment at Rosie's Beauty Spa in about 45 minutes.",
    })

    sentCount++
  }

  return new Response(JSON.stringify({ sent: sentCount }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
