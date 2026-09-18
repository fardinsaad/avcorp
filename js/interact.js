/* =====================================================================
   AVCORP — interact.js
   Theme switcher (as in the ToM site) and one behaviour per section.
   Sections alternate between a click-driven transition and a looping
   animation:
     Dataset      transition  step through one round, columns fill
     Theory       animation   each theory lights its part of the matrix
     Taxonomy     transition  filter by alignment, click a tactic
     Gen & Verify animation   a packet travels node to node
     Stage 4 QC   transition  decision-logic simulator
     Stage 5 & 6  animation   ReAct and ReCon lanes run, the gate opens
     Stage 6 QC   transition  tabbed results
     Schema       animation   a reading line scans the JSON (CSS only)
   Loops run only while their section is on screen.
   initSections() calls initInteract() once the components exist.
   ===================================================================== */

const IX_THEMES = ['midnight', 'obsidian', 'abyss', 'plum'];

function applyTheme(name) {
    if (!IX_THEMES.includes(name)) name = 'midnight';
    document.documentElement.dataset.theme = name;
    document.querySelectorAll('.tsw').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === name)));
    try { localStorage.setItem('avcorp-theme', name); } catch (e) { /* private mode */ }
}

function initThemes() {
    let saved = 'midnight';
    try { saved = localStorage.getItem('avcorp-theme') || 'midnight'; } catch (e) { /* private mode */ }
    applyTheme(saved);
    document.querySelectorAll('.tsw').forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.theme)));
}

// Runs fn every ms while el is at least 20% visible; returns nothing.
function whileVisible(el, ms, fn) {
    if (!el) return;
    let vis = false;
    new IntersectionObserver(en => en.forEach(e => { vis = e.isIntersecting; }), { threshold: 0.2 }).observe(el);
    setInterval(() => { if (vis) fn(); }, ms);
}

const IX_RM = () => document.documentElement.classList.contains('rm');

// ─── DATASET ────────────────────────────────────────────────────────────────
function initDatasetStepper() {
    const loop = document.getElementById('dlLoop');
    if (!loop) return;
    const steps = [...loop.querySelectorAll('.dl-step')];
    const arrows = [...loop.querySelectorAll('.dl-arrow')];
    const items = [...document.querySelectorAll('#dlGrid .col-item')];
    const next = document.getElementById('dlNext');
    const all = document.getElementById('dlAll');
    const reset = document.getElementById('dlReset');
    const count = document.getElementById('dlCount');
    let k = 0, timer = null;
    const lit = new Set();

    function label() {
        if (k === 0) next.innerHTML = 'Start the round <i>▸</i>';
        else if (k < steps.length) next.innerHTML = 'Next step <i>▸</i>';
        else next.innerHTML = 'Round complete <i>✓</i>';
        next.disabled = k >= steps.length;
        all.disabled = k >= steps.length;
    }
    function fill(step) {
        step.dataset.cols.split(' ').forEach(c => {
            const it = items.find(x => x.dataset.col === c);
            if (!it) return;
            const fresh = !lit.has(c);
            lit.add(c);
            it.classList.add('lit');
            if (fresh) { it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash'); }
        });
        count.textContent = lit.size;
    }
    function show(i) {
        steps.forEach(s => s.classList.remove('cur'));
        const reveal = () => { steps[i].classList.add('on', 'cur'); setTimeout(() => fill(steps[i]), 350); };
        if (i > 0) { arrows[i - 1].classList.add('on'); setTimeout(reveal, 380); } else reveal();
    }
    function advance() { if (k >= steps.length) return; show(k); k++; label(); }
    function stop() { clearInterval(timer); timer = null; }

    next.addEventListener('click', () => { stop(); advance(); });
    all.addEventListener('click', () => {
        stop(); advance();
        timer = setInterval(() => { if (k >= steps.length) stop(); else advance(); }, 1300);
    });
    reset.addEventListener('click', () => {
        stop(); k = 0; lit.clear(); count.textContent = '0';
        steps.forEach(s => s.classList.remove('on', 'cur'));
        arrows.forEach(a => a.classList.remove('on'));
        items.forEach(it => it.classList.remove('lit', 'flash'));
        label();
    });
    if (IX_RM()) {
        steps.forEach(s => s.classList.add('on'));
        arrows.forEach(a => a.classList.add('on'));
        items.forEach(it => it.classList.add('lit'));
        k = steps.length; count.textContent = '10';
    }
    label();
}

// ─── THEORY ─────────────────────────────────────────────────────────────────
function initTheoryMap() {
    const grid = document.getElementById('thMap');
    const cards = [...document.querySelectorAll('#thGrid .theory-card')];
    const say = document.getElementById('thSay');
    if (!grid || !cards.length) return;
    const ROWS = [['A', 'Transparent'], ['B', 'Framing'], ['C', 'Careless-to-truth'], ['D', 'Counterfactual']];
    ROWS.forEach(([r, name]) => {
        const h = document.createElement('span');
        h.className = 'thm-rh'; h.dataset.r = r; h.textContent = r + ' · ' + name;
        grid.appendChild(h);
        for (let c = 1; c <= 4; c++) {
            const cell = document.createElement('span');
            cell.className = 'thm-c'; cell.dataset.r = r; cell.dataset.c = String(c);
            grid.appendChild(cell);
        }
    });
    const cells = [...grid.querySelectorAll('.thm-c')];
    const MAPS = {
        'cols':     { on: () => true, cols: ['1', '2', '3', '4'], rows: [], text: '<b>IDT</b> defines the four social goal columns: Cooperative, Defensive, Opportunistic, and Adversarial.' },
        'axis':     { on: c => c.dataset.c === '1' || c.dataset.c === '4', cols: ['1', '4'], rows: [], text: '<b>TDT</b> separates the two ends of that axis: Cooperative, which keeps the truth default, and Adversarial, which exploits it.' },
        'rows-abd': { on: c => 'ABD'.includes(c.dataset.r), cols: [], rows: ['A', 'B', 'D'], text: '<b>IMT2</b> defines three information strategies: Transparent, Framing, and Counterfactual.' },
        'rows-c':   { on: c => c.dataset.r === 'C', cols: [], rows: ['C'], purple: true, text: '<b>Philosophy of lying and bullshitting</b> adds Careless-to-truth, speech that does not care whether it is true.' },
    };
    let i = 0, paused = false;
    function show(idx) {
        const card = cards[idx], m = MAPS[card.dataset.map];
        cards.forEach(c => c.classList.toggle('th-on', c === card));
        cells.forEach(c => { const on = m.on(c); c.classList.toggle('on', on); c.classList.toggle('p', on && !!m.purple); });
        grid.querySelectorAll('.thm-ch').forEach(h => h.classList.toggle('on', m.cols.includes(h.dataset.c)));
        grid.querySelectorAll('.thm-rh').forEach(h => h.classList.toggle('on', m.rows.includes(h.dataset.r)));
        say.classList.add('fade');
        setTimeout(() => { say.innerHTML = m.text; say.classList.remove('fade'); }, 250);
    }
    cards.forEach((c, idx) => {
        c.addEventListener('mouseenter', () => { paused = true; i = idx; show(idx); });
        c.addEventListener('mouseleave', () => { paused = false; });
        c.addEventListener('click', () => { i = idx; show(idx); });
    });
    document.getElementById('thGrid').classList.add('running');
    show(0);
    if (!IX_RM()) whileVisible(document.getElementById('theory'), 3200, () => { if (paused) return; i = (i + 1) % cards.length; show(i); });
}

// ─── TAXONOMY ───────────────────────────────────────────────────────────────
function initTaxonomy() {
    const grid = document.getElementById('txGrid');
    if (!grid) return;
    const cells = [...grid.querySelectorAll('.tx-cell')];
    const panel = document.getElementById('txPanel');
    const ROWN = { A: 'A · Transparent', B: 'B · Framing', C: 'C · Careless-to-truth', D: 'D · Counterfactual' };
    const COLN = { 1: '1 · Cooperative', 2: '2 · Defensive', 3: '3 · Opportunistic', 4: '4 · Adversarial' };
    const TAG = { g: ['g', 'Good only'], b: ['b', 'Both alignments'], r: ['r', 'Evil only'] };
    const mini = document.getElementById('txPMini');
    for (let n = 0; n < 16; n++) mini.appendChild(document.createElement('i'));

    document.querySelectorAll('#matrix .tx-f').forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('#matrix .tx-f').forEach(b => b.classList.toggle('on', b === btn));
        const f = btn.dataset.f;
        grid.classList.toggle('filtered', f !== 'all');
        cells.forEach(c => c.classList.toggle('dim', f !== 'all' && c.dataset.a !== f));
    }));

    function pick(t) {
        const cell = t.closest('.tx-cell');
        grid.querySelectorAll('.tx-t.sel').forEach(x => x.classList.remove('sel'));
        t.classList.add('sel');
        const fill = () => {
            const [cls, txt] = TAG[cell.dataset.a];
            const tag = document.getElementById('txPTag');
            tag.className = 'tx-p-tag ' + cls; tag.textContent = txt;
            document.getElementById('txPName').textContent = t.textContent;
            document.getElementById('txPDef').textContent = t.dataset.def + '.';
            document.getElementById('txPRow').textContent = ROWN[cell.dataset.r];
            document.getElementById('txPCol').textContent = COLN[cell.dataset.c];
            const idx = 'ABCD'.indexOf(cell.dataset.r) * 4 + (+cell.dataset.c - 1);
            [...mini.children].forEach((m, j) => m.classList.toggle('on', j === idx));
            panel.classList.remove('swap');
        };
        if (panel.classList.contains('has')) { panel.classList.add('swap'); setTimeout(fill, 140); }
        else { fill(); panel.classList.add('has'); }
    }
    grid.querySelectorAll('.tx-t').forEach(t => t.addEventListener('click', () => pick(t)));

    // hovering a header outlines its whole row or column
    grid.querySelectorAll('.tx-rh, .tx-ch').forEach(h => {
        const key = h.dataset.r ? ['r', h.dataset.r] : ['c', h.dataset.c];
        h.addEventListener('mouseenter', () => cells.forEach(c => { if (c.dataset[key[0]] === key[1]) c.classList.add(key[0] === 'r' ? 'hl-row' : 'hl-col'); }));
        h.addEventListener('mouseleave', () => cells.forEach(c => c.classList.remove('hl-row', 'hl-col')));
    });
}

// ─── GEN & VERIFY ───────────────────────────────────────────────────────────
function initGenflowPacket() {
    const sec = document.getElementById('genflow');
    if (!sec || IX_RM()) return;
    // the travel order, top row then bottom row, as the DOM already lays it out
    const path = [];
    sec.querySelectorAll('.gf-row').forEach((row, r) => {
        [...row.children].forEach(el => { if (el.matches('.gf-node, .gf-arrow')) path.push(el); });
        if (r === 0) { const v = sec.querySelector('.gf-connector-vert'); if (v) path.push(v); }
    });
    const loop = sec.querySelector('.gf-loop');
    let i = 0;
    whileVisible(sec, 520, () => {
        path.forEach(el => el.classList.remove('gf-hot'));
        if (loop) loop.classList.remove('gf-hot');
        if (i < path.length) {
            path[i].classList.add('gf-hot');
            // the decision node sometimes sends the packet round the correction loop
            if (path[i].classList.contains('gf-node-decision') && loop && Math.random() < 0.5) loop.classList.add('gf-hot');
        }
        i = (i + 1) % (path.length + 2);   // two empty beats before the next run
    });
}

// ─── STAGE 4 QC ─────────────────────────────────────────────────────────────
function initVerifySim() {
    const sim = document.getElementById('vsSim');
    if (!sim) return;
    const CASES = [
        { A: [1, 1, 1, 1, 1], B: [1, 1, 1, 1, 1], d: 0, say: '<b>Both 5/5.</b> A pairwise tiebreak keeps the richer, more strategic dialogue.' },
        { A: [1, 1, 1, 1, 1], B: [1, 1, 0, 1, 1], d: 1, say: '<b>Only A is 5/5.</b> A is used directly, with no changes.' },
        { A: [1, 1, 1, 0, 1], B: [1, 0, 1, 0, 0], d: 2, say: '<b>A is 4/5.</b> Only A’s failing criterion (④ authenticity) is corrected, then rechecked.' },
        { A: [1, 0, 1, 1, 0], B: [0, 1, 0, 1, 0], d: 3, say: '<b>Both 3/5 or less.</b> Claude Sonnet 4.5 writes new dialogue from scratch, which is then rechecked.' },
    ];
    const cards = [...sim.querySelectorAll('.vs-card')];
    cards.forEach(c => { const t = c.querySelector('.vs-ticks'); for (let n = 0; n < 5; n++) { const i = document.createElement('i'); i.textContent = '①②③④⑤'[n]; t.appendChild(i); } });
    const logic = document.querySelector('#verify .vs-logic');
    const decs = [...document.querySelectorAll('#verify .decision-grid .dec-card')];
    const verdict = sim.querySelector('.vs-verdict');
    let tok = 0;
    sim.querySelectorAll('.vs-b').forEach(btn => btn.addEventListener('click', () => {
        const run = ++tok, cs = CASES[+btn.dataset.case];
        sim.querySelectorAll('.vs-b').forEach(b => b.classList.toggle('on', b === btn));
        sim.classList.remove('done'); logic.classList.remove('picking');
        decs.forEach(d => d.classList.remove('pick'));
        verdict.textContent = 'Scoring…';
        cards.forEach((c, ci) => {
            const ticks = [...c.querySelectorAll('.vs-ticks i')], score = c.querySelector('.vs-score');
            ticks.forEach(t => { t.className = ''; });
            score.textContent = '?/5';
            const v = cs[ci === 0 ? 'A' : 'B'];
            ticks.forEach((t, n) => setTimeout(() => { if (run === tok) t.className = v[n] ? 'ok' : 'no'; }, 150 + n * 140 + ci * 90));
            setTimeout(() => { if (run === tok) score.textContent = v.reduce((a, b) => a + b, 0) + '/5'; }, 950 + ci * 90);
        });
        setTimeout(() => {
            if (run !== tok) return;
            sim.classList.add('done'); verdict.innerHTML = cs.say;
            logic.classList.add('picking'); decs[cs.d].classList.add('pick');
        }, 1250);
    }));
}

// ─── STAGE 5 & 6 ────────────────────────────────────────────────────────────
function initTraceLanes() {
    const sec = document.getElementById('trace');
    if (!sec) return;
    const ra = [...sec.querySelectorAll('#trReact .tr-s')];
    const rc = [...sec.querySelectorAll('#trRecon .tr-s')];
    const fields = [...sec.querySelectorAll('#trFields .tr-f')];
    const meter = [...sec.querySelectorAll('.tr-meter i')];
    const gate = document.getElementById('trGate');
    if (IX_RM()) { fields.forEach(f => f.classList.add('lit')); gate.classList.add('open'); meter.slice(0, 4).forEach(m => m.classList.add('on')); return; }
    // one tick = one ReAct step; ReCon's three steps are spread across the same span
    let t = 0;
    const T = ra.length;                       // 7 ticks of lane activity
    const LEVEL = [1, 2, 3, 4, 5, 2, 4];       // suspicion levels shown on successive runs
    let run = 0;
    whileVisible(sec, 700, () => {
        [...ra, ...rc].forEach(s => s.classList.remove('hot'));
        if (t < T) {
            ra[t].classList.add('hot');
            ra.slice(0, t).forEach(s => s.classList.add('done'));
            const j = Math.min(rc.length - 1, Math.floor(t / (T / rc.length)));
            rc[j].classList.add('hot');
            rc.slice(0, j).forEach(s => s.classList.add('done'));
            if (t === 0) { fields.forEach(f => f.classList.remove('lit')); gate.classList.remove('open'); meter.forEach(m => m.classList.remove('on')); }
        } else if (t < T + fields.length) {
            const f = fields[t - T];
            f.classList.add('lit');
            if (f.classList.contains('tr-f-s')) {
                const lv = LEVEL[run % LEVEL.length];
                meter.forEach((m, k) => m.classList.toggle('on', k < lv));
                f.dataset.lv = lv;
            }
            if (f === gate) {
                const lv = +fields.find(x => x.classList.contains('tr-f-s')).dataset.lv;
                gate.classList.toggle('open', lv >= 4);
                gate.querySelector('.tr-gate-l').textContent = lv >= 4 ? 'open: Strong+' : 'closed';
            }
        } else if (t >= T + fields.length + 3) {
            t = -1; run++;
            [...ra, ...rc].forEach(s => s.classList.remove('done'));
        }
        t++;
    });
}

// ─── STAGE 6 QC ─────────────────────────────────────────────────────────────
function initTraceTabs() {
    const sec = document.getElementById('traceqc');
    if (!sec) return;
    const tabs = [...sec.querySelectorAll('.q6-t')];
    const views = [...sec.querySelectorAll('.q6-v')];
    function show(n) {
        tabs.forEach((t, i) => { t.classList.toggle('on', i === n); t.setAttribute('aria-selected', String(i === n)); });
        views.forEach((v, i) => {
            if (i !== n) { v.classList.remove('on'); return; }
            v.classList.remove('on'); void v.offsetWidth; v.classList.add('on');   // replay bar growth
        });
    }
    tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
    // grow the first view's bars when the section is first seen
    views[0].classList.remove('on');
    new IntersectionObserver((en, obs) => en.forEach(e => {
        if (!e.isIntersecting) return;
        obs.disconnect(); setTimeout(() => show(0), 300);
    }), { threshold: 0.25 }).observe(sec.querySelector('.q6-views'));
    if (IX_RM()) show(0);
}

function initInteract() {
    initThemes();
    initDatasetStepper();
    initTheoryMap();
    initTaxonomy();
    initGenflowPacket();
    initVerifySim();
    initTraceLanes();
    initTraceTabs();
}
