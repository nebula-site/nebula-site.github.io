const user = JSON.parse(localStorage.getItem('user')) || {
  name: "Guest",
  avatar: "/branding/favicon.png"
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
        <img src="${user.avatar}" alt="User Avatar" class="avatar" href="/profile">
        <div class="dropdown">
          <button class="dropdown-toggle">${user.name}</button>
        </div>
      </div>
      <div class="menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
`;
