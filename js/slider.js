// =========================================================
//  NEBULA HERO SLIDER — Premium Edition
//  Styles live in menu.css. Font loaded in index.html.
//
//  Fixes vs previous version:
//  - Card image now renders (hs-card-in/out use opacity correctly)
//  - Ambient background cross-fades via a second div swap
//  - CARD_W / CARD_H constants removed (CSS handles sizing)
//  - activateSlide(0, true) now forces immediate class adds
// =========================================================

;(function () {
    const SLIDE_INTERVAL = 6000
    const TRANSITION_MS  = 600

    let slides        = []
    let current       = 0
    let timer         = null
    let progressRaf   = null
    let progressStart = null
    let isAnimating   = false
    let built         = false

    // ── Poll for games ────────────────────────────────────
    // menu.js sets window.allGames after the Supabase fetch completes.
    function waitForGames() {
        const check = setInterval(() => {
            const games = window.allGames
            if (games && games.length > 0) {
                clearInterval(check)
                slides = shuffle([...games]).slice(0, 8)
                buildSliderDOM()
                activateSlide(0, true)
                startAutoPlay()
            }
        }, 300)
        // Give up after 15 s
        setTimeout(() => clearInterval(check), 15000)
    }

    window.addEventListener('DOMContentLoaded', waitForGames)

    // ── Helpers ───────────────────────────────────────────
    function shuffle(arr) { return arr.sort(() => Math.random() - 0.5) }
    function slugify(n)   { return n.toLowerCase().replace(/[. ]+/g, '-') }
    function imgUrl(game) {
        return game.image || `/images/game-logos/${slugify(game.name)}.png`
    }

    // ── Build DOM ─────────────────────────────────────────
    function buildSliderDOM() {
        if (built) return
        built = true

        const hero = document.createElement('div')
        hero.id = 'hs'
        hero.innerHTML = `
            <div class="hs-ambient"         id="hsAmbientA"></div>
            <div class="hs-ambient hs-ambient-b" id="hsAmbientB"></div>
            <div class="hs-ambient-overlay"></div>
            <div class="hs-scanlines"></div>

            <div class="hs-body">
                <div class="hs-left">
                    <div class="hs-eyebrow">
                        <span class="hs-dot-live"></span>
                        <span id="hsTag">FEATURED</span>
                    </div>
                    <h2 class="hs-title" id="hsTitle"></h2>
                    <p  class="hs-sub"   id="hsSub"></p>
                    <div class="hs-actions">
                        <button class="hs-btn-play" id="hsPlayBtn">
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                                <polygon points="1,1 11,7 1,13"/>
                            </svg>
                            PLAY NOW
                        </button>
                        <button class="hs-btn-ghost" id="hsInfoBtn">MORE INFO</button>
                    </div>
                    <div class="hs-progress-track">
                        <div class="hs-progress-bar" id="hsProgressBar"></div>
                    </div>
                    <div class="hs-dots" id="hsDots"></div>
                </div>

                <div class="hs-right">
                    <div class="hs-card-wrap" id="hsCardWrap">
                        <div class="hs-card" id="hsCard">
                            <img class="hs-card-img" id="hsCardImg" src="" alt="" />
                            <div class="hs-card-shine"></div>
                            <div class="hs-card-border-glow"></div>
                        </div>
                        <div class="hs-corner hs-corner-tl"></div>
                        <div class="hs-corner hs-corner-tr"></div>
                        <div class="hs-corner hs-corner-bl"></div>
                        <div class="hs-corner hs-corner-br"></div>
                    </div>
                </div>
            </div>

            <div class="hs-strip-wrap">
                <div class="hs-strip" id="hsStrip"></div>
            </div>

            <button class="hs-arrow hs-prev" id="hsPrev" aria-label="Previous">
                <svg width="10" height="18" viewBox="0 0 10 18">
                    <polyline points="9,1 1,9 9,17" fill="none" stroke="currentColor"
                              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="hs-arrow hs-next" id="hsNext" aria-label="Next">
                <svg width="10" height="18" viewBox="0 0 10 18">
                    <polyline points="1,1 9,9 1,17" fill="none" stroke="currentColor"
                              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `

        // Insert before the <center> block (search bar + game grid)
        const ref = document.querySelector('center')
        if (ref) ref.parentNode.insertBefore(hero, ref)
        else     document.body.insertBefore(hero, document.body.firstChild)

        // Filmstrip thumbs
        const strip = document.getElementById('hsStrip')
        slides.forEach((game, i) => {
            const thumb = document.createElement('div')
            thumb.className    = 'hs-thumb'
            thumb.dataset.index = i
            thumb.innerHTML = `
                <img src="${imgUrl(game)}" alt="${escHtml(game.name)}" loading="lazy" />
                <div class="hs-thumb-label">${escHtml(game.name)}</div>
                <div class="hs-thumb-active-bar"></div>
            `
            thumb.addEventListener('click', () => goTo(i))
            strip.appendChild(thumb)
        })

        // Nav dots
        const dotsEl = document.getElementById('hsDots')
        slides.forEach((_, i) => {
            const d = document.createElement('button')
            d.className = 'hs-nav-dot'
            d.setAttribute('aria-label', `Slide ${i + 1}`)
            d.addEventListener('click', () => goTo(i))
            dotsEl.appendChild(d)
        })

        // Button events
        document.getElementById('hsPrev').addEventListener('click', prev)
        document.getElementById('hsNext').addEventListener('click', next)
        document.getElementById('hsPlayBtn').addEventListener('click', () => {
            if (slides[current]) triggerPlay(slides[current])
        })
        document.getElementById('hsInfoBtn').addEventListener('click', () => {
            if (slides[current]) triggerPlay(slides[current])
        })

        // Pause autoplay on hover
        hero.addEventListener('mouseenter', () => {
            clearInterval(timer)
            cancelAnimationFrame(progressRaf)
        })
        hero.addEventListener('mouseleave', () => {
            startAutoPlay()
            animateProgress()
        })

        // Touch swipe
        let touchX = 0
        hero.addEventListener('touchstart', e => {
            touchX = e.touches[0].clientX
        }, { passive: true })
        hero.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchX
            if (Math.abs(dx) > 48) dx < 0 ? next() : prev()
        }, { passive: true })
    }

    // ── Activate a slide ──────────────────────────────────
    let ambToggle = false  // alternates which ambient div is "on top"

    function activateSlide(index, instant) {
        if (isAnimating && !instant) return
        isAnimating = true

        const game = slides[index]
        const img  = imgUrl(game)

        // ── Ambient cross-fade ──
        // We alternate between two absolutely-positioned divs so the
        // background image transition is smooth without CSS template literals.
        const divA = document.getElementById('hsAmbientA')
        const divB = document.getElementById('hsAmbientB')
        if (divA && divB) {
            const incoming = ambToggle ? divA : divB
            const outgoing = ambToggle ? divB : divA
            incoming.style.backgroundImage = `url('${img}')`
            incoming.style.opacity = '1'
            outgoing.style.opacity = '0'
            ambToggle = !ambToggle
        }

        // ── Card image ──
        const cardImg = document.getElementById('hsCardImg')
        const card    = document.getElementById('hsCard')
        const wrap    = document.getElementById('hsCardWrap')

        if (instant) {
            // Immediate — set src, add active classes right away
            if (cardImg) { cardImg.src = img; cardImg.alt = game.name }
            if (card)  { card.classList.remove('hs-card-out');  card.classList.add('hs-card-in') }
            if (wrap)  { wrap.classList.add('hs-wrap-in') }
        } else {
            // Animate out
            if (card) { card.classList.remove('hs-card-in'); card.classList.add('hs-card-out') }
            if (wrap) { wrap.classList.remove('hs-wrap-in') }

            setTimeout(() => {
                if (cardImg) { cardImg.src = img; cardImg.alt = game.name }
                if (card) { card.classList.remove('hs-card-out'); card.classList.add('hs-card-in') }
                if (wrap) { wrap.classList.add('hs-wrap-in') }
            }, TRANSITION_MS / 2)
        }

        // ── Text panel ──
        const titleEl = document.getElementById('hsTitle')
        const tagEl   = document.getElementById('hsTag')
        const subEl   = document.getElementById('hsSub')

        const setTextIn = () => {
            if (tagEl)   tagEl.textContent   = (game.category || game.tag || 'FEATURED').toUpperCase()
            if (titleEl) {
                titleEl.textContent = game.name
                titleEl.classList.remove('hs-text-out')
                titleEl.classList.add('hs-text-in')
            }
            if (subEl) {
                subEl.textContent = game.description || 'Click to play this game on Nebula'
                subEl.classList.remove('hs-text-out')
                subEl.classList.add('hs-text-in')
            }
        }

        if (instant) {
            setTextIn()
        } else {
            if (titleEl) { titleEl.classList.remove('hs-text-in'); titleEl.classList.add('hs-text-out') }
            if (subEl)   { subEl.classList.remove('hs-text-in');   subEl.classList.add('hs-text-out') }
            setTimeout(setTextIn, TRANSITION_MS / 2)
        }

        // ── Dots & thumbs ──
        document.querySelectorAll('.hs-nav-dot').forEach((d, i) =>
            d.classList.toggle('hs-nav-dot-active', i === index)
        )
        document.querySelectorAll('.hs-thumb').forEach((t, i) =>
            t.classList.toggle('hs-thumb-active', i === index)
        )

        // Scroll active thumb into view
        setTimeout(() => {
            const activeThumb = document.querySelector('.hs-thumb.hs-thumb-active')
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }, 50)

        setTimeout(() => { isAnimating = false }, TRANSITION_MS + 60)

        // ── Progress bar ──
        cancelAnimationFrame(progressRaf)
        const bar = document.getElementById('hsProgressBar')
        if (bar) {
            bar.style.width = '0%'
            requestAnimationFrame(() => requestAnimationFrame(() => animateProgress()))
        }
    }

    // ── Progress bar ─────────────────────────────────────
    function animateProgress() {
        const bar = document.getElementById('hsProgressBar')
        if (!bar) return
        progressStart = performance.now()
        const tick = (now) => {
            const pct = Math.min(((now - progressStart) / SLIDE_INTERVAL) * 100, 100)
            bar.style.width = pct + '%'
            if (pct < 100) progressRaf = requestAnimationFrame(tick)
        }
        progressRaf = requestAnimationFrame(tick)
    }

    // ── Navigation ────────────────────────────────────────
    function goTo(index) {
        if (index === current || isAnimating) return
        current = (index + slides.length) % slides.length
        activateSlide(current, false)
        resetTimer()
    }
    function next() { goTo((current + 1) % slides.length) }
    function prev() { goTo((current - 1 + slides.length) % slides.length) }

    function startAutoPlay() {
        clearInterval(timer)
        timer = setInterval(next, SLIDE_INTERVAL)
    }
    function resetTimer() { clearInterval(timer); startAutoPlay() }

    // ── Play game ─────────────────────────────────────────
    function triggerPlay(game) {
        // Reuse menu.js playGame if available
        if (typeof window.playGame === 'function') { window.playGame(game); return }

        // Fallback
        try {
            const profile = JSON.parse(localStorage.getItem('nebula_profile') || 'null')
            if (!profile || !(profile.email || profile.username || profile.name)) {
                sessionStorage.setItem('postAuthRedirect', `/play?game=${encodeURIComponent(game.name)}`)
                window.location.href = '/profile'
                return
            }
        } catch { window.location.href = '/profile'; return }

        const slug = slugify(game.name)
        sessionStorage.setItem('gameLink',  `/sourceCode/${slug}`)
        sessionStorage.setItem('gameName',  game.name)
        sessionStorage.setItem('gameImage', `/images/game-logos/${slug}.png`)
        window.location.href = '/play'
    }

    // ── Tiny XSS helper ──────────────────────────────────
    function escHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    }

})()