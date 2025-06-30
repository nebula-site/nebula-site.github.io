document.addEventListener('DOMContentLoaded', () => {
  const defaultAvatar = "/images/favicon.png";
  const userAvatar = null; // Replace this with actual dynamic logic
  const avatarUrl = userAvatar || defaultAvatar;

  const navbarHTML = `
    <nav class="navbar">
      <div class="nav-left-bg">
        <a href="/" class="logo">
          <img id="logo-nav" src="/images/favicon.png" alt="Logo">
        </a>
        <div class="nav-links">
          <a href="/"><i class="fa fa-home fa-lg"></i></a>
          <a href="/games.html"><i class="fa fa-gamepad fa-lg"></i></a>
          <a href="/forms.html"><i class="fa fa-clipboard-list fa-lg"></i></a>
          <a href="/reviews.html"><i class="fa fa-star fa-lg"></i></a>
          <a href="/profile.html"><i class="fa fa-user fa-lg"></i></a>
          <a href="/settings.html"><i class="fa fa-gear fa-lg"></i></a>
          <a href="javascript:void(0);" class="extra"><i class="fa fa-plus fa-lg"></i></a>
          <div class="extra-buttons" style="display: none;">
            <a href="/terms.html"><i class="fa-solid fa-clipboard-check"></i></a>
            <a href="/privacy.html"><i class="fa-solid fa-user-lock"></i></a>
            <a href="/contact.html"><i class="fa-solid fa-envelope"></i></a>
          </div>
        </div>
      </div>

      <div class="nav-center">
        
      </div>

      <div class="nav-right-bg">
        <input type="text" id="searchBar" placeholder="Search this site..." autocomplete="off">
      </div>
    </nav>
    <div id="results" class="search-results"></div>
  `;

  // Insert navbar into the page
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);

  // --- Dynamic Island for cycling info ---
  const dynamicIsland = document.createElement('div');
  dynamicIsland.id = 'dynamic-island-site-views';
  dynamicIsland.style.position = 'fixed';
  dynamicIsland.style.top = '24px';
  dynamicIsland.style.right = '50%';
  dynamicIsland.style.transform = 'translateX(50%)';
  dynamicIsland.style.background = 'rgba(30,30,30,0.92)';
  dynamicIsland.style.color = 'white';
  dynamicIsland.style.padding = '10px 28px';
  dynamicIsland.style.borderRadius = '22px';
  dynamicIsland.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
  dynamicIsland.style.fontSize = '18px';
  dynamicIsland.style.fontWeight = '500';
  dynamicIsland.style.zIndex = '9999';
  dynamicIsland.style.display = 'flex';
  dynamicIsland.style.alignItems = 'center';
  dynamicIsland.style.gap = '10px';
  dynamicIsland.style.transition = 'opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)';

  document.body.appendChild(dynamicIsland);

  // --- Dynamic Island Data ---
  let siteViews = 0;

  // Track time spent today
  function getTodayKey() {
    const now = new Date();
    return `siteTime_${now.getFullYear()}_${now.getMonth()}_${now.getDate()}`;
  }
  function loadUserTime() {
    return parseInt(localStorage.getItem(getTodayKey()) || "0", 10);
  }
  function saveUserTime(secs) {
    localStorage.setItem(getTodayKey(), secs.toString());
  }

  // Update time every second
  setInterval(() => {
    const secs = loadUserTime() + 1;
    saveUserTime(secs);
  }, 1000);

  // Fetch and update site views
  async function updateSiteViews() {
    try {
      const res = await fetch('/api/site-views');
      const data = await res.json();
      siteViews = data.views;
    } catch (e) {
      siteViews = '?';
    }
  }
  updateSiteViews();
  setInterval(updateSiteViews, 10000); // Update every 10s

  // Format seconds as H:MM:SS
  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return (h > 0 ? h + ':' : '') +
      (h > 0 ? String(m).padStart(2, '0') : m) + ':' +
      String(s).padStart(2, '0');
  }

  // Cycle through info
  const infoModes = [
  () => `<i class="fa-solid fa-eye"></i> <span>${siteViews.toLocaleString()}</span> views`,
  () => {
    // Show time without seconds
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = '';
    // If you want 12-hour format with AM/PM, uncomment below:
    // ampm = hours >= 12 ? ' PM' : ' AM';
    // hours = hours % 12 || 12;
    return `<i class="fa-solid fa-clock"></i> <span>${hours}:${String(minutes).padStart(2, '0')}</span>`;
  },
  () => `<i class="fa-solid fa-hourglass-half"></i> <span>${formatTime(loadUserTime())}</span>`,
];
  let infoIndex = 0;

  // Smooth transition for dynamic island
  function smoothUpdateIsland(newHTML) {
    dynamicIsland.style.opacity = '0';
    dynamicIsland.style.transform = 'translateX(50%) scale(0.96)';
    setTimeout(() => {
      dynamicIsland.innerHTML = newHTML;
      dynamicIsland.style.opacity = '1';
      dynamicIsland.style.transform = 'translateX(50%) scale(1)';
    }, 350);
  }

  function updateIsland() {
    smoothUpdateIsland(infoModes[infoIndex % infoModes.length]());
  }

  setInterval(() => {
    infoIndex++;
    updateIsland();
  }, 3500); // Change every 3.5s

  // Update island every second for time and time spent
  setInterval(() => {
    // Only update if not transitioning
    if (dynamicIsland.style.opacity === '1' || dynamicIsland.style.opacity === '') {
      dynamicIsland.innerHTML = infoModes[infoIndex % infoModes.length]();
    }
  }, 1000);

  // Initial update
  dynamicIsland.style.opacity = '1';
  dynamicIsland.style.transform = 'translateX(50%) scale(1)';
  updateIsland();

  // Slide down animation
  setTimeout(() => {
    document.querySelector('.navbar').classList.add('active');
  }, 100);

  // Toggle extra buttons
  const extraIcon = document.querySelector('.extra');
  const extraButtons = document.querySelector('.extra-buttons');

  extraIcon.addEventListener('click', () => {
    const isActive = extraButtons.style.display === 'flex';
    extraButtons.style.display = isActive ? 'none' : 'flex';
    extraIcon.innerHTML = `<i class="fa fa-${isActive ? 'plus' : 'minus'} fa-lg"></i>`;
  });

  // Search functionality
  const filesWithTags = [
    { path: "/home", name: "Home Page", tags: ["home", "main", "start", "front", "page", "index"] },
    { path: "/games", name: "Games", tags: ["play", "fun", "games", "game", "page", "yay"] },
    { path: "/reviews", name: "Reviews", tags: ["star", "reviews", "review", "rate", "us", "page", "share", "your", "my", "thoughts"] },
    { path: "/profile", name: "Your Profile", tags: ["you", "your", "profile", "account", "edit", "my", "me", "page"] },
    { path: "/terms", name: "Terms of Service", tags: ["rules", "terms", "of", "and", "conditions", "page", "service", "legal", "licence"] },
    { path: "/privacy", name: "Privacy Policy", tags: ["your", "safe", "safety", "privacy", "policy", "private", "information", "info", "security", "page"] },
  ];

  const searchBar = document.getElementById('searchBar');
  const resultsDiv = document.getElementById('results');

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

  // Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0, 0, 0, 0.3)'
      : '0 0 10px rgba(173, 216, 230, 0.5)';
  });
});