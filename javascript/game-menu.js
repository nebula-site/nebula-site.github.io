const games = [
  { name: 'Game 1', image: '', link: 'https://example.com/game1' },
  { name: 'Game 2', image: '', link: 'https://example.com/game2' },
  { name: 'Game 3', image: '', link: 'https://example.com/game3' }
];

const menu = document.getElementById('menu-element');
renderButtons();

function renderButtons() {
  menu.innerHTML = '';
  games.forEach(game => {
    const btn = document.createElement('a');
    btn.href = game.link;
    btn.textContent = game.name;
    btn.className = 'menu-button';
    btn.target = '_blank'; // optional: opens in new tab
    menu.appendChild(btn);
  });
}
