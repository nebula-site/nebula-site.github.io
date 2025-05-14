 document.addEventListener('DOMContentLoaded', function () {
     const buttons = [
         { name: '2048', image: '/images/2048.png', link: '/sourceCode/2048', path: '/play', favorite: false },
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
