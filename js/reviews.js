import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://lhurtuuxsmlakoikcpiz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'; 
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    setupStarRating();
    fetchReviews();
    
    const postBtn = document.getElementById('post-review-btn');
    if (postBtn) postBtn.onclick = handlePostReview;
});

function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || '{}');
    const nameEl = document.getElementById('profile-display-name');
    const imgEl = document.getElementById('profile-display-img');
    
    if (profile.name || profile.username) {
        if (nameEl) nameEl.textContent = profile.name || profile.username;
        if (imgEl) imgEl.src = profile.picture || profile.avatar || "/images/user.png";
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.onclick = () => {
            const val = star.getAttribute('data-value');
            document.getElementById('rating-value').value = val;
            stars.forEach(s => {
                const sVal = s.getAttribute('data-value');
                s.classList.toggle('active', sVal <= val);
                s.classList.toggle('fa-solid', sVal <= val);
                s.classList.toggle('fa-regular', sVal > val);
            });
        };
    });
}

async function fetchReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*') 
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="color:#888; text-align:center; padding: 20px;">No reviews yet.</p>';
            return;
        }

        container.innerHTML = '';
        data.forEach(review => {
            const starCount = parseInt(review.stars) || 0;
            let starHTML = '';
            for(let i=1; i<=5; i++) {
                starHTML += i <= starCount ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
            }

            container.innerHTML += `
                <div class="review-card">
                    <div class="review-header">
                        <div class="user-meta">
                            <img src="${review.avatar_url || '/images/user.png'}" class="user-avatar">
                            <span class="user-name">${review.username || 'Anonymous'}</span>
                        </div>
                        <div class="star-rating">${starHTML}</div>
                    </div>
                    <div class="review-body">
                        <h3 class="review-title">${review.title}</h3>
                        <p class="review-text">${review.content}</p>
                    </div>
                </div>`;
        });
    } catch (err) {
        console.error("Fetch Error:", err);
        container.innerHTML = `<p class="error">Failed to load community feedback.</p>`;
    }
}

// PROFANITY CHECK API FUNCTION
async function isContentToxic(text) {
    try {
        const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(text)}`);
        const result = await response.text();
        return result === 'true'; 
    } catch (err) {
        console.error("Filter API failed, skipping check...");
        return false; // Fail open if API is down
    }
}

async function handlePostReview() {
    const title = document.getElementById('review-title').value.trim();
    const body = document.getElementById('review-body').value.trim();
    const stars = document.getElementById('rating-value').value;
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || 'null');

    if (!profile) return alert("Please sign in to Nebula first!");
    if (!title || !body || stars === "0") return alert("Please fill out all fields!");

    // Use the API for checking
    const combinedText = title + " " + body;
    const isBad = await isContentToxic(combinedText);
    
    if (isBad) return alert("Your review contains restricted language. Please keep it clean!");

    const { error } = await supabase.from('reviews').insert([{
        username: profile.name || profile.username,
        avatar_url: profile.picture || profile.avatar || "/images/user.png",
        stars: parseInt(stars),
        title: title,
        content: body
    }]);

    if (error) {
        alert(`Error: ${error.message}`);
    } else {
        location.reload(); 
    }
}
