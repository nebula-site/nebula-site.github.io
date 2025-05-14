// anvabr.js

(function() {
  const nav = document.createElement('nav');
  nav.style.cssText = `
    background-color: #333;
    padding: 10px 20px;
    font-family: sans-serif;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  nav.innerHTML = `
    <div style="font-weight: bold; font-size: 1.2em;">Anvabr</div>
    <ul style="list-style: none; display: flex; gap: 20px; margin: 0; padding: 0;">
      <li><a href="#" style="color: white; text-decoration: none;">Home</a></li>
      <li><a href="#" style="color: white; text-decoration: none;">About</a></li>
      <li><a href="#" style="color: white; text-decoration: none;">Contact</a></li>
    </ul>
  `;

  const target = document.getElementById('navbar-element');
  if (target) {
    target.appendChild(nav);
  } else {
    console.warn("No #anvabr element found on the page.");
  }
})();
