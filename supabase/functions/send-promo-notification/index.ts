import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')!

  let body: { title?: string; body?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { title, body: messageBody } = body

  if (!title || !messageBody) {
    return new Response(JSON.stringify({ error: 'Both title and body are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Insert broadcast notification (user_id = null, type = 'promo')
  await supabase.from('notifications').insert({
    user_id: null,
    type: 'promo',
    title,
    body: messageBody,
  })

  // Fetch all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, notification_prefs')

  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let sentCount = 0

  for (const profile of profiles ?? []) {
    const prefs = profile.notification_prefs ?? {}

    // Skip users who have opted out of offers/promos
    if (prefs.offers === false) continue

    // Fetch push tokens from separate table
    const { data: tokenRows } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', profile.id)

    const pushTokens = tokenRows ?? []

    if (pushTokens.length === 0) continue

    for (const tokenRow of pushTokens) {
      try {
        await fetch(tokenRow.token, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${FCM_SERVER_KEY}`,
          },
          body: JSON.stringify({
            notification: { title, body: messageBody },
          }),
        })
        sentCount++
      } catch (_err) {
        // Continue even if one push fails
      }
    }
  }

  return new Response(JSON.stringify({ sent: sentCount }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
