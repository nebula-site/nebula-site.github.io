import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function slugify(name){
  return name.toLowerCase().replace(/[. ]+/g, '-')
}

async function addGame(name){
  const slug = slugify(name)
  const link = `/sourceCode/${slug}`
  const image = `/images/game-logos/${slug}.png`
  const { error } = await supabase.from('games').insert({name, link, image})
  if(error) console.error('Error adding game:', error)
}

async function fetchGames(){
  try {
    const { data, error } = await supabase.from('games').select('*')
    
    if(error) {
      console.error('Error fetching games:', error)
      return []
    }
    
    console.log('Fetched games:', data) // Debug: verify data is retrieved
    return data || []
  } catch(err) {
    console.error('Unexpected error fetching games:', err)
    return []
  }
}

function createButton(game){
  const a = document.createElement('a')
  a.className = 'menu-button'
  a.href = game.link || '#'
  
  const img = document.createElement('img')
  img.src = game.image
  img.alt = game.name
  a.appendChild(img)
  
  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.innerText = game.name
  a.appendChild(overlay)
  
  return a
}

async function renderButtons(){
  const container = document.getElementById('buttonContainer')
  if(!container) {
    console.error('Button container not found')
    return
  }
  
  container.innerHTML = '<p>Loading games...</p>'
  
  const games = await fetchGames()
  
  if(games.length === 0) {
    container.innerHTML = '<p>No games found</p>'
    return
  }
  
  container.innerHTML = ''
  games.sort((a, b) => a.name.localeCompare(b.name))
  games.forEach(g => container.appendChild(createButton(g)))
}

document.addEventListener('DOMContentLoaded', renderButtons)
