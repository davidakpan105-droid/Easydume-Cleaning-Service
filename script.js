/* ═══════════════════════════════════════════════════════
   EASY DUMP — v3 MASTER SCRIPT
   GSAP + ScrollTrigger | Hero synced text slider
   ═══════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── GSAP availability check ── */
const G = window.gsap;
const ST = window.ScrollTrigger;

/* ── PRELOADER ── */
const PL = document.getElementById('preloader');
function donePL(){
  if(!PL) return;
  PL.classList.add('out');
  setTimeout(()=>{ PL.style.display='none'; }, 700);
  kickGSAP();
}
window.addEventListener('load', ()=> setTimeout(donePL, 2900));

/* ── GSAP INIT ── */
function kickGSAP(){
  if(!G || !ST) { fallbackReveal(); return; }
  ST.refresh();

  // Animate all .sa elements
  document.querySelectorAll('.sa').forEach(el=>{
    const d = parseFloat(getComputedStyle(el).transitionDelay)||0;
    let xFrom=0, yFrom=40;
    if(el.classList.contains('sl')){ xFrom=-40; yFrom=0; }
    if(el.classList.contains('sr')){ xFrom=40;  yFrom=0; }
    if(el.classList.contains('ss')){ yFrom=0; }
    G.fromTo(el,
      { opacity:0, x:xFrom, y:yFrom, scale: el.classList.contains('ss')?.93:1 },
      { opacity:1, x:0, y:0, scale:1, duration:.9, ease:'power3.out',
        delay: d,
        scrollTrigger:{ trigger:el, start:'top 88%', once:true }
      }
    );
  });
}

/* Fallback when GSAP not loaded */
function fallbackReveal(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.1, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.sa').forEach(el=>io.observe(el));
}

/* ── NAVBAR ── */
const NAV = document.getElementById('nav');
function onScroll(){
  if(NAV) NAV.classList.toggle('stuck', window.scrollY > 60);
  const btt = document.getElementById('btt');
  if(btt) btt.classList.toggle('on', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ── HAMBURGER ── */
const HAM = document.getElementById('ham');
const MOB = document.getElementById('mob-nav');
const MBC = document.getElementById('mob-close');
function openMob(){
  MOB?.classList.add('show');
  HAM?.classList.add('x');
  document.body.style.overflow='hidden';
}
function closeMob(){
  MOB?.classList.remove('show');
  HAM?.classList.remove('x');
  document.body.style.overflow='';
}
HAM?.addEventListener('click', openMob);
MBC?.addEventListener('click', closeMob);
MOB?.querySelectorAll('.mob-lnk').forEach(l=>l.addEventListener('click', closeMob));

/* ── ACTIVE NAV ── */
const page = location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-link,.mob-lnk').forEach(l=>{
  const h = l.getAttribute('href')||'';
  if(h===page||(page===''&&h==='index.html')) l.classList.add('act');
});

/* ── HERO SLIDER — synced text + bg ── */
const slides   = document.querySelectorAll('.hs');
const panels   = document.querySelectorAll('.hero-panel');
const dots     = document.querySelectorAll('.hdot');
const fill     = document.getElementById('hero-fill');
let cur = 0, timer = null;

function goSlide(idx){
  slides[cur]?.classList.remove('on');
  panels[cur]?.classList.remove('on');
  dots[cur]?.classList.remove('on');
  cur = (idx + slides.length) % slides.length;
  slides[cur]?.classList.add('on');
  panels[cur]?.classList.add('on');
  dots[cur]?.classList.add('on');
  resetFill();
}
function resetFill(){
  if(!fill) return;
  fill.style.transition='none'; fill.style.width='0%';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    fill.style.transition='width 5s linear'; fill.style.width='100%';
  }));
}
function startAuto(){
  clearInterval(timer);
  timer = setInterval(()=> goSlide(cur+1), 5000);
}
if(slides.length){
  goSlide(0);
  startAuto();
  dots.forEach((d,i)=> d.addEventListener('click',()=>{ goSlide(i); startAuto(); }));
  document.getElementById('hp')?.addEventListener('click',()=>{ goSlide(cur-1); startAuto(); });
  document.getElementById('hn')?.addEventListener('click',()=>{ goSlide(cur+1); startAuto(); });
}

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item = q.closest('.faq-item');
    const ans  = item.querySelector('.faq-a');
    const open = item.classList.contains('on');
    document.querySelectorAll('.faq-item.on').forEach(i=>{
      i.classList.remove('on'); i.querySelector('.faq-a')?.classList.remove('on');
    });
    if(!open){ item.classList.add('on'); ans?.classList.add('on'); }
  });
});

/* ── PROJECTS SHOW MORE ── */
const phidden = Array.from(document.querySelectorAll('.proj-hidden'));
const pMore   = document.getElementById('pMore');
const pLess   = document.getElementById('pLess');
let pPage=0; const PBATCH=5;
if(pLess) pLess.style.display='none';
pMore?.addEventListener('click',()=>{
  let shown=0;
  for(let i=pPage*PBATCH; i<phidden.length && shown<PBATCH; i++,shown++){
    phidden[i].classList.remove('proj-hidden');
    phidden[i].style.display='';
    if(G) G.fromTo(phidden[i],{opacity:0,y:30},{opacity:1,y:0,duration:.6,ease:'power3.out',delay:shown*.08});
  }
  pPage++;
  if(pPage*PBATCH>=phidden.length) pMore.style.display='none';
  if(pLess) pLess.style.display='';
});
pLess?.addEventListener('click',()=>{
  phidden.forEach(c=>{ c.classList.add('proj-hidden'); c.style.display='none'; });
  pPage=0;
  if(pMore) pMore.style.display='';
  if(pLess) pLess.style.display='none';
  document.getElementById('projects')?.scrollIntoView({behavior:'smooth',block:'start'});
});

/* ── BEFORE/AFTER ── */
const baHidden = Array.from(document.querySelectorAll('.ba-hidden'));
const baMore   = document.getElementById('baMore');
const baLess   = document.getElementById('baLess');
if(baLess) baLess.style.display='none';
baMore?.addEventListener('click',()=>{
  baHidden.forEach(el=>{ el.classList.remove('ba-hidden'); el.style.display=''; });
  baMore.style.display='none';
  if(baLess) baLess.style.display='';
});
baLess?.addEventListener('click',()=>{
  baHidden.forEach(el=>{ el.classList.add('ba-hidden'); el.style.display='none'; });
  if(baMore) baMore.style.display='';
  baLess.style.display='none';
});

/* ── REVIEWS SHOW MORE ── */
const rvHidden = Array.from(document.querySelectorAll('.rv-hidden'));
const rvMore   = document.getElementById('rvMore');
const rvLess   = document.getElementById('rvLess');
if(rvLess) rvLess.style.display='none';
rvMore?.addEventListener('click',()=>{
  rvHidden.forEach(r=>{ r.classList.remove('rv-hidden'); r.style.display=''; });
  rvMore.style.display='none';
  if(rvLess) rvLess.style.display='';
});
rvLess?.addEventListener('click',()=>{
  rvHidden.forEach(r=>{ r.classList.add('rv-hidden'); r.style.display='none'; });
  if(rvMore) rvMore.style.display='';
  rvLess.style.display='none';
  document.getElementById('reviews')?.scrollIntoView({behavior:'smooth',block:'start'});
});

/* ── BACK TO TOP ── */
document.getElementById('btt')?.addEventListener('click',()=> window.scrollTo({top:0,behavior:'smooth'}));

/* ── MIN DATE ── */
const di = document.getElementById('pref-date');
if(di) di.setAttribute('min', new Date().toISOString().split('T')[0]);

/* ── RATING BARS ANIMATE ── */
document.querySelectorAll('.rb-fill').forEach(bar=>{
  const w = bar.dataset.w||'0%';
  bar.style.width='0%';
  const io2 = new IntersectionObserver(e=>{
    if(e[0].isIntersecting){ bar.style.transition='width 1.2s ease'; bar.style.width=w; io2.disconnect(); }
  },{threshold:.5});
  io2.observe(bar);
});

/* ── EMAILJS ── */
if(typeof emailjs!=='undefined') emailjs.init('YOUR_PUBLIC_KEY');

function handleForm(fid, okId, errId){
  const form = document.getElementById(fid);
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = form.querySelector('.f-submit');
    const ok  = document.getElementById(okId);
    const err = document.getElementById(errId);
    const orig = btn.innerHTML;
    btn.innerHTML='Sending…'; btn.disabled=true;
    if(ok) ok.style.display='none';
    if(err) err.style.display='none';
    if(typeof emailjs!=='undefined'){
      emailjs.sendForm('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',form)
        .then(()=>{ btn.innerHTML='✓ Sent!'; if(ok) ok.style.display='block'; form.reset(); },
              ()=>{ btn.innerHTML=orig; btn.disabled=false; if(err) err.style.display='block'; });
    } else {
      setTimeout(()=>{ btn.innerHTML='✓ Sent!'; if(ok) ok.style.display='block'; form.reset(); },1200);
    }
  });
}
handleForm('bk-form','bk-ok','bk-err');
handleForm('ct-form','ct-ok','ct-err');

})();