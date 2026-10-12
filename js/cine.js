(()=>{
const secs=[...document.querySelectorAll(".cine")];if(!secs.length)return;
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches,T=window.THREE;
const sm=x=>x*x*(3-2*x),cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
secs.forEach(sec=>{
 const chs=[...sec.querySelectorAll(".cine-ch")],dots=[...sec.querySelectorAll(".cine-dots i")],cv=sec.querySelector(".cine-gl"),glow={v:0};let on=-1,P=0;
 if(rm){chs.forEach(c=>c.classList.add("on"));return}
 const show=i=>{if(i===on)return;on=i;chs.forEach((c,k)=>c.classList.toggle("on",k===i));dots.forEach((d,k)=>d.classList.toggle("on",k<=i));
  if(i<0||!window.anime)return;
  anime({targets:chs[i].querySelectorAll(".cl"),translateY:[46,0],opacity:[0,1],delay:anime.stagger(110),duration:1000,easing:"easeOutExpo"});
  anime({targets:glow,v:i===chs.length-1?1:0,duration:1300,easing:"easeInOutQuad"})};
 const prog=()=>{const r=sec.getBoundingClientRect();P=cl(-r.top/Math.max(1,r.height-innerHeight));show(P<=0?-1:Math.min(chs.length-1,Math.floor(P*chs.length)))};
 if(!T||!cv){addEventListener("scroll",prog,{passive:true});prog();return}
 const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true}),s=new T.Scene(),cam=new T.PerspectiveCamera(42,1,.1,100),g=new T.Group();s.add(g);
 s.add(new T.AmbientLight(0xffffff,.85));const dl=new T.DirectionalLight(0xffe2c0,.9);dl.position.set(4,6,8);s.add(dl);
 const L=[[0,3.6,9,.5],[-2.6,1.6,4,1.2],[-2.9,.3,3.4,.4],[-3.5,-.6,1.6,.5],[3,.9,3.4,2.8],[-3.4,-2.8,2.6,1.5],[0,-2.8,2.6,1.5],[3.4,-2.8,2.6,1.5],[0,-4.6,9,.4]];
 const C=[0x3a2a1e,0xf2e7d2,0xcdbfa6,0xc9622f,0xe0cfae,0xf2e7d2,0xf2e7d2,0xf2e7d2,0x3a2a1e],R=()=>(Math.random()-.5);
 const pg=L.map((l,i)=>{const m=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshStandardMaterial({color:C[i],roughness:.9,side:T.DoubleSide}));
  m.userData={l,i,sp:new T.Vector3(R()*22,R()*13,R()*14),q:new T.Quaternion().setFromEuler(new T.Euler(R()*6,R()*6,R()*6)),ph:Math.random()*6};g.add(m);return m});
 const N=180,pos=new Float32Array(N*3);for(let i=0;i<N;i++)pos.set([R()*30,R()*16,R()*16-4],i*3);
 const pts=new T.Points(new T.BufferGeometry().setAttribute("position",new T.BufferAttribute(pos,3)),new T.PointsMaterial({size:.07,color:0xffe7c2,transparent:true,opacity:.55}));s.add(pts);
 let base=12.5,mx=0,vis=true;const idq=new T.Quaternion();
 const rs=()=>{const w=cv.parentElement.clientWidth,h=cv.parentElement.clientHeight,a=w/h;r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,h,false);cam.aspect=a;cam.updateProjectionMatrix();
  base=Math.max(12.5,9.8/(2*Math.tan(21*Math.PI/180)*a));g.position.set(a>1.2?2.6:0,a>1.2?0:2.2,0);g.scale.setScalar(a>1.2?1:.85)};
 rs();addEventListener("resize",rs);addEventListener("pointermove",e=>mx=e.clientX/innerWidth-.5);
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(sec);
 r.setAnimationLoop(t=>{if(!vis)return;t*=.001;prog();const k=sm(cl((P-.08)/.5));
  pg.forEach(m=>{const u=m.userData,l=u.l;
   m.position.set(u.sp.x+(l[0]-u.sp.x)*k+Math.sin(t*.5+u.ph)*.5*(1-k),u.sp.y+(l[1]-u.sp.y)*k+Math.cos(t*.4+u.ph)*.5*(1-k),u.sp.z*(1-k));
   m.quaternion.copy(u.q).slerp(idq,k);m.scale.set(1.4+(l[2]-1.4)*k,1.9+(l[3]-1.9)*k,1);
   const e=glow.v*(u.i===3?.7:.18);m.material.emissive.setRGB(.8*e,.4*e,.15*e)});
  pts.rotation.y=t*.02;cam.position.set(Math.sin(P*2.2)*2.2*(1-k*.8)+mx*1.2,Math.cos(P*2)*.8*(1-k)-mx*.3,base-cl((P-.72)/.28)*2.8);cam.lookAt(g.position.x*.4,0,0);r.render(s,cam)});
});
})();
