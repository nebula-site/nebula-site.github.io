import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client — replace with your values
const supabaseUrl = 'https://isbtanymydnffawwembt.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYnRhbnlteWRuZmZhd3dlbWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzU4MDQsImV4cCI6MjA2MzUxMTgwNH0.aCAs5MI2FjQaPVgpVMF0EFgZM3lYQ0J3JZO_jy2n6LI'; 
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    // Get navbar container
    const navbarElement = document.getElementById('navbar-element');
    if (!navbarElement) {
        console.error("Element with ID 'navbar-element' not found.");
        return;
    }

    // Inject navbar HTML with user-info container (avatar first!)
    navbarElement.innerHTML = `
        <nav>
            <div class="navbar">
                <div class="logo"><a href="/index.html">Nebula</a></div>
                <ul class="menu">
                    <li><a href="/"><i class="fa-solid fa-house"></i> Home</a></li>
                    <li><a href="/games.html"><i class="fa-solid fa-gamepad"></i> Games</a></li>
                    <li><a href="/contact"><i class="fa-solid fa-comment"></i> Contact Us</a></li>
                </ul>

                <div class="menu-btn">
                    <i class="fas fa-bars"></i>
                </div>

                <a href="/profile"><div class="user-info">
                    <img id="avatar-display" src="https://via.placeholder.com/32" alt="Avatar" />
                    <span id="username-display">Loading...</span>
                </div></a>
            </div>
        </nav> 
    `;

    // Load user info from Supabase and update navbar
    loadUserInfo();

    async function loadUserInfo() {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            document.getElementById('username-display').textContent = 'Guest';
            document.getElementById('avatar-display').src = '/branding/nebula.png';
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            document.getElementById('username-display').textContent = 'Guest';
            document.getElementById('avatar-display').src = '/branding/nebula.png';
        } else {
            document.getElementById('username-display').textContent = profile.username;
            document.getElementById('avatar-display').src = profile.avatar_url || '/branding/nebula.png';
        }
    }
});
