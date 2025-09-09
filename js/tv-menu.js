 document.addEventListener('DOMContentLoaded', function () {
     const buttons = [
         { name: 'Phinnias and Ferb', image: '/images/phinnias-and-ferb.png', link: 'https://www.youtube.com/embed/fLWBx37eKBM?list=PLg6R6yXKSLYB7kxBoElpG5rSgThsWdrzr', path: '/play', favorite: false },
     ];
 
    const buttonContainer = document.getElementById('buttonContainer');
     const searchInput = document.getElementById('search');
     const counterDisplay = document.getElementById('counterDisplay');
     const sortOptions = document.getElementById('sortOptions');
 
     let showClickCounts = false;
 
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
 
         // Font Awesome favorite icon
         const favoriteIcon = document.createElement('span');
         favoriteIcon.className = 'favorite-icon';
         const icon = document.createElement('i');
         icon.className = button.favorite ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
         favoriteIcon.appendChild(icon);
 
         favoriteIcon.addEventListener('click', (e) => {
             e.stopPropagation();
             e.stopPropagation(); // Prevent the click event from bubbling up to the <a> element
             toggleFavorite(button);
             icon.className = button.favorite ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';
         });
 
         a.appendChild(favoriteIcon);
 
         a.addEventListener('click', () => {
             count++;
             setClickCount(button.name, count);
             sessionStorage.setItem('gameLink', button.link);
             sessionStorage.setItem('gameName', button.name);
             sessionStorage.setItem('gameImage', button.image);
 
             const iframe = document.getElementById('myIframe');
             iframe.src = button.link;
             const name = document.getElementById('game-name');
             name.innerText = button.name;
         });
 
         return a;
     }
 
     function renderButtons(filter = '', sortBy = 'alphabetical') {
         buttonContainer.innerHTML = '';
 
         let sortedButtons;
 
         if (sortBy === 'starred') {
             sortedButtons = buttons.sort((a, b) => {
                 const favoriteA = getFavoriteStatus(a.name);
                 const favoriteB = getFavoriteStatus(b.name);
                 return favoriteB - favoriteA;
             });
         } else if (sortBy === 'clickCount') {
             sortedButtons = buttons.sort((a, b) => {
                 const countA = getClickCount(a.name);
                 const countB = getClickCount(b.name);
                 return countB - countA;
             });
         } else if (sortBy === 'alphabetical') {
             sortedButtons = buttons.sort((a, b) => a.name.localeCompare(b.name));
         }
 
         const filteredButtons = sortedButtons.filter(button => button.name.toLowerCase().includes(filter.toLowerCase()));
 
         filteredButtons.forEach(button => {
             button.favorite = getFavoriteStatus(button.name);
             buttonContainer.appendChild(createButton(button));
         });
 
         counterDisplay.textContent = `${filteredButtons.length} Shows Loaded`;
     }
 
     searchInput.addEventListener('input', (e) => {
         renderButtons(e.target.value, sortOptions.value);
     });
 
     sortOptions.addEventListener('change', (e) => {
         renderButtons(searchInput.value, e.target.value);
     });
 
     const starredOption = document.createElement('option');
     starredOption.value = 'starred';
     starredOption.textContent = 'Sort By Starred';
     sortOptions.appendChild(starredOption);
 
     renderButtons();
 });
