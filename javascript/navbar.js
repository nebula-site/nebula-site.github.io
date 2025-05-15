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
        <span class="username">${user.name}</span>
      </div>
      <div class="menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
`;
