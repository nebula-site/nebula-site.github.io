// Create the loader container
    const loader = document.createElement('div');
    Object.assign(loader.style, {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'white',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '9999'
    });

    // Create the dots
    const dots = [];
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        width: '20px',
        height: '20px',
        margin: '0 10px',
        borderRadius: '50%',
        backgroundColor: '#3498db',
        opacity: '0.3',
        animation: `bounce 1s infinite ease-in-out`,
        animationDelay: `${i * 0.2}s`,
      });
      dots.push(dot);
      loader.appendChild(dot);
    }

    // Inject the bounce animation into the page
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 80%, 100% {
          transform: translateY(0);
          opacity: 0.3;
        }
        40% {
          transform: translateY(-20px);
          opacity: 1;
        }
      }

      /* Animation for fading and moving out */
      @keyframes fadeOut {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(-50px);
        }
      }

      .fade-out {
        animation: fadeOut 1s forwards;
      }
    `;
    document.head.appendChild(style);

    // Add loader to body
    document.body.appendChild(loader);

    // After 2 seconds, fade out the loader and show content
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out'); // Apply the fade-out animation
        setTimeout(() => {
          loader.remove();
          document.getElementById('content').style.display = 'block';
        }, 1000); // Wait for fade-out to finish before removing
      }, 2000); // Wait for 2 seconds before starting the fade-out
    });
