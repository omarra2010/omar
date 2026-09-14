let current=0;
const slides=document.querySelectorAll('.slide');
function show(n){current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current))}
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
document.addEventListener('touchstart',e=>startX=e.changedTouches[0].screenX);
document.addEventListener('touchend',e=>{if(startX===null)return;let dx=e.changedTouches[0].screenX-startX;if(Math.abs(dx)>50){dx<0?next():prev()}startX=null});
