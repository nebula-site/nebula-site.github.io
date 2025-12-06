document.addEventListener('DOMContentLoaded', () => {

  const defaultAvatar = "/images/user.png";
  const STORAGE_KEY = 'nebula_profile';

  /* ==================================
     SYNC UTILITY FUNCTIONS
  ================================== */

  function saveProfileToStorage(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      updateFloatingProfile(profile);
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
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

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

  // Listen for profile updates from other tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      const updated = e.newValue ? JSON.parse(e.newValue) : null;
      updateFloatingProfile(updated);
    }
  });

  // Listen for custom profile update events (from profile page)
  window.addEventListener('nebulaProfileUpdated', (e) => {
    const profile = e.detail;
    if (profile) {
      saveProfileToStorage(profile);
    } else {
      clearProfileStorage();
    }
  });


  /* ==================================
     MAKE FUNCTIONS GLOBALLY AVAILABLE
  ================================== */

  window.nebulaSaveProfile = saveProfileToStorage;
  window.nebulaClearProfile = clearProfileStorage;
  window.nebulaGetProfile = getProfileFromStorage;


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