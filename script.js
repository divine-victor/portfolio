const $=s=>[...document.querySelectorAll(s)];
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
document.documentElement.classList.add("js");
const year=document.getElementById("y");
if(year) year.textContent=new Date().getFullYear();

$(".ch p").forEach(p=>{
  let i=0;
  const wrap=n=>n.nodeType===3
    ?n.textContent.split(/(\s+)/).map(t=>/^\s+$/.test(t)||!t?t:`<span class="w" style="transition-delay:${i++*38}ms">${t}</span>`).join("")
    :`<${n.tagName.toLowerCase()}>${[...n.childNodes].map(wrap).join("")}</${n.tagName.toLowerCase()}>`;
  p.innerHTML=[...p.childNodes].map(wrap).join("");
});

const bar=document.querySelector(".bar");
const tracks=$(".track");
const chs=$(".ch");
const ticks=$(".ticks span");
const frame=document.querySelector(".frame");
const story=document.querySelector(".story");
const contact=document.querySelector(".contact");
const hero=document.querySelector(".hero");

const drift=[[-1.6,1],[1.6,-1],[-1.2,-1.4],[1.4,1.2]];
let queued=0,cur=1,tgt=1,raf=0,lastOn=-1;

function ease(){
  cur+=(tgt-cur)*.07;
  if(Math.abs(tgt-cur)<.001)cur=tgt;
  if(frame) frame.style.setProperty("--fp",cur.toFixed(4));
  raf=cur===tgt?0:requestAnimationFrame(ease);
}

function update(){
  queued=0;
  const vh=innerHeight,max=document.documentElement.scrollHeight-vh;
  if(bar) bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  if(rm)return;

  tracks.forEach(t=>{
    const r=t.getBoundingClientRect();
    const range=Math.max(1,r.height-vh);
    t.style.setProperty("--p",clamp(-r.top/range).toFixed(4));
  });

  if(story){
    const p=parseFloat(story.style.getPropertyValue("--p"))||0;
    const on=p>0&&p<1?Math.min(chs.length-1,Math.floor(p*chs.length)):-1;
    chs.forEach((c,i)=>c.classList.toggle("on",i===on));
    ticks.forEach((t,i)=>{
      t.classList.toggle("on",i===on);
      t.classList.toggle("done",on>-1&&i<on);
    });
    if(on!==lastOn&&on>-1){
      const d=drift[on%drift.length];
      story.style.setProperty("--sx",d[0]);
      story.style.setProperty("--sy",d[1]);
    }
    lastOn=on;
  }

  if(frame){
    const r=frame.parentElement.getBoundingClientRect();
    tgt=clamp((vh-r.top)/(vh*.85));
    if(!raf)raf=requestAnimationFrame(ease);
  }
}
addEventListener("scroll",()=>{if(!queued)queued=requestAnimationFrame(update)},{passive:true});
addEventListener("resize",update);
update();
if(!rm&&frame) frame.style.setProperty("--fp","1");

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}
}),{threshold:.16});
$("[data-r]").forEach(el=>io.observe(el));

/* Give the hero a subtle scale/fade on the first scroll without hijacking the browser. */
if(hero && !rm){
  const heroVideo=hero.querySelector("video");
  addEventListener("scroll",()=>{
    const p=parseFloat(hero.style.getPropertyValue("--p"))||0;
    if(heroVideo) heroVideo.style.setProperty("--hero-progress",p);
  },{passive:true});
}
