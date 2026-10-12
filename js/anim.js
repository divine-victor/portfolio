(()=>{
document.querySelectorAll("video").forEach(v=>{const ss=[...v.querySelectorAll("source[data-src]")];if(!ss.length)return;
 new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){ss.forEach(s=>s.src=s.dataset.src);v.load();v.play().catch(()=>{});o.disconnect()}},{rootMargin:"800px"}).observe(v)});
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
if(rm||!window.gsap)return;
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("gs");
const split=el=>{el.innerHTML=el.innerHTML.replace(/(<[^>]+>)|([^<\s]+)/g,(m,t,w)=>t||`<span class="sw"><span>${w}</span></span>`)};
gsap.from("body",{opacity:0,duration:.7});
const h1=document.querySelector(".hero h1");
if(h1){split(h1);gsap.timeline({defaults:{ease:"power4.out"}}).from(".hero .tag",{y:20,opacity:0,duration:.8}).from(".hero h1 .sw>span",{yPercent:115,duration:1.1,stagger:.06},"-=.5").from(".hero .sub,.hero-actions",{y:30,opacity:0,duration:.9,stagger:.12},"-=.7")}
gsap.utils.toArray("h2,.wk-hero h1").forEach(h=>{split(h);gsap.from(h.querySelectorAll(".sw>span"),{yPercent:115,duration:1,ease:"power4.out",stagger:.05,scrollTrigger:{trigger:h,start:"top 88%"}})});
gsap.utils.toArray("[data-r]:not(h2)").filter(el=>!el.matches(".step,.cap-grid article")).forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 90%"}}));
gsap.utils.toArray(".step,.cap-grid article").forEach((el,i)=>gsap.from(el,{y:60,opacity:0,duration:1,delay:(i%4)*.1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 92%"}}));
if(document.querySelector(".dark-break"))gsap.fromTo(".dark-break-bg",{yPercent:-8},{yPercent:8,ease:"none",scrollTrigger:{trigger:".dark-break",scrub:true,start:"top bottom",end:"bottom top"}});
gsap.utils.toArray(".proj .frame").forEach(f=>gsap.fromTo(f,{y:60,scale:.95},{y:0,scale:1,ease:"none",scrollTrigger:{trigger:f,scrub:.6,start:"top 95%",end:"top 40%"}}));
/* three.js: slow warm dust in the hero light */
const cv=document.getElementById("gl");
if(cv&&window.THREE&&innerWidth>700){const T=THREE,r=new T.WebGLRenderer({canvas:cv,alpha:true}),s=new T.Scene(),cam=new T.PerspectiveCamera(50,1,.1,100);cam.position.z=10;
 const k=document.createElement("canvas");k.width=k.height=64;const x=k.getContext("2d"),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,236,205,1)");g.addColorStop(1,"rgba(255,236,205,0)");x.fillStyle=g;x.fillRect(0,0,64,64);
 const N=260,pos=new Float32Array(N*3),sp=[];for(let i=0;i<N;i++){pos.set([(Math.random()-.5)*26,(Math.random()-.5)*14,(Math.random()-.5)*14],i*3);sp.push(.1+Math.random()*.3)}
 const geo=new T.BufferGeometry();geo.setAttribute("position",new T.BufferAttribute(pos,3));
 s.add(new T.Points(geo,new T.PointsMaterial({size:.22,map:new T.CanvasTexture(k),transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending})));
 const rs=()=>{const w=cv.parentElement.clientWidth,h=cv.parentElement.clientHeight;r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};
 rs();addEventListener("resize",rs);let mx=0,vis=true;addEventListener("pointermove",e=>mx=e.clientX/innerWidth-.5);
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv.parentElement);
 r.setAnimationLoop(()=>{if(!vis)return;const a=geo.attributes.position;for(let i=0;i<N;i++){let y=a.getY(i)+sp[i]*.01;if(y>7)y=-7;a.setY(i,y)}a.needsUpdate=true;cam.position.x+=(mx*1.5-cam.position.x)*.03;r.render(s,cam)})}
})();
