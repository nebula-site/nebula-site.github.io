document.addEventListener('DOMContentLoaded', () => {
  const defaultAvatar = "/images/user.png";
  const STORAGE_KEY = 'nebula_profile';
  const UNREAD_KEY = 'nebula_unread_count'; // Matches the key from your chat script

  function getProfileFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  }

  function initializeProfile() {
    const storedProfile = getProfileFromStorage();
    updateFloatingProfile(storedProfile);
    syncUnreadBadge(); // Check unread count on load
  }

  // UPDATED NAVBAR HTML: Added <span id="msg-badge">
  const navbarHTML = `
      <nav class="navbar">
          <div class="nav-left-bg">
              <a href="/" class="logo"><img src="/images/favicon.png"></a>
              <div class="nav-links">
                  <a href="/home"><i class="fa fa-home"></i></a>
                  <a href="/games"><i class="fa fa-gamepad"></i></a>
                  <a href="/messages" style="position: relative;">
                      <i class="fa-solid fa-message"></i>
                      <span id="msg-badge" class="nav-badge"></span>
                  </a>
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

  // --- UNREAD BADGE LOGIC ---
  function syncUnreadBadge() {
    const badge = document.getElementById('msg-badge');
    const count = parseInt(localStorage.getItem(UNREAD_KEY) || '0');
    
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  // Listen for changes in localStorage from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === UNREAD_KEY) syncUnreadBadge();
  });

  const profileLink = document.createElement("a");
  profileLink.href = "/profile";
  profileLink.id = "profile-float";
  profileLink.innerHTML = `<img id="profile-float-img" src="${defaultAvatar}"><span id="profile-float-name">Guest</span>`;
  document.body.appendChild(profileLink);

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

  initializeProfile();

  // Extras Menu Logic
  const extraBtn = document.querySelector(".extra");
  const menu = document.querySelector(".extra-buttons");
  if (extraBtn && menu) {
    extraBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.style.opacity === "1";
      menu.style.opacity = isOpen ? "0" : "1";
      menu.style.transform = isOpen ? "translateY(10px)" : "translateY(0)";
      menu.style.pointerEvents = isOpen ? "none" : "auto";
      extraBtn.innerHTML = isOpen ? `<i class="fa fa-plus"></i>` : `<i class="fa fa-minus"></i>`;
    });
  }
});