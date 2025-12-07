const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'

let supabase = null
let supabasePublic = null

// Replace the old initSupabase implementation with a dynamic import so we don't depend on globals
async function initSupabase() {
  try {
    // Dynamically import supabase client module — keeps this file isolated and avoids touching window
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')

    // client that may carry user session (if needed)
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // a dedicated public/anon client that will NOT pick up the user's session/localStorage token
    supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })

    console.log('✓ Supabase initialized (menu.js) — public client ready')
    renderButtons()
  } catch (err) {
    console.error('✗ Supabase init failed (menu.js):', err)
  }
}

function slugify(name) {
  return name.toLowerCase().replace(/[. ]+/g, '-')
}

async function addGame(name) {
  // Require authentication
  const client = supabase
  if (!client) {
    console.error('Supabase not initialized')
    return
  }

  const slug = slugify(name)
  const link = `/sourceCode/${name}`
  const image = `/images/game-logos/${name}.png`

  try {
    const { data, error } = await client
      .from('games')
      .insert([{ name, link, image }])
      .select()

    if (error) throw error
    console.log('✓ Game added:', data)
    return data
  } catch (error) {
    console.error('✗ Failed to add game:', error)
    throw error
  }
}


async function fetchGames() {
  const client = supabasePublic || supabase
  if (!client) {
    console.error('Supabase not initialized')
    return []
  }
  
  try {
    console.log('Fetching games from Supabase (public client)...')
    const { data, error } = await client
      .from('games')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    
    console.log(`✓ Fetched ${data.length} games:`, data)
    return data || []
  } catch (error) {
    console.error('✗ Supabase error:', error)
    return []
  }
}

function playGame(game) {
  // require auth: check unified profile key
  try {
    const raw = localStorage.getItem('nebula_profile');
    const profile = raw ? JSON.parse(raw) : null;
    if (!profile || !(profile.email || profile.username || profile.name)) {
      // remember desired target and send to profile to sign in
      try { sessionStorage.setItem('postAuthRedirect', `/play?game=${encodeURIComponent(game.name)}`); } catch (e) {}
      window.location.href = '/profile';
      return;
    }
  } catch (e) {
    window.location.href = '/profile';
    return;
  }

  // Store game data in sessionStorage for play.html to access
  let gameLink = game.link

  // Create slugified game name (lowercase + replace . and space with hyphen)
  const slugifiedName = game.name.toLowerCase().replace(/[. ]+/g, '-')
  gameLink = `/sourceCode/${slugifiedName}`

  // Format image path with slugified name
  const gameImage = `/images/game-logos/${slugifiedName}.png`

  sessionStorage.setItem('gameLink', gameLink)
  sessionStorage.setItem('gameName', game.name)
  sessionStorage.setItem('gameImage', gameImage)

  // Navigate to play.html
  window.location.href = '/play'
}

function createButton(game) {
  const button = document.createElement('button')
  button.className = 'menu-button'
  button.title = game.name
  
  // Prevent default link behavior and use playGame instead
  button.onclick = (e) => {
    e.preventDefault()
    playGame(game)
  }
  
  const slugifiedName = game.name.toLowerCase().replace(/[. ]+/g, '-')
  
  const img = document.createElement('img')
  img.src = `/images/game-logos/${slugifiedName}.png`
  img.alt = game.name
  img.loading = 'lazy'
  button.appendChild(img)
  
  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.textContent = game.name
  button.appendChild(overlay)
  
  return button
}

async function renderButtons() {
  const container = document.getElementById('buttonContainer')
  
  if (!container) {
    console.error('✗ Element with id "buttonContainer" not found')
    return
  }
  
  console.log('Rendering buttons...')
  
  try {
    const games = await fetchGames()
    
    if (games.length === 0) {
      console.warn('No games found in database')
      container.innerHTML = '<p>No games available</p>'
      return
    }
    
    container.innerHTML = ''
    games.forEach(game => {
      container.appendChild(createButton(game))
    })
    console.log(`✓ Rendered ${games.length} game buttons`)
    
    // Display games loaded counter
    const counter = document.getElementById('gamesLoadedCounter')
    if (counter) {
      counter.textContent = `${games.length} games loaded`
    }
  } catch (error) {
    console.error('✗ Failed to render games:', error)
    container.innerHTML = '<p>Error loading games. Check console.</p>'
  }
}

// Wait for Supabase library to load
window.addEventListener('load', initSupabase)