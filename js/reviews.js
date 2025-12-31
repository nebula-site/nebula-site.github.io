import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'secret1';
const supabaseKey = 'secret2'; 
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

// --- CONTENT FILTER CLASS ---
class FamilyFriendlyFilter {
    constructor() {
        // Swearwords and profanities
        this.swearwords = [
            'damn', 'hell', 'crap', 'piss', 'ass', 'bitch', 'bastard', 'bloody',
            'shit', 'fuck', 'cock', 'pussy', 'dick', 'whore', 'slut', 'rape', 'arse',
            'arsehole', 'bugger', 'bullshit', 'cunt', 'goddamn', 'heck', 'prick',
            'twat', 'wanker', 'fart', 'pee', 'poop', 'suck', 'sucks', 'sucky'
        ];

        // Slurs and derogatory terms (comprehensive list)
        this.slurs = [
            // Racial slurs
            'n*gg*r', 'nigg*r', 'negro', 'chink', 'gook', 'cracker', 'honky',
            'wetback', 'spic', 'jap', 'kyke', 'kike', 'raghead', 'towelhead',
            'camel jockey', 'paki', 'sand n*gg*r', 'terrorist',
            // Sexual orientation slurs
            'fagg*t', 'fag', 'queer', 'dyke', 'tranny', 'trap',
            // Gender/sexist slurs
            'whore', 'slut', 'hoe', 'b*tch', 'bitch', 'cunts', 'misogyn',
            // Disability slurs
            'retard', 'retarded', 'tard', 'spaz', 'cripple', 'crip', 'gimp',
            // Other hateful terms
            'incel', 'simp'
        ];

        // Suspicious/inappropriate topics and phrases
        this.suspiciousPatterns = [
            /violence|kill|murder|shoot|stab|rape|kidnap/gi,
            /drug|cocaine|heroin|meth|weed|smoke/gi,
            /sex|porn|xxx|nude|naked|adult|explicit/gi,
            /suicide|self.?harm|cut.?myself|kill.?myself/gi,
            /bomb|explosive|terrorist|attack/gi,
            /casino|poker|gambling|bet money|casino bonus/gi,
            /viagra|cialis|penis|enlargement|pharmacy/gi,
            /click here|buy now|limited time|act now|urgent/gi,
        ];

        // Excessive caps pattern (shouting)
        this.excessiveCapsThreshold = 0.4; // 40% of message in caps

        // Special character spam pattern
        this.specialCharThreshold = 0.25; // 25% special characters
    }

    /**
     * Main filter function - checks all inappropriate content
     * @param {string} text - Message text to filter
     * @returns {object} - { isClean: boolean, issues: array }
     */
    filterContent(text) {
        if (!text || typeof text !== 'string') {
            return { isClean: true, issues: [] };
        }

        const issues = [];
        const lowerText = text.toLowerCase();

        // Check for swearwords
        const swearwordsFound = this.checkSwearwords(lowerText);
        if (swearwordsFound.length > 0) {
            issues.push('Inappropriate language detected');
        }

        // Check for slurs and hate speech
        const slursFound = this.checkSlurs(lowerText);
        if (slursFound.length > 0) {
            issues.push('Hate speech or offensive language detected');
        }

        // Check for suspicious content patterns
        if (this.checkSuspiciousPatterns(lowerText)) {
            issues.push('Inappropriate content detected');
        }

        // Check for excessive caps (aggressive/shouting)
        if (this.checkExcessiveCaps(text)) {
            issues.push('Message appears to be shouting');
        }

        // Check for special character spam
        if (this.checkSpecialCharSpam(text)) {
            issues.push('Excessive special characters detected');
        }

        return {
            isClean: issues.length === 0,
            issues: issues
        };
    }

    checkSwearwords(lowerText) {
        const found = [];
        for (const word of this.swearwords) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(lowerText)) {
                found.push(word);
            }
        }
        return [...new Set(found)];
    }

    checkSlurs(lowerText) {
        const found = [];
        for (const slur of this.slurs) {
            // Handle wildcard patterns
            const pattern = slur.replace(/\*/g, '[a-z]*');
            const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
            if (regex.test(lowerText)) {
                found.push(slur);
            }
        }
        return [...new Set(found)];
    }

    checkSuspiciousPatterns(lowerText) {
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(lowerText)) {
                return true;
            }
        }
        return false;
    }

    checkExcessiveCaps(text) {
        const words = text.match(/\b[A-Z]+\b/g) || [];
        const totalWords = text.split(/\s+/).filter(w => w.length > 0).length;
        if (totalWords === 0) return false;
        const capsRatio = words.length / totalWords;
        return capsRatio > this.excessiveCapsThreshold;
    }

    checkSpecialCharSpam(text) {
        const specialChars = text.match(/[!@#$%^&*()_+=\[\]{}|;:'",.<>?/~`]/g) || [];
        const specialRatio = specialChars.length / text.length;
        return specialRatio > this.specialCharThreshold;
    }

    /**
     * Quick check if content is safe
     * @param {string} text - Message text
     * @returns {boolean} - True if safe
     */
    isSafe(text) {
        return this.filterContent(text).isClean;
    }
}

// --- INITIALIZE FILTER ---
const contentFilter = new FamilyFriendlyFilter();

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

async function handlePostReview() {
    const title = document.getElementById('review-title').value.trim();
    const body = document.getElementById('review-body').value.trim();
    const stars = document.getElementById('rating-value').value;
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || 'null');

    if (!profile) return alert("Please sign in to Nebula first!");
    if (!title || !body || stars === "0") return alert("Please fill out all fields!");

    // --- CONTENT FILTERING CHECK ---
    const combinedText = title + " " + body;
    const filterResult = contentFilter.filterContent(combinedText);
    
    if (!filterResult.isClean) {
        const issuesList = filterResult.issues.join(', ');
        alert(`⚠️ Your review was blocked: ${issuesList}\n\nKeep the Nebula community family-friendly! 🌟`);
        return;
    }

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
        // Clear form and reload reviews
        document.getElementById('review-title').value = '';
        document.getElementById('review-body').value = '';
        document.getElementById('rating-value').value = '0';
        location.reload(); 
    }
}
