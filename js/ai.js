document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");
  const chat = document.getElementById("chat");
  // Removed authOverlay and loginBtn references

  // Updated Profile helper: Always returns something so the UI never breaks
  async function getProfile() {
    try {
      if (window.puter && puter.auth && typeof puter.auth.getUser === 'function') {
        const user = await puter.auth.getUser();
        if (user) {
          return {
            name: user.name || (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || user.email || 'Guest',
            picture: user.avatar || (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || '/images/user.png'
          };
        }
      }
    } catch (e) {}

    // Default Guest Profile
    return { name: 'Guest', picture: '/images/user.png' };
  }

  // Event Listeners
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    await addMessage(text, "you");
    input.value = "";

    if (text.toLowerCase().startsWith("generate an image of ")) {
      const prompt = text.replace(/^generate an image of /i, "");
      
      // Create message row with loader
      const loaderRow = document.createElement('div');
      loaderRow.classList.add('message-row', 'bot');
      const botAvatar = document.createElement('img');
      botAvatar.classList.add('msg-avatar');
      botAvatar.src = '/images/favicon.png';
      botAvatar.alt = 'Nebula';

      const body = document.createElement('div');
      body.classList.add('msg-body');
      const nameEl = document.createElement('div');
      nameEl.classList.add('msg-name');
      nameEl.textContent = 'Lunar Copilot';
      const content = document.createElement('div');
      content.classList.add('msg-content', 'loader');

      const canvas = document.createElement('canvas');
      content.appendChild(canvas);

      body.appendChild(nameEl);
      body.appendChild(content);
      loaderRow.appendChild(botAvatar);
      loaderRow.appendChild(body);
      chat.appendChild(loaderRow);
      chat.scrollTop = chat.scrollHeight;

      const ctx = canvas.getContext("2d");
      let t = 0;
      canvas.width = 180;
      canvas.height = 120;
      const stars = Array.from({length: 18}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        tw: Math.random() * Math.PI * 2
      }));

      const anim = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width, h = canvas.height;
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#1a0033");
        grad.addColorStop(1, "#3f00ff");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        stars.forEach(star => {
          star.tw += 0.08;
          ctx.globalAlpha = 0.7 + 0.3 * Math.sin(star.tw);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
          ctx.fillStyle = "#a3f7ff";
          ctx.fill();
        });

        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.rotate(t/60);
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI*2);
        ctx.fillStyle = "#3f00ff";
        ctx.fill();
        ctx.restore();
        t++;
      }, 40);

      try {
        const imgUrl = await puter.ai.txt2img(prompt);
        clearInterval(anim);
        content.innerHTML = '';
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = prompt;
        img.style.maxWidth = '250px';
        img.style.borderRadius = '12px';
        content.appendChild(img);
      } catch (err) {
        clearInterval(anim);
        content.textContent = '⚠️ Error generating image.';
      }
    } else {
      const typing = await addMessage("...", "bot", true);
      try {
        const profile = await getProfile();
        const contextText = `User: ${profile.name}\n`;
        const response = await puter.ai.chat(contextText + text);
        typing.textContent = response;
      } catch (err) {
        typing.textContent = "⚠️ Error: couldn't reach AI";
      }
    }
  }

  async function addMessage(text, sender, returnElement = false) {
    const row = document.createElement('div');
    row.classList.add('message-row', sender === 'you' ? 'you' : 'bot');

    const avatar = document.createElement('img');
    avatar.classList.add('msg-avatar');
    
    let name = 'You';
    if (sender === 'bot') {
      avatar.src = '/images/favicon.png';
      name = 'Lunar Copilot';
    } else {
      const profile = await getProfile();
      avatar.src = profile.picture;
      name = profile.name;
    }

    const body = document.createElement('div');
    body.classList.add('msg-body');
    const nameEl = document.createElement('div');
    nameEl.classList.add('msg-name');
    nameEl.textContent = name;
    const content = document.createElement('div');
    content.classList.add('msg-content');
    content.textContent = text;

    body.appendChild(nameEl);
    body.appendChild(content);
    row.appendChild(avatar);
    row.appendChild(body);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;

    return returnElement ? content : null;
  }
});