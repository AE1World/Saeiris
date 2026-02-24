import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabase";

// ══════════════════════════════════════════════════════════════
// AE-1 WORLD — PhotoGlobe with Supabase Backend
// ══════════════════════════════════════════════════════════════

// TopoJSON
function decodeTopo(topo,name){const obj=topo.objects[name];if(!obj)return[];const{arcs:ta,transform:tr}=topo;const sc=tr?.scale||[1,1],tl=tr?.translate||[0,0];
function decArc(idx){const arc=ta[idx<0?~idx:idx];const coords=[];let x=0,y=0;for(const[dx,dy]of arc){x+=dx;y+=dy;coords.push([x*sc[0]+tl[0],y*sc[1]+tl[1]]);}if(idx<0)coords.reverse();return coords;}
function ring2c(ring){const c=[];for(const ai of ring){const ac=decArc(ai);const s=c.length>0?1:0;for(let i=s;i<ac.length;i++)c.push(ac[i]);}return c;}
// Split a ring at date line crossings AND into chunks spanning max ~90° longitude
function splitRing(ring){
  if(ring.length<3)return[ring];
  // First split at date line crossings (lon jumps > 30°)
  const dateSplit=[];let cur=[ring[0]];
  for(let i=1;i<ring.length;i++){
    if(Math.abs(ring[i][0]-ring[i-1][0])>30){
      if(cur.length>=3)dateSplit.push(cur);
      cur=[ring[i]];
    }else cur.push(ring[i]);
  }
  if(cur.length>=3)dateSplit.push(cur);
  if(dateSplit.length===0)dateSplit.push(ring);
  // Then split any piece that spans more than 90° longitude
  const result=[];
  for(const piece of dateSplit){
    const lons=piece.map(p=>p[0]);
    const lonSpan=Math.max(...lons)-Math.min(...lons);
    if(lonSpan>90){
      // Split into segments where we track running lon range
      let seg=[piece[0]];
      let segMin=piece[0][0],segMax=piece[0][0];
      for(let i=1;i<piece.length;i++){
        const lon=piece[i][0];
        const newMin=Math.min(segMin,lon),newMax=Math.max(segMax,lon);
        if(newMax-newMin>90){
          if(seg.length>=3)result.push(seg);
          seg=[piece[i]];segMin=lon;segMax=lon;
        }else{seg.push(piece[i]);segMin=newMin;segMax=newMax;}
      }
      if(seg.length>=3)result.push(seg);
    }else{result.push(piece);}
  }
  return result.length>0?result:[ring];
}
const feats=[];const geoms=obj.type==="GeometryCollection"?obj.geometries:[obj];
for(const g of geoms){
  if(g.type==="Polygon"){
    const allRings=[];
    for(const ring of g.arcs.map(ring2c)){for(const sr of splitRing(ring))allRings.push([sr]);}
    feats.push({type:"MultiPolygon",coords:allRings});
  }else if(g.type==="MultiPolygon"){
    const allRings=[];
    for(const poly of g.arcs.map(p=>p.map(ring2c)))for(const ring of poly){for(const sr of splitRing(ring))allRings.push([sr]);}
    feats.push({type:"MultiPolygon",coords:allRings});
  }
}return feats;}

function useWorldMap(){const[feats,setFeats]=useState([]);const[loading,setLoading]=useState(true);
useEffect(()=>{fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(r=>r.json()).then(t=>{setFeats(decodeTopo(t,"countries"));setLoading(false);}).catch(()=>setLoading(false));},[]);return{feats,loading};}

function getLandColor(cLat,cLon){const a=Math.abs(cLat);
if(a>68)return{fill:"#D2DDD0",stroke:"#B8C8B4"};if(a>62)return{fill:"#C4D6B8",stroke:"#AABF9E"};if(a>55)return{fill:"#8CB580",stroke:"#74A068"};
if(a>40){if((cLon>-130&&cLon<-115&&cLat>40)||(cLon>-10&&cLon<5&&cLat>45))return{fill:"#7AB470",stroke:"#62A058"};return{fill:"#96BE86",stroke:"#7EA870"};}
if(a>28){if((cLon>-17&&cLon<60&&cLat>15&&cLat<38)||(cLon>50&&cLon<75&&cLat>25))return{fill:"#DCCB9A",stroke:"#C8B888"};if(cLon>115&&cLon<150&&cLat<-20)return{fill:"#D6BC82",stroke:"#C2A870"};return{fill:"#A4C480",stroke:"#8CB068"};}
if(a>12){if(cLon>-20&&cLon<55&&cLat>10&&cLat<20)return{fill:"#D0BE84",stroke:"#BCA870"};if(cLon>68&&cLon<92&&cLat>8)return{fill:"#90BC72",stroke:"#78A65C"};return{fill:"#AECA7E",stroke:"#96B466"};}
if((cLon>-82&&cLon<-34&&cLat>-15&&cLat<12)||(cLon>8&&cLon<35&&a<8)||(cLon>95&&cLon<140&&a<15))return{fill:"#6AAE5C",stroke:"#529844"};return{fill:"#72B262",stroke:"#5A9C4A"};}

function featureCentroid(f){let tLat=0,tLon=0,c=0;const polys=f.type==="MultiPolygon"?f.coords:[f.coords];for(const poly of polys)for(const ring of poly)for(let i=0;i<ring.length;i+=3){tLon+=ring[i][0];tLat+=ring[i][1];c++;}return c>0?{lat:tLat/c,lon:tLon/c}:{lat:0,lon:0};}
function orthoProject(lat,lon,rLat,rLon,R,cx,cy){const phi=lat*Math.PI/180,lam=(lon-rLon)*Math.PI/180,phi0=rLat*Math.PI/180;const cosC=Math.sin(phi0)*Math.sin(phi)+Math.cos(phi0)*Math.cos(phi)*Math.cos(lam);if(cosC<0)return null;return{x:cx+R*Math.cos(phi)*Math.sin(lam),y:cy-R*(Math.cos(phi0)*Math.sin(phi)-Math.sin(phi0)*Math.cos(phi)*Math.cos(lam)),cosC};}
function clipRing(ring,rLat,rLon,R,cx,cy){
  const pr=ring.map(pt=>{const p=orthoProject(pt[1],pt[0],rLat,rLon,R,cx,cy);return p?{x:p.x,y:p.y,vis:true}:{x:0,y:0,vis:false};});
  const segs=[];let cur=[];
  for(let i=0;i<pr.length;i++){
    if(pr[i].vis){cur.push(pr[i]);}
    else{if(cur.length>=3)segs.push(cur);cur=[];}
  }
  if(cur.length>=3)segs.push(cur);
  // For each segment, if first and last points are far apart,
  // add points along the globe edge to close the shape cleanly
  return segs.map(seg=>{
    const first=seg[0],last=seg[seg.length-1];
    const dist=Math.hypot(last.x-first.x,last.y-first.y);
    if(dist>R*0.3){
      // Add arc along the globe edge from last point back to first point
      const a1=Math.atan2(last.y-cy,last.x-cx);
      const a2=Math.atan2(first.y-cy,first.x-cx);
      let da=a2-a1;
      if(da>Math.PI)da-=2*Math.PI;
      if(da<-Math.PI)da+=2*Math.PI;
      const steps=Math.max(4,Math.ceil(Math.abs(da)/(Math.PI/12)));
      const edgePts=[];
      for(let s=1;s<steps;s++){
        const a=a1+da*(s/steps);
        edgePts.push({x:cx+R*Math.cos(a),y:cy+R*Math.sin(a),vis:true});
      }
      return[...seg,...edgePts];
    }
    return seg;
  });
}

function timeAgo(ts){if(!ts)return"";const d=Math.floor((Date.now()-new Date(ts).getTime())/864e5);if(d<1)return"Today";if(d===1)return"Yesterday";if(d<30)return d+"d ago";if(d<365)return Math.floor(d/30)+"mo ago";return Math.floor(d/365)+"y ago";}
function fmtDate(ts){if(!ts)return"";return new Date(ts).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});}
function photoGradient(id){const p=[["#FF6B35","#F7C59F"],["#2E86AB","#A23B72"],["#1B4332","#95D5B2"],["#E63946","#F1FAEE"],["#264653","#E9C46A"],["#7209B7","#3A0CA3"]][(id-1)%6];return`linear-gradient(135deg,${p[0]},${p[1]})`;}

// ── Auth Modal ──
function AuthModal({onClose,onAuth}){
  const[mode,setMode]=useState("login");const[email,setEmail]=useState("");const[password,setPassword]=useState("");
  const[username,setUsername]=useState("");const[displayName,setDisplayName]=useState("");
  const[error,setError]=useState(null);const[loading,setLoading]=useState(false);

  const handleSubmit=async()=>{
    setError(null);setLoading(true);
    try{
      if(mode==="login"){
        const{error}=await supabase.auth.signInWithPassword({email,password});
        if(error)throw error;
      }else{
        const{error}=await supabase.auth.signUp({email,password,options:{data:{username,display_name:displayName||username}}});
        if(error)throw error;
      }
      onAuth();onClose();
    }catch(e){setError(e.message);}
    setLoading(false);
  };

  const iS={background:"#0D1F2D",border:"1px solid #1A3040",borderRadius:10,padding:"12px 14px",color:"#E0EEF4",fontSize:14,outline:"none",width:"100%",fontFamily:"'DM Sans',sans-serif"};
  const lS={fontSize:11,color:"#5A8CA8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,display:"block"};

  return(<div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,10,20,0.7)",backdropFilter:"blur(20px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{width:420,background:"#0A1620",borderRadius:24,border:"1px solid #1A3040",padding:"32px 28px",boxShadow:"0 40px 100px rgba(0,0,0,0.4)"}}>
      <h3 style={{fontSize:22,fontWeight:700,color:"#E0EEF4",margin:"0 0 4px"}}>{mode==="login"?"Welcome Back":"Join AE-1 World"}</h3>
      <p style={{fontSize:13,color:"#5A8CA8",margin:"0 0 24px"}}>{mode==="login"?"Sign in to upload and like photos":"Create an account to start sharing"}</p>
      {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#ef4444"}}>{error}</div>}
      {mode==="signup"&&<><label><span style={lS}>Username</span><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="johndoe" style={{...iS,marginBottom:12}}/></label>
        <label><span style={lS}>Display Name</span><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="John Doe" style={{...iS,marginBottom:12}}/></label></>}
      <label><span style={lS}>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{...iS,marginBottom:12}}/></label>
      <label><span style={lS}>Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{...iS,marginBottom:20}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></label>
      <button onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#FF6B35,#ff8c5a)",color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:16,opacity:loading?0.6:1}}>{loading?"...":(mode==="login"?"Sign In":"Create Account")}</button>
      <div style={{textAlign:"center",fontSize:13,color:"#5A8CA8"}}>{mode==="login"?"Don't have an account? ":"Already have an account? "}<button onClick={()=>{setMode(mode==="login"?"signup":"login");setError(null);}} style={{background:"none",border:"none",color:"#2AA6D4",cursor:"pointer",fontWeight:600,fontSize:13}}>{ mode==="login"?"Sign Up":"Sign In"}</button></div>
    </div>
  </div>);
}

// ── Globe Canvas ──
function GlobeCanvas({photos,selectedId,onSelect,rotation,onRotate,globeScale,onScaleChange}){
  const canvasRef=useRef(null);const containerRef=useRef(null);const[dims,setDims]=useState({w:900,h:700});
  const{feats,loading}=useWorldMap();const dragging=useRef(false);const dragMoved=useRef(false);const lastM=useRef({x:0,y:0});const hovered=useRef(null);
  const featColors=useMemo(()=>feats.map(f=>{const c=featureCentroid(f);return getLandColor(c.lat,c.lon);}),[feats]);
  useEffect(()=>{const ro=new ResizeObserver(e=>{for(const en of e)setDims({w:en.contentRect.width,h:en.contentRect.height});});if(containerRef.current)ro.observe(containerRef.current);return()=>ro.disconnect();},[]);
  const R=useMemo(()=>Math.min(dims.w,dims.h)*0.42*globeScale,[dims,globeScale]);const cx=dims.w/2,cy=dims.h/2;
  const proj=useCallback((lat,lon)=>orthoProject(lat,lon,rotation.lat,rotation.lon,R,cx,cy),[R,cx,cy,rotation]);

  const draw=useCallback(()=>{
    const cv=canvasRef.current;if(!cv)return;const ctx=cv.getContext("2d");const dpr=window.devicePixelRatio||1;
    cv.width=dims.w*dpr;cv.height=dims.h*dpr;ctx.scale(dpr,dpr);
    ctx.fillStyle="#111A24";ctx.fillRect(0,0,dims.w,dims.h);
    const gSh=ctx.createRadialGradient(cx+6,cy+14,R*0.85,cx+6,cy+14,R*1.2);gSh.addColorStop(0,"rgba(0,0,0,0.25)");gSh.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=gSh;ctx.fillRect(0,0,dims.w,dims.h);
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);const oG=ctx.createRadialGradient(cx-R*0.2,cy-R*0.25,R*0.05,cx,cy,R);
    oG.addColorStop(0,"#3CBAE0");oG.addColorStop(0.3,"#2AA6D4");oG.addColorStop(0.65,"#1E8AB8");oG.addColorStop(0.85,"#145F8A");oG.addColorStop(1,"#0A3A5C");ctx.fillStyle=oG;ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
    ctx.strokeStyle="rgba(255,255,255,0.05)";ctx.lineWidth=0.5;
    for(let lat=-80;lat<=80;lat+=20){ctx.beginPath();let s=false;for(let lon=-180;lon<=180;lon+=3){const p=proj(lat,lon);if(p){if(!s){ctx.moveTo(p.x,p.y);s=true;}else ctx.lineTo(p.x,p.y);}else s=false;}ctx.stroke();}
    for(let lon=-180;lon<=180;lon+=30){ctx.beginPath();let s=false;for(let lat=-90;lat<=90;lat+=3){const p=proj(lat,lon);if(p){if(!s){ctx.moveTo(p.x,p.y);s=true;}else ctx.lineTo(p.x,p.y);}else s=false;}ctx.stroke();}
    for(let fi=0;fi<feats.length;fi++){const f=feats[fi];const polys=f.type==="MultiPolygon"?f.coords:[f.coords];for(const poly of polys)for(const ring of poly){const segs=clipRing(ring,rotation.lat,rotation.lon,R,cx,cy);for(const seg of segs){const closeDist=Math.hypot(seg[seg.length-1].x-seg[0].x,seg[seg.length-1].y-seg[0].y);if(closeDist>R*0.5)continue;ctx.beginPath();ctx.moveTo(seg[0].x+3,seg[0].y+4);for(let i=1;i<seg.length;i++)ctx.lineTo(seg[i].x+3,seg[i].y+4);ctx.fillStyle="rgba(0,20,40,0.3)";ctx.fill();}}}
    for(let fi=0;fi<feats.length;fi++){const f=feats[fi];const colors=featColors[fi];const polys=f.type==="MultiPolygon"?f.coords:[f.coords];for(const poly of polys)for(const ring of poly){const segs=clipRing(ring,rotation.lat,rotation.lon,R,cx,cy);for(const seg of segs){const closeDist=Math.hypot(seg[seg.length-1].x-seg[0].x,seg[seg.length-1].y-seg[0].y);ctx.beginPath();ctx.moveTo(seg[0].x,seg[0].y);for(let i=1;i<seg.length;i++)ctx.lineTo(seg[i].x,seg[i].y);if(closeDist<=R*0.5){ctx.fillStyle=colors.fill;ctx.fill();}ctx.strokeStyle=colors.stroke;ctx.lineWidth=0.6;ctx.stroke();}}}
    const aG=ctx.createRadialGradient(cx-R*0.35,cy-R*0.35,0,cx,cy,R);aG.addColorStop(0,"rgba(255,255,255,0.08)");aG.addColorStop(0.4,"rgba(255,255,255,0.02)");aG.addColorStop(0.75,"rgba(0,0,0,0.02)");aG.addColorStop(1,"rgba(0,20,50,0.15)");ctx.fillStyle=aG;ctx.fillRect(0,0,dims.w,dims.h);
    ctx.restore();
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle="rgba(42,166,212,0.3)";ctx.lineWidth=2;ctx.stroke();
    const oGl=ctx.createRadialGradient(cx,cy,R-2,cx,cy,R+12);oGl.addColorStop(0,"rgba(42,166,212,0.12)");oGl.addColorStop(0.5,"rgba(42,166,212,0.04)");oGl.addColorStop(1,"rgba(42,166,212,0)");ctx.fillStyle=oGl;ctx.beginPath();ctx.arc(cx,cy,R+12,0,Math.PI*2);ctx.fill();
    const pinR=Math.max(8,Math.min(18,10*globeScale));
    for(const photo of photos){const p=proj(photo.lat,photo.lon);if(!p)continue;const sel=photo.id===selectedId,hov=photo.id===hovered.current;const r=sel?pinR*1.7:hov?pinR*1.3:pinR;
      if(sel){ctx.beginPath();ctx.arc(p.x,p.y,r+14,0,Math.PI*2);ctx.fillStyle="rgba(255,107,53,0.12)";ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y,r+7,0,Math.PI*2);ctx.fillStyle="rgba(255,107,53,0.18)";ctx.fill();}
      ctx.beginPath();ctx.arc(p.x+1,p.y+2,r+1,0,Math.PI*2);ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);const g=ctx.createRadialGradient(p.x-r*0.3,p.y-r*0.3,0,p.x,p.y,r);g.addColorStop(0,sel?"#FF9060":"#FF7A45");g.addColorStop(1,sel?"#E04D15":"#FF6B35");ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=sel?3.5:2.5;ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,r*0.28,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.85)";ctx.fill();
      if(sel||hov){const lbl=photo.city;ctx.font='600 12px "DM Sans",system-ui,sans-serif';const tw=ctx.measureText(lbl).width;const by=p.y-r-30;ctx.fillStyle="rgba(10,20,30,0.92)";ctx.beginPath();ctx.roundRect(p.x-tw/2-10,by,tw+20,26,8);ctx.fill();ctx.beginPath();ctx.moveTo(p.x-5,by+26);ctx.lineTo(p.x+5,by+26);ctx.lineTo(p.x,by+32);ctx.closePath();ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(lbl,p.x,by+13);}}
    if(loading){ctx.fillStyle="#8AD";ctx.font='500 14px "DM Sans",sans-serif';ctx.textAlign="center";ctx.fillText("Loading globe...",cx,cy);}
  },[dims,feats,featColors,photos,selectedId,rotation,R,cx,cy,proj,loading,globeScale]);

  useEffect(()=>{const f=requestAnimationFrame(draw);return()=>cancelAnimationFrame(f);},[draw]);
  const hitTest=useCallback((mx,my)=>{const pinR=Math.max(8,Math.min(18,10*globeScale));for(let i=photos.length-1;i>=0;i--){const p=proj(photos[i].lat,photos[i].lon);if(p&&Math.hypot(mx-p.x,my-p.y)<pinR+10)return photos[i].id;}return null;},[photos,proj,globeScale]);
  const onWheel=useCallback(e=>{e.preventDefault();onScaleChange(Math.max(0.5,Math.min(4,globeScale*(1-e.deltaY*0.001))));},[globeScale,onScaleChange]);
  const onMD=useCallback(e=>{dragging.current=true;dragMoved.current=false;lastM.current={x:e.clientX,y:e.clientY};canvasRef.current.style.cursor="grabbing";},[]);
  const onMM=useCallback(e=>{const r=canvasRef.current?.getBoundingClientRect();if(!r)return;if(dragging.current){const dx=e.clientX-lastM.current.x,dy=e.clientY-lastM.current.y;if(Math.abs(dx)>2||Math.abs(dy)>2)dragMoved.current=true;lastM.current={x:e.clientX,y:e.clientY};const s=0.3/globeScale;onRotate({lat:Math.max(-85,Math.min(85,rotation.lat+dy*s)),lon:rotation.lon-dx*s});}else{const mx=e.clientX-r.left,my=e.clientY-r.top;const h=hitTest(mx,my);if(h!==hovered.current){hovered.current=h;draw();}canvasRef.current.style.cursor=h?"pointer":"grab";}},[rotation,globeScale,onRotate,hitTest,draw]);
  const onMU=useCallback(()=>{dragging.current=false;if(canvasRef.current)canvasRef.current.style.cursor="grab";},[]);
  const onClick=useCallback(e=>{if(dragMoved.current)return;const r=canvasRef.current?.getBoundingClientRect();if(!r)return;onSelect(hitTest(e.clientX-r.left,e.clientY-r.top));},[hitTest,onSelect]);
  const lastT=useRef(null);const lastPD=useRef(null);const touchStart=useRef(null);
  const onTS=useCallback(e=>{if(e.touches.length===1){lastT.current={x:e.touches[0].clientX,y:e.touches[0].clientY};touchStart.current={...lastT.current};}else if(e.touches.length===2)lastPD.current=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);},[]);
  const onTM=useCallback(e=>{e.preventDefault();if(e.touches.length===1&&lastT.current){const dx=e.touches[0].clientX-lastT.current.x,dy=e.touches[0].clientY-lastT.current.y;lastT.current={x:e.touches[0].clientX,y:e.touches[0].clientY};const s=0.3/globeScale;onRotate({lat:Math.max(-85,Math.min(85,rotation.lat+dy*s)),lon:rotation.lon-dx*s});}else if(e.touches.length===2){const dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(lastPD.current)onScaleChange(Math.max(0.5,Math.min(4,globeScale*dist/lastPD.current)));lastPD.current=dist;}},[rotation,globeScale,onRotate,onScaleChange]);
  const onTE=useCallback(e=>{if(e.touches.length===0&&touchStart.current&&lastT.current&&Math.hypot(lastT.current.x-touchStart.current.x,lastT.current.y-touchStart.current.y)<10){const r=canvasRef.current?.getBoundingClientRect();if(r)onSelect(hitTest(lastT.current.x-r.left,lastT.current.y-r.top));}lastT.current=null;lastPD.current=null;touchStart.current=null;},[hitTest,onSelect]);
  return(<div ref={containerRef} style={{width:"100%",height:"100%",position:"relative"}}><canvas ref={canvasRef} style={{width:"100%",height:"100%",cursor:"grab",display:"block"}} onWheel={onWheel} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU} onClick={onClick} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}/></div>);
}

// ── Photo Detail ──
function PhotoDetail({photo,onClose,onLike,user}){
  const[fullscreen,setFullscreen]=useState(false);
  if(!photo)return null;
  if(fullscreen&&photo.image_url){return(<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setFullscreen(false)}><img src={photo.image_url} alt={photo.title} style={{maxWidth:"95vw",maxHeight:"95vh",objectFit:"contain",borderRadius:4}}/><button style={{position:"absolute",top:20,right:20,width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>);}
  return(<div style={{position:"absolute",top:0,right:0,width:420,height:"100%",background:"#0A1620",borderLeft:"1px solid #1A3040",zIndex:100,display:"flex",flexDirection:"column",animation:"slideIn 0.4s cubic-bezier(0.16,1,0.3,1)",overflowY:"auto",boxShadow:"-8px 0 40px rgba(0,0,0,0.3)"}}>
    <div style={{width:"100%",height:260,position:"relative",flexShrink:0,background:photo.image_url?`url(${photo.image_url}) center/cover`:"linear-gradient(135deg,#1A3040,#0D1F2D)"}}>
      {!photo.image_url&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"rgba(255,255,255,0.4)"}}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="4"/></svg><div style={{fontSize:12,marginTop:8}}>No image</div></div></div>}
      <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,backdropFilter:"blur(8px)"}}>×</button>
      {photo.image_url&&<button onClick={()=>setFullscreen(true)} style={{position:"absolute",top:14,right:56,width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg></button>}
      {photo.film_type?<div style={{position:"absolute",top:14,left:14,background:"rgba(232,98,42,0.85)",borderRadius:20,padding:"5px 12px",fontSize:10,color:"#fff",fontWeight:700,backdropFilter:"blur(8px)"}}>🎞 {photo.film_type}</div>:<div style={{position:"absolute",top:14,left:14,background:"rgba(34,197,94,0.25)",border:"1px solid rgba(34,197,94,0.5)",borderRadius:20,padding:"5px 12px",fontSize:10,color:"#fff",fontWeight:700,backdropFilter:"blur(8px)"}}>DIGITAL</div>}
    </div>
    <div style={{padding:"22px 24px 32px",flex:1}}>
      <h2 style={{fontSize:21,fontWeight:700,color:"#E0EEF4",margin:"0 0 4px",lineHeight:1.3}}>{photo.title}</h2>
      <div style={{fontSize:13,color:"#5A8CA8",display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span>{photo.city}, {photo.country}</span><span style={{color:"#1A3040"}}>·</span><span>{timeAgo(photo.created_at||photo.captured_at)}</span></div>
      <button onClick={()=>onLike(photo.id)} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid "+(photo.user_liked?"rgba(255,107,53,0.3)":"#1A3040"),background:photo.user_liked?"rgba(255,107,53,0.1)":"#0D1F2D",color:photo.user_liked?"#FF6B35":"#5A8CA8",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:20,transition:"all 0.2s"}}>{photo.user_liked?"♥":"♡"} {photo.like_count||0}</button>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:"#0D1F2D",borderRadius:12,marginBottom:22,border:"1px solid #1A3040"}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#ff9a6c)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,color:"#fff"}}>{(photo.photographer_name||"?").charAt(0)}</div>
        <div><div style={{fontSize:14,fontWeight:600,color:"#E0EEF4"}}>{photo.photographer_name||"Unknown"}</div><div style={{fontSize:11,color:"#5A8CA8"}}>@{photo.photographer_username||"user"}</div></div>
      </div>
      <div style={{fontSize:10,color:"#3A6080",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>Camera & Lens</div>
      <div style={{background:"rgba(255,107,53,0.08)",border:"1px solid rgba(255,107,53,0.15)",borderRadius:12,padding:"13px 16px",marginBottom:18}}><div style={{fontSize:16,fontWeight:700,color:"#FF6B35",marginBottom:2}}>{photo.camera}</div><div style={{fontSize:13,color:"#5A8CA8"}}>{photo.lens||"—"}</div>{photo.film_type&&<div style={{fontSize:12,color:"#E8622A",marginTop:4}}>Film: {photo.film_type}</div>}</div>
      <div style={{fontSize:10,color:"#3A6080",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>Settings</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {[{l:"Aperture",v:photo.aperture},{l:"Shutter",v:photo.shutter_speed},{l:"ISO",v:photo.iso},{l:"Focal",v:photo.focal_length},{l:"Flash",v:photo.flash},{l:"WB",v:photo.white_balance}].map(b=>
          <div key={b.l} style={{background:"#0D1F2D",borderRadius:10,padding:"10px 14px",border:"1px solid #1A3040"}}><span style={{fontSize:10,color:"#5A8CA8",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{b.l}</span><div style={{fontSize:15,color:"#E0EEF4",fontWeight:600,fontFamily:"'Space Mono',monospace",marginTop:3}}>{b.v||"—"}</div></div>)}
      </div>
      {photo.tags?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:22}}>{photo.tags.map(t=><span key={t} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,background:"#0D1F2D",color:"#5A8CA8",border:"1px solid #1A3040"}}>#{t}</span>)}</div>}
      <div style={{fontSize:12,color:"#3A6080",borderTop:"1px solid #1A3040",paddingTop:14}}>{photo.captured_at?"Captured "+fmtDate(photo.captured_at):"Uploaded "+fmtDate(photo.created_at)}</div>
    </div>
  </div>);
}

// ── Location Autocomplete (OpenStreetMap Nominatim) ──
function LocationSearch({onSelect,style}){
  const[query,setQuery]=useState("");const[results,setResults]=useState([]);const[loading,setLoading]=useState(false);const[selected,setSelected]=useState(null);
  const debounceRef=useRef(null);

  const search=useCallback((q)=>{
    if(q.length<2){setResults([]);return;}
    setLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,{headers:{"Accept-Language":"en"}})
      .then(r=>r.json()).then(data=>{
        setResults(data.map(d=>{
          const city=d.address?.city||d.address?.town||d.address?.village||d.address?.hamlet||d.address?.municipality||d.address?.county||"";
          const state=d.address?.state||"";
          const country=d.address?.country||"";
          return{display:d.display_name,lat:parseFloat(d.lat),lon:parseFloat(d.lon),city,state,country};
        }));
        setLoading(false);
      }).catch(()=>setLoading(false));
  },[]);

  const handleChange=(e)=>{
    const v=e.target.value;setQuery(v);setSelected(null);
    if(debounceRef.current)clearTimeout(debounceRef.current);
    debounceRef.current=setTimeout(()=>search(v),350);
  };

  const handleSelect=(r)=>{
    setSelected(r);setQuery(r.display);setResults([]);
    onSelect(r);
  };

  return(<div style={{position:"relative",marginBottom:14}}>
    <div style={{position:"relative"}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A8CA8" strokeWidth="2" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <input value={query} onChange={handleChange} placeholder="Search a city or address..." style={{...style,paddingLeft:38}}/>
      {loading&&<div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50)",fontSize:12,color:"#5A8CA8"}}>...</div>}
    </div>
    {selected&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"rgba(42,166,212,0.08)",border:"1px solid rgba(42,166,212,0.2)",fontSize:12,color:"#2AA6D4",display:"flex",alignItems:"center",gap:6}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      {selected.city}{selected.state?`, ${selected.state}`:""}, {selected.country} <span style={{color:"#3A6080",marginLeft:"auto"}}>{selected.lat.toFixed(4)}, {selected.lon.toFixed(4)}</span>
    </div>}
    {results.length>0&&!selected&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,background:"#0A1620",border:"1px solid #1A3040",borderRadius:10,marginTop:4,overflow:"hidden",boxShadow:"0 12px 40px rgba(0,0,0,0.4)",maxHeight:240,overflowY:"auto"}}>
      {results.map((r,i)=><div key={i} onClick={()=>handleSelect(r)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #1A3040",fontSize:13,color:"#E0EEF4",display:"flex",alignItems:"flex-start",gap:8}} onMouseOver={e=>e.currentTarget.style.background="rgba(42,166,212,0.08)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A8CA8" strokeWidth="2" style={{marginTop:2,flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div style={{minWidth:0}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.display}</div></div>
      </div>)}
    </div>}
  </div>);
}

// ── Upload Modal ──
function UploadModal({onClose,onUpload,user}){
  const[imgFile,setImgFile]=useState(null);const[imgPreview,setImgPreview]=useState(null);
  const[title,setTitle]=useState("");const[lat,setLat]=useState("");const[lon,setLon]=useState("");
  const[city,setCity]=useState("");const[country,setCountry]=useState("");
  const[camera,setCamera]=useState("");const[lens,setLens]=useState("");const[filmType,setFilmType]=useState("");
  const[aperture,setAperture]=useState("");const[shutter,setShutter]=useState("");const[iso,setIso]=useState("");
  const[focalLength,setFocalLength]=useState("");const[tags,setTags]=useState("");
  const[location,setLocation]=useState(null);
  const handleLocation=(loc)=>{setLocation(loc);setLat(loc.lat.toString());setLon(loc.lon.toString());setCity(loc.city||loc.state||"Unknown");setCountry(loc.country||"Unknown");};
  const[step,setStep]=useState(1);const[uploading,setUploading]=useState(false);const[success,setSuccess]=useState(false);const[error,setError]=useState(null);
  const fileRef=useRef(null);

  const handleFile=(f)=>{if(!f)return;setImgFile(f);setImgPreview(URL.createObjectURL(f));};

  const handleSubmit=async()=>{
    setUploading(true);setError(null);
    try{
      let image_url=null;
      if(imgFile){
        const ext=imgFile.name.split('.').pop();
        const path=`${user.id}/${Date.now()}.${ext}`;
        const{error:uploadErr}=await supabase.storage.from('photos').upload(path,imgFile);
        if(uploadErr)throw uploadErr;
        const{data}=supabase.storage.from('photos').getPublicUrl(path);
        image_url=data.publicUrl;
      }
      const{error:insertErr}=await supabase.from('photos').insert({
        user_id:user.id,title,lat:parseFloat(lat),lon:parseFloat(lon),city,country,
        image_url,camera,lens:lens||null,film_type:filmType||null,
        aperture:aperture||null,shutter_speed:shutter||null,iso:iso||null,
        focal_length:focalLength||null,flash:"Off",white_balance:"Auto",
        tags:tags.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean),
        captured_at:new Date().toISOString()
      });
      if(insertErr)throw insertErr;
      setSuccess(true);onUpload();setTimeout(onClose,1500);
    }catch(e){setError(e.message);}
    setUploading(false);
  };

  const iS={background:"#0D1F2D",border:"1px solid #1A3040",borderRadius:10,padding:"11px 14px",color:"#E0EEF4",fontSize:14,outline:"none",width:"100%",fontFamily:"'DM Sans',sans-serif"};
  const lS={fontSize:11,color:"#5A8CA8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,display:"block"};

  return(<div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,10,20,0.6)",backdropFilter:"blur(20px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{width:560,maxHeight:"92vh",background:"#0A1620",borderRadius:24,border:"1px solid #1A3040",overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.4)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"24px 28px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div><h3 style={{fontSize:20,fontWeight:700,color:"#E0EEF4",margin:0}}>{success?"Published!":"Upload Photo"}</h3><p style={{fontSize:12,color:"#5A8CA8",margin:"4px 0 0"}}>{success?"On the globe":step===1?"Photo & location":"Camera details"}</p></div>
        <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"#0D1F2D",border:"1px solid #1A3040",color:"#5A8CA8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
      {!success&&<div style={{display:"flex",gap:8,padding:"0 28px 16px"}}>{[1,2].map(s=><div key={s} style={{flex:1,height:3,borderRadius:2,background:step>=s?"#2AA6D4":"#1A3040",transition:"all 0.3s"}}/>)}</div>}
      <div style={{padding:"0 28px 28px",overflowY:"auto",flex:1}}>
        {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#ef4444"}}>{error}</div>}
        {success?(<div style={{textAlign:"center",padding:"40px 0"}}><div style={{width:64,height:64,borderRadius:"50%",background:"rgba(34,197,94,0.1)",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="32" height="32" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div><div style={{fontSize:18,fontWeight:700,color:"#E0EEF4"}}>Published!</div></div>)
        :step===1?(<div>
          <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed "+(imgPreview?"#2AA6D4":"#1A3040"),borderRadius:16,height:imgPreview?180:120,cursor:"pointer",background:imgPreview?`url(${imgPreview}) center/cover`:"#0D1F2D",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,position:"relative",overflow:"hidden"}}>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>handleFile(e.target.files?.[0])} style={{display:"none"}}/>
            {!imgPreview&&<div style={{textAlign:"center"}}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3A6080" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg><div style={{fontSize:13,color:"#5A8CA8",marginTop:8}}>Click to add photo</div></div>}
          </div>
          <label><span style={lS}>Photo Title *</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Name your photo" style={{...iS,marginBottom:14}}/></label>
          <span style={lS}>Location *</span>
          <LocationSearch onSelect={handleLocation} style={iS}/>
          <button onClick={()=>setStep(2)} disabled={!title||!location} style={{width:"100%",padding:"14px",borderRadius:12,background:(title&&location)?"linear-gradient(135deg,#2AA6D4,#1E8AB8)":"#1A3040",color:(title&&location)?"#fff":"#3A6080",border:"none",fontWeight:700,cursor:(title&&location)?"pointer":"not-allowed",fontSize:14}}>Next →</button>
        </div>)
        :(<div>
          <label><span style={lS}>Camera *</span><input value={camera} onChange={e=>setCamera(e.target.value)} placeholder="Canon AE-1" style={{...iS,marginBottom:14}}/></label>
          <label><span style={lS}>Lens</span><input value={lens} onChange={e=>setLens(e.target.value)} placeholder="FD 50mm f/1.4" style={{...iS,marginBottom:14}}/></label>
          <label><span style={lS}>Film Stock (blank = digital)</span><input value={filmType} onChange={e=>setFilmType(e.target.value)} placeholder="Kodak Portra 400" style={{...iS,marginBottom:14}}/></label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}><label><span style={lS}>Aperture</span><input value={aperture} onChange={e=>setAperture(e.target.value)} placeholder="ƒ/2.8" style={iS}/></label><label><span style={lS}>Shutter</span><input value={shutter} onChange={e=>setShutter(e.target.value)} placeholder="1/125s" style={iS}/></label></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}><label><span style={lS}>ISO</span><input value={iso} onChange={e=>setIso(e.target.value)} placeholder="400" style={iS}/></label><label><span style={lS}>Focal Length</span><input value={focalLength} onChange={e=>setFocalLength(e.target.value)} placeholder="50mm" style={iS}/></label></div>
          <label><span style={lS}>Tags</span><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="landscape, film, travel" style={{...iS,marginBottom:20}}/></label>
          <div style={{display:"flex",gap:10}}><button onClick={()=>setStep(1)} style={{padding:"14px 20px",borderRadius:12,background:"#0D1F2D",color:"#5A8CA8",border:"1px solid #1A3040",fontWeight:600,cursor:"pointer"}}>←</button><button onClick={handleSubmit} disabled={!camera||uploading} style={{flex:1,padding:"14px",borderRadius:12,background:camera?"linear-gradient(135deg,#FF6B35,#ff8c5a)":"#1A3040",color:camera?"#fff":"#3A6080",border:"none",fontWeight:700,cursor:camera?"pointer":"not-allowed",opacity:uploading?0.6:1}}>{uploading?"Uploading...":"Publish"}</button></div>
        </div>)}
      </div>
    </div>
  </div>);
}

function PhotoListItem({photo,selected,onClick}){
  return(<div onClick={onClick} style={{display:"flex",gap:14,padding:"12px 14px",cursor:"pointer",borderRadius:12,background:selected?"rgba(42,166,212,0.08)":"transparent",border:selected?"1px solid rgba(42,166,212,0.2)":"1px solid transparent",transition:"all 0.15s"}} onMouseOver={e=>{if(!selected)e.currentTarget.style.background="rgba(255,255,255,0.03)";}} onMouseOut={e=>{if(!selected)e.currentTarget.style.background="transparent";}}>
    <div style={{width:52,height:52,borderRadius:10,flexShrink:0,border:"1px solid #1A3040",overflow:"hidden",background:photo.image_url?`url(${photo.image_url}) center/cover`:photoGradient(photo.id)}}/>
    <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:selected?"#2AA6D4":"#E0EEF4",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{photo.title}</div><div style={{fontSize:11,color:"#5A8CA8",marginBottom:3}}>{photo.city}, {photo.country}</div><div style={{fontSize:10,color:"#3A6080",fontFamily:"'Space Mono',monospace"}}>{photo.camera}{photo.film_type?" · 🎞":""}</div></div>
  </div>);
}

function GlobeNav({onNavigate}){
  return(<div style={{position:"absolute",top:0,left:0,right:0,zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 20px",pointerEvents:"none"}}>
    <div style={{display:"flex",gap:4,background:"rgba(10,22,32,0.85)",borderRadius:12,padding:"4px",border:"1px solid #1A3040",backdropFilter:"blur(12px)",pointerEvents:"auto"}}>
      {[{id:"home",label:"Home"},{id:"how",label:"How It Works"},{id:"deals",label:"Deals"},{id:"globe",label:"Globe",active:true},{id:"about",label:"About"},{id:"contact",label:"Get Started"}].map(t=>(
        <button key={t.id} onClick={()=>onNavigate&&onNavigate(t.id)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:t.active?"rgba(42,166,212,0.2)":"transparent",color:t.active?"#2AA6D4":"#5A8CA8",fontSize:12,fontWeight:t.active?700:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.label}</button>
      ))}
    </div>
  </div>);
}

// ── Main ──
export default function PhotoGlobe({onNavigate}){
  const[photos,setPhotos]=useState([]);const[selectedId,setSelectedId]=useState(null);
  const[showUpload,setShowUpload]=useState(false);const[showAuth,setShowAuth]=useState(false);
  const[filter,setFilter]=useState("all");const[search,setSearch]=useState("");
  const[rotation,setRotation]=useState({lat:20,lon:-20});const[globeScale,setGlobeScale]=useState(1);const[sidebar,setSidebar]=useState(true);
  const[user,setUser]=useState(null);const[userLikes,setUserLikes]=useState(new Set());

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session)setUser(session.user);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setUser(session?.user||null);});
    return()=>subscription.unsubscribe();
  },[]);

  // Load photos
  const loadPhotos=useCallback(async()=>{
    const{data,error}=await supabase.from('photos_with_likes').select('*').order('created_at',{ascending:false});
    if(!error&&data)setPhotos(data);
  },[]);

  useEffect(()=>{loadPhotos();},[loadPhotos]);

  // Load user likes
  useEffect(()=>{
    if(!user)return;
    supabase.from('likes').select('photo_id').eq('user_id',user.id).then(({data})=>{
      if(data)setUserLikes(new Set(data.map(l=>l.photo_id)));
    });
  },[user,photos]);

  const photosWithLikes=useMemo(()=>photos.map(p=>({...p,user_liked:userLikes.has(p.id)})),[photos,userLikes]);

  const handleLike=async(photoId)=>{
    if(!user){setShowAuth(true);return;}
    const liked=userLikes.has(photoId);
    if(liked){
      await supabase.from('likes').delete().eq('user_id',user.id).eq('photo_id',photoId);
      setUserLikes(prev=>{const n=new Set(prev);n.delete(photoId);return n;});
    }else{
      await supabase.from('likes').insert({user_id:user.id,photo_id:photoId});
      setUserLikes(prev=>new Set(prev).add(photoId));
    }
    loadPhotos();
  };

  const handleUploadClick=()=>{if(!user){setShowAuth(true);}else{setShowUpload(true);}};

  const sel=photosWithLikes.find(p=>p.id===selectedId);
  const filtered=useMemo(()=>{let r=photosWithLikes;if(filter!=="all")r=r.filter(p=>p.tags?.includes(filter));if(search){const q=search.toLowerCase();r=r.filter(p=>p.title?.toLowerCase().includes(q)||p.city?.toLowerCase().includes(q)||p.country?.toLowerCase().includes(q)||p.camera?.toLowerCase().includes(q));}return r;},[photosWithLikes,filter,search]);
  const allTags=useMemo(()=>[...new Set(photos.flatMap(p=>p.tags||[]))].sort(),[photos]);
  const stats=useMemo(()=>({p:photos.length,c:new Set(photos.map(p=>p.country)).size,cam:new Set(photos.map(p=>p.camera)).size}),[photos]);
  // No auto-rotation - just open the detail panel and highlight the pin

  return(<div style={{width:"100vw",height:"100vh",background:"#111A24",fontFamily:"'DM Sans',system-ui,sans-serif",display:"flex",overflow:"hidden",position:"relative",color:"#E0EEF4"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0A1620}::-webkit-scrollbar-thumb{background:#1A3040;border-radius:3px}input::placeholder{color:#3A6080}input:focus{border-color:rgba(42,166,212,0.5)!important}`}</style>

    <div style={{width:sidebar?340:0,flexShrink:0,background:"#0A1620",borderRight:sidebar?"1px solid #1A3040":"none",display:"flex",flexDirection:"column",transition:"width 0.3s",overflow:"hidden",zIndex:50}}>
      <div style={{padding:"22px 20px 14px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2AA6D4,#1E8AB8)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
            <div><div style={{fontSize:18,fontWeight:800,color:"#E0EEF4"}}>AE-1 World</div><div style={{fontSize:10,color:"#3A6080",fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>Film & Digital Photos</div></div>
          </div>
          {user?<button onClick={()=>supabase.auth.signOut()} style={{padding:"6px 12px",borderRadius:8,background:"#0D1F2D",border:"1px solid #1A3040",color:"#5A8CA8",fontSize:11,cursor:"pointer"}}>Sign Out</button>
          :<button onClick={()=>setShowAuth(true)} style={{padding:"6px 12px",borderRadius:8,background:"rgba(42,166,212,0.15)",border:"1px solid rgba(42,166,212,0.3)",color:"#2AA6D4",fontSize:11,fontWeight:600,cursor:"pointer"}}>Sign In</button>}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>{[{l:"Photos",v:stats.p},{l:"Countries",v:stats.c},{l:"Cameras",v:stats.cam}].map(s=>(<div key={s.l} style={{flex:1,padding:"9px 10px",borderRadius:10,background:"#0D1F2D",border:"1px solid #1A3040",textAlign:"center"}}><div style={{fontSize:17,fontWeight:800,color:"#2AA6D4",fontFamily:"'Space Mono',monospace"}}>{s.v}</div><div style={{fontSize:9,color:"#3A6080",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{s.l}</div></div>))}</div>
        <div style={{position:"relative",marginBottom:10}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3A6080" strokeWidth="2" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"10px 14px 10px 36px",background:"#0D1F2D",border:"1px solid #1A3040",borderRadius:10,color:"#E0EEF4",fontSize:13,outline:"none"}}/></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}><button onClick={()=>setFilter("all")} style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:filter==="all"?"rgba(42,166,212,0.15)":"#0D1F2D",color:filter==="all"?"#2AA6D4":"#3A6080",border:filter==="all"?"1px solid rgba(42,166,212,0.3)":"1px solid #1A3040",cursor:"pointer"}}>All</button>{allTags.slice(0,8).map(t=><button key={t} onClick={()=>setFilter(filter===t?"all":t)} style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:filter===t?"rgba(42,166,212,0.15)":"#0D1F2D",color:filter===t?"#2AA6D4":"#3A6080",border:filter===t?"1px solid rgba(42,166,212,0.3)":"1px solid #1A3040",cursor:"pointer"}}>#{t}</button>)}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 6px 16px"}}>{filtered.length===0&&photos.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"#3A6080"}}><div style={{fontSize:32,marginBottom:12}}>🌍</div><div style={{fontSize:14,marginBottom:4}}>No photos yet</div><div style={{fontSize:12}}>Be the first to upload!</div></div>:filtered.map(p=><PhotoListItem key={p.id} photo={p} selected={selectedId===p.id} onClick={()=>setSelectedId(selectedId===p.id?null:p.id)}/>)}</div>
      <div style={{padding:"14px 20px",flexShrink:0,borderTop:"1px solid #1A3040"}}><button onClick={handleUploadClick} style={{width:"100%",padding:"13px",borderRadius:12,background:"linear-gradient(135deg,#FF6B35,#ff8c5a)",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 20px rgba(255,107,53,0.25)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Upload Photo</button></div>
    </div>

    <div style={{flex:1,position:"relative",overflow:"hidden"}}>
      <GlobeNav onNavigate={onNavigate}/>
      <button onClick={()=>setSidebar(!sidebar)} style={{position:"absolute",top:60,left:20,zIndex:40,width:40,height:40,borderRadius:10,background:"rgba(10,22,32,0.8)",border:"1px solid #1A3040",color:"#5A8CA8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{sidebar?<path d="M15 18l-6-6 6-6"/>:<path d="M9 18l6-6-6-6"/>}</svg></button>
      <div style={{position:"absolute",bottom:24,right:24,zIndex:40,display:"flex",flexDirection:"column",gap:6}}>{[{label:"+",fn:()=>setGlobeScale(s=>Math.min(4,s*1.3))},{label:"−",fn:()=>setGlobeScale(s=>Math.max(0.5,s/1.3))},{label:"⌂",fn:()=>{setGlobeScale(1);setRotation({lat:20,lon:-20});}}].map((b,i)=>(<button key={i} onClick={b.fn} style={{width:40,height:40,borderRadius:10,background:"rgba(10,22,32,0.8)",border:"1px solid #1A3040",color:"#5A8CA8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,backdropFilter:"blur(10px)"}} onMouseOver={e=>e.currentTarget.style.background="rgba(42,166,212,0.15)"} onMouseOut={e=>e.currentTarget.style.background="rgba(10,22,32,0.8)"}>{b.label}</button>))}</div>
      <div style={{position:"absolute",bottom:24,left:20,zIndex:40,display:"flex",gap:16,padding:"10px 16px",borderRadius:12,background:"rgba(10,22,32,0.8)",border:"1px solid #1A3040",backdropFilter:"blur(10px)",fontSize:11,color:"#5A8CA8"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:"#FF6B35",border:"2px solid #fff"}}/>Photo</div><div style={{color:"#3A6080"}}>Drag to rotate</div></div>
      <GlobeCanvas photos={filtered} selectedId={selectedId} onSelect={id=>setSelectedId(selectedId===id?null:id)} rotation={rotation} onRotate={setRotation} globeScale={globeScale} onScaleChange={setGlobeScale}/>
      {sel&&<PhotoDetail photo={sel} onClose={()=>setSelectedId(null)} onLike={handleLike} user={user}/>}
    </div>
    {showUpload&&user&&<UploadModal onClose={()=>setShowUpload(false)} onUpload={loadPhotos} user={user}/>}
    {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={()=>{loadPhotos();}}/>}
  </div>);
}
