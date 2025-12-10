document.addEventListener('DOMContentLoaded', () => {

  const defaultAvatar = "/images/user.png";
  const STORAGE_KEY = 'nebula_profile';

  // --- CONSTANT FOR ADMIN CHECK ---
  const ADMIN_EMAIL_CHECK = 'REESDOLSEN@GMAIL.COM'.toUpperCase().trim();


  /* ==================================
     SYNC UTILITY FUNCTIONS
  ================================== */

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
      console.error('Storage read error:', e);
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

  /* ==================================
     ADMIN STATUS CHECK AND DISPATCHER
  ================================== */

  function checkAdminStatusAndDispatch(profile) {
      const currentProfile = profile || getProfileFromStorage();
      
      const currentUserEmail = currentProfile?.email?.toUpperCase().trim() || null;
      
      const isAdmin = currentUserEmail === ADMIN_EMAIL_CHECK;

      console.log(`[Admin Check Dispatch - Navbar] User: ${currentUserEmail || 'None'} | IsAdmin: ${isAdmin}`);

      window.dispatchEvent(new CustomEvent('adminStatusChecked', {
          detail: { isAdmin: isAdmin, email: currentUserEmail }
      }));
  }
  // -------------------------------------------------


  /* ==================================
     NEW NAVBAR (BOTTOM-LEFT)
  ================================== */

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

          <!-- ADMIN NAV BUTTON (only appears if admin) -->
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


  /* ==================================
     FLOATING PROFILE — BOTTOM-RIGHT
  ================================== */

  const profileLink = document.createElement("a");
  profileLink.href = "/profile";
  profileLink.id = "profile-float";
  profileLink.innerHTML = `
      <img id="profile-float-img" src="${defaultAvatar}">
      <span id="profile-float-name">Guest</span>
  `;
  document.body.appendChild(profileLink);


  /* ==================================
     UPDATE FLOATING PROFILE WIDGET
  ================================== */

  function updateFloatingProfile(profile) {
    const img = document.getElementById('profile-float-img');
    const name = document.getElementById('profile-float-name');
    if (!profile) {
      img.src = defaultAvatar;
      name.textContent = "Sign In";
    } else {
      img.src = profile.picture || profile.avatar || defaultAvatar;
      name.textContent = profile.name || profile.username || "User";
    }
  }


  /* ==================================
     INITIALIZE FROM LOCAL STORAGE
  ================================== */

  const storedProfile = getProfileFromStorage();
  if (storedProfile) {
    updateFloatingProfile(storedProfile);
  }
  
  checkAdminStatusAndDispatch(storedProfile);


  /* ==================================
     AUTH HELPERS + UX
  ================================== */

  function isSignedIn() {
    try {
      const p = getProfileFromStorage();
      return !!(p && (p.email || p.username || p.name));
    } catch (e) {
      return false;
    }
  }

  function showAuthToast(msg = 'Sign in required') {
    let t = document.getElementById('nebula-auth-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'nebula-auth-toast';
      t.style = 'position:fixed;right:20px;bottom:90px;background:#1a73e8;color:white;padding:10px 14px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.4);z-index:2000;font-weight:600';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => { t.style.opacity = '0'; }, 2200);
  }

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
      const allowedPublic = ['/', '/profile', '/privacy', '/terms', '/contact'];
      if (isSignedIn()) return;

      if (!allowedPublic.includes(path)) {
        ev.preventDefault();
        try { sessionStorage.setItem('postAuthRedirect', path + url.search); } catch(e) {}
        showAuthToast('Please sign in first — redirecting to Profile');
        window.location.href = '/profile';
      }
    } catch (e) {
      return;
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      const updated = e.newValue ? JSON.parse(e.newValue) : null;
      updateFloatingProfile(updated);
      checkAdminStatusAndDispatch(updated);
    }
  });

  window.addEventListener('nebulaProfileUpdated', (e) => {
    const profile = e.detail;
    if (profile) {
      saveProfileToStorage(profile);
    } else {
      clearProfileStorage();
    }
  });


  /* ==================================
     ADMIN NAV ICON VISIBILITY
  ================================== */

  window.addEventListener('adminStatusChecked', (e) => {
    const btn = document.getElementById('admin-nav-btn');
    if (!btn) return;

    btn.style.display = e.detail.isAdmin ? "inline-flex" : "none";
  });


  /* ==================================
     EXTRAS MENU
  ================================== */

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

});
