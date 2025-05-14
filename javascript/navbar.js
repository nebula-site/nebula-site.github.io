document.getElementById('navbar-element').innerHTML = `
  <nav>
    <div class="navbar">
      <div class="logo"><a href="/index">Nebula</a></div>
      <ul class="menu">
        <li><a href="/index"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="/games"><i class="fa-solid fa-gamepad"></i> Games</a></li>
      </ul>
      <div class="search-box">
        <input type="text" placeholder="Search here...">
        <i class="fas fa-search"></i>
      </div>
      <div class="menu-btn">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
`;
