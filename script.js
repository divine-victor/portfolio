const $=s=>[...document.querySelectorAll(s)];
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
document.documentElement.classList.add("js");
document.getElementById("y").textContent=new Date().getFullYear();

// split story lines into words for the staggered reveal
$(".ch p").forEach(p=>{
  let i=0;
  const wrap=n=>n.nodeType===3
    ?n.textContent.split(/(\s+)/).map(t=>/^\s+$/.test(t)||!t?t:`<span class="w" style="transition-delay:${i++*40}ms">${t}</span>`).join("")
    :`<${n.tagName.toLowerCase()}>${[...n.childNodes].map(wrap).join("")}</${n.tagName.toLowerCase()}>`;
  p.innerHTML=[...p.childNodes].map(wrap).join("");
});

const bar=document.querySelector(".bar"),tracks=$(".track"),chs=$(".ch"),ticks=$(".ticks span"),
  frame=document.querySelector(".frame"),story=document.querySelector(".story"),contact=document.querySelector(".contact");
// slow drift of the story video from one line to the next
const drift=[[-1.6,1],[1.6,-1],[-1.2,-1.4],[1.4,1.2]];
let queued=0,cur=1,tgt=1,raf=0,lastOn=-1;

function ease(){
  cur+=(tgt-cur)*.07;
  if(Math.abs(tgt-cur)<.001)cur=tgt;
  frame.style.setProperty("--fp",cur.toFixed(4));
  raf=cur===tgt?0:requestAnimationFrame(ease);
}

function update(){
  queued=0;
  const vh=innerHeight,max=document.documentElement.scrollHeight-vh;
  bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  if(rm)return;
  tracks.forEach(t=>{
    const r=t.getBoundingClientRect();
    t.style.setProperty("--p",clamp(-r.top/(r.height-vh)).toFixed(4));
  });
  const p=parseFloat(story.style.getPropertyValue("--p"))||0;
  const on=p>0&&p<1?Math.min(chs.length-1,Math.floor(p*chs.length)):-1;
  chs.forEach((c,i)=>c.classList.toggle("on",i===on));
  ticks.forEach((t,i)=>{t.classList.toggle("on",i===on);t.classList.toggle("done",on>-1&&i<on)});
  if(on!==lastOn&&on>-1){
    const d=drift[on%drift.length];
    story.style.setProperty("--sx",d[0]);story.style.setProperty("--sy",d[1]);
  }
  lastOn=on;
  if(frame){
    const r=frame.parentElement.getBoundingClientRect();
    tgt=clamp((vh-r.top)/(vh*.85));
    if(!raf)raf=requestAnimationFrame(ease);
  }
  if(contact){
    const r=contact.getBoundingClientRect();
    contact.style.setProperty("--k",clamp((vh-r.top)/(vh*.7)).toFixed(3));
  }
}
addEventListener("scroll",()=>{if(!queued)queued=requestAnimationFrame(update)},{passive:true});
addEventListener("resize",update);
update();
if(!rm&&frame){cur=tgt;frame.style.setProperty("--fp",cur.toFixed(4))}

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}
}),{threshold:.2});
$("[data-r]").forEach(el=>io.observe(el));
