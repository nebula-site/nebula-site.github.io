import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


function slugify(name){
return name.toLowerCase().replace(/[. ]+/g,'-')
}


async function addGame(name){
const slug = slugify(name)
const link = `/sourceCode/${slug}`
const image = `/images/game-logos/${slug}.png`
await supabase.from('games').insert({name,link,image})
}


async function fetchGames(){
const { data, error } = await supabase.from('games').select('*')
if(error) console.error(error)
return data || []
}


function createButton(game){
const a = document.createElement('a')
a.className = 'menu-button'
a.href = game.link || '#'


const img = document.createElement('img')
img.src = game.image
a.appendChild(img)


const overlay = document.createElement('div')
overlay.className = 'overlay'
overlay.innerText = game.name
a.appendChild(overlay)


return a
}


async function renderButtons(){
const container = document.getElementById('buttonContainer')
container.innerHTML = ''
const games = await fetchGames()
games.sort((a,b)=> a.name.localeCompare(b.name))
games.forEach(g=> container.appendChild(createButton(g)))
}


document.addEventListener('DOMContentLoaded', renderButtons);
