// Navbar with dynamic Google name + avatar integration + dropdown extra menu
document.addEventListener('DOMContentLoaded', () => {
  const defaultAvatar = "/images/user.png";

  const navbarHTML = `
    <nav class="navbar" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="nav-left-bg" style="display: flex; align-items: center;">
        <a href="/index.html" class="logo">
          <img src="/images/favicon.png" alt="Nebula Logo">
        </a>
        <div class="nav-links" style="display: flex; align-items: center; position: relative;">
          <a href="/home"><i class="fa fa-home fa-lg"></i></a>
          <a href="/games"><i class="fa fa-gamepad fa-lg"></i></a>
          <a href="/videos"><i class="fa-solid fa-circle-play"></i></a>
          <a href="/ai"><i class="fa-solid fa-robot"></i></a>
          <a href="/forms"><i class="fa fa-clipboard-list fa-lg"></i></a>
          <a href="/profile"><i class="fa fa-user fa-lg"></i></a>
          <a href="/reviews"><i class="fa fa-star fa-lg"></i></a>
          <a href="javascript:void(0);" class="extra" title="More options"><i class="fa fa-plus fa-lg"></i></a>

          <!-- Dropdown extra menu -->
          <div class="extra-buttons" style="
            position: absolute;
            top: 120%;
            left: auto;
            right: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            background: rgba(30,0,60,0.92);
            padding: 8px 10px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.25s ease;
            pointer-events: none;
          ">
            <a target="_blank" href="https://github.com/nebula-site" style="color:#a3f7ff;padding:6px;text-decoration:none;"><i class="fa-brands fa-github fa-lg"></i></a>
            <a href="/terms" style="color:#a3f7ff;padding:6px;text-decoration:none;"><i class="fa-solid fa-clipboard-check"></i></a>
            <a href="/privacy" style="color:#a3f7ff;padding:6px;text-decoration:none;"><i class="fa-solid fa-user-lock"></i></a>
            <a href="/contact" style="color:#a3f7ff;padding:6px;text-decoration:none;"><i class="fa-solid fa-envelope"></i></a>
          </div>
        </div>
      </div>

      <div class="nav-center-bg" style="flex:1; display:flex; justify-content:center; align-items:center;">
        <div id="dynamic-island" style="display:inline-block;padding:8px 32px;background:rgba(30,0,60,0.8);border-radius:32px;box-shadow:0 2px 16px #3f00ff44;backdrop-filter:blur(6px);font-size:1.2rem;font-weight:600;color:#a3f7ff;transition:all 0.4s;">
          <span id="island-time">--:--:--</span>
        </div>
      </div>

      <div class="nav-right-bg" style="display: flex; align-items: center;">
        <input type="text" id="searchBar" placeholder="Search this site..." autocomplete="off">
      </div>
    </nav>
    <div id="results" class="search-results"></div>
  `;

  document.body.insertAdjacentHTML('afterbegin', navbarHTML);

  // --- Floating profile button ---
  const profileLink = document.createElement('a');
  profileLink.href = "/profile.html";
  profileLink.id = "profile-float";
  profileLink.title = "Open profile";
  profileLink.style.cssText = `
    position:fixed; left:16px; bottom:16px; display:flex; align-items:center; gap:8px;
    padding:8px 12px; background:rgba(30,0,60,0.85); backdrop-filter:blur(6px);
    border-radius:999px; box-shadow:0 8px 30px rgba(0,0,0,0.35);
    cursor:pointer; text-decoration:none; color:#a3f7ff; z-index:10000;
    transition:transform .12s ease, box-shadow .12s ease;
  `;
  profileLink.innerHTML = `
    <img src="${defaultAvatar}" alt="avatar" id="profile-float-img"
      style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(163,247,255,0.12);">
    <span id="profile-float-name" style="font-weight:600;font-size:0.95rem;color:#a3f7ff;">Guest</span>
  `;
  document.body.appendChild(profileLink);

  // --- Floating Profile Update Helper ---
  function updateFloatingProfile(profile) {
    const img = document.getElementById('profile-float-img');
    const name = document.getElementById('profile-float-name');
    if (profile) {
      if (img && profile.picture) img.src = profile.picture;
      if (name) name.textContent = profile.name || profile.email || 'User';
    } else {
      if (img) img.src = defaultAvatar;
      if (name) name.textContent = 'Guest';
    }
  }

  // Load stored profile (if any)
  try {
    const stored = localStorage.getItem('nebula_profile');
    if (stored) updateFloatingProfile(JSON.parse(stored));
  } catch (e) {}

  // --- Supabase Integration ---
  (async function trySupabaseIntegration() {
    const url = window.SUPABASE_URL;
    const anon = window.SUPABASE_ANON_KEY;
    if (!url || !anon) return;

    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
      const supabase = mod.createClient(url, anon);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (user) {
        const metadata = user.user_metadata || {};
        const profile = {
          id: user.id,
          name: metadata.full_name || metadata.name || user.email || '',
          email: user.email || '',
          picture: metadata.avatar_url || metadata.picture || ''
        };
        updateFloatingProfile(profile);
        try { localStorage.setItem('nebula_profile', JSON.stringify(profile)); } catch(e){}
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u = session.user;
          const metadata = u.user_metadata || {};
          const profile = {
            id: u.id,
            name: metadata.full_name || metadata.name || u.email || '',
            email: u.email || '',
            picture: metadata.avatar_url || metadata.picture || ''
          };
          updateFloatingProfile(profile);
          try { localStorage.setItem('nebula_profile', JSON.stringify(profile)); } catch(e){}
        } else {
          updateFloatingProfile(null);
          try { localStorage.removeItem('nebula_profile'); } catch(e){}
        }
      });
    } catch (err) {
      console.warn('Supabase integration for navbar failed:', err);
    }
  })();

  // --- Dynamic Island Clock ---
  function animateIsland() {
    const island = document.getElementById('dynamic-island');
    if (!island) return;
    island.style.transform = 'scale(1.08)';
    island.style.boxShadow = '0 4px 32px #3f00ff88';
    setTimeout(() => {
      island.style.transform = '';
      island.style.boxShadow = '0 2px 16px #3f00ff44';
    }, 400);
  }

  function updateIslandTime() {
    const now = new Date();
    const timeSpan = document.getElementById('island-time');
    if (timeSpan) {
      timeSpan.textContent = now.toLocaleTimeString();
      animateIsland();
    }
  }
  updateIslandTime();
  setInterval(updateIslandTime, 1000);

  // --- Dropdown Extra Buttons Toggle ---
  const extraIcon = document.querySelector('.extra');
  const extraButtons = document.querySelector('.extra-buttons');
  if (extraIcon && extraButtons) {
    extraIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = extraButtons.classList.toggle('active');
      if (isOpen) {
        extraButtons.style.opacity = '1';
        extraButtons.style.transform = 'translateY(0)';
        extraButtons.style.pointerEvents = 'auto';
        extraIcon.innerHTML = `<i class="fa fa-minus fa-lg"></i>`;
      } else {
        extraButtons.style.opacity = '0';
        extraButtons.style.transform = 'translateY(-10px)';
        extraButtons.style.pointerEvents = 'none';
        extraIcon.innerHTML = `<i class="fa fa-plus fa-lg"></i>`;
      }
    });
    // Hide if you click elsewhere
    document.addEventListener('click', (e) => {
      if (!extraButtons.contains(e.target) && !extraIcon.contains(e.target)) {
        extraButtons.style.opacity = '0';
        extraButtons.style.transform = 'translateY(-10px)';
        extraButtons.style.pointerEvents = 'none';
        extraIcon.innerHTML = `<i class="fa fa-plus fa-lg"></i>`;
      }
    });
  }

  // --- Search Feature ---
  const filesWithTags = [
    { path: "/home", name: "Home Page", tags: ["home", "main", "start", "front", "index"] },
    { path: "/games", name: "Games", tags: ["play", "fun", "games", "game"] },
    { path: "/reviews", name: "Reviews", tags: ["reviews", "review", "rate"] },
    { path: "/profile", name: "Your Profile", tags: ["profile", "account", "user", "me"] },
    { path: "/terms", name: "Terms of Service", tags: ["terms", "service", "rules"] },
    { path: "/privacy", name: "Privacy Policy", tags: ["privacy", "policy", "info", "data"] },
    { path: "/contact", name: "Contact", tags: ["contact", "email", "support", "help"] },
  ];

  const searchBar = document.getElementById('searchBar');
  const resultsDiv = document.getElementById('results');

  if (searchBar && resultsDiv) {
    searchBar.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      resultsDiv.innerHTML = '';

      if (!query) {
        resultsDiv.classList.remove('active');
        return;
      }

      const matchedFiles = filesWithTags.filter(file =>
        file.tags.some(tag => tag.includes(query))
      );

      if (matchedFiles.length === 0) {
        resultsDiv.innerHTML = '<p style="padding: 10px;">No results found.</p>';
      } else {
        matchedFiles.forEach(file => {
          const link = document.createElement('a');
          link.href = file.path;
          link.textContent = file.name;
          link.style.display = 'block';
          link.style.padding = '10px';
          link.style.borderBottom = '1px solid #eee';
          resultsDiv.appendChild(link);
        });
      }

      resultsDiv.classList.add('active');
    });
  }

  // --- Navbar Shadow on Scroll ---
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0, 0, 0, 0.3)'
      : '0 0 10px rgba(173, 216, 230, 0.5)';
  });
});
