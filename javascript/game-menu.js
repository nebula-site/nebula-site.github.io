document.addEventListener('DOMContentLoaded', function () {
    const buttons = [
        { name: 'Block Blast', image: '/game-logos/block-blast.png', link: '/sourceCode/block-blast', path: '/play', favorite: false },
        { name: 'Subway Surfers', image: '/game-logos/subway-surfers.png', link: '/sourceCode/subway-surfers/', path: '/play', favorite: false },
        { name: 'Cookie Clicker', image: '/game-logos/cookie-clicker.png', link: '/sourceCode/cookie-clicker/', path: '/play', favorite: false },
        { name: 'Cut The Rope', image: '/game-logos/cut-the-rope.png', link: '/sourceCode/cut-the-rope', path: '/play', favorite: false },
        { name: 'Drive Mad', image: '/game-logos/drive-mad.png', link: '/sourceCode/drive-mad', path: '/play', favorite: false },
        { name: 'Fruit Ninja', image: '/game-logos/fruit-ninja.png', link: '/sourceCode/fruit-ninja', path: '/play', favorite: false },
        { name: 'Dadish', image: '/game-logos/dadish.png', link: '/sourceCode/dadish/', path: '/play', favorite: false },
        { name: 'Retro Bowl College', image: '/game-logos/retro-bowl-college.png', link: '/sourceCode/retro-bowl-college/', path: '/play', favorite: false },
        { name: 'Monkey Mart', image: '/game-logos/monkey-mart.png', link: '/sourceCode/monkey-mart/', path: '/play', favorite: false },
        { name: 'Stickman Hook', image: '/game-logos/stickman-hook.png', link: '/sourceCode/stickman-hook', path: '/play', favorite: false },
    ];
    const buttonContainer = document.getElementById('buttonContainer');
    const searchInput = document.getElementById('search');
    const counterDisplay = document.getElementById('counterDisplay');

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
        renderButtons(searchInput.value); // Just filter by search input
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

    function renderButtons(filter = '') {
        buttonContainer.innerHTML = '';

        const filteredButtons = buttons.filter(button =>
            button.name.toLowerCase().includes(filter.toLowerCase())
        );

        filteredButtons.forEach(button => {
            button.favorite = getFavoriteStatus(button.name);
            buttonContainer.appendChild(createButton(button));
        });

        counterDisplay.textContent = `${filteredButtons.length} Games Loaded`;
    }

    searchInput.addEventListener('input', (e) => {
        renderButtons(e.target.value);
    });

    renderButtons();
});
