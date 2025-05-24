document.addEventListener('DOMContentLoaded', function () {
  const supabaseUrl = 'https://viknwzilvugcbbgkkzer.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpa253emlsdnVnY2JiZ2tremVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MzQyMzMsImV4cCI6MjA2MzExMDIzM30.2FXndUt4KyUkIXEpKqbchq8v6GZx24frhzlhGtH54Wc';
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const buttons = [
    { name: 'Block Blast', image: '/game-logos/block-blast.png', link: '/sourceCode/block-blast', path: '/play', favorite: false },
    { name: 'Subway Surfers', image: '/game-logos/subway-surfers.png', link: '/sourceCode/subway-surfers/', path: '/play', favorite: false },
    { name: 'Cookie Clicker', image: '/game-logos/cookie-clicker.png', link: '/sourceCode/cookie-clicker/', path: '/play', favorite: false },
    { name: 'Cut The Rope', image: '/game-logos/cut-the-rope.png', link: '/sourceCode/cut-the-rope', path: '/play', favorite: false },
    { name: 'Drive Mad', image: '/game-logos/drive-mad.png', link: '/sourceCode/drive-mad', path: '/play', favorite: false },
    { name: 'Fruit Ninja', image: '/game-logos/fruit-ninja.png', link: '/sourceCode/fruit-ninja/', path: '/play', favorite: false },
    { name: 'Dadish', image: '/game-logos/dadish.png', link: '/sourceCode/dadish/', path: '/play', favorite: false },
    { name: 'Retro Bowl College', image: '/game-logos/retro-bowl-college.png', link: '/sourceCode/retro-bowl-college/', path: '/play', favorite: false },
    { name: 'Monkey Mart', image: '/game-logos/monkey-mart.png', link: '/sourceCode/monkey-mart/', path: '/play', favorite: false },
    { name: 'Stickman Hook', image: '/game-logos/stickman-hook.png', link: '/sourceCode/stickman-hook', path: '/play', favorite: false },
    { name: 'Tiny Fishing', image: '/game-logos/tiny-fishing.png', link: '/sourceCode/tiny-fishing/', path: '/play', favorite: false },
    { name: 'Moto X3m', image: '/game-logos/moto-x3m.png', link: '/sourceCode/moto-x3m/', path: '/play', favorite: false },
    { name: 'Stick Archers Battle', image: '/game-logos/stick-archers-battle.png', link: '/sourceCode/stick-archers-battle/', path: '/play', favorite: false },
    { name: 'Crazy Cattle 3d', image: '/game-logos/crazy-cattle-3d.png', link: '/sourceCode/crazy-cattle-3d/', path: '/play', favorite: false },
    { name: 'Dino Bros', image: '/game-logos/dino-bros.png', link: '/sourceCode/dino-bros/', path: '/play', favorite: false },
    { name: 'Recoil', image: '/game-logos/recoil.png', link: '/sourceCode/recoil/', path: '/play', favorite: false },
    { name: 'Crossy Road', image: '/game-logos/crossy-road.png', link: '/sourceCode/crossy-road/', path: '/play', favorite: false },
    { name: 'Slope.io', image: '/game-logos/slope-io.png', link: '/sourceCode/slope-io', path: '/play', favorite: false },
    { name: 'Slope.io 3', image: '/game-logos/slope-io-3.png', link: '/sourceCode/slope-io-3/', path: '/play', favorite: false },
  ];

  const buttonContainer = document.getElementById('buttonContainer');
  const searchInput = document.getElementById('search');
  const counterDisplay = document.getElementById('counterDisplay');
  const sortSelect = document.getElementById('sortSelect');

  function getClickCount(buttonName) {
    const count = localStorage.getItem(buttonName);
    return count ? parseInt(count) : 0;
  }

  function setClickCount(buttonName, count) {
    localStorage.setItem(buttonName, count);
  }

  function getFavoriteStatus(buttonName) {
    return localStorage.getItem(buttonName + '_favorite') === 'true';
  }

  function setFavoriteStatus(buttonName, status) {
    localStorage.setItem(buttonName + '_favorite', status);
  }

  function toggleFavorite(button) {
    button.favorite = !button.favorite;
    setFavoriteStatus(button.name, button.favorite);
    renderButtons(searchInput.value);
  }

  async function updateClickInSupabase(name) {
    const { data, error } = await supabaseClient
      .from('clicks')
      .upsert({ name, clicks: getClickCount(name) }, { onConflict: ['name'] });

    if (error) {
      console.error('Error updating Supabase:', error);
    }
  }

  function createButton(button) {
    const a = document.createElement('a');
    a.className = 'menu-button';
    a.href = button.path;

    const img = document.createElement('img');
    img.src = button.image;
    a.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerText = button.name;
    a.appendChild(overlay);

    const count = getClickCount(button.name);
    const popUp = document.createElement('div');
    popUp.className = 'popup';
    popUp.innerText = `Clicked: ${count} clicks`;
    a.appendChild(popUp);

    const favoriteIcon = document.createElement('span');
    favoriteIcon.className = 'favorite-icon';
    const icon = document.createElement('i');
    icon.className = button.favorite ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
    favoriteIcon.appendChild(icon);

    favoriteIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(button);
      icon.className = button.favorite ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
      icon.classList.add('animate__animated', 'animate__bounce');
      setTimeout(() => {
        icon.classList.remove('animate__animated', 'animate__bounce');
      }, 1000);
    });

    a.appendChild(favoriteIcon);

    a.addEventListener('click', async (e) => {
      e.preventDefault();

      let newCount = getClickCount(button.name) + 1;
      setClickCount(button.name, newCount);
      await updateClickInSupabase(button.name);

      sessionStorage.setItem('gameLink', button.link);
      sessionStorage.setItem('gameName', button.name);
      sessionStorage.setItem('gameImage', button.image);

      const iframe = document.getElementById('myIframe');
      const nameDisplay = document.getElementById('game-name');
      if (iframe) iframe.src = button.link;
      if (nameDisplay) nameDisplay.innerText = button.name;

      window.location.href = button.path;
    });

    return a;
  }

  function renderButtons(filter = '') {
    buttonContainer.classList.add('fade-out');

    setTimeout(() => {
      buttonContainer.innerHTML = '';
      const filteredButtons = buttons.filter(button =>
        button.name.toLowerCase().includes(filter.toLowerCase())
      );
      filteredButtons.forEach(button => {
        button.favorite = getFavoriteStatus(button.name);
        buttonContainer.appendChild(createButton(button));
      });
      counterDisplay.textContent = `${filteredButtons.length} Games Loaded`;

      buttonContainer.classList.remove('fade-out');
      buttonContainer.classList.add('fade-in');

      setTimeout(() => {
        buttonContainer.classList.remove('fade-in');
      }, 300);
    }, 300);
  }

  searchInput.addEventListener('input', (e) => {
    renderButtons(e.target.value);
  });

  sortSelect.addEventListener('change', async (event) => {
    const sortType = event.target.value;

    if (sortType === 'trending') {
      try {
        const { data: trending, error } = await supabaseClient
          .from('clicks')
          .select('*')
          .order('clicks', { ascending: false });

        if (error) throw error;

        const trendingMap = new Map(trending.map(item => [item.name, item.clicks]));

        buttons.sort((a, b) =>
          (trendingMap.get(b.name) || 0) - (trendingMap.get(a.name) || 0)
        );

      } catch (err) {
        console.error('Error fetching trending data:', err);
      }
    } else if (sortType === 'alphabetical') {
      buttons.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderButtons(searchInput.value);
  });

  // ✅ Default to alphabetical sort on load
  buttons.sort((a, b) => a.name.localeCompare(b.name));
  sortSelect.value = 'alphabetical'; // Set dropdown to match initial sort
  renderButtons();
});
