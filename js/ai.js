document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");
  const chat = document.getElementById("chat");

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "you");
    input.value = "";

    if (text.toLowerCase().startsWith("generate an image of ")) {
      const prompt = text.replace(/^generate an image of /i, "");
      const loaderWrapper = document.createElement("div");
      loaderWrapper.classList.add("message", "bot", "loader");
      const canvas = document.createElement("canvas");
      loaderWrapper.appendChild(canvas);
      chat.appendChild(loaderWrapper);
      chat.scrollTop = chat.scrollHeight;

      const ctx = canvas.getContext("2d");
      let t = 0;
      canvas.width = 180;
      canvas.height = 120;
      // Space themed loader: planet, orbiting stars, and twinkling background
      const stars = Array.from({length: 18}, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        tw: Math.random() * Math.PI * 2
      }));
      const anim = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width, h = canvas.height;
        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#1a0033");
        grad.addColorStop(1, "#3f00ff");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Twinkling stars
        stars.forEach(star => {
          star.tw += 0.08 + Math.random()*0.02;
          ctx.globalAlpha = 0.7 + 0.3 * Math.sin(star.tw);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
          ctx.fillStyle = "#a3f7ff";
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // Planet
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.rotate(t/60);
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI*2);
        ctx.fillStyle = "#3f00ff";
        ctx.shadowColor = "#a3f7ff";
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Planet ring
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 8, Math.PI/6, 0, Math.PI*2);
        ctx.strokeStyle = "#a3f7ff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Orbiting dot
        const orbitAngle = t/20;
        ctx.beginPath();
        ctx.arc(w/2 + Math.cos(orbitAngle)*38, h/2 + Math.sin(orbitAngle)*18, 6, 0, Math.PI*2);
        ctx.fillStyle = "#ffb3fe";
        ctx.shadowColor = "#ffb3fe";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        t++;
      }, 40);

      try {
        const imgUrl = await puter.ai.txt2img(prompt);
        clearInterval(anim);
        loaderWrapper.innerHTML = "";
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = prompt;
        img.style.maxWidth = "250px";
        img.style.borderRadius = "12px";
        loaderWrapper.appendChild(img);
      } catch (err) {
        clearInterval(anim);
        loaderWrapper.textContent = "⚠️ Error generating image.";
      }
    } else {
      const typing = addMessage("...", "bot", true);
      try {
        const response = await puter.ai.chat(text);
        typing.textContent = response;
      } catch (err) {
        typing.textContent = "⚠️ Error: couldn't reach AI";
      }
    }
  }

  function addMessage(text, sender, returnElement = false) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    return returnElement ? msg : null;
  }
});
