document.addEventListener('DOMContentLoaded', () => {
  const defaultAvatar = "/images/favicon.png";
  const userAvatar = null; // Replace this with actual dynamic logic
  const avatarUrl = userAvatar || defaultAvatar;

  const navbarHTML = `
    <nav class="navbar">
      <div class="nav-left-bg">
        <a href="/index.html" class="logo">
          <img src="/images/favicon.png" alt="Waffles Logo">
        </a>
        <div class="nav-links">
          <a href="/home"><i class="fa fa-home fa-lg"></i></a>
          <a href="/games"><i class="fa fa-gamepad fa-lg"></i></a>
          <a href="/theater.html"><i class="fa fa-tv fa-lg"></i></a>
          <a href="/forms"><i class="fa fa-clipboard-list fa-lg"></i></a>
          <a href="/reviews"><i class="fa fa-star fa-lg"></i></a>
          <a href="/profile"><i class="fa fa-user fa-lg"></i></a>
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

      <div class="nav-center">
        <input type="text" id="searchBar" placeholder="Search this site..." autocomplete="off">
      </div>

      <div class="nav-right-bg">
        <a href="/profile" class="user-profile">
          <img id="user-avatar" src="${avatarUrl}" alt="User Avatar" class="avatar" style="height: 40px; width: 40px; border-radius: 50%;">
          <span id="user-name">Sign Up</span>
        </a>
      </div>
    </nav>
    <div id="results" class="search-results"></div>
  `;

  // Insert navbar into the page
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);

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
