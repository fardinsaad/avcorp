/* =====================================================================
   AVCORP — main.js
   Component loader  ·  sci-fi counters  ·  scroll reveal  ·  particles

   All interactive behaviour is initialised AFTER every component has
   been fetched and injected into the DOM.
   ===================================================================== */

// ─── COMPONENT LOADER ────────────────────────────────────────────────────────
async function loadComponents() {
    const slots = document.querySelectorAll('[data-component]');
    await Promise.all([...slots].map(async slot => {
        const src = slot.dataset.component;
        try {
            const html = await (await fetch(src)).text();
            const tmp  = document.createElement('div');
            tmp.innerHTML = html;
            // Convert to Array first — NodeList is live and shifts as nodes move
            slot.replaceWith(...Array.from(tmp.childNodes));
        } catch (err) {
            console.error('AVCORP: failed to load component:', src, err);
        }
    }));
}

// ─── SCI-FI DIGIT-SCRAMBLE COUNTERS ──────────────────────────────────────────
function scifiCounter(el, target, duration) {
    const digits     = '0123456789';
    const displayStr = target >= 1000 ? Math.round(target / 1000) + 'k' : String(target);
    const len        = displayStr.length;
    const startTime  = performance.now();
    let locked       = new Array(len).fill(false);

    function frame(now) {
        const elapsed     = now - startTime;
        const progress    = Math.min(elapsed / duration, 1);
        const revealCount = Math.floor(progress * (len + 1));
        for (let i = 0; i < revealCount && i < len; i++) locked[i] = true;

        let result = '';
        for (let i = 0; i < len; i++) {
            if (locked[i]) {
                result += displayStr[i];
            } else {
                const c = displayStr[i];
                result += isNaN(c) ? c : digits[Math.floor(Math.random() * 10)];
            }
        }
        el.textContent = result;

        if (progress < 1 || locked.some(v => !v)) {
            requestAnimationFrame(frame);
        } else {
            el.textContent = displayStr;
        }
    }
    requestAnimationFrame(frame);
}

function initCounters() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                scifiCounter(el, parseInt(el.dataset.target), 1600);
                io.unobserve(el);
            }
        });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-target]').forEach(el => io.observe(el));

    // Hero stat auto-cycle every 10 s
    const heroStatEls = document.querySelectorAll('.hero .stat-n[data-target]');
    if (heroStatEls.length) {
        setInterval(() => {
            heroStatEls.forEach((el, i) => {
                setTimeout(() => scifiCounter(el, parseInt(el.dataset.target), 1400), i * 120);
            });
        }, 10000);
    }
}

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
function initScrollReveal() {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.sh')
        .forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
}

// ─── FLOWING CONNECTOR PARTICLES ─────────────────────────────────────────────
function addParticles() {
    document.querySelectorAll('.conn').forEach(conn => {
        const line = conn.querySelector('.conn-line');
        if (!line) return;
        const isActive   = line.classList.contains('cl-active');
        const isComplete = line.classList.contains('cl-complete');
        if (!isActive && !isComplete) return;

        const color = isActive ? 'rgba(245,158,11,0.95)' : 'rgba(34,197,94,0.85)';
        const glow  = isActive ? '0 0 6px rgba(245,158,11,0.85)' : '0 0 6px rgba(34,197,94,0.75)';
        const speed = isActive ? 1.2 : 2.4;

        for (let i = 0; i < 2; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = [
                'position:absolute',
                'top:50%',
                'transform:translateY(-50%)',
                'width:5px',
                'height:5px',
                'border-radius:50%',
                'pointer-events:none',
                'z-index:5',
                `background:${color}`,
                `box-shadow:${glow}`,
                `animation:moveDot ${speed + i * 0.6}s linear infinite`,
                `animation-delay:${i * (speed / 2)}s`,
            ].join(';');
            conn.appendChild(dot);
        }
    });
}

function initParticles() {
    // Inject the moveDot keyframe into <head> at runtime
    const s = document.createElement('style');
    s.textContent = '@keyframes moveDot{0%{left:-5px;opacity:0}8%{opacity:1}90%{opacity:1}100%{left:calc(100% + 5px);opacity:0}}';
    document.head.appendChild(s);
    addParticles();
}

// ─── SMOOTH NAV HIGHLIGHT ─────────────────────────────────────────────────────
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');
    const sio = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(a => {
                    a.style.color = a.getAttribute('href') === '#' + e.target.id
                        ? 'var(--text)'
                        : '';
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => sio.observe(s));
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initCounters();
    initScrollReveal();
    initParticles();
    initNavHighlight();
    if (typeof initMotivation === 'function') initMotivation();
    if (typeof initSections === 'function') initSections();
});
