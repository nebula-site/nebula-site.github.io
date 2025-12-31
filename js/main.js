document.title = "Nebula - Gaming Meets Reality";

/**
 * Self-contained utility function to create and manage a full-screen loading spinner.
 * Includes mobile redirection for devices with screen widths under 768px.
 */
(function() {
    // 1. Define your valid routes
    const validPages = [
        '/', 
        '/terms.html', 
        '/reviews.html', 
        '/profile.html',
        '/privacy.html'
        '/play.html'
        '/messages.html'
        '/index.html'
        '/home.html'
        '/games.html'
        '/forms.html'
        '/contact.html'
        '/ai.html'
        '/README.md'
        '/DMCA.html'
        '/terms', 
        '/reviews', 
        '/profile',
        '/privacy'
        '/play'
        '/messages'
        '/index'
        '/home'
        '/games'
        '/forms'
        '/contact'
        '/ai'
        '/DMCA'
    ];

    // 2. Get current path
    const currentPath = window.location.pathname;

    // 3. Check if current path is invalid
    // This allows for root access and checking specific filenames
    if (!validPages.includes(currentPath) && currentPath !== '') {
        trigger404();
    }

    function trigger404() {
        // Change title for SEO/UX
        document.title = "404 - Page Not Found";

        // Inject CSS to reset body and handle iframe
        const style = document.createElement('style');
        style.innerHTML = `
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                overflow: hidden;
                background-color: #000;
            }
            #error-frame {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                border: none;
                z-index: 999999;
            }
        `;
        document.head.appendChild(style);

        // Clear current body and inject the iframe
        document.body.innerHTML = `
            <iframe 
                id="error-frame" 
                src="/errors/404.html" 
                title="404 Error">
            </iframe>
        `;
        
        // Prevent further script execution on the "broken" page
        window.stop();
    }
})();
(function() {
    // --- 0. Mobile Detection & Redirection ---
    const isMobileUserAgent = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768; // Standard breakpoint for tablets vs phones

    if (isMobileUserAgent && isSmallScreen) {
        window.location.href = "/errors/phone.html";
        return; // Stop execution of the loader if redirecting
    }

    // --- 1. Define HTML and CSS Templates ---
    const LOADER_ID = 'js-loading-screen';
    const SPINNER_CLASS = 'js-spinner';
    const HIDDEN_CLASS = 'js-hidden-loader';
    const CSS_STYLES = `
        #${LOADER_ID} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }

        .${SPINNER_CLASS} {
            border: 8px solid rgba(255, 255, 255, 0.2);
            border-top: 8px solid #00b894;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: js-spin 1.2s linear infinite;
        }

        @keyframes js-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .${HIDDEN_CLASS} {
            opacity: 0;
            pointer-events: none;
        }
    `;

    // --- 2. Inject CSS into the <head> ---
    function injectStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = CSS_STYLES;
        document.head.appendChild(style);
    }

    // --- 3. Inject HTML Loader into the <body> ---
    function createLoader() {
        const loader = document.createElement('div');
        loader.id = LOADER_ID;
        loader.innerHTML = `<div class="${SPINNER_CLASS}"></div>`;
        document.body.appendChild(loader);
        return loader;
    }

    // --- 4. Logic to Hide the Loader ---
    function hideLoader(loaderElement) {
        if (loaderElement) {
            console.log("All resources loaded. Hiding spinner.");
            loaderElement.classList.add(HIDDEN_CLASS);

            setTimeout(() => {
                if (loaderElement.parentNode) {
                    loaderElement.parentNode.removeChild(loaderElement);
                }
            }, 600);
        }
    }

    // --- 5. Initialization ---
    function initializeLoader() {
        injectStyles();
        const loaderElement = createLoader();

        window.addEventListener('load', () => {
            hideLoader(loaderElement);
        });
        
        setTimeout(() => {
            if (!loaderElement.classList.contains(HIDDEN_CLASS)) {
                console.warn("Forcing loader hide after timeout.");
                hideLoader(loaderElement);
            }
        }, 30000); 
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLoader);
    } else {
        initializeLoader();
    }
})();
