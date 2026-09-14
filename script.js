let current=0;
const slides=document.querySelectorAll('.slide');
const revealTimers=new Map();
const nextBtn=document.getElementById('nextBtn');

function prepareReveal(slide){
  if(!slide)return;
  slide.querySelectorAll('h1,h2,h3,p,li,.badge,.student-name,.card,.step,.arrow,.note,.result-box,.info-visual,.chart-card,.big-number,.grades-intro,.grades-layout,.grades-result').forEach((el,index)=>{
    if(el.closest('.controls'))return;
    el.classList.add('word-reveal-target');
    if(el.dataset.revealed==='1')return;
    const textNodes=[];
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(node){
      return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    let node;
    while(node=walker.nextNode())textNodes.push(node);
    textNodes.forEach(textNode=>{
      const frag=document.createDocumentFragment();
      textNode.nodeValue.trim().split(/(\s+)/).forEach(part=>{
        if(/^\s+$/.test(part))frag.appendChild(document.createTextNode(part));
        else{
          const span=document.createElement('span');
          span.className='reveal-word';
          span.textContent=part;
          frag.appendChild(span);
        }
      });
      textNode.parentNode.replaceChild(frag,textNode);
    });
    el.dataset.revealed='1';
  });
}

function animateReveal(slide){
  if(!slide)return;
  prepareReveal(slide);
  const words=slide.querySelectorAll('.reveal-word');
  words.forEach((word,index)=>{
    word.classList.remove('show-word');
    word.style.setProperty('--word-delay',`${Math.min(index*55,1600)}ms`);
  });
  requestAnimationFrame(()=>requestAnimationFrame(()=>words.forEach(word=>word.classList.add('show-word'))));
}

function updateControls(){
  if(!nextBtn)return;
  if(current===slides.length-1){
    nextBtn.textContent='إعادة العرض';
    nextBtn.onclick=()=>show(0);
  }else{
    nextBtn.textContent='التالي';
    nextBtn.onclick=()=>next();
  }
}

function show(n){
  current=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===current));
  updateControls();
  animateReveal(slides[current]);
}
function next(){show(current+1)}
function prev(){show(current-1)}
function toggleFS(){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen()}

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();next()}
  if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();prev()}
  if(e.key==='Home')show(0)
  if(e.key==='End')show(slides.length-1)
});

let startX=null;
document.addEventListener('touchstart',e=>startX=e.changedTouches[0].screenX,{passive:true});
document.addEventListener('touchend',e=>{if(startX===null)return;let dx=e.changedTouches[0].screenX-startX;if(Math.abs(dx)>50){dx<0?next():prev()}startX=null},{passive:true});

if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.classList.add('reduced-motion');
}

const controlsStyle=document.createElement('style');
controlsStyle.textContent='.controls{position:absolute!important;z-index:20;bottom:12px!important;top:auto!important;left:50%!important;transform:translateX(-50%)!important}.slide{padding-bottom:96px!important}@media(max-width:480px){.controls{bottom:6px!important}.slide{padding-bottom:82px!important}}';
document.head.appendChild(controlsStyle);

show(0);
