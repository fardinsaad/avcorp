/* =====================================================================
   AVCORP — sections.js
   Entrance animations for every section after Motivation, in the style of
   the ToM site: items arrive in sequence when a section scrolls into view,
   then tables replay a light sweep every 12 s while they stay on screen.
   Also drives the Phases section (scaling dots, bars, IAA grid) and
   hands over to js/interact.js for the per-section behaviours.
   main.js calls initSections() after the components are injected.
   ===================================================================== */
function initSections() {
    const rm = document.documentElement.classList.contains('rm');

    // [section, [[selector, variant, step ms, base delay ms], ...]]
    const PLAN = [
        ['#pipeline', [['.track-step', 'pop', 110, 0], ['.track-conn', 'draw', 110, 60], ['.stage', 'up', 90, 350]]],
        ['#theory',   [['.theory-card', 'up', 120, 0], ['.th-map', 'up', 0, 500]]],
        ['#matrix',   [['.tx-bar', 'up', 0, 0], ['.tx-ch, .tx-rh', 'pop', 60, 150], ['.tx-cell', 'pop', 35, 450], ['.tx-panel', 'left', 0, 700], ['.tx-scale', 'up', 140, 900]]],
        ['#genflow',  [['.gf-row, .gf-loop', 'up', 140, 0], ['.gf-node', 'pop', 90, 150]]],
        ['#verify',   [['.crit-card', 'up', 100, 0], ['.vs-sim', 'up', 0, 550], ['.dec-card', 'pop', 110, 750]]],
        ['#trace',    [['.tr-in', 'up', 0, 0], ['.tr-lane', 'up', 150, 150], ['.tr-schema, .tr-judge', 'up', 150, 500]]],
        ['#traceqc',  [['.q6-c', 'up', 100, 0], ['.q6-tabs, .q6-views', 'up', 120, 450], ['.q6-l', 'up', 110, 700]]],
        ['#tom',      [['.tom-schema', 'scan', 0, 0], ['.dec-card', 'pop', 140, 700]]],
        ['#scale',    [['.p2-p1, .p2-scale', 'up', 160, 0], ['.p2-arrow', 'pop', 0, 450], ['.p2-card', 'up', 150, 650]]],
    ];
    const SWEEP = ['#progress .prog-table'];

    PLAN.forEach(([sel, groups]) => {
        const sec = document.querySelector(sel);
        if (!sec) return;
        let last = 0;
        const items = [];
        groups.forEach(([q, v, step, base]) => {
            sec.querySelectorAll(q).forEach((el, i) => {
                if (el.classList.contains('sx')) return;
                const d = base + i * step;
                last = Math.max(last, d);
                el.classList.add('sx', 'sx-' + v);
                el.style.setProperty('--sd', d + 'ms');
                items.push(el);
            });
        });
        if (rm) return;
        const io = new IntersectionObserver((en, obs) => {
            en.forEach(e => {
                if (!e.isIntersecting) return;
                sec.classList.add('sx-go');
                obs.disconnect();
                // hand hover effects back to the site's own CSS once everything has landed
                setTimeout(() => items.forEach(el => {
                    el.classList.remove('sx', 'sx-up', 'sx-left', 'sx-pop', 'sx-draw', 'sx-scan');
                    el.style.removeProperty('--sd');
                }), last + 1400);
                if (sel === '#scale') startPhase2(sec);
            });
        }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
        io.observe(sec);
    });

    // light sweep + status-chip ripple, every 12 s while the table is visible
    SWEEP.forEach(q => {
        const t = document.querySelector(q);
        if (!t || rm) return;
        const host = t.parentElement;
        host.classList.add('sx-host');
        let vis = false;
        new IntersectionObserver(en => en.forEach(e => { vis = e.isIntersecting; }), { threshold: 0.3 }).observe(host);
        setInterval(() => {
            if (!vis) return;
            host.classList.remove('sweeping'); void host.offsetWidth; host.classList.add('sweeping');
            if (q.startsWith('#progress')) {
                const sec = document.querySelector('#progress');
                sec.querySelectorAll('.si').forEach((s, i) => s.style.setProperty('--sb', (i * 18) + 'ms'));
                sec.classList.remove('sx-bump'); void sec.offsetWidth; sec.classList.add('sx-bump');
                setTimeout(() => sec.classList.remove('sx-bump'), 1800);
            }
        }, 12000);
    });

    buildPhase2(rm);
    if (typeof initInteract === 'function') initInteract();
}

// ─── PHASE 2 ─────────────────────────────────────────────────────────────────
function buildPhase2(rm) {
    const dots = document.getElementById('p2Dots');
    if (!dots) return;
    for (let i = 0; i < 100; i++) dots.appendChild(document.createElement('i'));
    const sqs = document.getElementById('p2Sqs');
    // 100 IAA items: 30 from games ending in R3, 20 in R4, 50 in R5
    for (let i = 0; i < 100; i++) {
        const q = document.createElement('i');
        q.className = i < 30 ? 'q3' : i < 50 ? 'q4' : 'q5';
        q.style.setProperty('--qd', (i * 14) + 'ms');
        sqs.appendChild(q);
    }
    document.querySelectorAll('.xd-syn').forEach(g => { for (let i = 0; i < 24; i++) g.appendChild(document.createElement('i')); });
    document.querySelectorAll('.xd-hum').forEach(g => { for (let i = 0; i < 24; i++) g.appendChild(document.createElement('i')); });
    document.querySelectorAll('#scale .p2-bar i').forEach((b, i) => b.style.setProperty('--bd', (500 + i * 220) + 'ms'));
    setGames(rm ? 5000 : 250, false);
    if (rm) {
        document.querySelector('#scale .p2-bars').classList.add('go');
        sqs.classList.add('go');
    }
}

function setGames(n, animate) {
    const lit = Math.round(n / 50);
    document.querySelectorAll('#p2Dots i').forEach((d, i) => {
        d.classList.toggle('on', i < lit);
        d.classList.toggle('p1', i < 5);
        d.style.transitionDelay = animate ? (Math.max(0, i - 5) * 12) + 'ms' : '0ms';
    });
    document.getElementById('p2Fill').style.width = (n / 5000 * 100) + '%';
    const out = document.getElementById('p2Games');
    const from = parseInt(out.textContent.replace(/,/g, ''), 10) || 0;
    if (!animate) { out.textContent = n.toLocaleString('en-US'); return; }
    const t0 = performance.now(), dur = 1200;
    (function tick(now) {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        out.textContent = Math.round(from + (n - from) * e).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
    })(t0);
}

function startPhase2(sec) {
    setTimeout(() => sec.querySelector('.p2-bars').classList.add('go'), 900);
    setTimeout(() => document.getElementById('p2Sqs').classList.add('go'), 1100);
    // the scaling loop: 250 → 2,000 → 5,000 → back, only while visible
    let vis = true;
    new IntersectionObserver(en => en.forEach(e => { vis = e.isIntersecting; }), { threshold: 0.2 })
        .observe(document.getElementById('p2Scale'));
    const steps = [250, 2000, 5000];
    let k = 0;
    setInterval(() => {
        if (!vis) return;
        k = (k + 1) % steps.length;
        setGames(steps[k], true);
    }, 2600);
    // human games light up one by one as the transfer dot arrives
    const hum = [...document.querySelectorAll('.xd-hum i')];
    let h = 0;
    setInterval(() => {
        if (!vis) return;
        if (h >= hum.length) { hum.forEach(x => x.classList.remove('lit')); h = 0; return; }
        hum[h++].classList.add('lit');
    }, 360);
}
