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
        function saveProfileToStorage(profile) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
                updateFloatingProfile(profile);
                checkAdminStatusAndDispatch(profile);
                return profile;
            } catch (e) {
                console.error('Storage error:', e);
            }
        }

        function getProfileFromStorage() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) : null;
            } catch (e) {
                return null;
            }
        }

        function clearProfileStorage() {
            try {
                localStorage.removeItem(STORAGE_KEY);
                updateFloatingProfile(null);
                checkAdminStatusAndDispatch(null);
            } catch (e) {
                console.error('Storage error:', e);
            }
        }

        function showAuthToast(msg = 'Sign in required') {
            let t = document.getElementById('nebula-auth-toast');
            if (!t) {
                t = document.createElement('div');
                t.id = 'nebula-auth-toast';
                t.style = 'position:fixed;right:20px;bottom:90px;background:#3a6fb5;color:white;padding:10px 14px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.4);z-index:2000;font-weight:600;opacity:0;transition:opacity 0.3s;';
                document.body.appendChild(t);
            }
            t.textContent = msg;
            t.style.opacity = '1';
            clearTimeout(t._hideTimer);
            t._hideTimer = setTimeout(() => { t.style.opacity = '0'; }, 2200);
        }

        function checkAdminStatusAndDispatch(profile) {
            const currentProfile = profile || getProfileFromStorage();
            const currentUserEmail = currentProfile?.email?.toUpperCase().trim() || null;
            const isAdmin = currentUserEmail === ADMIN_EMAIL_CHECK;

            window.dispatchEvent(new CustomEvent('adminStatusChecked', {
                detail: { isAdmin: isAdmin, email: currentUserEmail }
            }));
        }

        function isSignedIn() {
            try {
                const p = getProfileFromStorage();
                return !!(p && (p.email || p.name));
            } catch (e) {
                return false;
            }
        }

        function showError(msg) {
            const el = document.getElementById('error-message');
            el.textContent = msg;
            el.style.display = 'block';
            setTimeout(() => { el.style.display = 'none'; }, 5000);
        }

        function showSuccess(msg) {
            const el = document.getElementById('success-message');
            el.textContent = msg;
            el.style.display = 'block';
            setTimeout(() => { el.style.display = 'none'; }, 3000);
        }

        function imageToBase64(file) {
            return new Promise((resolve, reject) => {
                if (file.size > MAX_FILE_SIZE) {
                    reject(new Error(`File size exceeds ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)}MB limit`));
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // --- UI UPDATE FUNCTIONS ---
        function showProfile(user) {
            const profile = {
                name: user?.user_metadata?.full_name || user?.full_name || user?.email || 'User',
                avatar: user?.user_metadata?.avatar_url || user?.avatar_url || user?.avatar || defaultAvatar,
                email: user?.email || getProfileFromStorage()?.email || '(no email)'
            };

            saveProfileToStorage(profile);

            document.getElementById('profile-status').textContent = `Signed in as ${profile.email}`;
            document.getElementById('profile-name').textContent = profile.name;
            document.getElementById('profile-email').textContent = profile.email;
            document.getElementById('profile-pic').src = profile.avatar;
            document.getElementById('profile-card').classList.add('show');
            document.getElementById('auth-section').style.display = 'none';

            document.getElementById('editUsername').value = profile.name;
            document.getElementById('avatarPreview').src = profile.avatar;
        }

        function hideProfile() {
            clearProfileStorage();

            document.getElementById('profile-status').textContent = 'Not signed in.';
            document.getElementById('profile-card').classList.remove('show');
            document.getElementById('auth-section').style.display = 'block';

            document.getElementById('editModal').classList.remove('show');
            document.getElementById('signInModal').classList.remove('show');
            document.getElementById('signUpModal').classList.remove('show');
        }

        function updateFloatingProfile(profile) {
            const img = document.getElementById('profile-float-img');
            const name = document.getElementById('profile-float-name');

            if (!img || !name) return;

            if (!profile) {
                img.src = defaultAvatar;
                name.textContent = "Sign In";
            } else {
                img.src = profile.avatar || defaultAvatar;
                name.textContent = profile.name || "User";
            }
        }

        // --- DOM CONTENT LOADED ---
        document.addEventListener('DOMContentLoaded', () => {

            // Inject Navbar
            const navbarHTML = `
                <nav class="navbar">
                    <div class="nav-left-bg">
                        <a href="/" class="logo">
                            <img src="/images/favicon.png">
                        </a>
                        <div class="nav-links">
                            <a href="/home"><i class="fa fa-home"></i></a>
                            <a href="/games"><i class="fa fa-gamepad"></i></a>
                            <a href="/ai"><i class="fa fa-robot"></i></a>
                            <a href="/forms"><i class="fa fa-clipboard-list"></i></a>
                            <a href="/profile"><i class="fa fa-user"></i></a>
                            <a href="/reviews"><i class="fa fa-star"></i></a>
                            <a href="/admin" id="admin-nav-btn" style="display:none;">
                                <i class="fa fa-crown"></i>
                            </a>
                            <a class="extra"><i class="fa fa-plus"></i></a>
                            <div class="extra-buttons">
                                <a href="https://github.com/nebula-site" target="_blank"><i class="fa-brands fa-github"></i></a>
                                <a href="/terms"><i class="fa fa-clipboard-check"></i></a>
                                <a href="/privacy"><i class="fa fa-user-lock"></i></a>
                                <a href="/contact"><i class="fa fa-envelope"></i></a>
                            </div>
                        </div>
                    </div>
                </nav>
            `;
            document.body.insertAdjacentHTML("afterbegin", navbarHTML);

            // Inject Profile Float
            const profileLink = document.createElement("a");
            profileLink.href = "/profile";
            profileLink.id = "profile-float";
            profileLink.innerHTML = `
                <img id="profile-float-img" src="${defaultAvatar}">
                <span id="profile-float-name">Sign In</span>
            `;
            document.body.appendChild(profileLink);
            
            const storedProfile = getProfileFromStorage();
            if (storedProfile) {
                updateFloatingProfile(storedProfile);
                checkAdminStatusAndDispatch(storedProfile);
            }

            // Navigation Guard
            document.addEventListener('click', (ev) => {
                const a = ev.target.closest && ev.target.closest('a');
                if (!a) return;
                if (a.target === '_blank') return;
                const href = a.getAttribute('href');
                if (!href) return;
                if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;

                try {
                    const url = new URL(href, window.location.origin);
                    if (url.origin !== window.location.origin) return;
                    const path = url.pathname || '/';
                    const allowedPublic = ['/', '/home', '/profile', '/privacy', '/terms', '/contact'];
                    if (isSignedIn()) return;
                    if (!allowedPublic.includes(path)) {
                        ev.preventDefault();
                        try { sessionStorage.setItem('postAuthRedirect', path + url.search); } catch(e) {}
                        showAuthToast('Please sign in first');
                        window.location.href = '/profile';
                    }
                } catch (e) {
                    return;
                }
            });

            // Cross-tab storage listener
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY) {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    updateFloatingProfile(updated);
                    checkAdminStatusAndDispatch(updated);
                    if (document.getElementById('profile-card')) {
                         if (updated) showProfile(updated); else hideProfile();
                    }
                }
            });

            // Admin status listener
            window.addEventListener('adminStatusChecked', (e) => {
                const btn = document.getElementById('admin-nav-btn');
                if (!btn) return;
                btn.style.display = e.detail.isAdmin ? "inline-flex" : "none";
            });

            // Extra menu toggle
            const extraBtn = document.querySelector(".extra");
            const menu = document.querySelector(".extra-buttons");
            if (extraBtn && menu) {
                extraBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const open = menu.style.opacity === "1";
                    if (open) {
                        menu.style.opacity = "0";
                        menu.style.pointerEvents = "none";
                        menu.style.transform = "translateY(10px)";
                        extraBtn.innerHTML = `<i class="fa fa-plus"></i>`;
                    } else {
                        menu.style.opacity = "1";
                        menu.style.pointerEvents = "auto";
                        menu.style.transform = "translateY(0)";
                        extraBtn.innerHTML = `<i class="fa fa-minus"></i>`;
                    }
                });

                document.addEventListener("click", () => {
                    menu.style.opacity = "0";
                    menu.style.pointerEvents = "none";
                    menu.style.transform = "translateY(10px)";
                    extraBtn.innerHTML = `<i class="fa fa-plus"></i>`;
                });
            }

            // Avatar upload
            document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
                document.getElementById('avatarUpload').click();
            });

            document.getElementById('avatarUpload').addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const base64 = await imageToBase64(file);
                    document.getElementById('avatarPreview').src = base64;
                    document.getElementById('avatarUpload').dataset.base64 = base64;
                    showSuccess('Avatar preview updated');
                } catch (err) {
                    showError(err.message);
                }
            });

            // Save profile
            document.getElementById('saveProfileBtn').addEventListener('click', async () => {
                const newUsername = document.getElementById('editUsername').value.trim();
                const avatarUploadEl = document.getElementById('avatarUpload');
                const avatarData = avatarUploadEl.dataset.base64 || null;
                const currentProfile = getProfileFromStorage(); 
                const finalAvatarUrl = avatarData || currentProfile?.avatar || defaultAvatar;

                if (!newUsername) {
                    showError('Username cannot be empty');
                    return;
                }

                try {
                    const { data, error } = await supabase.auth.updateUser({
                        data: {
                            full_name: newUsername,
                            avatar_url: finalAvatarUrl
                        }
                    });

                    if (error) {
                        showError('Error updating profile: ' + error.message);
                        return;
                    }

                    showSuccess('Profile updated successfully!');
                    document.getElementById('editModal').classList.remove('show');

                    delete avatarUploadEl.dataset.base64;
                    avatarUploadEl.value = '';

                    const { data: sessionData } = await supabase.auth.getSession();
                    if (sessionData.session?.user) {
                        showProfile(sessionData.session.user);
                    }

                } catch (e) {
                    showError('Error: ' + (e.message || e));
                }
            });

            // Modal handlers
            document.getElementById('signInBtn').addEventListener('click', () => document.getElementById('signInModal').classList.add('show'));
            document.getElementById('closeSignInBtn').addEventListener('click', () => document.getElementById('signInModal').classList.remove('show'));
            document.getElementById('signUpBtn').addEventListener('click', () => document.getElementById('signUpModal').classList.add('show'));
            document.getElementById('closeSignUpBtn').addEventListener('click', () => document.getElementById('signUpModal').classList.remove('show'));
            document.getElementById('editProfileBtn').addEventListener('click', () => document.getElementById('editModal').classList.add('show'));
            document.getElementById('closeEditBtn').addEventListener('click', () => document.getElementById('editModal').classList.remove('show'));

            document.getElementById('switchToSignUp').addEventListener('click', () => { 
                document.getElementById('signInModal').classList.remove('show'); 
                document.getElementById('signUpModal').classList.add('show'); 
            });
            document.getElementById('switchToSignIn').addEventListener('click', () => { 
                document.getElementById('signUpModal').classList.remove('show'); 
                document.getElementById('signInModal').classList.add('show'); 
            });

            document.getElementById('signOutBtn').addEventListener('click', async () => {
                await supabase.auth.signOut();
                hideProfile();
                showSuccess('Signed out successfully');
            });

            document.getElementById('loginBtn').addEventListener('click', async () => {
                const email = document.getElementById('signInEmail').value.trim();
                const password = document.getElementById('signInPassword').value;

                if (!email || !password) return showError('Please fill in all fields');

                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) return showError('Sign in failed: ' + error.message);

                showProfile(data.user);
                showSuccess('Signed in successfully!');
                document.getElementById('signInModal').classList.remove('show');
                const redirect = sessionStorage.getItem('postAuthRedirect');
                if (redirect) {
                    sessionStorage.removeItem('postAuthRedirect');
                    window.location.href = redirect;
                }
            });

            document.getElementById('createAccountBtn').addEventListener('click', async () => {
                const email = document.getElementById('signUpEmail').value.trim();
                const username = document.getElementById('signUpUsername').value.trim();
                const password = document.getElementById('signUpPassword').value;

                if (!email || !password || !username) return showError('Please fill in all fields');
                if (password.length < 6) return showError('Password must be at least 6 characters');

                const { data, error } = await supabase.auth.signUp({
                    email, password, options: { data: { full_name: username, avatar_url: defaultAvatar } }
                });

                if (error) return showError('Sign up failed: ' + error.message);

                showSuccess('Account created! Check your email for verification.');
                document.getElementById('signUpModal').classList.remove('show');
            });

            // Auth state listener
            supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    showProfile(session.user);
                } else {
                    hideProfile();
                }
            });

            // Initial session check
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    showProfile(session.user);
                } else {
                    hideProfile();
                }
            });

        });
