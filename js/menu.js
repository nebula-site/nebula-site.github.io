const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'

let supabase = null

function initSupabase() {
  if (typeof supabase !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('✓ Supabase initialized')
    renderButtons()
  } else {
    console.error('✗ Supabase library not loaded')
  }
}

function slugify(name) {
  return name.toLowerCase().replace(/[. ]+/g, '-')
}

async function addGame(name) {
  if (!supabase) {
    console.error('Supabase not initialized')
    return
  }
  
  const slug = slugify(name)
  const link = `/sourceCode/${name}`
  const image = `/images/game-logos/${name}.png`
  
  try {
    const { data, error } = await supabase
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
  if (!supabase) {
    console.error('Supabase not initialized')
    return []
  }
  
  try {
    console.log('Fetching games from Supabase...')
    const { data, error } = await supabase
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
  // Store game data in sessionStorage for play.html to access
  let gameLink = game.link
  
  // Ensure the link starts with /sourceCode/
  if (!gameLink.startsWith('/sourceCode/')) {
    gameLink = '/sourceCode/' + gameLink.replace(/^\/+/, '')
  }
  

  
  // Format image path with slugified name
  const slugifiedName = game.name.toLowerCase().replace(/[. ]+/g, '-')
  const gameImage = `/images/game-logos/${slugifiedName}.png`
  
  sessionStorage.setItem('gameLink', gameLink)
  sessionStorage.setItem('gameName', game.name)
  sessionStorage.setItem('gameImage', gameImage)
  
  // Navigate to play.html
  window.location.href = '/play.html'
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
  container.innerHTML = '<p>Loading games...</p>'
  
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
