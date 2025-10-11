document.addEventListener('DOMContentLoaded', function () {
     const buttons = [
     { name: 'Block Blast', image: '/images/game-logos/block-blast.png', link: '/sourceCode/block-blast', path: '/play', favorite: false },
     { name: 'Cookie Clicker', image: '/images/game-logos/cookie-clicker.png', link: '/sourceCode/cookie-clicker', path: '/play', favorite: false },
     { name: 'Crazy Cattle 3D', image: '/images/game-logos/crazy-cattle-3d.png', link: '/sourceCode/crazy-cattle-3d', path: '/play', favorite: false },
     { name: 'Crossy Road', image: '/images/game-logos/crossy-road.png', link: '/sourceCode/crossy-road', path: '/play', favorite: false },
     { name: 'Cut the Rope', image: '/images/game-logos/cut-the-rope.png', link: '/sourceCode/cut-the-rope', path: '/play', favorite: false },
     { name: 'Dadish', image: '/images/game-logos/dadish.png', link: '/sourceCode/dadish', path: '/play', favorite: false },
     { name: 'Dino Bros', image: '/images/game-logos/dino-bros.png', link: '/sourceCode/dino-bros', path: '/play', favorite: false },
     { name: 'Drive Mad', image: '/images/game-logos/drive-mad.png', link: '/sourceCode/drive-mad', path: '/play', favorite: false },
     { name: 'Fruit Ninja', image: '/images/game-logos/fruit-ninja.png', link: '/sourceCode/fruit-ninja', path: '/play', favorite: false },
     { name: 'Monkey Mart', image: '/images/game-logos/monkey-mart.png', link: '/sourceCode/monkey-mart', path: '/play', favorite: false },
     { name: 'Moto X3m', image: '/images/game-logos/moto-x3m.png', link: '/sourceCode/moto-x3m', path: '/play', favorite: false },
     { name: 'Recoil', image: '/images/game-logos/recoil.png', link: '/sourceCode/recoil', path: '/play', favorite: false },
     { name: 'Retro Bowl', image: '/images/game-logos/retro-bowl.png', link: '/sourceCode/retro-bowl', path: '/play', favorite: false },
     { name: 'Slope.IO', image: '/images/game-logos/slope-io.png', link: '/sourceCode/slope-io', path: '/play', favorite: false },
     { name: 'Slope.IO 3', image: '/images/game-logos/slope-io-3.png', link: '/sourceCode/slope-io-3', path: '/play', favorite: false },
     { name: 'Stick Archers Battle', image: '/images/game-logos/stick-archers-battle.png', link: '/sourceCode/stick-archers-battle', path: '/play', favorite: false },
     { name: 'Stickman Hook', image: '/images/game-logos/stickman-hook.png', link: '/sourceCode/stickman-hook', path: '/play', favorite: false },
     { name: 'Subway Surfers', image: '/images/game-logos/subway-surfers.png', link: '/sourceCode/subway-surfers', path: '/play', favorite: false },
     { name: 'Tiny Fishing', image: '/images/game-logos/tiny-fishing.png', link: '/sourceCode/tiny-fishing', path: '/play', favorite: false },
     { name: 'Tomb of the Mask', image: '/images/game-logos/tomb-of-the-mask.png', link: '/sourceCode/tomb-of-the-mask', path: '/play', favorite: false },
     { name: 'Geometry Dash', image: '/images/game-logos/geometry-dash.png', link: '/sourceCode/geometry-dash', path: '/play', favorite: false },
     { name: 'Minecraft', image: '/images/game-logos/minecraft.png', link: '/sourceCode/minecraft', path: '/play', favorite: false },
     { name: 'Worlds Hardest Game', image: '/images/game-logos/worlds-hardest-game.png', link: '/sourceCode/worlds-hardest-game', path: '/play', favorite: false },
     { name: 'Arena King', image: '/images/game-logos/arena-king.png', link: '/sourceCode/arena-king', path: '/play', favorite: false },
     { name: 'Slow Roads', image: '/images/game-logos/slow-roads.png', link: '/sourceCode/slow-roads', path: '/play', favorite: false },
     { name: 'Helix Jump', image: '/images/game-logos/helix-jump.png', link: '/sourceCode/helix-jump', path: '/play', favorite: false },
     { name: 'Mario Bros', image: '/images/game-logos/mario-bros.png', link: '/sourceCode/mario-bros', path: '/play', favorite: false },
     { name: 'Core Ball', image: '/images/game-logos/core-ball.png', link: '/sourceCode/core-ball', path: '/play', favorite: false },
     { name: 'Doodle Jump', image: '/images/game-logos/doodle-jump.png', link: '/sourceCode/doodle-jump', path: '/play', favorite: false },
     { name: 'Death Run 3D', image: '/images/game-logos/death-run-3d.png', link: '/sourceCode/death-run-3d', path: '/play', favorite: false },
     { name: 'Thorns and Balloons', image: '/images/game-logos/thorns-and-balloons.png', link: '/sourceCode/thorns-and-balloons', path: '/play', favorite: false },
     { name: 'Getaway Shootout', image: '/images/game-logos/getaway-shootout.png', link: '/sourceCode/getaway-shootout', path: '/play', favorite: false },
     { name: 'Bacon may Die', image: '/images/game-logos/bacon-may-die.png', link: '/sourceCode/bacon-may-die', path: '/play', favorite: false },
     { name: 'Angry Birds', image: '/images/game-logos/angry-birds.png', link: '/sourceCode/angry-birds', path: '/play', favorite: false },
     { name: '1v1.LOL', image: '/images/game-logos/1v1-lol.png', link: '/sourceCode/1v1-lol', path: '/play', favorite: false },
     { name: '2048', image: '/images/game-logos/2048.png', link: '/sourceCode/2048', path: '/play', favorite: false },
     { name: 'Idle Breakout', image: '/images/game-logos/idle-breakout.png', link: '/sourceCode/idle-breakout', path: '/play', favorite: false },
     { name: 'Snow Rider 3D', image: '/images/game-logos/snow-rider.png', link: '/sourceCode/snow-rider', path: '/play', favorite: false },
     { name: 'OvO', image: '/images/game-logos/ovo.png', link: '/sourceCode/ovo', path: '/play', favorite: false },
     { name: 'Stickman Parkour', image: '/images/game-logos/stickman-parkour.png', link: '/sourceCode/stickman-parkour', path: '/play', favorite: false },
         
         
     ];
    const buttonContainer = document.getElementById('buttonContainer');
    const searchInput = document.getElementById('search');
    const counterDisplay = document.getElementById('counterDisplay');
    const sortOptions = document.getElementById('sortOptions');

    function getClickCount(buttonName) {
        const count = localStorage.getItem(buttonName);
        return count ? parseInt(count) : 0;
    }

    function setClickCount(buttonName, count) {
        localStorage.setItem(buttonName, count);
    }

    function getFavoriteStatus(buttonName) {
        const status = localStorage.getItem(buttonName + '_favorite');
        return status === 'true';
    }

    function setFavoriteStatus(buttonName, status) {
        localStorage.setItem(buttonName + '_favorite', status);
    }

    function toggleFavorite(button) {
        button.favorite = !button.favorite;
        setFavoriteStatus(button.name, button.favorite);
        renderButtons(searchInput.value, sortOptions.value);
    }

    function createButton(button) {
        const a = document.createElement('a');
        a.className = 'menu-button';
        a.href = button.path;

        let count = getClickCount(button.name);

        const img = document.createElement('img');
        img.src = button.image;
        a.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerText = button.name;
        a.appendChild(overlay);

        const popUp = document.createElement('div');
        popUp.className = 'popup';
        popUp.innerText = `Clicked: ${count} clicks`;
        a.appendChild(popUp);

        const favoriteIcon = document.createElement('span');
        favoriteIcon.className = 'favorite-icon';
        const icon = document.createElement('i');
        icon.className = button.favorite ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
        favoriteIcon.appendChild(icon);

        // Prevent navigation when clicking thumbs up
        favoriteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFavorite(button);
            icon.className = button.favorite ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
            icon.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                icon.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
        });

        a.appendChild(favoriteIcon);

        a.addEventListener('click', (e) => {
            // Only navigate if the click is not on the favorite icon
            if (e.target.closest('.favorite-icon')) return;
            e.preventDefault();
            count++;
            setClickCount(button.name, count);
            sessionStorage.setItem('gameLink', button.link);
            sessionStorage.setItem('gameName', button.name);
            sessionStorage.setItem('gameImage', button.image);

            const iframe = document.getElementById('myIframe');
            const name = document.getElementById('game-name');
            if (iframe) iframe.src = button.link;
            if (name) name.innerText = button.name;

            window.location.href = button.path;
        });

        return a;
    }

    function renderButtons(filter = '', sortBy = 'alphabetical') {
        buttonContainer.innerHTML = '';

        let sortedButtons = [...buttons]; // clone to avoid in-place sort bugs

        if (sortBy === 'liked') {
            sortedButtons.sort((a, b) => {
                return getFavoriteStatus(b.name) - getFavoriteStatus(a.name);
            });
        } else if (sortBy === 'clickCount') {
            sortedButtons.sort((a, b) => {
                return getClickCount(b.name) - getClickCount(a.name);
            });
        } else {
            sortedButtons.sort((a, b) => a.name.localeCompare(b.name));
        }

        const filteredButtons = sortedButtons.filter(button =>
            button.name.toLowerCase().includes(filter.toLowerCase())
        );

        filteredButtons.forEach(button => {
            button.favorite = getFavoriteStatus(button.name);
            buttonContainer.appendChild(createButton(button));
        });

        counterDisplay.textContent = `${filteredButtons.length} Games Loaded`;
    }

    searchInput.addEventListener('input', (e) => {
        renderButtons(e.target.value, sortOptions.value);
    });

    sortOptions.addEventListener('change', (e) => {
        renderButtons(searchInput.value, e.target.value);
    });

    // Ensure the 'liked' option exists
    if (!Array.from(sortOptions.options).some(opt => opt.value === 'liked')) {
        const likedOption = document.createElement('option');
        likedOption.value = 'liked';
        likedOption.textContent = 'Sort By Liked';
        sortOptions.appendChild(likedOption);
    }

    renderButtons();
});
