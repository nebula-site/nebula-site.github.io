import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- CONFIGURATION ---
const supabaseUrl = 'https://lhurtuuxsmlakoikcpiz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodXJ0dXV4c21sYWtvaWtjcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTIyNjEsImV4cCI6MjA3OTE2ODI2MX0.NiXIlUukeNB-gOANdbHSyfb6T9GcO7QqtlMsQgkEGKc'; 
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});
const PERSPECTIVE_API_KEY = "885618591034-hphuiote1kotis5lt5cagm9810hleiid.apps.googleusercontent.com";

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

// --- UNREAD TRACKING VARIABLE ---
let unreadCount = parseInt(localStorage.getItem('nebula_unread_count') || '0');

document.addEventListener('DOMContentLoaded', () => {
    initChat();
});

async function initChat() {
    loadProfile();
    await fetchMessages();
    subscribeToLiveUpdates();

    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chat-input');

    if (sendBtn) sendBtn.onclick = postMessage;
    
    if (input) {
        // Reset unread count when user clicks into the input to type
        input.onfocus = () => clearUnreadCount();
        
        input.onkeypress = (e) => { 
            if (e.key === 'Enter') postMessage(); 
        };
    }

    // Also reset count if the user simply switches back to this tab
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            clearUnreadCount();
        }
    });

    // Initial UI sync
    updateUnreadUI();
}

// --- UNREAD LOGIC FUNCTIONS ---
function incrementUnreadCount() {
    unreadCount++;
    localStorage.setItem('nebula_unread_count', unreadCount);
    updateUnreadUI();
}

function clearUnreadCount() {
    unreadCount = 0;
    localStorage.setItem('nebula_unread_count', '0');
    updateUnreadUI();
}

function updateUnreadUI() {
    const badge = document.getElementById('unread-badge');
    if (badge) {
        badge.textContent = unreadCount > 0 ? unreadCount : '';
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    // Optional: Update Document Title to show count
    document.title = unreadCount > 0 ? `(${unreadCount}) Nebula Chat` : 'Nebula Chat';
}

// --- CORE CHAT FUNCTIONS ---
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || '{}');
    const nameEl = document.getElementById('profile-display-name');
    const imgEl = document.getElementById('profile-display-img');
    
    if (profile.name || profile.username) {
        if (nameEl) nameEl.textContent = profile.name || profile.username;
        if (imgEl) imgEl.src = profile.picture || profile.avatar || "/images/user.png";
    }
}

async function fetchMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (!error && data) {
        const container = document.getElementById('chat-messages');
        container.innerHTML = data.map(m => renderMessage(m)).join('');
        scrollDown();
    }
}

function subscribeToLiveUpdates() {
    supabase.channel('nebula-chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            const container = document.getElementById('chat-messages');
            container.innerHTML += renderMessage(payload.new);
            scrollDown();

            // Increment count if user is not looking at the tab
            if (document.visibilityState === 'hidden') {
                incrementUnreadCount();
            }
        })
        .subscribe();
}

function renderMessage(msg) {
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || '{}');
    const currentUsername = profile.name || profile.username;
    
    const sideClass = msg.username === currentUsername ? 'me' : 'others';

    return `
        <div class="message-row ${sideClass}">
            <img src="${msg.avatar_url || '/images/user.png'}" 
                 class="chat-avatar" 
                 onerror="this.src='/images/user.png'">
            <div class="message-content">
                <span class="chat-username">${msg.username}</span>
                <p class="chat-text">${msg.content}</p>
            </div>
        </div>`;
}

async function postMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    const profile = JSON.parse(localStorage.getItem('nebula_profile') || 'null');

    if (!profile) return alert("Identify yourself to the Nebula network first!");
    if (!text) return;

    // --- CONTENT FILTERING CHECK ---
    const filterResult = contentFilter.filterContent(text);
    
    if (!filterResult.isClean) {
        const issuesList = filterResult.issues.join(', ');
        alert(`⚠️ Your message was blocked: ${issuesList}\n\nKeep the Nebula network family-friendly! 🌟`);
        return;
    }

    input.value = '';

    const { error } = await supabase.from('messages').insert([{
        username: profile.name || profile.username,
        avatar_url: profile.picture || profile.avatar || "/images/user.png",
        content: text
    }]);

    if (error) console.error("Signal lost:", error.message);
}

function scrollDown() {
    const chat = document.getElementById('chat-messages');
    if (chat) chat.scrollTop = chat.scrollHeight;
}