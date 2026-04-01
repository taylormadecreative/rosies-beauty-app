/* =====================================================
   ROSIE'S BEAUTY SPA — SUPABASE CLIENT + DATA LAYER
   Client init, auth helpers, data fetchers, storage
   ===================================================== */

const SUPABASE_URL = 'https://rrpcfltqtebohkebrhpn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycGNmbHRxdGVib2hrZWJyaHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQzOTAsImV4cCI6MjA5MDU5MDM5MH0._SwK5Ba2VB-yBc-rGyN6bC7QTebwSqaIshzgdt4LLug';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SupabaseData = {
  // Auth
  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) throw error;
    return data;
  },
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data;
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
  getSession() { return supabase.auth.getSession(); },
  getUser() { return supabase.auth.getUser(); },
  onAuthStateChange(callback) { return supabase.auth.onAuthStateChange(callback); },

  // Profile
  async getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  },
  async updateProfile(userId, updates) {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
    if (error) throw error;
    return data;
  },

  // Avatar Storage
  async uploadAvatar(userId, file) {
    const resized = await SupabaseData._resizeImage(file, 400);
    const filePath = `${userId}.jpg`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, resized, { upsert: true, contentType: 'image/jpeg' });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const photoUrl = urlData.publicUrl + '?t=' + Date.now();
    await SupabaseData.updateProfile(userId, { photo_url: photoUrl });
    return photoUrl;
  },
  _resizeImage(file, maxSize) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = maxSize; canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          const min = Math.min(img.width, img.height);
          const sx = (img.width - min) / 2, sy = (img.height - min) / 2;
          ctx.drawImage(img, sx, sy, min, min, 0, 0, maxSize, maxSize);
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // Appointments
  async getUpcomingAppointment(userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('appointments').select('*').eq('user_id', userId).eq('status', 'booked').gte('date', today).order('date', { ascending: true }).order('time', { ascending: true }).limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
  async getPastAppointments(userId, limit = 10) {
    const { data, error } = await supabase.from('appointments').select('*').eq('user_id', userId).eq('status', 'completed').order('date', { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  },

  // Rewards
  async getRewardsHistory(userId, limit = 20) {
    const { data, error } = await supabase.from('rewards_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  },
  async redeemReward(userId, points, description) {
    const { data, error } = await supabase.rpc('redeem_reward', { p_user_id: userId, p_points: points, p_description: description });
    if (error) throw error;
    return data;
  },

  // Push Tokens
  async savePushToken(userId, token, platform) {
    const { error } = await supabase.from('push_tokens').upsert({ user_id: userId, token, platform }, { onConflict: 'user_id,token' });
    if (error) throw error;
  },
  async removePushToken(userId, token) {
    const { error } = await supabase.from('push_tokens').delete().eq('user_id', userId).eq('token', token);
    if (error) throw error;
  },

  // Notifications
  async getNotifications(userId, limit = 20) {
    const { data, error } = await supabase.from('notifications').select('*').or(`user_id.eq.${userId},user_id.is.null`).order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  },
  async markNotificationRead(notificationId) {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    if (error) throw error;
  },

  // Delete Account
  async deleteAccount() {
    const { error } = await supabase.functions.invoke('delete-user');
    if (error) throw error;
  }
};
