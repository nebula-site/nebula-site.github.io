document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");
  const chat = document.getElementById("chat");
  const authOverlay = document.getElementById('auth-overlay');
  const loginBtn = document.getElementById('login-btn');
  const greeting = document.getElementById('greeting');

  // Helper to obtain profile: prefer puter.auth.getUser(), fallback to localStorage 'nebula_profile'
  async function getProfile() {
    // 1) puter auth if available
    try {
      if (window.puter && puter.auth && typeof puter.auth.getUser === 'function') {
        const user = await puter.auth.getUser();
        if (user) {
          return {
            name: user.name || (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || user.email || '',
            picture: user.avatar || (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || ''
          };
        }
      }
    } catch (e) {
      // ignore and fallback
    }

    // 2) localStorage fallback
    try {
      const stored = localStorage.getItem('nebula_profile');
      if (stored) {
        const p = JSON.parse(stored);
        return { name: p.name || p.email || 'User', picture: p.picture || p.avatar || '' };
      }
    } catch (e) {}

    return null;
  }

  // Enforce sign-in: show overlay if no profile
  (async function ensureSignedIn() {
    const profile = await getProfile();
    if (!profile) {
      // show overlay and disable inputs
      if (authOverlay) authOverlay.style.display = 'flex';
      if (input) input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      if (greeting) greeting.textContent = 'Sign in to start a conversation with Lunar Copilot.';
    } else {
      // hide overlay and personalize
      if (authOverlay) authOverlay.style.display = 'none';
      if (input) input.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      if (greeting) greeting.textContent = `Hello, ${profile.name}! Lunar Copilot is ready.`;
      // Add an initial bot greeting
      await addMessage(`Hello ${profile.name}! I'm Lunar Copilot — ask me about games, tips, or generate images.`, 'bot');
    }
  })();

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      try {
        if (window.puter && puter.auth && typeof puter.auth.login === 'function') {
          puter.auth.login();
        } else {
          // fallback to profile page
          window.location.href = '/profile.html';
        }
      } catch (e) {
        window.location.href = '/profile.html';
      }
    });
  }

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
      // Create a message row with bot avatar and a loader in the content
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
        // replace loader content with the image
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
        // include a simple personalization hint if available
        let profile = null;
        try { profile = await getProfile(); } catch(e){}
        const contextText = profile ? `User: ${profile.name}\n` : '';
        const response = await puter.ai.chat(contextText + text);
        typing.textContent = response;
      } catch (err) {
        typing.textContent = "⚠️ Error: couldn't reach AI";
      }
    }
  }

  // Build a message row with avatar, name, and content. Returns the content element if returnElement=true
  async function addMessage(text, sender, returnElement = false) {
    const row = document.createElement('div');
    row.classList.add('message-row');
    row.classList.add(sender === 'you' ? 'you' : 'bot');

    // Avatar
    const avatar = document.createElement('img');
    avatar.classList.add('msg-avatar');
    let name = 'You';
    if (sender === 'bot') {
      avatar.src = '/images/favicon.png';
      avatar.alt = 'Nebula';
      name = 'Lunar Copilot';
    } else {
      // user message: try to get profile
      const profile = await getProfile();
      if (profile && profile.picture) avatar.src = profile.picture;
      else avatar.src = '/images/user.png';
      avatar.alt = (profile && profile.name) ? profile.name : 'You';
      name = (profile && profile.name) ? profile.name : 'You';
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
