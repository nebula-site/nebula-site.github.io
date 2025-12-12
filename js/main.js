document.title = "Nebula - Gaming Meets Reality";
/**
 * Self-contained utility function to create and manage a full-screen loading spinner.
 * It injects the necessary HTML and CSS into the document and hides itself
 * automatically when the entire page (including all resources like images) is loaded.
 */
(function() {
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
            // 1. Start the fade-out effect
            loaderElement.classList.add(HIDDEN_CLASS);

            // 2. Remove the element from the DOM after the transition is complete
            // (Wait 600ms to allow the 500ms CSS transition to finish)
            setTimeout(() => {
                if (loaderElement.parentNode) {
                    loaderElement.parentNode.removeChild(loaderElement);
                }
            }, 600);
        }
    }

    // --- 5. Initialization ---
    function initializeLoader() {
        // Ensure styles and loader are created before content loads
        injectStyles();
        const loaderElement = createLoader();

        // The 'load' event waits for ALL page resources (HTML, CSS, JS, Images, etc.)
        window.addEventListener('load', () => {
            hideLoader(loaderElement);
        });
        
        // Safety timeout: If 'load' fails for some reason or takes an extreme amount of time,
        // hide the loader after a very long delay (e.g., 30 seconds) to prevent infinite loading.
        setTimeout(() => {
            // Check if the loader is already hidden before forcing it
            if (!loaderElement.classList.contains(HIDDEN_CLASS)) {
                console.warn("Forcing loader hide after timeout.");
                hideLoader(loaderElement);
            }
        }, 30000); // 30 seconds
    }

    // Run the initialization logic when the DOM structure is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLoader);
    } else {
        // DOM is already ready (in case the script is placed at the end of the body)
        initializeLoader();
    }
})();
