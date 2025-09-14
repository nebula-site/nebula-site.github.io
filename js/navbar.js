document.addEventListener('DOMContentLoaded', () => {
  const defaultAvatar = "/images/favicon.png";
  const userAvatar = null; // Replace this with actual dynamic logic
  const avatarUrl = userAvatar || defaultAvatar;

  const navbarHTML = `
    <nav class="navbar" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="nav-left-bg" style="display: flex; align-items: center;">
        <a href="/index.html" class="logo">
          <img src="/images/favicon.png" alt="Waffles Logo">
        </a>
        <div class="nav-links" style="display: flex; align-items: center;">
          <a href="/home"><i class="fa fa-home fa-lg"></i></a>
          <a href="/games"><i class="fa fa-gamepad fa-lg"></i></a>
          <a href="/videos"><i class="fa-solid fa-circle-play"></i></a>
          <a href="/ai"><i class="fa-solid fa-robot"></i></a>
          <a href="/forms"><i class="fa fa-clipboard-list fa-lg"></i></a>
          <a href="/reviews"><i class="fa fa-star fa-lg"></i></a>
          <a href="/settings"><i class="fa fa-gear fa-lg"></i></a>
          <a href="javascript:void(0);" class="extra"><i class="fa fa-plus fa-lg"></i></a>
          <div class="extra-buttons" style="display: none;">
            <a target="_blank" href="https://github.com/eat-waffles-more"><i class="fa-brands fa-github fa-lg"></i></a>
            <a href="/terms"><i class="fa-solid fa-clipboard-check"></i></a>
            <a href="/privacy"><i class="fa-solid fa-user-lock"></i></a>
            <a href="/contact"><i class="fa-solid fa-envelope"></i></a>
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

  // Insert navbar into the page
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  // Animate dynamic island on update
  function animateIsland() {
    const island = document.getElementById('dynamic-island');
    island.style.transform = 'scale(1.08)';
    island.style.boxShadow = '0 4px 32px #3f00ff88';
    setTimeout(() => {
      island.style.transform = '';
      island.style.boxShadow = '0 2px 16px #3f00ff44';
    }, 400);
  }

  function updateIslandTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const timeSpan = document.getElementById('island-time');
    if (timeSpan) {
      timeSpan.textContent = timeStr;
      animateIsland();
    }
  }
  updateIslandTime();
  setInterval(updateIslandTime, 1000);

  // Puter view count logic
  async function updateViewCount() {
    if (!(window.puter && puter.storage && puter.storage.get && puter.storage.set)) {
      document.getElementById('view-count').textContent = '...';
      setTimeout(updateViewCount, 500);
      return;
    }
    let count = 0;
    try {
      count = await puter.storage.get('site_views') || 0;
      count++;
      await puter.storage.set('site_views', count);
      document.getElementById('view-count').textContent = count.toLocaleString();
      animateIsland();
    } catch (err) {
      document.getElementById('view-count').textContent = 'ERR';
    }
  }
  updateViewCount();

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
