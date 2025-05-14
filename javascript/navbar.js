const user = JSON.parse(localStorage.getItem('user')) || {
  name: "Guest",
  avatar: "/images/user-avatar.png"
};

document.getElementById('navbar-element').innerHTML = `
  <nav>
    <div class="navbar">
      <div class="logo"><a href="/index.html">Nebula</a></div>
      <ul class="menu">
        <li><a href="/"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="/games"><i class="fa-solid fa-gamepad"></i> Games</a></li>
      </ul>
      <div class="user-profile">
        <img src="${user.avatar}" alt="User Avatar" class="avatar">
        <div class="dropdown">
          <button class="dropdown-toggle">${user.name} <i class="fa-solid fa-caret-down"></i></button>
          <div class="dropdown-menu">
            <a href="/profile.html">My Profile</a>
            <a href="/settings.html">Settings</a>
            <a href="/logout.html">Logout</a>
          </div>
        </div>
      </div>
      <div class="menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
`;
