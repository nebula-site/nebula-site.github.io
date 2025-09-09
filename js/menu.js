 document.addEventListener('DOMContentLoaded', function () {
     const buttons = [
         { name: '2048', image: '/images/2048.png', link: '/sourceCode/2048', path: '/play', favorite: false },
         { name: 'Snow Rider', image: '/images/snowrider.png', link: 'https://www.hoodamath.com/mobile/games/snow-rider-3d/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'OvO', image: '/images/ovo.png', link: 'https://www.hoodamath.com/mobile/games/ovo/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Geometry Dash', image: '/images/geometrydash.png', link: '/sourceCode/geometry-dash', path: '/play', favorite: false },
         { name: 'Tiny Fishing', image: '/images/tinyfishing.png', link: 'https://www.hoodamath.com/mobile/games/hooda-tiny-fishing/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Guess Word', image: '/images/guessword.png', link: 'https://www.hoodamath.com/mobile/games/guess-word/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Draw to Smash', image: '/images/drawtosmash.png', link: 'https://www.hoodamath.com/mobile/games/draw-to-smash/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Slice It', image: '/images/sliceit.png', link: 'https://www.hoodamath.com/mobile/games/hooda-slice-it/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Rodha', image: '/images/rodha.png', link: 'https://www.hoodamath.com/mobile/games/rodha/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Swing Monkey', image: '/images/swingmonkey.png', link: 'https://www.hoodamath.com/mobile/games/swing-monkey/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: '8 Ball Pool', image: '/images/8ballpool.png', link: 'https://www.hoodamath.com/mobile/games/8-ball-pool/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Wheelie Bike', image: '/images/wheeliebike.png', link: 'https://www.hoodamath.com/mobile/games/wheelie-bike/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Drift Hunters', image: '/images/drifthunters.png', link: 'https://www.hoodamath.com/mobile/games/drift-hunters/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Taxi Driver 3d', image: '/images/taxidriver3d.png', link: 'https://www.hoodamath.com/mobile/games/taxi-driver-3d/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Duck Life', image: '/images/ducklife.png', link: 'https://www.hoodamath.com/mobile/games/duck-life/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Duck Life 2', image: '/images/ducklife2.png', link: 'https://www.hoodamath.com/mobile/games/duck-life-2-world-champion/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Duck Life 3', image: '/images/ducklife3.png', link: 'https://www.hoodamath.com/mobile/games/duck-life-3-evolution/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Duck Life 4', image: '/images/ducklife4.png', link: 'https://www.hoodamath.com/mobile/games/duck-life-4/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Duck Life 6', image: '/images/ducklife6.png', link: 'https://www.hoodamath.com/mobile/games/duck-life-6-space/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: "Low's Adventures", image: '/images/lowsadventures.png', link: 'https://www.hoodamath.com/mobile/games/lows-adventures/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: "Low's Adventures 2", image: '/images/lowsadventures2.png', link: 'https://www.hoodamath.com/mobile/games/lows-adventures-2/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: "Low's Adventures 3", image: '/images/lowsadventures3.png', link: 'https://www.hoodamath.com/mobile/games/lows-adventures-3/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Draw the Rest', image: '/images/drawtherest.png', link: 'https://www.hoodamath.com/mobile/games/draw-the-rest/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Car Rush', image: '/images/carrush.png', link: 'https://www.hoodamath.com/mobile/games/car-rush/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Opposite Day', image: '/images/oppositeday.png', link: 'https://www.hoodamath.com/mobile/games/opposite-day/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Wordle', image: '/images/wordle.png', link: 'https://wordleunlimited.org/#google_vignette', path: '/play', favorite: false },
         { name: 'Helix Jump', image: '/images/helixjump.png', link: '/sourceCode/helix-jump', path: '/play', favorite: false },
         { name: 'Are you Human?', image: '/images/areyouhuman.png', link: 'https://www.hoodamath.com/mobile/games/are-you-human/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Ball Blast', image: '/images/ballblast.png', link: '/sourceCode/ball-blast', path: '/play', favorite: false },
         { name: 'Simon', image: '/images/simongame.png', link: '/sourceCode/simon', path: '/play', favorite: false },
         { name: 'Speed Cube', image: '/images/speedcube.png', link: 'https://www.hoodamath.com/mobile/games/speed-cube/game.html?nocheckorient=1', path: '/play', favorite: false },
         { name: 'Drive Mad', image: '/images/drivemad.png', link: '/sourceCode/drive-mad', path: '/play', favorite: false },
         { name: 'Stickman Hook', image: '/images/stickmanhook.png', link: '/sourceCode/stick-man-hook', path: '/play', favorite: false },
         { name: 'Cookie Clicker', image: '/images/cookieclicker.png', link: 'sourceCode/cookie-clicker', path: '/play', favorite: false },
         { name: 'Stick Archer Battle', image: '/images/stickarcherbattle.png', link: '/sourceCode/stick-archers-battle', path: '/play', favorite: false },
         { name: 'Arena King', image: '/images/arenaking.png', link: '/sourceCode/arena-king', path: '/play', favorite: false },
         { name: 'Stickman Parkour', image: '/images/stickmanparkour.png', link: '/sourceCode/stickman-parkour', path: '/play', favorite: false },
         { name: 'Recoil', image: '/images/recoil.png', link: '/sourceCode/recoil', path: '/play', favorite: false },
         { name: 'Google Snake', image: '/images/snake.png', link: '/sourceCode/snake', path: '/play', favorite: false },
         { name: 'Moto X3m', image: '/images/motox3m.png', link: '/sourceCode/moto-x3m', path: '/play', favorite: false },
         { name: 'Bacon May Die', image: '/images/baconmaydie.png', link: '/sourceCode/bacon-may-die', path: '/play', favorite: false },
         { name: 'Eaglercraft', image: '/images/eaglercraft.png', link: '/sourceCode/eaglercraft', path: '/play', favorite: false },
         { name: 'Asteroids', image: '/images/asteroids.png', link: '/sourceCode/asteroids', path: '/play', favorite: false },
         { name: 'Slither.IO', image: '/images/slitherio.png', link: '/sourceCode/slither-io', path: '/play', favorite: false },
         { name: 'Flappy Bird', image: '/images/flappybird.png', link: '/sourceCode/flappy-bird', path: '/play', favorite: false },
         { name: 'Slow Roads', image: '/images/slowroads.png', link: '/sourceCode/slow-roads', path: '/play', favorite: false },
         { name: 'Block Blast!', image: '/images/blockblast.png', link: '/sourceCode/block-blast', path: '/play', favorite: false },
         { name: 'Crossy Road', image: '/images/crossyroad.png', link: '/sourceCode/crossy-road', path: '/play', favorite: false },
         { name: 'Cut The Rope', image: '/images/cuttherope.png', link: '/sourceCode/cut-the-rope', path: '/play', favorite: false },
         { name: 'Getting Over It', image: '/images/gettingoverit.png', link: '/sourceCode/getting-over-it', path: '/play', favorite: false },
         { name: 'Chrome Dino', image: '/images/chromedino.png', link: '/sourceCode/chrome-dino', path: '/play', favorite: false },
         { name: 'Super Mario 64', image: '/images/mario64.png', link: '/sourceCode/mario-64', path: '/play', favorite: false },
         { name: 'Infinate Craft', image: '/images/infinatecraft.png', link: '/sourceCode/infinate-craft', path: '/play', favorite: false },
         { name: 'Pig Clicker', image: '/images/pigclicker.png', link: '/sourceCode/pig-clicker', path: '/play', favorite: false },
         { name: 'Freehead Skate', image: '/images/freeheadskate.png', link: '/sourceCode/freehead-skate', path: '/play', favorite: false },
         { name: 'Idle Breakout', image: '/images/idlebreakout.png', link: '/sourceCode/idle-breakout', path: '/play', favorite: false },
         { name: 'Doodle Jump', image: '/images/doodlejump.png', link: '/sourceCode/doodle-jump', path: '/play', favorite: false },
         { name: 'Donkey Kong', image: '/images/donkeykong.png', link: '/sourceCode/donkey-kong', path: '/play', favorite: false },
         { name: 'Stack It', image: '/images/stackit.png', link: '/sourceCode/stack-it', path: '/play', favorite: false },
         { name: 'Resizer', image: '/images/resizer.png', link: '/sourceCode/resizer', path: '/play', favorite: false },
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

        a.addEventListener('click', (e) => {
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

        if (sortBy === 'starred') {
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

    // Ensure the 'starred' option exists
    if (!Array.from(sortOptions.options).some(opt => opt.value === 'starred')) {
        const starredOption = document.createElement('option');
        starredOption.value = 'starred';
        starredOption.textContent = 'Sort By Starred';
        sortOptions.appendChild(starredOption);
    }

    renderButtons();
});
