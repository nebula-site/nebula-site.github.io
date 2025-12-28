import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Ensure your Key is the "anon" "public" key
const supabaseUrl = 'https://lhurtuuxsmlakoikcpiz.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const badWords = ['hate', 'stupid', 'jerk']; 

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    setupStarRating();
    fetchReviews();
    
    const postBtn = document.getElementById('post-review-btn');
    if (postBtn) postBtn.onclick = handlePostReview;
});

// Get user data from your navbar's localStorage
function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || '{}');
    const nameEl = document.getElementById('profile-display-name');
    const imgEl = document.getElementById('profile-display-img');
    
    if (profile.name || profile.username) {
        if (nameEl) nameEl.textContent = profile.name || profile.username;
        if (imgEl) imgEl.src = profile.picture || profile.avatar || "/images/user.png";
    }
}

// Interactive Stars
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
    try {
        // Use select('*') to ensure we don't hit a column naming error
        const { data, error } = await supabase
            .from('reviews')
            .select('*') 
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error Object:", error);
            throw error;
        }

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="color:#888;">No reviews yet.</p>';
            return;
        }

        container.innerHTML = '';
        data.forEach(review => {
            const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
            container.innerHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-user-info">
                            <img src="${review.avatar_url || '/images/user.png'}">
                            <span>${review.username || 'Anonymous'}</span>
                        </div>
                        <div style="color: #f5b301;">${stars}</div>
                    </div>
                    <h3>${review.title}</h3>
                    <p>${review.content}</p>
                </div>`;
        });
    } catch (err) {
        console.error("Detailed Fetch Error:", err);
        container.innerHTML = `<p class="error">Connection Reset. Try disabling Ad-Blockers or checking RLS Policies.</p>`;
    }
}

// POST REVIEW
async function handlePostReview() {
    const title = document.getElementById('review-title').value.trim();
    const body = document.getElementById('review-body').value.trim();
    const stars = document.getElementById('rating-value').value;
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || 'null');

    if (!profile) return alert("Please sign in to Nebula first!");
    if (!title || !body || stars === "0") return alert("Please fill out all fields!");

    // Basic profanity check
    const isBad = badWords.some(word => (title + body).toLowerCase().includes(word));
    if (isBad) return alert("Your review contains restricted language.");

    const { error } = await supabase.from('reviews').insert([{
        username: profile.name || profile.username,
        avatar_url: profile.picture || profile.avatar || "/images/user.png",
        stars: parseInt(stars),
        title: title,
        content: body
    }]);

    if (error) {
        alert("Error posting review. Check console.");
        console.error(error);
    } else {
        location.reload(); 
    }
}
