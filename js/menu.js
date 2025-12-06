const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'

let supabase = null

async function initSupabase() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  console.log('✓ Supabase initialized')
  renderButtons()
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
  const link = `/sourceCode/${slug}`
  const image = `/images/game-logos/${slug}.png`
  
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

function createButton(game) {
  const a = document.createElement('a')
  a.className = 'menu-button'
  a.href = game.link || '#'
  a.title = game.name
  
  const img = document.createElement('img')
  img.src = game.image
  img.alt = game.name
  img.loading = 'lazy'
  a.appendChild(img)
  
  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.textContent = game.name
  a.appendChild(overlay)
  
  return a
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
  } catch (error) {
    console.error('✗ Failed to render games:', error)
    container.innerHTML = '<p>Error loading games. Check console.</p>'
  }
}

console.log('Script loaded, initializing Supabase...')
initSupabase()
