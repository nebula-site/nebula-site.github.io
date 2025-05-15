const user = JSON.parse(localStorage.getItem('user')) || {
  name: "Guest",
  avatar: "/branding/favicon.png" // Default avatar
};

// Check if user avatar exists or is empty, and provide default
const avatarSrc = user.avatar ? user.avatar : "/branding/favicon.png";

document.getElementById('navbar-element').innerHTML = `
  <nav>
    <div class="navbar">
      <div class="logo"><a href="/index.html">Nebula</a></div>
      <ul class="menu">
        <li><a href="/"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="/games"><i class="fa-solid fa-gamepad"></i> Games</a></li>
      </ul>
      <a href="/profile">
        <div class="user-profile">
          <img src="${avatarSrc}" class="avatar" alt="User Avatar">
          <button class="dropdown-toggle">${user.name}</button>
          <span class="username">${user.name}</span>
        </div>
      </a>
      <div class="menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
`;
