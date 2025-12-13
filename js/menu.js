// --- Supabase Configuration (Replace with your actual keys) ---
// NOTE: For a public list of games, using the anonymous key is fine for read-only access.
const SUPABASE_URL = 'https://lhurtuuxsmlakoikcpiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'

let supabase = null // Client for potentially authenticated actions (like addGame)
let supabasePublic = null // Dedicated public client for fetching
let allGames = [] // Cache to hold all fetched games for searching/filtering

// --- Supabase Initialization ---

function initSupabase() {
    // Check if the Supabase global object is available (loaded via CDN script in HTML)
    if (window.supabase) {
        // client that may carry user session
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        // a dedicated public/anon client that will NOT pick up the user's session/localStorage token
        supabasePublic = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        })

        console.log('✓ Supabase initialized (menu.js) — public client ready')
        // Initial fetch and render
        fetchGamesAndRender()
    } else {
        console.error('✗ Supabase client not found. Ensure the CDN script loads correctly.')
        document.getElementById('gamesLoadedCounter').textContent = 'Error: Supabase client not loaded.'
    }
}

// --- Utility Functions ---

function slugify(name) {
    // Creates a URL-safe string from the game name
    return name.toLowerCase().replace(/[. ]+/g, '-')
}

function createButton(game) {
    const button = document.createElement('button')
    button.className = 'menu-button animate__animated animate__zoomIn'
    button.title = game.name
    
    // Prevent default link behavior and use playGame instead
    button.onclick = (e) => {
        e.preventDefault()
        playGame(game)
    }
    
    const slugifiedName = slugify(game.name)
    
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

// --- Data Fetching & Rendering ---

async function fetchGamesAndRender() {
    const client = supabasePublic || supabase
    if (!client) {
        console.error('Supabase not initialized for fetching')
        return
    }
    
    try {
        console.log('Fetching games from Supabase (public client)...')
        const { data, error } = await client
            .from('games')
            .select('*')
            .order('name', { ascending: true })
            
        if (error) throw error
        
        allGames = data || [] // Cache all games
        
        console.log(`✓ Fetched ${allGames.length} games.`)
        
        // Initial rendering of all games
        renderButtons(allGames)

        // Set up the search listener only after games are fetched
        document.getElementById('search').addEventListener('input', handleSearch)
        
    } catch (error) {
        console.error('✗ Supabase error during fetch:', error)
        document.getElementById('gamesLoadedCounter').textContent = 'Error loading games. Check console.'
    }
}

function renderButtons(gamesToRender) {
    const container = document.getElementById('buttonContainer')
    const counter = document.getElementById('gamesLoadedCounter')
    
    if (!container) {
        console.error('✗ Element with id "buttonContainer" not found')
        return
    }
    
    container.innerHTML = ''
    
    if (gamesToRender.length === 0) {
        container.innerHTML = '<p>No games found matching your search.</p>'
        counter.textContent = `${gamesToRender.length} games found`
        return
    }
    
    gamesToRender.forEach(game => {
        container.appendChild(createButton(game))
    })
    
    counter.textContent = `${gamesToRender.length} games loaded`
}

// --- Search Functionality ---

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim()
    
    if (query === '') {
        // If the query is empty, show all games
        renderButtons(allGames)
    } else {
        // Filter the cached list of games
        const filteredGames = allGames.filter(game => 
            game.name.toLowerCase().includes(query)
        )
        // Render the filtered list
        renderButtons(filteredGames)
    }
}

// --- Play Game Function (Requires Authentication/Profile Check) ---

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
    const slugifiedName = slugify(game.name)
    const gameLink = `/sourceCode/${slugifiedName}`
    const gameImage = `/images/game-logos/${slugifiedName}.png`

    sessionStorage.setItem('gameLink', gameLink)
    sessionStorage.setItem('gameName', game.name)
    sessionStorage.setItem('gameImage', gameImage)

    // Navigate to play.html
    window.location.href = '/play'
}

// --- Entry Point ---

// Wait for the window to fully load, ensuring the Supabase global object is ready
window.addEventListener('load', initSupabase)

// --- Optional: addGame function (For completeness, though not needed for menu page) ---
async function addGame(name) {
    // This function requires a client that has user authentication/session
    const client = supabase 
    if (!client) {
        console.error('Supabase not initialized or user not authenticated')
        return
    }

    const slug = slugify(name)
    const link = `/sourceCode/${slug}`
    const image = `/images/game-logos/${slug}.png`

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
