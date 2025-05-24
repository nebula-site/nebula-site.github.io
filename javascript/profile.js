import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.43.4/+esm';

const supabaseUrl = 'https://isbtanymydnffawwembt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYnRhbnlteWRuZmZhd3dlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzU4MDQsImV4cCI6MjA2MzUxMTgwNH0.aCAs5MI2FjQaPVgpVMF0EFgZM3lYQ0J3JZO_jy2n6LI';

const supabase = createClient(supabaseUrl, supabaseKey);
const currentPage = window.location.pathname;

// -------------------- SIGNUP PAGE --------------------
if (currentPage.includes('signup.html')) {
  const form = document.getElementById('signup-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const username = document.getElementById('username').value;

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);

      const user = data?.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username }]);

        if (profileError) alert(profileError.message);
        else {
          alert('Signed up successfully! Now log in.');
          window.location.href = 'login.html';
        }
      }
    });
  }
}

// -------------------- LOGIN PAGE --------------------
if (currentPage.includes('login.html')) {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);

      window.location.href = 'profile.html';
    });
  }
}

// -------------------- PROFILE PAGE --------------------
if (currentPage.includes('profile.html')) {
  document.addEventListener('DOMContentLoaded', async () => {
    await checkUser();

    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
      });
    }

    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
      avatarUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) await uploadAvatar(file);
      });
    }
  });

  async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      window.location.href = 'login.html';
      return;
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) return alert('Failed to load profile');

    document.getElementById('username').textContent = data.username;
    document.getElementById('avatar').src = data.avatar_url || 'https://via.placeholder.com/100';
  }

  async function uploadAvatar(file) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return alert('Not logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) return alert('Upload failed: ' + uploadError.message);

    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = publicData?.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) return alert('Update failed: ' + updateError.message);
    document.getElementById('avatar').src = publicUrl;
    alert('Avatar updated!');
  }
}
