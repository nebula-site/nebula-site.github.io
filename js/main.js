document.title = "Waffles"

document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    const sayings = [
        "Thou Shalt Eat Waffles",
        "Keep Calm and Waffle On",
        "Good Things Come to Those Who Waffle",
        "Life is Better with Waffles",
        "Waffles are the Answer",
        "In a World Full of Pancakes, Be a Waffle",
        "You Can't Buy Happiness, But You Can Buy Waffles",
        "Thou shalt eat waffles.",
        "Waffles: The breakfast of champions",
        "Love is like a waffle — hot, sweet, and comforting.",
        "Waffles: Because some decisions in life are easy.",
        "Every day is waffle day if you want it to be.",
        "A day without waffles is a day without sunshine.",
        "Waffles are proof that good things come in crunchy packages.",
        "The world would be a better place if everyone ate waffles.",
        "When life gets complicated, add waffles.",
        "A waffle in the morning keeps the grumpiness away.",
        "Waffle more, worry less.",
        "You had me at waffles.",
        "A waffle a day keeps the hangry away.",
        "Don't worry, be waffle.",
        "You can't go wrong with waffles."
    ];

    // Pick a random saying from the list
    const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
    
    const loader = document.createElement("div");
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.backgroundColor = "rgba(210, 180, 140, 0.8)";
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
            background-color: rgba(255, 255, 255, 0.2);
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
