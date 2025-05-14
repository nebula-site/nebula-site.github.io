document.getElementById('navbar-element').innerHTML = `
  <nav>
    <div class="navbar">
      <div class="logo"><a href="/index">Nebula</a></div>
      <ul class="menu">
        <li><a href="/index"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="/games"><i class="fa-solid fa-gamepad"></i> Games</a></li>
      </ul>
      <div class="user-profile">
        <img src="/images/user-avatar.png" alt="User Avatar" class="avatar">
        <div class="dropdown">
          <button class="dropdown-toggle">Profile <i class="fa-solid fa-caret-down"></i></button>
          <div class="dropdown-menu">
            <a href="/profile">My Profile</a>
            <a href="/settings">Settings</a>
            <a href="/logout">Logout</a>
          </div>
        </div>
      </div>
      <div class="menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
`;
