import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Supabase and Global Constants ---
const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc';
const MAX_FILE_SIZE = 500 * 1024;
const ADMIN_EMAIL_CHECK = 'REESDOLSEN@GMAIL.COM'.toUpperCase().trim();
const STORAGE_KEY = 'nebula_profile';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const defaultAvatar = "/images/user.png";

// --- UTILITY FUNCTIONS ---

function compressImage(base64Str, maxWidth = 120, maxHeight = 120) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
            } else {
                if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.onerror = () => resolve(defaultAvatar);
    });
}

function saveProfileToStorage(profile) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        updateFloatingProfile(profile);
        checkAdminStatusAndDispatch(profile);
    } catch (e) { console.error('Storage error:', e); }
}

function getProfileFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
}

function clearProfileStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('sb-lhurtuuxsmlakoikcpiz-auth-token'); 
        updateFloatingProfile(null);
        checkAdminStatusAndDispatch(null);
    } catch (e) { console.error('Storage error:', e); }
}

function checkAdminStatusAndDispatch(profile) {
    const email = profile?.email?.toUpperCase().trim() || null;
    const isAdmin = email === ADMIN_EMAIL_CHECK;
    window.dispatchEvent(new CustomEvent('adminStatusChecked', {
        detail: { isAdmin, email }
    }));
}

function showError(msg) {
    const el = document.getElementById('error-message');
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 5000);
    }
}

function showSuccess(msg) {
    const el = document.getElementById('success-message');
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }
}

// --- UI UPDATE FUNCTIONS ---
function showProfile(user) {
    if (!user) return;
    const profile = {
        name: user.user_metadata?.full_name || user.email || 'User',
        avatar: user.user_metadata?.avatar_url || defaultAvatar,
        email: user.email || ''
    };
    saveProfileToStorage(profile);

    const els = {
        status: document.getElementById('profile-status'),
        name: document.getElementById('profile-name'),
        email: document.getElementById('profile-email'),
        pic: document.getElementById('profile-pic'),
        card: document.getElementById('profile-card'),
        auth: document.getElementById('auth-section'),
        editName: document.getElementById('editUsername'),
        editEmail: document.getElementById('editEmail'),
        prev: document.getElementById('avatarPreview')
    };

    if (els.status) els.status.textContent = `Signed in as ${profile.email}`;
    if (els.name) els.name.textContent = profile.name;
    if (els.email) els.email.textContent = profile.email;
    if (els.pic) els.pic.src = profile.avatar;
    if (els.card) els.card.classList.add('show');
    if (els.auth) els.auth.style.display = 'none';
    if (els.editName) els.editName.value = profile.name;
    if (els.editEmail) els.editEmail.value = profile.email;
    if (els.prev) els.prev.src = profile.avatar;
}

function hideProfile() {
    clearProfileStorage();
    const els = {
        status: document.getElementById('profile-status'),
        card: document.getElementById('profile-card'),
        auth: document.getElementById('auth-section')
    };
    if (els.status) els.status.textContent = 'Not signed in.';
    if (els.card) els.card.classList.remove('show');
    if (els.auth) els.auth.style.display = 'block';
}

function updateFloatingProfile(profile) {
    const img = document.getElementById('profile-float-img');
    const name = document.getElementById('profile-float-name');
    if (!img || !name) return;
    img.src = profile?.avatar || defaultAvatar;
    name.textContent = profile?.name || "Sign In";
}

// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    // UI Injection
    const navbarHTML = `<nav class="navbar"><div class="nav-left-bg"><a href="/" class="logo"><img src="/images/favicon.png"></a><div class="nav-links"><a href="/home"><i class="fa fa-home"></i></a><a href="/games"><i class="fa fa-gamepad"></i></a><a href="/messages" style="position: relative;"><i class="fa-solid fa-message"></i><span id="msg-badge" class="nav-badge"></span></a><a href="/ai"><i class="fa fa-robot"></i></a><a href="/forms"><i class="fa fa-clipboard-list"></i></a><a href="/profile"><i class="fa fa-user"></i></a><a href="/reviews"><i class="fa fa-star"></i></a><a href="/admin" id="admin-nav-btn" style="display:none;"><i class="fa fa-crown"></i></a><a class="extra"><i class="fa fa-plus"></i></a><div class="extra-buttons"><a href="https://github.com/nebula-site" target="_blank"><i class="fa-brands fa-github"></i></a><a href="/terms"><i class="fa fa-clipboard-check"></i></a><a href="/privacy"><i class="fa fa-user-lock"></i></a><a href="/contact"><i class="fa fa-envelope"></i></a></div></div></div></nav>`;
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    const profileLink = document.createElement("a");
    profileLink.href = "/profile";
    profileLink.id = "profile-float";
    profileLink.innerHTML = `<img id="profile-float-img" src="${defaultAvatar}"><span id="profile-float-name">Sign In</span>`;
    document.body.appendChild(profileLink);

    // Initial Auth Check
    const { data: { session } } = await supabase.auth.getSession();
    if (session) showProfile(session.user); else hideProfile();

    // Modal Helpers
    const modal = (id, open) => document.getElementById(id)?.classList[open ? 'add' : 'remove']('show');

    // Avatar Upload Logic
    document.getElementById('uploadAvatarBtn')?.addEventListener('click', () => document.getElementById('avatarUpload').click());
    document.getElementById('avatarUpload')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (re) => {
            const compressed = await compressImage(re.target.result);
            document.getElementById('avatarPreview').src = compressed;
            document.getElementById('avatarUpload').dataset.base64 = compressed;
        };
        reader.readAsDataURL(file);
    });

    // Save Profile Changes
    document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
        const btn = document.getElementById('saveProfileBtn');
        const name = document.getElementById('editUsername').value.trim();
        const b64 = document.getElementById('avatarUpload').dataset.base64;
        const newEmail = document.getElementById('editEmail')?.value.trim();
        const newPassword = document.getElementById('editPassword')?.value.trim();
        
        if (!name) return showError('Name required');
        btn.disabled = true;
        btn.textContent = 'Saving...';

        try {
            const updates = { data: { full_name: name, avatar_url: b64 || getProfileFromStorage()?.avatar } };
            const currentProfile = getProfileFromStorage();
            if (newEmail && newEmail !== currentProfile?.email) updates.email = newEmail;
            if (newPassword && newPassword.length >= 6) updates.password = newPassword;

            const { error } = await supabase.auth.updateUser(updates);
            if (error) throw error;

            showSuccess('Profile Updated!');
            if (!updates.email) location.reload(); else btn.textContent = 'Check Email';
        } catch (e) {
            showError(e.message);
            btn.disabled = false;
            btn.textContent = 'Save Changes';
        }
    });

    // Sign Out
    document.getElementById('signOutBtn')?.addEventListener('click', async () => {
        hideProfile();
        await supabase.auth.signOut();
        location.href = '/profile';
    });

    // Sign In logic
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return showError(error.message);
        showProfile(data.user);
        location.reload();
    });

    // Sign Up logic
    document.getElementById('createAccountBtn')?.addEventListener('click', async () => {
        const btn = document.getElementById('createAccountBtn');
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;
        const name = document.getElementById('signUpName').value.trim();

        if (!email || !password || !name) return showError('All fields are required');
        btn.disabled = true;
        btn.textContent = 'Creating...';

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, avatar_url: defaultAvatar } }
        });

        if (error) {
            showError(error.message);
            btn.disabled = false;
            btn.textContent = 'Sign Up';
            return;
        }

        if (data?.user && data?.session === null) {
            showSuccess('Check your email to verify!');
            modal('signUpModal', false);
        } else {
            showProfile(data.user);
            location.reload();
        }
    });
    

    // Modal Control Listeners
    document.getElementById('editProfileBtn')?.addEventListener('click', () => modal('editModal', true));
    document.getElementById('closeEditBtn')?.addEventListener('click', () => modal('editModal', false));
    document.getElementById('signInBtn')?.addEventListener('click', () => modal('signInModal', true));
    document.getElementById('closeSignInBtn')?.addEventListener('click', () => modal('signInModal', false));
    document.getElementById('signUpBtn')?.addEventListener('click', () => modal('signUpModal', true));
    document.getElementById('closeSignUpBtn')?.addEventListener('click', () => modal('signUpModal', false));
});