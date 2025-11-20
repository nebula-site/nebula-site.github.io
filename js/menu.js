/* app.js
   Supabase-backed game list with admin tools
   Uses Supabase project URL & anon key provided by user.
*/

// ---------- CONFIG: your Supabase URL / key (you provided these)
const SUPABASE_URL = "https://yjwipqxgvjbeofnwsiaa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqd2lwcXhndmpiZW9mbndzaWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Mjg0MTIsImV4cCI6MjA3ODEwNDQxMn0.sxVxT4RGt6YBDNc5k8pl3F77c03gmao_f85TZTf_MqQ";

// ---------- Init supabase client
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- DOM elements
const buttonContainer = document.getElementById('buttonContainer');
const searchInput = document.getElementById('search');
const sortOptions = document.getElementById('sortOptions');
const counterDisplay = document.getElementById('counterDisplay');

const btnSignup = document.getElementById('btn-signup');
const btnSignin = document.getElementById('btn-signin');
const btnSignout = document.getElementById('btn-signout');
const authState = document.getElementById('auth-state');

const btnAddGame = document.getElementById('btn-add-game');
const modalAddGame = document.getElementById('modal-add-game');
const gameNameInput = document.getElementById('game-name-input');
const gameLinkInput = document.getElementById('game-link-input');
const gameImageInput = document.getElementById('game-image-input');
const gameAddSubmit = document.getElementById('game-add-submit');
const gameAddCancel = document.getElementById('game-add-cancel');
const addGameStatus = document.getElementById('add-game-status');

const btnAddAdmin = document.getElementById('btn-add-admin');
const modalAddAdmin = document.getElementById('modal-add-admin');
const adminEmailInput = document.getElementById('admin-email-input');
const adminSubmit = document.getElementById('admin-submit');
const adminCancel = document.getElementById('admin-cancel');
const addAdminStatus = document.getElementById('add-admin-status');

let games = []; // loaded from supabase

// ---------- Auth helpers
async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
async function signOut() {
  await supabase.auth.signOut();
}

// ---------- Profile admin check
async function isCurrentUserAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  // look up profiles table for is_admin
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (error) {
    // if profile doesn't exist, treat as not admin
    return false;
  }
  return profile?.is_admin === true;
}

// ---------- Promote user to admin (admins only UI)
async function promoteToAdmin(email) {
  // find the user in auth.users to get id
  const { data: usersData, error: usersErr } = await supabase
    .from('profiles') // profiles table should have user id and email if you created it using the SQL below; try from auth.users is not allowed clientside
    .select('id,email')
    .eq('email', email)
    .limit(1)
    .single();

  if (usersErr || !usersData) {
    // As a fallback we try to update by email via RPC/edge function or instruct admin to use SQL dashboard.
    throw new Error("Could not find user profile with that email. Make sure the user signed up first.");
  }

  const userId = usersData.id;
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', userId);

  if (error) throw error;
  return data;
}

// ---------- Add game (upload image to storage & insert to games)
async function addGame(name, link, file) {
  if (!name || !link || !file) throw new Error("name/link/file required");

  // upload image to bucket 'game-images'
  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadErr } = await supabase.storage
    .from('game-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadErr) throw uploadErr;

  // get public URL
  const { data: publicData } = supabase.storage.from('game-images').getPublicUrl(fileName);
  const publicUrl = publicData?.publicUrl ?? null;

  // insert game record
  const { data, error } = await supabase
    .from('games')
    .insert([{ name, link, image_url: publicUrl }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ---------- Fetch games from DB
async function loadGamesFromSupabase() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Failed to fetch games:", error);
    games = [];
    return;
  }
  // normalize structure to match your previous button structure
  games = data.map(g => ({
    name: g.name,
    link: g.link,
    image: g.image_url,
    path: '/play', // keep existing behaviour
    favorite: false
  }));
}

// ---------- Click count & favorites (localStorage)
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

// ---------- Create DOM for a single button (same behavior as before)
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

// ---------- Render all buttons
function renderButtons(filter = '', sortBy = 'alphabetical') {
  buttonContainer.innerHTML = '';

  let sortedButtons = [...games]; // clone to avoid in-place sort

  if (sortBy === 'liked') {
    sortedButtons.sort((a, b) => {
      return (getFavoriteStatus(b.name) ? 1 : 0) - (getFavoriteStatus(a.name) ? 1 : 0);
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

// ---------- UI wiring & auth flow
async function updateUiForAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    authState.innerText = "Not signed in";
    btnSignin.classList.remove('hidden');
    btnSignup.classList.remove('hidden');
    btnSignout.classList.add('hidden');
    btnAddGame.classList.add('hidden');
    btnAddAdmin.classList.add('hidden');
    return;
  }
  authState.innerText = user.email;
  btnSignin.classList.add('hidden');
  btnSignup.classList.add('hidden');
  btnSignout.classList.remove('hidden');

  const admin = await isCurrentUserAdmin();
  if (admin) {
    btnAddGame.classList.remove('hidden');
    btnAddAdmin.classList.remove('hidden');
  } else {
    btnAddGame.classList.add('hidden');
    btnAddAdmin.classList.add('hidden');
  }
}

// Prompt for credentials (quick UI)
btnSignup.addEventListener('click', async () => {
  const email = prompt("Sign up - enter email:");
  if (!email) return;
  const password = prompt("Choose a password (min length may be required):");
  if (!password) return;
  try {
    await signUpWithEmail(email, password);
    alert("Sign up successful — check your email if confirmation required. Then sign in.");
  } catch (err) {
    alert("Sign up error: " + (err.message || err));
  }
});
btnSignin.addEventListener('click', async () => {
  const email = prompt("Sign in - email:");
  if (!email) return;
  const password = prompt("Password:");
  if (!password) return;
  try {
    await signInWithEmail(email, password);
    alert("Signed in!");
    await updateUiForAuth();
  } catch (err) {
    alert("Sign in error: " + (err.message || err));
  }
});
btnSignout.addEventListener('click', async () => {
  await signOut();
  await updateUiForAuth();
  alert("Signed out.");
});

// Add Game modal wiring
btnAddGame.addEventListener('click', () => {
  modalAddGame.classList.remove('hidden');
});
gameAddCancel.addEventListener('click', () => {
  modalAddGame.classList.add('hidden');
  addGameStatus.innerText = '';
});
gameAddSubmit.addEventListener('click', async () => {
  addGameStatus.innerText = "Uploading...";
  const name = gameNameInput.value.trim();
  const link = gameLinkInput.value.trim();
  const file = gameImageInput.files[0];

  try {
    // check admin
    const admin = await isCurrentUserAdmin();
    if (!admin) {
      throw new Error("You are not an admin.");
    }
    const res = await addGame(name, link, file);
    addGameStatus.innerText = "Game added!";
    // reload games
    await refreshGames();
    // clear modal
    gameNameInput.value = '';
    gameLinkInput.value = '';
    gameImageInput.value = '';
    setTimeout(() => { modalAddGame.classList.add('hidden'); addGameStatus.innerText = '' }, 900);
  } catch (err) {
    addGameStatus.innerText = "Error: " + (err.message || err);
    console.error(err);
  }
});

// Add Admin modal wiring
btnAddAdmin.addEventListener('click', () => {
  modalAddAdmin.classList.remove('hidden');
});
adminCancel.addEventListener('click', () => {
  modalAddAdmin.classList.add('hidden');
  addAdminStatus.innerText = '';
});
adminSubmit.addEventListener('click', async () => {
  const email = adminEmailInput.value.trim();
  if (!email) return (addAdminStatus.innerText = "Type an email first.");
  addAdminStatus.innerText = "Promoting...";
  try {
    const admin = await isCurrentUserAdmin();
    if (!admin) throw new Error("You are not an admin.");
    await promoteToAdmin(email);
    addAdminStatus.innerText = "User promoted to admin.";
    adminEmailInput.value = '';
    setTimeout(() => { modalAddAdmin.classList.add('hidden'); addAdminStatus.innerText = '' }, 900);
  } catch (err) {
    addAdminStatus.innerText = "Error: " + (err.message || err);
    console.error(err);
  }
});

// Search & sort handlers
searchInput.addEventListener('input', (e) => {
  renderButtons(e.target.value, sortOptions.value);
});
sortOptions.addEventListener('change', (e) => {
  renderButtons(searchInput.value, e.target.value);
});

// reload games flow
async function refreshGames() {
  await loadGamesFromSupabase();
  renderButtons(searchInput.value, sortOptions.value);
}

// On load - populate and auth state
(async function init() {
  // initial UI
  await updateUiForAuth();
  await refreshGames();

  // subscribe to auth state changes to update UI
  supabase.auth.onAuthStateChange(() => {
    updateUiForAuth();
  });
})();
