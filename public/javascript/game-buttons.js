const API_URL = 'http://localhost:3000/api';

async function loadGames() {
  const container = document.getElementById('game-menu');
  container.innerHTML = '';
  try {
    // 1. Load static game data
    const [resGames, resStats] = await Promise.all([
      fetch('/json/games.json'),
      fetch(`${API_URL}/stats`)
    ]);

    if (!resGames.ok) throw new Error('Failed to load games.json');
    if (!resStats.ok) throw new Error('Failed to load stats');

    const games = await resGames.json();
    const stats = await resStats.json();

    // 2. Merge game info with live stats (handle string keys)
    const mergedGames = games.map((game, index) => {
      const stat = stats[String(index)] || { views: 0, likes: 0, dislikes: 0 };
      return { ...game, ...stat };
    });

    // 3. Display games
    mergedGames.forEach((game, index) => {
      const div = document.createElement('div');
      div.className = 'game-wrapper';
      div.innerHTML = `
        <div class="game" data-index="${index}">
          <div class="top">
            <img class="game-logo" src="${game.image}" alt="${game.title}">
            <h2 class="game-title">${game.title}</h2>
          </div>
          <div class="bottom">
            <div><i class="fa-solid fa-play"></i> ${formatNumber(game.views)}</div>
            <div><i class="fa-solid fa-thumbs-up"></i> ${formatNumber(game.likes)}</div>
            <div><i class="fa-solid fa-thumbs-down"></i> ${formatNumber(game.dislikes)}</div>
          </div>
        </div>
      `;

      div.querySelector('.game').addEventListener('click', () => {
        localStorage.setItem('games', JSON.stringify(mergedGames)); // Save merged to localStorage
        window.location.href = `play.html?game=${index}`;
      });

      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = `<div style="color:#ff6b6b;font-size:1.2em;padding:2em;text-align:center;">Failed to load games.<br>${err.message}</div>`;
    console.error('Error loading games:', err);
  }
}

function formatNumber(n) {
  return n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n;
}

loadGames();