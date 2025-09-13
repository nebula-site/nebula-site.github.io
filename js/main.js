document.title = "Nebula - Gaming Meets Reality";

document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    const sayings = [
        "Reach for the stars, even if you start with waffles.",
        "Every new day is a chance to level up your dreams.",
        "Great journeys begin with a single step—and a good breakfast.",
        "Let your imagination soar beyond the horizon.",
        "Success is built one small victory at a time.",
        "Stay curious, stay kind, and keep moving forward.",
        "Your potential is limitless—believe in yourself.",
        "Challenges are just opportunities in disguise.",
        "Shine bright, even on cloudy days.",
        "The best adventures start with courage.",
        "Dream big, act boldly, and inspire others.",
        "Progress is progress, no matter how small.",
        "You are the hero of your own story.",
        "Let your passion guide you to new worlds.",
        "Every setback is a setup for a comeback.",
        "Keep going—your breakthrough is closer than you think.",
        "Inspire others by being your authentic self.",
        "The universe rewards those who dare.",
        "Kindness is the greatest power you can wield.",
        "Your journey matters—make it extraordinary.",
        "Greatness begins with believing you can.",
        "You are capable of amazing things."
    ];

    // Pick a random saying from the list
    const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
    
    const loader = document.createElement("div");
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.backgroundColor = "rgba(17, 70, 131, 0.8)";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.zIndex = "9999";
    loader.innerHTML = `<div class="loader-container"> 
                            <div class='spinner'></div> 
                            <div id="loadertext"><h3>${randomSaying}</h3></div> 
                        </div>`;

    const spinnerStyle = document.createElement("style");
    spinnerStyle.innerHTML = `
        .spinner {
            border: 8px solid pink;
            border-top: 8px solid transparent;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #loader-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 30px;
            background-color: rgba(49, 23, 125, 0.2);
            border-radius: 15px;
            overflow: hidden;
            margin: 0;
            z-index: 1000;
        }
        #loadertext {
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            margin-top: 10px;
            font-size: 1.2em;
            color: white;
        }
    `;

    document.head.appendChild(spinnerStyle);
    body.appendChild(loader);

    setTimeout(() => {
        loader.style.transition = "opacity 0.5s ease";
        loader.style.opacity = "0";
        setTimeout(() => {
            body.removeChild(loader);
        }, 500);
    }, 1000);
});