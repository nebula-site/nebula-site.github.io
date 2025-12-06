import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function slugify(name) {
  return name.toLowerCase().replace(/[. ]+/g, '-')
}

async function addGame(name) {
  const slug = slugify(name)
  const link = `/sourceCode/${slug}`
  const image = `/images/game-logos/${slug}.png`
  
  const { data, error } = await supabase
    .from('games')
    .insert([{ name, link, image }])
    .select()
  
  if (error) throw error
  return data
}

async function fetchGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('name', { ascending: true })
  
  if (error) {
    console.error('Supabase error:', error)
    throw error
  }
  
  return data || []
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
    console.error('Element with id "buttonContainer" not found')
    return
  }
  
  try {
    container.innerHTML = ''
    const games = await fetchGames()
    
    if (games.length === 0) {
      container.innerHTML = '<p>No games available</p>'
      return
    }
    
    games.forEach(game => {
      container.appendChild(createButton(game))
    })
  } catch (error) {
    console.error('Failed to render games:', error)
    container.innerHTML = '<p>Error loading games. Check console.</p>'
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderButtons)
} else {
  renderButtons()
}
