// --- Supabase Configuration ---
const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'

let supabase = null
let supabasePublic = null
let allGames = []

// --- Supabase Initialization ---
function initSupabase() {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        supabasePublic = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        })

        console.log('✓ Supabase initialized')
        fetchGamesAndRender()
    } else {
        console.error('✗ Supabase client not found')
        document.getElementById('gamesLoadedCounter').textContent =
            'Error: Supabase client not loaded.'
    }
}

// --- Utilities ---
function slugify(name) {
    return name.toLowerCase().replace(/[. ]+/g, '-')
}

function createButton(game) {
    const button = document.createElement('button')
    button.className = 'menu-button'
    button.title = game.name

    button.onclick = (e) => {
        e.preventDefault()
        playGame(game)
    }

    const slug = slugify(game.name)

    const img = document.createElement('img')
    img.src = `/images/game-logos/${slug}.png`
    img.alt = game.name
    img.loading = 'lazy'
    button.appendChild(img)

    const overlay = document.createElement('div')
    overlay.className = 'overlay'
    overlay.textContent = game.name
    button.appendChild(overlay)

    return button
}

// --- Fetch & Render ---
async function fetchGamesAndRender() {
    const client = supabasePublic || supabase
    if (!client) return

    try {
        const { data, error } = await client
            .from('games')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error

        allGames = data || []
        renderButtons(allGames)

        document
            .getElementById('search')
            .addEventListener('input', handleSearch)

    } catch (err) {
        console.error('✗ Failed to fetch games:', err)
        document.getElementById('gamesLoadedCounter').textContent =
            'Error loading games'
    }
}

function renderButtons(games) {
    const container = document.getElementById('buttonContainer')
    const counter = document.getElementById('gamesLoadedCounter')

    if (!container) return

    container.innerHTML = ''

    if (!games.length) {
        container.innerHTML = '<p>No games found.</p>'
        counter.textContent = '0 games found'
        return
    }

    games.forEach(game => container.appendChild(createButton(game)))
    counter.textContent = `${games.length} games loaded`
}

// --- Search ---
function handleSearch(e) {
    const q = e.target.value.toLowerCase().trim()
    if (!q) return renderButtons(allGames)

    renderButtons(
        allGames.filter(g => g.name.toLowerCase().includes(q))
    )
}

// --- Play Game ---
function playGame(game) {
    try {
        const raw = localStorage.getItem('nebula_profile')
        const profile = raw ? JSON.parse(raw) : null

        if (!profile || !(profile.email || profile.username || profile.name)) {
            sessionStorage.setItem(
                'postAuthRedirect',
                `/play?game=${encodeURIComponent(game.name)}`
            )
            window.location.href = '/profile'
            return
        }
    } catch {
        window.location.href = '/profile'
        return
    }

    const slug = slugify(game.name)

    sessionStorage.setItem('gameLink', `/sourceCode/${slug}`)
    sessionStorage.setItem('gameName', game.name)
    sessionStorage.setItem('gameImage', `/images/game-logos/${slug}.png`)

    window.location.href = '/play'
}

// --- Start ---
window.addEventListener('load', initSupabase)

// --- Optional Add Game ---
async function addGame(name) {
    if (!supabase) return

    const slug = slugify(name)

    const { data, error } = await supabase
        .from('games')
        .insert([{
            name,
            link: `/sourceCode/${slug}`,
            image: `/images/game-logos/${slug}.png`
        }])
        .select()

    if (error) throw error
    return data
}
