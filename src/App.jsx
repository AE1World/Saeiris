import { useState, useEffect, useRef, useCallback } from "react";
import PhotoGlobe from "./photoglobe";

const isMobile = window.innerWidth < 768;

const SECTIONS = ["Home","How It Works","Travel Guides","About","Get Started"];
const DARK_SECTIONS = [false,false,false,true,false];

function SectionNav({active,onNav}){
  const isDark=DARK_SECTIONS[active];
  const accent="#C8956C";
  const inactiveColor=isDark?"rgba(255,255,255,0.3)":"rgba(42,36,32,0.3)";
  const inactiveDot=isDark?"rgba(255,255,255,0.2)":"rgba(42,36,32,0.2)";
  return(
    <div style={{position:"fixed",left:16,top:"50%",transform:"translateY(-50%)",zIndex:100,display:"flex",flexDirection:"column",gap:20,alignItems:"flex-start",padding:"14px 16px 14px 12px",borderRadius:12,background:isDark?"rgba(20,16,12,0.22)":"rgba(253,251,248,0.32)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",border:isDark?"1px solid rgba(200,149,108,0.08)":"1px solid rgba(200,149,108,0.15)",transition:"background 0.4s, border 0.4s"}}>
      {SECTIONS.map((s,i)=>(
        <button key={s} onClick={()=>onNav(i)} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:0}}>
          <div style={{width:active===i?10:6,height:active===i?10:6,borderRadius:"50%",background:active===i?accent:inactiveDot,transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",boxShadow:active===i?"0 0 12px rgba(200,149,108,0.4)":"none"}}/>
          <span style={{fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:active===i?accent:inactiveColor,transition:"all 0.4s",fontFamily:"'Cormorant Garamond',serif",whiteSpace:"nowrap"}}>{s}</span>
        </button>
      ))}
    </div>
  );
}

function GlobeTab({onClick,dark}){
  return(
    <button onClick={onClick} style={{position:"fixed",top:28,right:32,zIndex:100,display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:40,background:dark?"rgba(15,25,35,0.7)":"rgba(42,36,32,0.7)",border:"1px solid rgba(200,149,108,0.25)",color:"#C8956C",cursor:"pointer",backdropFilter:"blur(16px)",fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Cormorant Garamond',serif",transition:"all 0.3s"}}
      onMouseOver={e=>{e.currentTarget.style.background="rgba(200,149,108,0.15)";e.currentTarget.style.borderColor="rgba(200,149,108,0.5)";}}
      onMouseOut={e=>{e.currentTarget.style.background=dark?"rgba(15,25,35,0.7)":"rgba(42,36,32,0.7)";e.currentTarget.style.borderColor="rgba(200,149,108,0.25)";}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
      Globe
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 1: HERO
// ══════════════════════════════════════════════════════════════
function HeroSectionMobile({onGlobe}){
  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section visible":undefined}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/hero-mobile.png')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#F5F0EB"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(245,240,235,0.45) 0%,rgba(245,240,235,0.1) 30%,transparent 60%)"}}/>
      <div style={{position:"absolute",top:"22%",left:"50%",transform:"translateX(-50%)",zIndex:10,textAlign:"center",whiteSpace:"nowrap"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:0,fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,lineHeight:1,letterSpacing:"-0.02em"}}>
          <span style={{color:"#2A2420"}}>S</span><span style={{color:"#C8956C",fontWeight:400}}>ae1</span><span style={{color:"#2A2420",fontStyle:"italic"}}>ris</span>
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"#8A7A68",marginTop:6,whiteSpace:"nowrap",textAlign:"center"}}>Curated travel · Captured on film</div>
      </div>
      <button onClick={onGlobe} style={{position:"absolute",top:56,right:24,zIndex:10,display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:40,background:"rgba(42,36,32,0.65)",border:"1px solid rgba(200,149,108,0.3)",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        Globe
      </button>
      <div style={{position:"absolute",bottom:60,left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:"#8A7A68",opacity:0.8}}>Scroll</span>
        <div style={{width:1,height:28,background:"linear-gradient(to bottom,rgba(138,122,104,0.8),transparent)"}}/>
      </div>
    </section>
  );
}

function HeroSection({onGlobe}){
  if(isMobile)return <HeroSectionMobile onGlobe={onGlobe}/>;
  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section":undefined}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/hero-bg.png')",backgroundSize:"cover",backgroundPosition:"center bottom",backgroundColor:"#F5F0EB"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(245,240,235,0.55) 0%,rgba(245,240,235,0.2) 35%,transparent 55%)"}}/>
      </div>
      <div style={{position:"absolute",top:28,left:60,zIndex:2}}>
        <div style={{display:"flex",alignItems:"baseline",gap:0}}>
          <div style={{fontSize:72,fontWeight:300,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.02em",lineHeight:1}}>
            <span style={{color:"#2A2420"}}>S</span><span style={{color:"#C8956C",fontWeight:400}}>ae1</span><span style={{color:"#2A2420",fontStyle:"italic"}}>ris</span>
          </div>
        </div>
        <div style={{fontSize:12,letterSpacing:"0.3em",textTransform:"uppercase",color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",marginTop:3,marginLeft:1}}>Curated travel · Captured on film</div>
      </div>
      <div style={{position:"absolute",top:"30%",left:"37.66%",transform:"translateY(-50%)",textAlign:"center",zIndex:2}}>
        <h1 style={{fontSize:"clamp(38px,5.5vw,72px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.08,margin:0,letterSpacing:"-0.02em"}}>
          Your Journey.<br/><span style={{fontStyle:"italic",fontWeight:400,color:"#C8956C"}}>On Film.</span>
        </h1>
        <div style={{width:40,height:1,background:"#C8956C",margin:"24px auto 0"}}/>
      </div>
      <div style={{position:"absolute",bottom:36,left:"48.43%",display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0.4,zIndex:2}}>
        <span style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif"}}>Scroll</span>
        <div style={{width:1,height:24,background:"linear-gradient(to bottom,#8A7A68,transparent)"}}/>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 2: HOW IT WORKS
// ══════════════════════════════════════════════════════════════
function ServiceModal({service,onClose}){
  if(!service)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,18,15,0.4)",backdropFilter:"blur(10px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:580,maxHeight:"80vh",background:"#FDFBF8",borderRadius:16,overflow:"hidden",boxShadow:"0 40px 120px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"36px 36px 32px"}}>
          <h3 style={{fontSize:30,fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 6px"}}>{service.title}</h3>
          <div style={{width:32,height:1,background:"#C8956C",margin:"12px 0 20px"}}/>
          <p style={{fontSize:17,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:"0 0 20px"}}>{service.desc}</p>
          {service.details&&service.details.map((d,i)=>(
            <div key={i} style={{padding:"14px 16px",background:"rgba(200,149,108,0.05)",border:"1px solid rgba(200,149,108,0.1)",marginBottom:10}}>
              <div style={{fontSize:15,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{d.title}</div>
              <div style={{fontSize:14.5,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.6}}>{d.text}</div>
            </div>
          ))}
          <button onClick={onClose} style={{marginTop:16,padding:"12px 28px",background:"#2A2420",color:"#F5F0EB",border:"none",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.3s"}}
            onMouseOver={e=>e.currentTarget.style.background="#C8956C"}
            onMouseOut={e=>e.currentTarget.style.background="#2A2420"}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const SERVICES=[
  {title:"Join the Globe",desc:"Your developed photos join our interactive PhotoGlobe — a growing, living map of real travel moments captured on real film cameras by real travelers.",
    details:[
      {title:"How It Works",text:"After your trip, send back the Canon AE-1. We develop your film, scan each frame in high resolution, and upload your best shots to the PhotoGlobe with your name and destination."},
      {title:"Your Legacy",text:"Every pin on the globe is a real moment from a real trip. Your photos become part of a worldwide community of analog travelers."},
    ]},
  {title:"Full-Service Planning",desc:"We handle every detail of your trip — flights, accommodations, excursions, restaurant reservations, and local transportation. You just show up and be present.",
    details:[
      {title:"What's Included",text:"Round-trip flights & airport transfers · Hand-picked boutique hotels & Airbnbs · Custom day-by-day itinerary · Restaurant reservations with menu picks · Emergency travel support 24/7"},
      {title:"Our Approach",text:"We negotiate directly with hosts and local operators to get you the best rates. Every itinerary is custom-built based on your interests, pace, and budget."},
    ]},
  {title:"Canon AE-1 Experience",desc:"Before every trip, we ship a vintage Canon AE-1 loaded with a fresh roll of Kodak UltraMax 400 to your door. 36 exposures. No filters. No edits. Just you and the world.",
    details:[
      {title:"What You Get",text:"A fully serviced 1976 Canon AE-1 with 50mm f/1.8 lens · One roll of Kodak UltraMax 400 (36 exposures) · A quick-start guide for film beginners · Prepaid return shipping label"},
      {title:"After Your Trip",text:"Ship the camera back to us. We develop your film, scan every frame at high resolution, and deliver your photos digitally within 2 weeks. The best shots join the Globe."},
    ]},
];

function HowItWorksSectionMobile(){
  const[activeService,setActiveService]=useState(null);
  const CARD_SERVICES=[
    {num:"01",title:"Join the Globe",desc:"Your developed photos join our interactive PhotoGlobe — a living map of real travel moments captured on real film cameras by real travelers.",serviceIdx:0},
    {num:"02",title:"Full-Service Planning",desc:"We handle every detail of your trip — flights, accommodations, excursions, restaurant reservations, and local transportation. You just show up.",serviceIdx:1},
    {num:"03",title:"Canon AE-1 Experience",desc:"Before every trip, a fully serviced 1976 Canon AE-1 loaded with Kodak UltraMax 400 ships to your door. 36 exposures. No filters. No edits.",serviceIdx:2},
  ];
  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0,display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/howitworks-mobile.png')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#F5F0EB"}}/>
      <div style={{position:"absolute",inset:0,background:"rgba(245,240,235,0.25)"}}/>
      <div style={{position:"relative",zIndex:1,padding:"0 28px",overflowY:"auto",maxHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{marginBottom:28,paddingTop:48}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",marginBottom:10}}>How It Works</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:"#2A2420",lineHeight:1.15,margin:0}}>
            Not Just a Trip.<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>A Memory</span> You Can Hold.
          </h2>
          <div style={{width:36,height:1,background:"#C8956C",marginTop:16}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {CARD_SERVICES.map((c)=>(
            <div key={c.num} style={{background:"rgba(253,251,248,0.93)",borderLeft:"3px solid #C8956C",padding:"18px 20px",boxShadow:"0 4px 24px rgba(42,36,32,0.10),0 1px 4px rgba(42,36,32,0.06)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"#C8956C",marginBottom:6}}>{c.num}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:400,color:"#2A2420",marginBottom:8}}>{c.title}</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"#6A5A48",lineHeight:1.75,margin:"0 0 12px"}}>{c.desc}</p>
              <button onClick={()=>setActiveService(SERVICES[c.serviceIdx])}
                style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#C8956C",background:"transparent",border:"none",padding:0,cursor:"pointer"}}>
                Learn More →
              </button>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.5,marginTop:28,paddingBottom:48}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:"#8A7A68"}}>Scroll</span>
          <div style={{width:1,height:24,background:"linear-gradient(to bottom,#8A7A68,transparent)"}}/>
        </div>
      </div>
      <ServiceModal service={activeService} onClose={()=>setActiveService(null)}/>
    </section>
  );
}

function HowItWorksSection(){
  if(isMobile)return <HowItWorksSectionMobile/>;

  const[activeService,setActiveService]=useState(null);
  const[hoveredIdx,setHoveredIdx]=useState(null);

  // ── DEBUG MODE ──────────────────────────────────────────────
  // Set to true to show draggable/resizable/rotatable hotspot boxes.
  // Drag boxes onto the props, then click "Copy Positions" and paste
  // the output back to Claude. Set to false when done.
  const debug=false;

  const[hotspots,setHotspots]=useState([
    {left:-6.39,top:49.35,width:45.36,height:62.61,rotation:-14,serviceIdx:0},
    {left:59.11,top:15.34,width:32.24,height:23.7,rotation:0.7,serviceIdx:1},
    {left:66.94,top:66.45,width:20.73,height:17.22,rotation:13.6,serviceIdx:2},
  ]);

  const containerRef=useRef(null);
  const dragging=useRef(null);

  const onMouseDown=(i,e,mode='move')=>{
    if(!debug)return;
    e.preventDefault();e.stopPropagation();
    dragging.current={i,mode,startX:e.clientX,startY:e.clientY,orig:{...hotspots[i]}};
  };

  // Rotation handle drag
  const onRotateDown=(i,e)=>{
    if(!debug)return;
    e.preventDefault();e.stopPropagation();
    const el=containerRef.current;if(!el)return;
    const r=el.getBoundingClientRect();
    const h=hotspots[i];
    const cx=r.left+(h.left+h.width/2)/100*r.width;
    const cy=r.top+(h.top+h.height/2)/100*r.height;
    dragging.current={i,mode:'rotate',cx,cy,startAngle:Math.atan2(e.clientY-cy,e.clientX-cx)*(180/Math.PI)-h.rotation};
  };

  const onMouseMove=useCallback((e)=>{
    if(!debug||!dragging.current)return;
    const{i,mode,startX,startY,orig,cx,cy,startAngle}=dragging.current;
    const el=containerRef.current;if(!el)return;
    const r=el.getBoundingClientRect();
    const dx=(e.clientX-startX)/r.width*100;
    const dy=(e.clientY-startY)/r.height*100;
    setHotspots(prev=>prev.map((p,idx)=>{
      if(idx!==i)return p;
      if(mode==='move') return{...p,left:Math.round((orig.left+dx)*100)/100,top:Math.round((orig.top+dy)*100)/100};
      if(mode==='resize-r') return{...p,width:Math.max(1,Math.round((orig.width+dx)*100)/100)};
      if(mode==='resize-l') return{...p,left:Math.round((orig.left+dx)*100)/100,width:Math.max(1,Math.round((orig.width-dx)*100)/100)};
      if(mode==='resize-b') return{...p,height:Math.max(1,Math.round((orig.height+dy)*100)/100)};
      if(mode==='resize-t') return{...p,top:Math.round((orig.top+dy)*100)/100,height:Math.max(1,Math.round((orig.height-dy)*100)/100)};
      if(mode==='resize-br') return{...p,width:Math.max(1,Math.round((orig.width+dx)*100)/100),height:Math.max(1,Math.round((orig.height+dy)*100)/100)};
      if(mode==='rotate'){
        const angle=Math.atan2(e.clientY-cy,e.clientX-cx)*(180/Math.PI);
        return{...p,rotation:Math.round((angle-startAngle)*10)/10};
      }
      return p;
    }));
  },[debug]);

  const onMouseUp=useCallback(()=>{dragging.current=null;},[]);

  useEffect(()=>{
    if(!debug)return;
    window.addEventListener('mousemove',onMouseMove);
    window.addEventListener('mouseup',onMouseUp);
    return()=>{window.removeEventListener('mousemove',onMouseMove);window.removeEventListener('mouseup',onMouseUp);};
  },[debug,onMouseMove,onMouseUp]);

  const copyPositions=()=>{
    const txt=hotspots.map((h,i)=>`Hotspot ${i+1}: left=${h.left}, top=${h.top}, width=${h.width}, height=${h.height}, rotation=${h.rotation}`).join('\n');
    navigator.clipboard.writeText(txt);
    alert('Positions copied!\n\n'+txt);
  };

  const LABELS=["Map → Join the Globe","Boarding Pass → Full-Service Planning","Sunglasses → Canon AE-1 Experience"];

  return(
    <section ref={containerRef} style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section":undefined}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/howitworks-bg.png')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#F8F4F0"}}/>

      {/* Debug controls */}
      {debug&&<>
        <button onClick={copyPositions} style={{position:"absolute",top:10,right:10,zIndex:300,padding:"8px 18px",background:"#FF6B35",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>Copy Positions</button>
        <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"6px 14px",background:"rgba(42,36,32,0.85)",borderRadius:6,color:"#F5F0EB",fontSize:12,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em"}}>DEBUG MODE — drag boxes onto props, use handles to resize/rotate</div>
      </>}

      <div style={{position:"absolute",top:"50%",left:"33.94%",transform:"translateY(-50%)",textAlign:"center",zIndex:2,pointerEvents:"none"}}>
        <h2 style={{fontSize:"clamp(30px,4.5vw,52px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.15,margin:0,textShadow:"0 2px 20px rgba(248,244,240,1), 0 0 40px rgba(248,244,240,0.8)"}}>
          Not Just a Trip.<br/><span style={{fontStyle:"italic",fontWeight:400,color:"#C8956C"}}>A Memory</span> You Can Hold.
        </h2>
      </div>
      <div style={{position:"absolute",top:"2.34%",left:"41.68%",textAlign:"center",zIndex:2,pointerEvents:"none"}}>
        <p style={{fontSize:13,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",textShadow:"0 1px 8px rgba(248,244,240,0.9)"}}>Click the objects to learn more</p>
      </div>

      {hotspots.map((h,i)=>(
        <div key={i}
          onMouseDown={(e)=>onMouseDown(i,e)}
          onClick={()=>!debug&&setActiveService(SERVICES[h.serviceIdx])}
          onMouseEnter={()=>!debug&&setHoveredIdx(i)}
          onMouseLeave={()=>!debug&&setHoveredIdx(null)}
          style={{position:"absolute",left:h.left+"%",top:h.top+"%",width:h.width+"%",height:h.height+"%",transform:`rotate(${h.rotation}deg)`,zIndex:debug?50:1,cursor:debug?"move":"pointer",borderRadius:6,transition:debug?"none":"all 0.4s ease",
            boxShadow:debug?"0 0 0 2px #FF6B35, inset 0 0 0 1px rgba(255,107,53,0.3)":hoveredIdx===i?"0 0 30px rgba(200,149,108,0.4), inset 0 0 30px rgba(200,149,108,0.08)":"none",
            background:debug?"rgba(255,107,53,0.12)":hoveredIdx===i?"rgba(200,149,108,0.08)":"transparent",
            border:debug?"none":hoveredIdx===i?"1px solid rgba(200,149,108,0.25)":"1px solid transparent"}}>

          {/* Debug: label */}
          {debug&&<div style={{position:"absolute",top:4,left:4,background:"#FF6B35",color:"#fff",fontSize:10,padding:"2px 6px",borderRadius:4,fontWeight:700,pointerEvents:"none",whiteSpace:"nowrap"}}>{LABELS[i]}</div>}

          {/* Debug: live position readout */}
          {debug&&<div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:9,padding:"2px 5px",borderRadius:3,pointerEvents:"none",whiteSpace:"nowrap"}}>L:{h.left} T:{h.top} W:{h.width} H:{h.height} R:{h.rotation}°</div>}

          {/* Debug: right resize handle */}
          {debug&&<div onMouseDown={(e)=>onMouseDown(i,e,'resize-r')} style={{position:"absolute",right:-5,top:"15%",width:10,height:"70%",background:"#FF6B35",cursor:"ew-resize",zIndex:60,borderRadius:3}} onClick={e=>e.stopPropagation()}/>}
          {/* Debug: left resize handle */}
          {debug&&<div onMouseDown={(e)=>onMouseDown(i,e,'resize-l')} style={{position:"absolute",left:-5,top:"15%",width:10,height:"70%",background:"#FF6B35",cursor:"ew-resize",zIndex:60,borderRadius:3}} onClick={e=>e.stopPropagation()}/>}
          {/* Debug: bottom resize handle */}
          {debug&&<div onMouseDown={(e)=>onMouseDown(i,e,'resize-b')} style={{position:"absolute",bottom:-5,left:"15%",height:10,width:"70%",background:"#FF6B35",cursor:"ns-resize",zIndex:60,borderRadius:3}} onClick={e=>e.stopPropagation()}/>}
          {/* Debug: top resize handle */}
          {debug&&<div onMouseDown={(e)=>onMouseDown(i,e,'resize-t')} style={{position:"absolute",top:-5,left:"15%",height:10,width:"70%",background:"#FF6B35",cursor:"ns-resize",zIndex:60,borderRadius:3}} onClick={e=>e.stopPropagation()}/>}
          {/* Debug: bottom-right corner */}
          {debug&&<div onMouseDown={(e)=>onMouseDown(i,e,'resize-br')} style={{position:"absolute",bottom:-7,right:-7,width:14,height:14,background:"#fff",border:"2px solid #FF6B35",cursor:"nwse-resize",zIndex:60,borderRadius:3}} onClick={e=>e.stopPropagation()}/>}
          {/* Debug: rotation handle (circle at top center) */}
          {debug&&<div onMouseDown={(e)=>onRotateDown(i,e)} style={{position:"absolute",top:-22,left:"50%",transform:"translateX(-50%)",width:14,height:14,background:"#fff",border:"2px solid #FF6B35",cursor:"crosshair",zIndex:60,borderRadius:"50%"}} onClick={e=>e.stopPropagation()}/>}

          {/* Normal hover label */}
          {!debug&&hoveredIdx===i&&<div style={{position:"absolute",bottom:"105%",left:"50%",transform:"translateX(-50%) rotate("+(-h.rotation)+"deg)",whiteSpace:"nowrap",padding:"6px 14px",background:"rgba(42,36,32,0.85)",backdropFilter:"blur(8px)",borderRadius:6,boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>
            <span style={{fontSize:12,fontWeight:600,color:"#F5F0EB",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em"}}>{SERVICES[h.serviceIdx].title}</span>
          </div>}
        </div>
      ))}
      <ServiceModal service={activeService} onClose={()=>setActiveService(null)}/>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 3: TRAVEL GUIDES
// ══════════════════════════════════════════════════════════════
const GUIDES=[
  {city:"Madrid",country:"Spain",img:"/Madrid.png",tagline:"Tapas, plazas & golden light",budget:"$2,800 – $4,200",duration:"7 nights",highlight:"Rooftop sunset at Círculo de Bellas Artes"},
  {city:"Tuscany",country:"Italy",img:"/Tuscany.png",tagline:"Rolling hills & Chianti roads",budget:"$3,200 – $5,000",duration:"7 nights",highlight:"Private vineyard tasting in Montalcino"},
  {city:"Kauai",country:"Hawaii",img:"/Kauai.png",tagline:"The Garden Isle, untouched",budget:"$3,500 – $5,500",duration:"7 nights",highlight:"Nā Pali Coast helicopter tour at sunrise"},
  {city:"Hvar",country:"Croatia",img:"/Hvar.png",tagline:"Lavender, stone & Adriatic blue",budget:"$2,400 – $3,800",duration:"7 nights",highlight:"Sunset kayak to the Pakleni Islands"},
  {city:"Seattle",country:"USA",img:"https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=928&q=80",tagline:"Coffee, rain & emerald views",budget:"$1,800 – $3,000",duration:"7 nights",highlight:"Ferry ride to Bainbridge Island"},
  {city:"Rome",country:"Italy",img:"/Rome.png",tagline:"Eternal city, timeless film",budget:"$2,600 – $4,400",duration:"7 nights",highlight:"Private twilight Colosseum tour"},
];

// ── Cost breakdown rows (what we handle — no dollar amounts) ──
const COST_BREAKDOWN_ITEMS = [
  {l:"Flights (Round Trip)"},
  {l:"Accommodation"},
  {l:"Dining & Drinks"},
  {l:"Experiences & Excursions"},
  {l:"Shopping"},
  {l:"Transportation"},
];

// ── Full slide data per city ──
const GUIDE_SLIDES = {

  Madrid: {
    heroImg:"https://images.unsplash.com/photo-1574556462575-eb106a5865a0?w=900&q=80",
    slides:[
      {
        type:"overview",
        tagline:"Tapas, plazas & golden light",
        intro:"Madrid rewards the curious traveler — a city of late nights, world-class art, and streets that feel made for wandering. We handle every detail from the moment you land so you arrive with nothing to do but fall in love with it.",
        stats:[
          {l:"Duration",v:"7 Nights"},
          {l:"Best Season",v:"Spring & Fall (Apr–Jun, Sep–Nov)"},
          {l:"Language",v:["Spanish","English (6/10)"]},
          {l:"Flight Time",v:["NY ~8 hrs","LA ~11 hrs","Miami ~9 hrs"]},
        ],
      },
      {
        type:"investment",
        title:"Investment",
        tip:"We begin monitoring flight prices up to nine months in advance, using a combination of fare trend tools and airline alerts to identify the optimal booking window. Most of our clients save between $200 and $500 on flights alone — simply by letting us watch the market on their behalf.",
        tiers:[
          {name:"Explorer",desc:"Madrid is your playground. You're here to move — through the markets, the backstreets, the late-night bars, and the plazas that don't fill up until midnight. The stay is simple; the rest is yours."},
          {name:"Comfort",desc:"A well-appointed base in the right neighborhood, curated dining at the spots worth finding, and a thoughtful itinerary that gives structure without taking away the spontaneity that makes Madrid feel alive."},
          {name:"Curated",desc:"Every detail considered, every moment arranged. Private transfers, hand-selected accommodation, exclusive access to the city's finest experiences, and a personal concierge — so the only thing left to do is show up."},
        ],
        breakdown:COST_BREAKDOWN_ITEMS,
      },
      {
        type:"stays",
        title:"Where You'll Stay",
        intro:"Every property we recommend has been personally evaluated for location, character, and quality of service. We match your style — whether that's a sleek design hotel steps from the Prado or a century-old townhouse in the heart of La Latina.",
        options:[
          {name:"Private Room in Bed & Breakfast",type:"Explorer",desc:"A reimagined 19th-century building with a rooftop pool, steps from the city's great art museums. Our most recommended property for first-time visitors to Madrid.",link:"https://www.airbnb.com/rooms/44697269"},
          {name:"Coqueto in San Miguel Market",type:"Comfort",desc:"A beautifully restored apartment in the tapas district, complete with a private terrace and neighborhood charm. Perfect for couples who want to feel genuinely local.",link:"https://www.airbnb.com/rooms/1255434400355072597"},
          {name:"Rosewood Villa Magna",type:"Curated",desc:"A former ducal palace turned five-star hotel, steps from the Royal Palace. The kind of property that makes every arrival feel like an occasion.",link:"https://www.rosewoodhotels.com/en/villa-magna"},
        ],
      },
      {
        type:"experiences",
        title:"Experiences",
        intro:"We curate a handful of signature experiences that most visitors to Madrid never discover on their own — each one arranged in advance, so you simply show up.",
        list:[
          {name:"Authentic Flamenco Show",desc:"An evening of genuine flamenco — raw, emotional, and nothing like the tourist versions. Arranged at an intimate venue where the art form is still treated with the respect it deserves.",link:"https://www.airbnb.com/experiences/3055740"},
          {name:"Paella, Sangria & Churros Making Class",desc:"A hands-on session learning three of Spain's most beloved dishes with a local host — ideal for travelers who want to bring a piece of Madrid home with them.",link:"https://www.airbnb.com/experiences/6932067"},
          {name:"Royal Palace — Skip The Line Guided Tour",desc:"A guided tour through the Royal Palace of Madrid with skip-the-line access — one of Europe's most opulent royal residences, walked with someone who knows every room's story.",link:"https://www.viator.com/tours/Madrid/Madrid-Royal-Palace-Guided-Tour-with-Skip-The-Line-Tickets/d566-340934P5"},
        ],
      },
      {
        type:"film",
        title:"On Film",
        city:"Madrid",
      },
    ],
  },

  Tuscany: {
    heroImg:"https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=900&q=80",
    slides:[
      {
        type:"overview",
        tagline:"Rolling hills, harvest light & unhurried roads",
        intro:"Tuscany is the Italy people dream about before they've ever been — and the one they spend the rest of their lives trying to return to. We design your time here around the landscape, the table, and the kind of slowness that only comes when every detail has already been handled.",
        stats:[
          {l:"Duration",v:"7 Nights"},
          {l:"Best Season",v:"Spring & Fall (Apr–May, Sep–Oct)"},
          {l:"Language",v:["Italian","English (5/10)"]},
          {l:"Flight Time",v:["NY ~9 hrs","LA ~12 hrs","Miami ~10 hrs"]},
        ],
      },
      {
        type:"investment",
        title:"Investment",
        tip:"We begin tracking fares to Florence and Pisa up to nine months in advance. Tuscany is a destination where booking early — both flights and stays — can make a significant difference, particularly during harvest season in September and October when demand peaks across the region.",
        tiers:[
          {name:"Explorer",desc:"Tuscany at your own pace. You're here for the countryside, the wine, the unmarked roads, and the villages most people drive past. The stay is simple; everything else follows wherever the day leads."},
          {name:"Comfort",desc:"A vineyard estate or boutique hotel with soul, paired with curated experiences and a thoughtful itinerary that moves between the landscape and the table at the right pace."},
          {name:"Curated",desc:"Every detail considered, every moment arranged. A private villa with dedicated staff, exclusive winery access, a personal driver, and an itinerary built to show you the Tuscany most visitors never reach."},
        ],
        breakdown:COST_BREAKDOWN_ITEMS,
      },
      {
        type:"stays",
        title:"Where You'll Stay",
        intro:"In Tuscany, the property is part of the experience. We select places with soul — where the breakfast comes from the farm out back, the views are worth waking up for, and the host can tell you exactly where to eat in the village.",
        options:[
          {name:"Farmhouse near Florence",type:"Explorer",desc:"A working farm turned intimate retreat in the rolling hills south of Siena — expect homegrown olive oil at breakfast and complete silence at night.",link:"https://www.airbnb.com/rooms/7001093"},
          {name:"Tuscany House in the Countryside",type:"Comfort",desc:"A restored stone apartment in one of Tuscany's most beautiful hilltop towns, with terracotta floors, original beams, and a terrace overlooking the valley.",link:"https://www.airbnb.com/rooms/1486089282126756297"},
          {name:"Villa di Piazzano",type:"Curated",desc:"A medieval village converted into one of Tuscany's most extraordinary retreats — spa, Michelin-recognized restaurant, private vineyard, and a level of quiet luxury that is genuinely rare.",link:"https://www.villadipiazzano.com/en/"},
        ],
      },
      {
        type:"experiences",
        title:"Experiences",
        intro:"We build your Tuscany itinerary around the moments most travelers never get to — private access, local relationships, and experiences that aren't listed anywhere online.",
        list:[
          {name:"Authentic Tuscan Cooking Class",desc:"A hands-on cooking class in a traditional Tuscan kitchen — fresh pasta, seasonal ingredients, and the kind of recipes that have been passed down for generations.",link:"https://www.airbnb.com/experiences/177281"},
          {name:"Small-Group Wine Tasting in the Tuscan Countryside",desc:"A guided tasting through some of Tuscany's finest estates — Chianti, Brunello, and Super Tuscans — in the countryside that produced them.",link:"https://www.viator.com/tours/Florence/Small-Group-Wine-Tasting-Experience-in-the-Tuscan-Countryside/d519-5292P25"},
          {name:"Florence & Tuscan Hills Vespa Tour with Italian Meal",desc:"A Vespa ride through the Florentine hills and Chianti wine country, stopping for a full Italian meal along the way. One of the most cinematic ways to see this landscape.",link:"https://www.viator.com/tours/Florence/Florence-Vespa-Tour-Tuscan-Hills-and-Italian-Cuisine/d519-5070FLORENCEVESPA"},
        ],
      },
      {
        type:"film",
        title:"On Film",
        city:"Tuscany",
      },
    ],
  },

  Kauai: {
    heroImg:"https://images.unsplash.com/photo-1542309174-d33b34ce6ea7?w=900&q=80",
    slides:[
      {
        type:"overview",
        tagline:"The Garden Isle — raw, green & unhurried",
        intro:"Kauai doesn't perform for you. It simply exists — ancient cliffs, waterfalls that appear from nowhere, and coastlines so untouched they feel like a secret. We plan every detail so you can move through it slowly, camera in hand, without a single thing left to arrange.",
        stats:[
          {l:"Duration",v:"7 Nights"},
          {l:"Best Season",v:"Spring & Fall (Apr–Jun, Sep–Oct)"},
          {l:"Language",v:["English","English (10/10)"]},
          {l:"Flight Time",v:["NY ~11 hrs","LA ~6 hrs","Miami ~11 hrs"]},
        ],
      },
      {
        type:"investment",
        title:"Investment",
        tip:"Direct flights from the West Coast make Kauai one of the more accessible destinations in our collection. From New York or Miami, a single connection through Los Angeles or San Francisco adds minimal time. We monitor inter-island and mainland fares from the moment you inquire, and we know the windows when prices drop significantly.",
        tiers:[
          {name:"Explorer",desc:"Kauai is meant to be explored on your terms. You're here for the trails, the hidden beaches, the waterfalls you earn, and the sunsets nobody plans for. A well-placed rental and the freedom to go wherever the island pulls you."},
          {name:"Comfort",desc:"A premium oceanfront property on your preferred side of the island, curated activity planning, and a daily rhythm that makes sure you don't miss what matters — with room to breathe between."},
          {name:"Curated",desc:"Every detail considered, every moment arranged. A private villa, dedicated concierge, helicopter and boat tours pre-booked, and an itinerary built entirely around what you want — nothing more, nothing less."},
        ],
        breakdown:COST_BREAKDOWN_ITEMS,
      },
      {
        type:"stays",
        title:"Where You'll Stay",
        intro:"Kauai's best properties aren't in the guidebooks — they're the ones with unobstructed ocean views, private access to the beach, and enough space to actually feel the island rather than just sleep near it.",
        options:[
          {name:"Guest Suite in Princeville",type:"Explorer",desc:"A thoughtfully appointed suite on Kauai's lush North Shore — well-placed for both beach access and island exploration, with the kind of calm that makes mornings here feel unhurried.",link:"https://www.airbnb.com/rooms/15590432"},
          {name:"Hanalei Bay Cottage",type:"Comfort",desc:"A private cottage tucked into the lush North Shore, within walking distance of Hanalei Bay's legendary crescent beach. Mornings here feel like they belong somewhere further from the modern world.",link:"https://www.airbnb.com/rooms/52826629"},
          {name:"1 Hotel Hanalei Bay",type:"Curated",desc:"Perched above Hanalei Bay with sweeping mountain and ocean views, this is one of the most beautifully positioned properties in all of Hawaii — refined, unhurried, and deeply connected to the landscape.",link:"https://www.1hotels.com/hanalei-bay"},
        ],
      },
      {
        type:"experiences",
        title:"Experiences",
        intro:"Kauai rewards those who know where to look. We plan a small number of extraordinary experiences that most visitors to the island never access — each arranged well in advance.",
        list:[
          {name:"Private Surf Lesson for Beginners",desc:"A private lesson with a local instructor on one of Kauai's most welcoming breaks — no experience needed, just a willingness to get in the water and try something that might surprise you.",link:"https://www.airbnb.com/experiences/2732272"},
          {name:"Nā Pali Coast Power Catamaran Tour",desc:"The iconic sea cliffs of the Nā Pali Coast — 4,000-foot walls of ancient lava dropping into the Pacific — seen from the water on a powerful catamaran. One of the defining experiences of Kauai.",link:"https://www.viator.com/tours/Kauai/Deluxe-Power-Catamaran/d670-382914P6"},
          {name:"Private Kauai Helicopter Experience — Doors Off",desc:"The entire island from the air, doors off, all window seats — the waterfalls, the valleys, the coastline, and the interior wilderness that no trail can reach. Nothing else puts you closer to Kauai.",link:"https://www.viator.com/tours/Kauai/Kauai-The-Kauai-Experience/d670-71933P1"},
        ],
      },
      {
        type:"film",
        title:"On Film",
        city:"Kauai",
      },
    ],
  },

  Hvar: {
    heroImg:"https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900&q=80",
    slides:[
      {
        type:"overview",
        tagline:"Lavender fields, stone towns & the Adriatic at its finest",
        intro:"Hvar is one of Europe's most beautifully kept secrets — an island of ancient walled towns, lavender-covered hillsides, and water so clear it redefines what blue can mean. We take care of every logistical detail, including the ferry, so you arrive ready for nothing but presence.",
        stats:[
          {l:"Duration",v:"7 Nights"},
          {l:"Best Season",v:"Late Spring & Early Fall (May–Jun, Sep–Oct)"},
          {l:"Language",v:["Croatian","English (8/10)"]},
          {l:"Flight Time",v:["NY ~9 hrs to Split + ferry","LA ~14 hrs","Miami ~12 hrs"]},
        ],
      },
      {
        type:"investment",
        title:"Investment",
        tip:"United Airlines launched direct service from Newark to Split in 2026, making Hvar more accessible from New York than ever before — roughly nine hours in the air, with a short ferry connection to the island. From the West Coast or Miami, a single European hub connection is typically the most efficient routing. We track fares and advise on the right booking window for your departure city.",
        tiers:[
          {name:"Explorer",desc:"Hvar rewards the curious. You're here to wander the old town, find the coves nobody else does, and eat wherever the locals eat. A stone apartment and a few good recommendations are all you need."},
          {name:"Comfort",desc:"A sea-view property, curated dining at the right konobas, ferry logistics handled, and a plan that balances activity with genuine rest — Hvar is best enjoyed without rushing."},
          {name:"Curated",desc:"Every detail considered, every moment arranged. A private villa above the Pakleni Islands, a dedicated concierge, a private boat charter, and an itinerary that keeps the best of Hvar to yourself."},
        ],
        breakdown:COST_BREAKDOWN_ITEMS,
      },
      {
        type:"stays",
        title:"Where You'll Stay",
        intro:"In Hvar, where you stay shapes everything. We select properties that put you inside the texture of the island — old stone, sea breezes, and the kind of quiet that only comes when the right details have been arranged.",
        options:[
          {name:"Guest Suite in Hvar",type:"Explorer",desc:"A restored Dalmatian stone suite within the 13th-century walls of Hvar Town — cool interior, private terrace, and a five-minute walk to the harbor at any hour.",link:"https://www.airbnb.com/rooms/6631187"},
          {name:"Apartment Mama Marija",type:"Comfort",desc:"An intimate apartment in Hvar's oldest town, tucked into a narrow alley lined with bougainvillea. Quiet, considered, and far enough from the summer crowds to feel like a discovery.",link:"https://www.airbnb.com/rooms/1144953954926285969"},
          {name:"Hotel Moeesy — Blue & Green Oasis",type:"Curated",desc:"A hillside retreat above Hvar Town with panoramic Adriatic views and absolute privacy — the kind of property that makes leaving feel genuinely difficult.",link:"https://moeesy.com/"},
        ],
      },
      {
        type:"experiences",
        title:"Experiences",
        intro:"Hvar's most memorable moments aren't in the tourist brochures. We arrange access to the ones that take local knowledge and advance planning.",
        list:[
          {name:"Blue Cave & Pakleni Islands Speedboat Tour",desc:"A full-day speedboat tour through the Pakleni Islands and into the luminous Blue Cave — one of the most visually stunning natural wonders on the Adriatic coast.",link:"https://www.airbnb.com/experiences/504001"},
          {name:"Wine Tasting at a Hilltop Family Winery",desc:"A round trip to a family-run winery perched above the island — Hvar's indigenous plavac mali grape, volcanic soil, and the kind of setting that makes the wine taste even better.",link:"https://www.viator.com/tours/Hvar/Wine-Tasting-Round-Trip-from-Hvar-Family-Winery-at-a-Hilltop/d22146-310667P4"},
          {name:"Half-Day Sailing to the Pakleni Islands",desc:"A half-day on a modern 36ft yacht, sailing out to the Pakleni Islands — hidden coves, clear Adriatic water, and the kind of afternoon that makes you want to extend your stay.",link:"https://www.viator.com/tours/Hvar/Sail-and-escape-to-Pakleni-islands-Half-day-sailing-on-a-modern-36ft-sail-yacht/d22146-45311P18"},
        ],
      },
      {
        type:"film",
        title:"On Film",
        city:"Hvar",
      },
    ],
  },

  Seattle: {
    heroImg:"https://images.unsplash.com/photo-1535581652167-3a26c90bbf86?w=900&q=80",
    slides:[
      {
        type:"overview",
        tagline:"Coffee, emerald water & a city that earns its rain",
        intro:"Seattle is the kind of city that surprises people — dramatic mountain backdrops, a serious food scene, and water in every direction. Whether you're visiting for the first time or rediscovering it through fresh eyes, we build an experience here that goes far beyond the usual itinerary.",
        stats:[
          {l:"Duration",v:"7 Nights"},
          {l:"Best Season",v:"Summer (Jun–Sep)"},
          {l:"Language",v:["English","English (10/10)"]},
          {l:"Flight Time",v:["NY ~5.5 hrs","LA ~2.5 hrs","Miami ~5 hrs"]},
        ],
      },
      {
        type:"investment",
        title:"Investment",
        tip:"Seattle is one of the most accessible destinations in our collection — direct flights from virtually every major U.S. city, with no international connections required. We focus our energy on the ground experience: securing the right property, the right reservations, and the right moments that most visitors to Seattle never find.",
        tiers:[
          {name:"Explorer",desc:"Seattle is a city built for wandering. You're here for the neighborhoods, the coffee shops, the ferry views, and days with no fixed plan. A well-located apartment and your curiosity are the only itinerary you need."},
          {name:"Comfort",desc:"A premium hotel or stylish rental in the heart of the city, curated dining at Seattle's best tables, and a daily rhythm that makes the most of the long summer light."},
          {name:"Curated",desc:"Every detail considered, every moment arranged. A waterfront property or top hotel, private tours, exclusive access experiences, and a personal concierge for the full duration of your stay."},
        ],
        breakdown:COST_BREAKDOWN_ITEMS,
      },
      {
        type:"stays",
        title:"Where You'll Stay",
        intro:"Seattle's best neighborhoods each have a distinct personality. We match your property to your pace — whether you want to be in the middle of everything or tucked away somewhere with a view of the water.",
        options:[
          {name:"Private Garden Cottage",type:"Explorer",desc:"A charming private cottage tucked into one of Seattle's most walkable neighborhoods — surrounded by independent coffee shops, wine bars, and the city's best restaurant scene.",link:"https://www.airbnb.com/rooms/7800238"},
          {name:"Private Retreat with Rooftop Sauna & Shower",type:"Comfort",desc:"A beautifully designed private retreat in the heart of the city, with a rooftop sauna and outdoor shower — the kind of stay that turns the end of every day into something to look forward to.",link:"https://www.airbnb.com/rooms/17575412"},
          {name:"Four Seasons Hotel Seattle",type:"Curated",desc:"Downtown Seattle's finest hotel — floor-to-ceiling views of Elliott Bay, refined service, and a location that puts everything the city has to offer within easy reach.",link:"https://www.fourseasons.com/seattle/"},
        ],
      },
      {
        type:"experiences",
        title:"Experiences",
        intro:"Seattle's best experiences require local knowledge. We arrange the ones that residents take years to discover.",
        list:[
          {name:"Mt. Rainier National Park Full-Day Nature Tour",desc:"A full day in one of America's most dramatic national parks — ancient glaciers, wildflower meadows, old-growth forest, and a mountain that dominates the skyline from nearly 100 miles away.",link:"https://www.viator.com/tours/Seattle/Mt-Rainier-Day-Trip-from-Seattle/d704-3657RAINIER"},
          {name:"Chef-Guided Food Tour of Pike Place Market",desc:"A guided morning walk through Pike Place with a local chef before the crowds arrive — from the flower vendors to the fishmongers to the family-run stalls that have been here for generations.",link:"https://www.viator.com/tours/Seattle/Chef-Guided-Food-Tour-of-Pike-Place-Market/d704-23161P1"},
          {name:"Seattle Half-Day Whale Watching Cruise",desc:"A half-day on the water searching for orca, humpback, and minke whales in the Salish Sea — with the Olympic Mountains in the distance and Seattle's skyline behind you.",link:"https://www.viator.com/tours/Seattle/Seattle-Whale-Watching-Tour-Half-Day/d704-5113P19"},
        ],
      },
      {
        type:"film",
        title:"On Film",
        city:"Seattle",
      },
    ],
  },

  Rome: {
    heroImg:"https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=900&q=80",
    slides:[
      {
        type:"overview",
        tagline:"The Eternal City",
        intro:"Rome is one of our most sought-after destinations — a city where nearly 3,000 years of history exist on the same street corner as your morning espresso. We handle every detail, from flights to the final dinner reservation, so you arrive with nothing to do but be present and let the city reveal itself.",
        stats:[
          {l:"Duration",v:"7 Nights"},
          {l:"Best Season",v:"Spring & Fall (Apr–May, Sep–Oct)"},
          {l:"Language",v:["Italian","English (6/10)"]},
          {l:"Flight Time",v:["NY ~9 hrs","LA ~12 hrs","Miami ~10 hrs"]},
        ],
      },
      {
        type:"investment",
        title:"Investment",
        tip:"We begin tracking fares to Rome up to nine months in advance, using a combination of airline tools and price trend data to identify the optimal booking window. Most of our clients save between $200 and $500 on flights alone — simply by letting us monitor the market on their behalf.",
        tiers:[
          {name:"Explorer",desc:"Rome is your city. You're here to get lost in it — the side streets of Trastevere, the morning markets, the piazzas that buzz until 2am. The stay is simple and well-placed; everything else is wide open."},
          {name:"Comfort",desc:"A boutique hotel or premium apartment in the right neighborhood, curated dining at the trattorias worth finding, and a daily itinerary that gives direction without taking away the magic of discovery."},
          {name:"Curated",desc:"Every detail considered, every moment arranged. Luxury accommodation, private transfers, exclusive access to Rome's greatest sites, and a personal concierge — Rome the way most visitors never see it."},
        ],
        breakdown:COST_BREAKDOWN_ITEMS,
      },
      {
        type:"stays",
        title:"Where You'll Stay",
        intro:"The right neighborhood changes everything in Rome. We select properties based on character, location, and the quality of what's immediately around you — because in this city, your street is as important as your room.",
        options:[
          {name:"Boutique Colosseum Hideaway",type:"Explorer",desc:"A highly-rated bed and breakfast positioned directly beside the Colosseum — affordable, full of character, and the ideal base for exploring the ancient city on foot.",link:"https://www.airbnb.com/rooms/1356583421912597734"},
          {name:"The Nook under the Colosseum's Shadow",type:"Comfort",desc:"A complete loft in a traditional Roman alleyway in the heart of the city — full kitchen, morning light, and the kind of neighborhood rhythm that makes you feel like a local within two days.",link:"https://www.airbnb.com/rooms/1409274854260723534"},
          {name:"Orient Express La Minerva",type:"Curated",desc:"A 17th-century palace on Piazza della Minerva, reimagined as one of Rome's most extraordinary hotels — ancient columns, a rooftop restaurant seven stories above the city, and an address that speaks for itself.",link:"https://www.orient-express.com/en/hotel/europe/italy/rome/la-minerva"},
        ],
      },
      {
        type:"experiences",
        title:"Experiences",
        intro:"Rome's greatest experiences require access, timing, and the right guide. We arrange each one in advance so you arrive to find it already waiting.",
        list:[
          {name:"Colosseum Arena Floor — Gladiator's Gate Access",desc:"Privileged entry through the Gladiator's Gate and onto the Arena Floor itself — standing at the center of a nearly 2,000-year-old amphitheater in the place where history was made. Not available to standard visitors.",link:"https://theromanguy.com/tours/italy/rome/colosseum-tour-arena-floor?itemlistname=the%20best%20rome%20tours&itemlistid=32&index=1"},
          {name:"Trastevere After Dark — Local Food Tour",desc:"A private evening walk through Rome's most atmospheric neighborhood — street foods, local wines, artisan cheeses, and a traditional Roman dinner at a table that doesn't take walk-ins.",link:"https://theromanguy.com/tours/italy/rome/trastevere-food-tour?itemlistname=the%20best%20rome%20tours&itemlistid=32&index=11"},
          {name:"Pompeii & Sorrento Day Trip by Train",desc:"A private guided day south of Rome — Sorrento's clifftop piazzas and limoncello above the Bay of Naples, followed by a skip-the-line expert tour through the ancient streets of Pompeii, frozen in 79 AD.",link:"https://theromanguy.com/tours/italy/rome/pompeii-sorrento-day-trip-from-rome?guests=1&itemlistname=the%20best%20rome%20tours&itemlistid=32&index=22"},
        ],
      },
      {
        type:"film",
        title:"On Film",
        city:"Rome",
      },
    ],
  },

};

// ── GuideModal ──
function GuideModalMobile({guide,onClose}){
  const[slide,setSlide]=useState(0);
  useEffect(()=>{setSlide(0);},[guide]);
  useEffect(()=>{
    const el=document.documentElement;
    const body=document.body;
    const prevElOverflow=el.style.overflow;
    const prevBodyOverflow=body.style.overflow;
    el.style.overflow='hidden';
    body.style.overflow='hidden';
    // Also find and lock any scrolling parent
    const scrollParent=document.querySelector('[style*="overflow: scroll"], [style*="overflow:scroll"]');
    let prevScrollOverflow='';
    if(scrollParent){prevScrollOverflow=scrollParent.style.overflowY;scrollParent.style.overflowY='hidden';}
    return()=>{
      el.style.overflow=prevElOverflow;
      body.style.overflow=prevBodyOverflow;
      if(scrollParent)scrollParent.style.overflowY=prevScrollOverflow;
    };
  },[]);
  if(!guide)return null;
  const cityData=GUIDE_SLIDES[guide.city];
  const slides=cityData?cityData.slides:[];
  const heroImg=cityData?.heroImg||guide.img;
  const curr=slides[slide];
  const font="'Cormorant Garamond',serif";
  const accent="#C8956C";
  const dark="#2A2420";
  if(!curr)return null;

  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(20,18,15,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"90vw",height:"90vh",display:"flex",flexDirection:"column",background:"#FDFBF8",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>

        {/* Photo — 35% */}
        <div style={{height:"35%",position:"relative",flexShrink:0}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`url('${heroImg}')`,backgroundSize:"cover",backgroundPosition:"center"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(20,18,15,0.65) 100%)"}}/>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:30,height:30,borderRadius:"50%",background:"rgba(253,251,248,0.15)",border:"1px solid rgba(253,251,248,0.3)",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font}}>×</button>
          <div style={{position:"absolute",bottom:14,left:18}}>
            <div style={{fontFamily:font,fontSize:22,fontWeight:300,color:"#fff",lineHeight:1}}>{guide.city}</div>
            <div style={{fontFamily:font,fontSize:12,fontStyle:"italic",color:"rgba(253,251,248,0.75)",marginTop:3}}>{guide.country}</div>
          </div>
          <div style={{position:"absolute",bottom:14,right:18,fontFamily:font,fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em"}}>{String(slide+1).padStart(2,"0")} / {String(slides.length).padStart(2,"0")}</div>
        </div>

        {/* Slide label */}
        <div style={{padding:"14px 20px 0",flexShrink:0}}>
          <div style={{fontFamily:font,fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:accent}}>
            {curr.type==="overview"?"Overview":curr.type==="investment"?"Travel Style":curr.type==="stays"?"Where You'll Stay":curr.type==="experiences"?"Experiences":curr.type==="film"?"On Film":""}
          </div>
          <div style={{fontFamily:font,fontSize:20,fontWeight:300,color:dark,marginTop:4}}>
            {curr.type==="overview"?guide.city+", "+guide.country:curr.type==="investment"?"How We Travel":curr.title||guide.city}
          </div>
          <div style={{width:24,height:1,background:accent,marginTop:8}}/>
        </div>

        {/* Scrollable content — 65% minus header */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px 20px"}}>

          {curr.type==="overview"&&<>
            <p style={{fontFamily:font,fontSize:12,color:accent,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 10px"}}>{curr.tagline}</p>
            <p style={{fontFamily:font,fontSize:14,color:"#5A4A38",lineHeight:1.85,margin:"0 0 18px"}}>{curr.intro}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
              {curr.stats.map((s,i)=>(
                <div key={i} style={{padding:"12px 14px",background:"rgba(200,149,108,0.04)",border:"1px solid rgba(200,149,108,0.12)"}}>
                  <div style={{fontFamily:font,fontSize:9,color:"#A89A88",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>{s.l}</div>
                  {Array.isArray(s.v)?s.v.map((line,li)=>(<div key={li} style={{fontFamily:font,fontSize:13,color:dark,lineHeight:1.5}}>{line}</div>)):<div style={{fontFamily:font,fontSize:13,color:dark}}>{s.v}</div>}
                </div>
              ))}
            </div>
            <div style={{fontFamily:font,fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase",color:"#A89A88",marginBottom:8}}>What We Handle</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,border:"1px solid rgba(200,149,108,0.1)"}}>
              {COST_BREAKDOWN_ITEMS.map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",padding:"8px 12px",borderBottom:i<COST_BREAKDOWN_ITEMS.length-2?"1px solid rgba(200,149,108,0.07)":"none",borderRight:i%2===0?"1px solid rgba(200,149,108,0.07)":"none"}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:accent,opacity:0.6,marginRight:8,flexShrink:0}}/>
                  <span style={{fontFamily:font,fontSize:12,color:"#5A4A38"}}>{b.l}</span>
                </div>
              ))}
            </div>
          </>}

          {curr.type==="investment"&&<>
            <p style={{fontFamily:font,fontSize:13,color:"#8A7A68",lineHeight:1.7,margin:"0 0 14px",fontStyle:"italic"}}>{curr.tip}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {curr.tiers.map((t,i)=>{
                const signs=i===0?"$":i===1?"$$":"$$$";
                const signColors=["rgba(200,149,108,0.5)","rgba(200,149,108,0.75)","#C8956C"];
                return(
                  <div key={i} style={{padding:"12px 14px",background:i===1?"rgba(200,149,108,0.05)":"transparent",border:"1px solid "+(i===1?"rgba(200,149,108,0.18)":"rgba(200,149,108,0.08)"),display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{flexShrink:0,minWidth:56}}>
                      <div style={{fontFamily:font,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:accent,marginBottom:3}}>{t.name}</div>
                      <div style={{fontFamily:font,fontSize:14,fontWeight:700,color:signColors[i]}}>{signs}</div>
                    </div>
                    <div style={{width:1,background:"rgba(200,149,108,0.12)",alignSelf:"stretch",flexShrink:0}}/>
                    <div style={{fontFamily:font,fontSize:13,color:"#6A5A48",lineHeight:1.6}}>{t.desc}</div>
                  </div>
                );
              })}
            </div>
          </>}

          {curr.type==="stays"&&<>
            <p style={{fontFamily:font,fontSize:14,color:"#5A4A38",lineHeight:1.85,margin:"0 0 16px"}}>{curr.intro}</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {curr.options.map((o,i)=>(
                <div key={i} style={{padding:"14px 16px",border:"1px solid rgba(200,149,108,0.12)",background:"rgba(200,149,108,0.02)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{fontFamily:font,fontSize:15,fontWeight:500,color:dark}}>{o.name}</div>
                    <span style={{fontFamily:font,fontSize:9,color:accent,letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(200,149,108,0.08)",padding:"3px 8px",whiteSpace:"nowrap",marginLeft:8}}>{o.type}</span>
                  </div>
                  <p style={{fontFamily:font,fontSize:13,color:"#6A5A48",lineHeight:1.65,margin:"0 0 8px"}}>{o.desc}</p>
                  {o.link&&o.link!=="#"&&<a href={o.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:font,fontSize:11,color:accent,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none"}}>View Property →</a>}
                </div>
              ))}
            </div>
          </>}

          {curr.type==="experiences"&&<>
            <p style={{fontFamily:font,fontSize:14,color:"#5A4A38",lineHeight:1.85,margin:"0 0 16px"}}>{curr.intro}</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {curr.list.map((x,i)=>(
                <div key={i} style={{padding:"14px 16px",border:"1px solid rgba(200,149,108,0.1)",background:"rgba(200,149,108,0.025)",borderLeft:`3px solid ${accent}`}}>
                  <div style={{fontFamily:font,fontSize:15,fontWeight:500,color:dark,marginBottom:5}}>{x.name}</div>
                  <div style={{fontFamily:font,fontSize:13,color:"#6A5A48",lineHeight:1.7,marginBottom:x.link?8:0}}>{x.desc}</div>
                  {x.link&&<a href={x.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:font,fontSize:11,color:accent,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none"}}>Book This →</a>}
                </div>
              ))}
            </div>
          </>}

          {curr.type==="film"&&<>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"20px 0"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(200,149,108,0.08)",border:"1px solid rgba(200,149,108,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </div>
              <div style={{fontFamily:font,fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:accent,marginBottom:10}}>The PhotoGlobe</div>
              <h3 style={{fontFamily:font,fontSize:22,fontWeight:300,color:dark,lineHeight:1.25,margin:"0 0 14px"}}>Every traveler sees <span style={{fontStyle:"italic",color:accent}}>{curr.city}</span> differently.</h3>
              <p style={{fontFamily:font,fontSize:14,color:"#6A5A48",lineHeight:1.85,margin:"0 0 24px"}}>{curr.body||`Our PhotoGlobe is a living collection of real photographs from real travelers — each pinned to where it was taken.`}</p>
              <button onClick={onClose} style={{fontFamily:font,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#FDFBF8",background:dark,border:"none",padding:"12px 24px",cursor:"pointer"}}>Explore the Globe →</button>
            </div>
          </>}

        </div>

        {/* Navigation footer */}
        <div style={{padding:"12px 20px",borderTop:"1px solid rgba(200,149,108,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,background:"#FDFBF8"}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {slides.map((_,i)=>(
              <button key={i} onClick={()=>setSlide(i)} style={{width:slide===i?20:6,height:6,borderRadius:3,background:slide===i?accent:"rgba(200,149,108,0.2)",border:"none",cursor:"pointer",transition:"all 0.3s",padding:0}}/>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSlide(s=>Math.max(0,s-1))} disabled={slide===0}
              style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(200,149,108,0.2)",background:"transparent",color:slide===0?"rgba(200,149,108,0.2)":accent,cursor:slide===0?"default":"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
            <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} disabled={slide===slides.length-1}
              style={{width:36,height:36,borderRadius:"50%",border:"none",background:slide===slides.length-1?"transparent":accent,color:slide===slides.length-1?"rgba(200,149,108,0.2)":"#fff",cursor:slide===slides.length-1?"default":"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function GuideModal({guide,onClose,onGlobe}){
  if(isMobile)return <GuideModalMobile guide={guide} onClose={onClose}/>;

  const[slide,setSlide]=useState(0);
  useEffect(()=>{setSlide(0);},[guide]);
  if(!guide)return null;

  const cityData=GUIDE_SLIDES[guide.city];
  const slides=cityData?cityData.slides:[];
  const heroImg=cityData?.heroImg||guide.img;
  const curr=slides[slide];
  const font="'Cormorant Garamond',serif";
  const accent="#C8956C";
  const dark="#2A2420";

  if(!curr)return null;

  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,18,15,0.55)",backdropFilter:"blur(12px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"92vw",maxWidth:1100,height:"88vh",background:"#FDFBF8",borderRadius:20,overflow:"hidden",boxShadow:"0 60px 160px rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",animation:"modalIn 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <div style={{display:"flex",flex:1,overflow:"hidden"}}>

          {/* LEFT — Photo panel */}
          <div style={{width:"42%",flexShrink:0,position:"relative",overflow:"hidden"}}>
            {slide===0?(
              <>
                <div style={{position:"absolute",inset:0,background:`url(${heroImg}) center/cover`}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to right, transparent 60%, rgba(253,251,248,0.15) 100%)"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 32px 32px",background:"linear-gradient(transparent,rgba(0,0,0,0.7))"}}>
                  <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(200,149,108,0.9)",fontFamily:font,marginBottom:8}}>Saeiris</div>
                  <h2 style={{fontSize:36,fontWeight:300,color:"#fff",fontFamily:font,margin:0,lineHeight:1.1}}>{guide.city}<br/><span style={{fontStyle:"italic",fontWeight:400}}>{guide.country}</span></h2>
                  <div style={{width:32,height:1,background:accent,marginTop:16}}/>
                </div>
              </>
            ):(
              <div style={{position:"absolute",inset:0,background:`url(${heroImg}) center/cover`,filter:"brightness(0.35) saturate(0.6)"}}/>
            )}
            <div style={{position:"absolute",bottom:20,right:20,fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:font,letterSpacing:"0.1em"}}>
              {String(slide+1).padStart(2,"0")} / {String(slides.length).padStart(2,"0")}
            </div>
          </div>

          {/* RIGHT — Content panel */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",borderLeft:"1px solid rgba(200,149,108,0.1)"}}>

            {/* Header */}
            <div style={{padding:"28px 32px 20px",borderBottom:"1px solid rgba(200,149,108,0.1)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
              <div>
                <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:accent,fontFamily:font,marginBottom:6}}>
                  {curr.type==="overview"?"Overview":curr.type==="investment"?"Travel Style":curr.type==="stays"?"Where You'll Stay":curr.type==="experiences"?"Experiences":curr.type==="film"?"On Film":""}
                </div>
                <h3 style={{fontSize:26,fontWeight:300,color:dark,fontFamily:font,margin:0,lineHeight:1.1}}>
                  {curr.type==="overview"?guide.city+", "+guide.country:curr.type==="investment"?"How We Travel":curr.title||guide.city}
                </h3>
              </div>
              <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"rgba(42,36,32,0.06)",border:"1px solid rgba(42,36,32,0.1)",color:"#8A7A68",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
            </div>

            {/* Scrollable content */}
            <div style={{flex:1,overflowY:"auto",padding:"24px 32px 24px"}}>

              {/* SLIDE 1: OVERVIEW */}
              {curr.type==="overview"&&<>
                <p style={{fontSize:13,color:accent,fontFamily:font,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,margin:"0 0 14px"}}>{curr.tagline}</p>
                <p style={{fontSize:15.5,color:"#5A4A38",fontFamily:font,lineHeight:1.85,margin:"0 0 22px"}}>{curr.intro}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
                  {curr.stats.map((s,i)=>(
                    <div key={i} style={{padding:"14px 16px",background:"rgba(200,149,108,0.04)",border:"1px solid rgba(200,149,108,0.12)",borderRadius:8}}>
                      <div style={{fontSize:9,color:"#A89A88",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600,marginBottom:6,fontFamily:font}}>{s.l}</div>
                      {Array.isArray(s.v)
                        ? s.v.map((line,li)=>(
                            <div key={li} style={{fontSize:14,color:dark,fontWeight:500,fontFamily:font,lineHeight:1.6}}>{line}</div>
                          ))
                        : <div style={{fontSize:14,color:dark,fontWeight:500,fontFamily:font}}>{s.v}</div>
                      }
                    </div>
                  ))}
                </div>
                <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"#A89A88",fontFamily:font,marginBottom:10,fontWeight:600}}>What We Handle</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderRadius:8,overflow:"hidden",border:"1px solid rgba(200,149,108,0.1)"}}>
                  {COST_BREAKDOWN_ITEMS.map((b,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",padding:"9px 14px",background:i%2===0?"rgba(200,149,108,0.02)":"transparent",borderBottom:i<COST_BREAKDOWN_ITEMS.length-2?"1px solid rgba(200,149,108,0.07)":"none",borderRight:i%2===0?"1px solid rgba(200,149,108,0.07)":"none"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:accent,opacity:0.6,marginRight:10,flexShrink:0}}/>
                      <span style={{fontSize:12,color:"#5A4A38",fontFamily:font}}>{b.l}</span>
                    </div>
                  ))}
                </div>
              </>}

              {/* SLIDE 2: INVESTMENT */}
              {curr.type==="investment"&&<>
                <p style={{fontSize:13,color:"#8A7A68",fontFamily:font,lineHeight:1.7,margin:"0 0 4px",fontStyle:"italic"}}>{curr.tip}</p>
                <p style={{fontSize:13,color:"#8A7A68",fontFamily:font,lineHeight:1.7,margin:"0 0 16px",fontStyle:"italic"}}>No matter how you prefer to travel, we're here to help plan the version that's right for you.</p>
                <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"#A89A88",fontFamily:font,marginBottom:10,fontWeight:600}}>Travel Styles</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {curr.tiers.map((t,i)=>{
                    const signs=i===0?"$":i===1?"$$":"$$$";
                    const signColors=["rgba(200,149,108,0.5)","rgba(200,149,108,0.75)","#C8956C"];
                    return(
                      <div key={i} style={{padding:"12px 16px",background:i===1?"rgba(200,149,108,0.05)":"transparent",border:"1px solid "+(i===1?"rgba(200,149,108,0.18)":"rgba(200,149,108,0.08)"),borderRadius:8,display:"flex",gap:14,alignItems:"flex-start"}}>
                        <div style={{flexShrink:0,minWidth:70,paddingTop:2}}>
                          <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:accent,fontFamily:font,fontWeight:600,marginBottom:4}}>{t.name}</div>
                          <div style={{fontSize:15,fontWeight:700,color:signColors[i],fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.05em"}}>{signs}</div>
                        </div>
                        <div style={{width:1,background:"rgba(200,149,108,0.12)",alignSelf:"stretch",flexShrink:0}}/>
                        <div style={{fontSize:13,color:"#6A5A48",fontFamily:font,lineHeight:1.6}}>{t.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </>}

              {/* SLIDE 3: STAYS */}
              {curr.type==="stays"&&<>
                <p style={{fontSize:15,color:"#5A4A38",fontFamily:font,lineHeight:1.85,margin:"0 0 22px"}}>{curr.intro}</p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {curr.options.map((o,i)=>(
                    <div key={i} style={{padding:"16px 18px",border:"1px solid rgba(200,149,108,0.12)",borderRadius:8,background:"rgba(200,149,108,0.02)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div style={{fontSize:15,fontWeight:500,color:dark,fontFamily:font}}>{o.name}</div>
                        <span style={{fontSize:10,color:accent,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:font,fontWeight:600,background:"rgba(200,149,108,0.08)",padding:"3px 8px",borderRadius:20,whiteSpace:"nowrap",marginLeft:8}}>{o.type}</span>
                      </div>
                      <p style={{fontSize:13,color:"#6A5A48",fontFamily:font,lineHeight:1.65,margin:"0 0 10px"}}>{o.desc}</p>
                      {o.link&&o.link!=="#"&&<a href={o.link} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:accent,fontFamily:font,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,textDecoration:"none"}}>View Property →</a>}
                    </div>
                  ))}
                </div>
              </>}

              {/* SLIDE 4: EXPERIENCES */}
              {curr.type==="experiences"&&<>
                <p style={{fontSize:15,color:"#5A4A38",fontFamily:font,lineHeight:1.85,margin:"0 0 22px"}}>{curr.intro}</p>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {curr.list.map((x,i)=>(
                    <div key={i} style={{padding:"18px 20px",border:"1px solid rgba(200,149,108,0.1)",borderRadius:8,background:"rgba(200,149,108,0.025)",borderLeft:`3px solid ${accent}`}}>
                      <div style={{fontSize:15,fontWeight:500,color:dark,fontFamily:font,marginBottom:6}}>{x.name}</div>
                      <div style={{fontSize:13,color:"#6A5A48",fontFamily:font,lineHeight:1.7,marginBottom:x.link?10:0}}>{x.desc}</div>
                      {x.link&&<a href={x.link} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:accent,fontFamily:font,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,textDecoration:"none"}}>Book This Experience →</a>}
                    </div>
                  ))}
                </div>
              </>}

              {/* SLIDE 5: ON FILM — Globe CTA */}
              {curr.type==="film"&&<>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,textAlign:"center",padding:"20px 0"}}>
                  {/* Globe icon */}
                  <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(200,149,108,0.08)",border:"1px solid rgba(200,149,108,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    </svg>
                  </div>
                  <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:accent,fontFamily:font,fontWeight:600,marginBottom:14}}>The PhotoGlobe</div>
                  <h3 style={{fontSize:26,fontWeight:300,color:dark,fontFamily:font,lineHeight:1.25,margin:"0 0 16px",maxWidth:380}}>
                    Every traveler sees <span style={{fontStyle:"italic",color:accent}}>{curr.city}</span> differently.
                  </h3>
                  <p style={{fontSize:14.5,color:"#6A5A48",fontFamily:font,lineHeight:1.85,maxWidth:400,margin:"0 0 32px"}}>
                    Our PhotoGlobe is a living, growing collection of real photographs from real travelers — each one pinned to the exact place it was taken. Explore how our community has captured {curr.city} through the lens of an authentic camera.
                  </p>
                  <button
                    onClick={()=>{onClose();onGlobe();}}
                    style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 28px",background:dark,color:"#F5F0EB",border:"none",borderRadius:0,fontSize:13,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:font,cursor:"pointer",transition:"all 0.3s"}}
                    onMouseOver={e=>e.currentTarget.style.background=accent}
                    onMouseOut={e=>e.currentTarget.style.background=dark}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                    Explore {curr.city} on the Globe
                  </button>
                  <p style={{fontSize:11,color:"#A89A88",fontFamily:font,marginTop:16,fontStyle:"italic"}}>Your photos from this trip will join the Globe too.</p>
                </div>
              </>}

            </div>

            {/* Navigation footer */}
            <div style={{padding:"16px 32px",borderTop:"1px solid rgba(200,149,108,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,background:"#FDFBF8"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {slides.map((_,i)=>(
                  <button key={i} onClick={()=>setSlide(i)} style={{width:slide===i?24:7,height:7,borderRadius:4,background:slide===i?accent:"rgba(200,149,108,0.2)",border:"none",cursor:"pointer",transition:"all 0.3s",padding:0}}/>
                ))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setSlide(s=>Math.max(0,s-1))} disabled={slide===0}
                  style={{width:40,height:40,borderRadius:"50%",border:"1px solid rgba(200,149,108,0.2)",background:"transparent",color:slide===0?"rgba(200,149,108,0.2)":accent,cursor:slide===0?"default":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}
                  onMouseOver={e=>{if(slide>0)e.currentTarget.style.background="rgba(200,149,108,0.08)"}}
                  onMouseOut={e=>e.currentTarget.style.background="transparent"}>←</button>
                <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} disabled={slide===slides.length-1}
                  style={{width:40,height:40,borderRadius:"50%",border:"1px solid rgba(200,149,108,0.2)",background:slide===slides.length-1?"transparent":accent,color:slide===slides.length-1?"rgba(200,149,108,0.2)":"#fff",cursor:slide===slides.length-1?"default":"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>→</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── TravelGuidesSection ──
// ── Mobile Travel Guides ──
function TravelGuidesSectionMobile(){
  const[idx,setIdx]=useState(0);
  const[activeMobileGuide,setActiveMobileGuide]=useState(null);
  const guide=GUIDES[idx];
  const swipeRef=useRef(null);

  const photo={top:29.4,left:21.5,width:57.5,height:45.22};
  const plaqueTop=80;

  const onTouchStart=(e)=>{swipeRef.current=e.touches[0].clientX;};
  const onTouchEnd=(e)=>{
    if(swipeRef.current===null)return;
    const diff=swipeRef.current-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){diff>0?setIdx(i=>(i+1)%GUIDES.length):setIdx(i=>(i-1+GUIDES.length)%GUIDES.length);}
    swipeRef.current=null;
  };

  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section":undefined} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/travelguides-mobile.png')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#F5F0EB"}}/>

      <div style={{position:"absolute",top:48,left:0,right:0,zIndex:10,textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,letterSpacing:"0.25em",textTransform:"uppercase",color:"#2A2420",marginBottom:10}}>Travel Guides</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:300,color:"#C8956C",fontStyle:"italic",lineHeight:1.15,margin:0}}>Showcase</h2>
        <div style={{width:36,height:1,background:"#C8956C",margin:"16px auto 0"}}/>
      </div>

      <div
        onClick={()=>setActiveMobileGuide(guide)}
        style={{position:"absolute",top:`${photo.top}%`,left:`${photo.left}%`,width:`${photo.width}%`,height:`${photo.height}%`,backgroundImage:`url('${guide.img}')`,backgroundSize:"cover",backgroundPosition:"center",zIndex:5,cursor:"pointer"}}
      />

      <div style={{position:"absolute",top:`${plaqueTop}%`,left:"50%",transform:"translateX(-50%)",zIndex:10,textAlign:"center",pointerEvents:"none"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:400,color:"#C8956C",letterSpacing:"0.18em",textTransform:"uppercase"}}>{guide.city}</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,color:"#8A7A68",letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>{guide.country}</div>
      </div>

      <button onClick={()=>setIdx(i=>(i-1+GUIDES.length)%GUIDES.length)} style={{position:"absolute",left:12,top:"52%",transform:"translateY(-50%)",zIndex:10,background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.6}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#2A2420",lineHeight:1}}>‹</span>
      </button>
      <button onClick={()=>setIdx(i=>(i+1)%GUIDES.length)} style={{position:"absolute",right:12,top:"52%",transform:"translateY(-50%)",zIndex:10,background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.6}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#2A2420",lineHeight:1}}>›</span>
      </button>

      

      <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.5}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:"#8A7A68"}}>Scroll</span>
        <div style={{width:1,height:20,background:"linear-gradient(to bottom,#8A7A68,transparent)"}}/>
      </div>

      {activeMobileGuide&&<GuideModal guide={activeMobileGuide} onClose={()=>setActiveMobileGuide(null)}/>}
    </section>
  );
}

function TravelGuidesSection({onGlobe}){
  if(isMobile)return <TravelGuidesSectionMobile/>;

  const[selected,setSelected]=useState(null);
  const debug=false;
  const[positions,setPositions]=useState([
    {left:33.07,top:8.67,width:10.16,height:30.24},
    {left:45.66,top:8.6,width:10.22,height:30.36},
    {left:58.44,top:8.79,width:10.1,height:30.12},
    {left:33.11,top:43.99,width:10.22,height:29.87},
    {left:45.66,top:43.99,width:10.27,height:29.87},
    {left:58.45,top:43.87,width:10.22,height:30.12},
  ]);
  const dragging=useRef(null);
  const containerRef=useRef(null);

  const onMouseDown=(i,e,mode='move')=>{
    if(!debug)return;
    e.preventDefault();e.stopPropagation();
    dragging.current={i,mode,startX:e.clientX,startY:e.clientY,orig:{...positions[i]}};
  };
  const onMouseMove=useCallback((e)=>{
    if(!debug||!dragging.current)return;
    const{i,mode,startX,startY,orig}=dragging.current;
    const el=containerRef.current;if(!el)return;
    const r=el.getBoundingClientRect();
    const dx=(e.clientX-startX)/r.width*100;
    const dy=(e.clientY-startY)/r.height*100;
    setPositions(prev=>prev.map((p,idx)=>{
      if(idx!==i)return p;
      if(mode==='move') return{...p,left:Math.round((orig.left+dx)*100)/100,top:Math.round((orig.top+dy)*100)/100};
      if(mode==='resize-br') return{...p,width:Math.max(1,Math.round((orig.width+dx)*100)/100),height:Math.max(1,Math.round((orig.height+dy)*100)/100)};
      if(mode==='resize-r') return{...p,width:Math.max(1,Math.round((orig.width+dx)*100)/100)};
      if(mode==='resize-b') return{...p,height:Math.max(1,Math.round((orig.height+dy)*100)/100)};
      if(mode==='resize-l') return{...p,left:Math.round((orig.left+dx)*100)/100,width:Math.max(1,Math.round((orig.width-dx)*100)/100)};
      if(mode==='resize-t') return{...p,top:Math.round((orig.top+dy)*100)/100,height:Math.max(1,Math.round((orig.height-dy)*100)/100)};
      return p;
    }));
  },[debug]);
  const onMouseUp=useCallback(()=>{dragging.current=null;},[]);

  useEffect(()=>{
    if(!debug)return;
    window.addEventListener("mousemove",onMouseMove);
    window.addEventListener("mouseup",onMouseUp);
    return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);};
  },[debug,onMouseMove,onMouseUp]);

  const frames=positions.map((p,i)=>({...p,...GUIDES[i]}));

  return(
    <section ref={containerRef} style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section":undefined}>
      <img src="/guides-wall.png" alt="" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",pointerEvents:"none"}}/>
      <div style={{position:"absolute",left:"77.77%",top:"3.45%",textAlign:"left",zIndex:2}}>
        <div style={{fontSize:"clamp(9px,0.85vw,12px)",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",marginBottom:6}}>Explore</div>
        <h2 style={{fontSize:"clamp(20px,2.5vw,34px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:0,lineHeight:1.15,textShadow:"0 1px 12px rgba(255,255,255,0.8)"}}>
          Travel<br/>Guide<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>Showcase</span>
        </h2>
      </div>
      {debug&&<button onClick={()=>{const txt=positions.map((p,i)=>`Frame ${i+1}: left=${p.left}%, top=${p.top}%, width=${p.width}%, height=${p.height}%`).join('\n');navigator.clipboard.writeText(txt);alert('Positions copied!\n\n'+txt);}} style={{position:"absolute",top:10,right:10,zIndex:200,padding:"8px 16px",background:"#FF6B35",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>Copy Positions</button>}
      {frames.map((f,i)=>(
        <div key={i} onMouseDown={(e)=>onMouseDown(i,e)}
          style={{position:"absolute",left:f.left+"%",top:f.top+"%",width:f.width+"%",height:f.height+"%",zIndex:1,cursor:debug?"move":"pointer",border:debug?"2px solid #FF6B35":"none",background:debug?"rgba(255,107,53,0.15)":"transparent"}}>
          {debug&&<>
            <div style={{position:"absolute",top:0,left:0,background:"#FF6B35",color:"#fff",fontSize:9,padding:"2px 4px",fontWeight:700,zIndex:10,pointerEvents:"none"}}>{i+1}: {f.left}%,{f.top}% | {f.width}x{f.height}</div>
            <div onMouseDown={(e)=>onMouseDown(i,e,'resize-r')} style={{position:"absolute",right:-4,top:"10%",width:8,height:"80%",background:"#FF6B35",cursor:"ew-resize",zIndex:20,borderRadius:2}}/>
            <div onMouseDown={(e)=>onMouseDown(i,e,'resize-l')} style={{position:"absolute",left:-4,top:"10%",width:8,height:"80%",background:"#FF6B35",cursor:"ew-resize",zIndex:20,borderRadius:2}}/>
            <div onMouseDown={(e)=>onMouseDown(i,e,'resize-b')} style={{position:"absolute",bottom:-4,left:"10%",height:8,width:"80%",background:"#FF6B35",cursor:"ns-resize",zIndex:20,borderRadius:2}}/>
            <div onMouseDown={(e)=>onMouseDown(i,e,'resize-t')} style={{position:"absolute",top:-4,left:"10%",height:8,width:"80%",background:"#FF6B35",cursor:"ns-resize",zIndex:20,borderRadius:2}}/>
            <div onMouseDown={(e)=>onMouseDown(i,e,'resize-br')} style={{position:"absolute",bottom:-6,right:-6,width:12,height:12,background:"#fff",border:"2px solid #FF6B35",cursor:"nwse-resize",zIndex:20,borderRadius:2}}/>
          </>}
          {!debug&&<div onClick={()=>setSelected(f)} style={{width:"100%",height:"100%",overflow:"hidden",cursor:"pointer"}}>
            <img src={f.img} alt={f.city} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease",filter:"brightness(0.95) saturate(0.82) blur(0.3px)"}}
              onMouseOver={e=>{e.currentTarget.style.transform="scale(1.06)";e.currentTarget.style.filter="brightness(1.0) saturate(0.88) blur(0px)";}}
              onMouseOut={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.filter="brightness(0.95) saturate(0.82) blur(0.3px)";}}/>
          </div>}
        </div>
      ))}
      <GuideModal guide={selected} onClose={()=>setSelected(null)} onGlobe={onGlobe}/>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 4: ABOUT
// ══════════════════════════════════════════════════════════════
function AboutSection(){
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#2A2420",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section":undefined}>
      <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
      <div style={{position:"absolute",left:"10%",top:"23.58%",width:400,height:480,borderRadius:8,border:"1px solid rgba(200,149,108,0.12)",overflow:"hidden",zIndex:1}}>
        <img src="/aboutphoto.png" alt="Josh and Bella" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%"}}/>
      </div>
      <div style={{position:"absolute",left:"45%",top:"29.05%",maxWidth:500,zIndex:1}}>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",marginBottom:14}}>Our Story</div>
        <h2 style={{fontSize:"clamp(30px,3.2vw,42px)",fontWeight:300,color:"#F5F0EB",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.2,margin:"0 0 22px"}}>
          Built on a love of<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>travel & film</span>
        </h2>
        <p style={{fontSize:16,color:"rgba(245,240,235,0.6)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:"0 0 16px"}}>
          We're Josh and Bella — a couple who fell in love with the world through the lens of a 1976 Canon AE-1. What started as a hobby on our first trip to Tuscany turned into an obsession: analog photography, intentional travel, and the irreplaceable feeling of holding a developed roll of film from a trip you'll never forget.
        </p>
        <p style={{fontSize:16,color:"rgba(245,240,235,0.6)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:0}}>
          Saeiris was born from the belief that the best trips aren't the most expensive — they're the most intentional. We plan every detail so you can be present, camera in hand, capturing moments the way they were meant to be captured.
        </p>
        <div style={{width:40,height:1,background:"#C8956C",marginTop:24}}/>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 5: GET STARTED
// ══════════════════════════════════════════════════════════════
function GetStartedSection(){
  const[form,setForm]=useState({name:"",email:"",destination:"",travelers:"",dates:"",message:""});
  const[submitted,setSubmitted]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));

  const handleSubmit=async()=>{
    if(!form.name||!form.email)return;
    setLoading(true);setError(null);
    try{
      const res=await fetch("https://kkwcrzxxtkjgnymhcbci.supabase.co/functions/v1/send-inquiry",{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":"sb_publishable_S17U2c6b5esKDTkb98ZaLA_MHl0rv1x"},
        body:JSON.stringify(form),
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error||"Something went wrong");}
      setSubmitted(true);
    }catch(e){setError("Something went wrong. Please try again or email us directly.");}
    setLoading(false);
  };

  const iS={width:"100%",padding:"14px 16px",border:"none",borderBottom:"1px solid rgba(200,149,108,0.2)",background:"transparent",color:"#2A2420",fontSize:16,fontFamily:"'Cormorant Garamond',serif",outline:"none",transition:"border-color 0.3s"};
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"flex-start",background:"#FDFBF8",position:"relative",overflow:"hidden",flexShrink:0}}
        className={isMobile?"mobile-section":undefined}>
      <div style={{position:"absolute",left:"35.36%",top:"22.48%",textAlign:"center",maxWidth:560,width:"100%",padding:"0 40px",zIndex:1}}>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",marginBottom:12}}>Start Your Journey</div>
        <h2 style={{fontSize:"clamp(28px,3.5vw,42px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.15,margin:"0 0 6px"}}>
          Let's Plan <span style={{fontStyle:"italic",color:"#C8956C"}}>Something Beautiful</span>
        </h2>
        <p style={{fontSize:15,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 32px",lineHeight:1.6}}>
          Tell us where you'd love to go. We'll handle the rest.
        </p>
        {submitted?(
          <div style={{padding:"36px",borderRadius:12,background:"rgba(200,149,108,0.05)",border:"1px solid rgba(200,149,108,0.12)"}}>
            <div style={{fontSize:20,fontWeight:400,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",marginBottom:6}}>We'll be in touch!</div>
            <div style={{fontSize:14,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif"}}>Check your email for next steps.</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:16,textAlign:"left"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <input value={form.name} onChange={e=>up("name",e.target.value)} placeholder="Your name" style={iS} onFocus={e=>e.target.style.borderBottomColor="#C8956C"} onBlur={e=>e.target.style.borderBottomColor="rgba(200,149,108,0.2)"}/>
              <input value={form.email} onChange={e=>up("email",e.target.value)} placeholder="Email" type="email" style={iS} onFocus={e=>e.target.style.borderBottomColor="#C8956C"} onBlur={e=>e.target.style.borderBottomColor="rgba(200,149,108,0.2)"}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <input value={form.destination} onChange={e=>up("destination",e.target.value)} placeholder="Dream destination" style={iS} onFocus={e=>e.target.style.borderBottomColor="#C8956C"} onBlur={e=>e.target.style.borderBottomColor="rgba(200,149,108,0.2)"}/>
              <input value={form.travelers} onChange={e=>up("travelers",e.target.value)} placeholder="Number of travelers" style={iS} onFocus={e=>e.target.style.borderBottomColor="#C8956C"} onBlur={e=>e.target.style.borderBottomColor="rgba(200,149,108,0.2)"}/>
            </div>
            <input value={form.dates} onChange={e=>up("dates",e.target.value)} placeholder="Preferred travel dates (flexible is fine!)" style={iS} onFocus={e=>e.target.style.borderBottomColor="#C8956C"} onBlur={e=>e.target.style.borderBottomColor="rgba(200,149,108,0.2)"}/>
            <textarea value={form.message} onChange={e=>up("message",e.target.value)} placeholder="Anything else you'd like us to know?" rows={3} style={{width:"100%",padding:"14px 16px",resize:"none",border:"1px solid rgba(200,149,108,0.15)",borderRadius:8,background:"transparent",color:"#2A2420",fontSize:16,fontFamily:"'Cormorant Garamond',serif",outline:"none",transition:"border-color 0.3s",marginBottom:6}} onFocus={e=>e.target.style.borderColor="#C8956C"} onBlur={e=>e.target.style.borderColor="rgba(200,149,108,0.15)"}/>
            {error&&<div style={{fontSize:13,color:"#C0392B",fontFamily:"'Cormorant Garamond',serif",textAlign:"center"}}>{error}</div>}
            <button onClick={handleSubmit} disabled={loading||!form.name||!form.email} style={{width:"100%",padding:"16px",borderRadius:0,background:loading?"rgba(200,149,108,0.5)":"#2A2420",color:"#F5F0EB",border:"none",fontSize:15,fontWeight:600,cursor:loading?"default":"pointer",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.12em",textTransform:"uppercase",transition:"all 0.3s"}}
              onMouseOver={e=>{if(!loading)e.currentTarget.style.background="#C8956C";}}
              onMouseOut={e=>{if(!loading)e.currentTarget.style.background="#2A2420";}}>
              {loading?"Sending...":"Send Inquiry"}
            </button>
            <p style={{fontSize:12,color:"#A89A88",textAlign:"center",fontFamily:"'Cormorant Garamond',serif",margin:0}}>No commitment — just a conversation about your perfect trip.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// MOBILE LONG-SCROLL LAYOUT
// ══════════════════════════════════════════════════════════════
function MobileApp({onGlobe}){
  return(
    <div style={{width:"100vw",fontFamily:"'Cormorant Garamond',serif",backgroundImage:"url('/wall-texture.png')",backgroundSize:"100% auto",backgroundRepeat:"repeat-y",backgroundPosition:"top center",overflowX:"hidden",position:"relative"}}>
      <div style={{position:"relative",zIndex:1}}>

      {/* HERO — full screen with bottom fade */}
      <div style={{position:"relative",width:"100vw",height:"100svh",flexShrink:0}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url('/hero-mobile.png')",backgroundSize:"cover",backgroundPosition:"center"}}/>
        {/* Bottom fade into wall — starts higher */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"45%",background:"linear-gradient(to bottom,transparent 0%,rgba(240,235,230,0.6) 50%,#F0EBE6 100%)"}}/>
        {/* Logo */}
        <div style={{position:"absolute",top:"22%",left:"50%",transform:"translateX(-50%)",zIndex:10,textAlign:"center",whiteSpace:"nowrap"}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,lineHeight:1,letterSpacing:"-0.02em"}}>
            <span style={{color:"#2A2420"}}>S</span><span style={{color:"#C8956C",fontWeight:400}}>ae1</span><span style={{color:"#2A2420",fontStyle:"italic"}}>ris</span>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"#8A7A68",marginTop:6,whiteSpace:"nowrap",textAlign:"center"}}>Curated travel · Captured on film</div>
        </div>
        {/* Globe button */}
        <button onClick={onGlobe} style={{position:"absolute",top:56,right:24,zIndex:10,display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:40,background:"rgba(42,36,32,0.65)",border:"1px solid rgba(200,149,108,0.3)",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          Globe
        </button>
        {/* Scroll indicator */}
        <div style={{position:"absolute",bottom:60,left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.5}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:"#8A7A68"}}>Scroll</span>
          <div style={{width:1,height:28,background:"linear-gradient(to bottom,#8A7A68,transparent)"}}/>
        </div>
      </div>

      {/* HOW IT WORKS — flows from hero */}
      <div style={{padding:"60px 28px 60px"}}>
        <div style={{marginBottom:32}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",marginBottom:10}}>How It Works</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:"#2A2420",lineHeight:1.15,margin:0}}>
            Not Just a Trip.<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>A Memory</span> You Can Hold.
          </h2>
          <div style={{width:36,height:1,background:"#C8956C",marginTop:16}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {num:"01",title:"Join the Globe",desc:"Your developed photos join our interactive PhotoGlobe — a living map of real travel moments captured on real film cameras by real travelers.",idx:0},
            {num:"02",title:"Full-Service Planning",desc:"We handle every detail of your trip — flights, accommodations, excursions, restaurant reservations, and local transportation. You just show up.",idx:1},
            {num:"03",title:"Canon AE-1 Experience",desc:"Before every trip, a fully serviced 1976 Canon AE-1 loaded with Kodak UltraMax 400 ships to your door. 36 exposures. No filters. No edits.",idx:2},
          ].map((c)=>(
            <div key={c.num} style={{background:"rgba(253,251,248,0.95)",borderLeft:"3px solid #C8956C",padding:"18px 20px",boxShadow:"0 4px 24px rgba(42,36,32,0.08),0 1px 4px rgba(42,36,32,0.04)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"#C8956C",marginBottom:6}}>{c.num}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:400,color:"#2A2420",marginBottom:8}}>{c.title}</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"#6A5A48",lineHeight:1.75,margin:"0 0 12px"}}>{c.desc}</p>
              <HowItWorksLearnMore idx={c.idx}/>
            </div>
          ))}
        </div>
      </div>

      {/* TRAVEL GUIDES */}
      <MobileTravelGuides onGlobe={onGlobe}/>

      {/* ABOUT */}
      <MobileAbout/>

      {/* GET STARTED */}
      <MobileGetStarted/>

      {/* GLOBE CTA */}
      <div style={{background:"#2A2420",padding:"60px 28px",textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",marginBottom:12}}>PhotoGlobe</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:"#FDFBF8",lineHeight:1.2,margin:"0 0 16px"}}>See the world through<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>their lens.</span></h2>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"rgba(253,251,248,0.6)",lineHeight:1.8,margin:"0 0 28px"}}>Every trip we plan gets pinned to the globe. Browse real photos from real travelers — captured on film.</p>
        <button onClick={onGlobe} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",color:"#2A2420",background:"#C8956C",border:"none",padding:"14px 32px",cursor:"pointer"}}>Explore the Globe</button>
      </div>

      </div>{/* end zIndex wrapper */}
    </div>
  );
}

// Wrapper components for mobile sections
function HowItWorksLearnMore({idx}){
  const[active,setActive]=useState(null);
  return(
    <>
      <button onClick={()=>setActive(SERVICES[idx])} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#C8956C",background:"transparent",border:"none",padding:0,cursor:"pointer"}}>Learn More →</button>
      <ServiceModal service={active} onClose={()=>setActive(null)}/>
    </>
  );
}

function MobileTravelGuides({onGlobe}){
  const[idx,setIdx]=useState(0);
  const[activeGuide,setActiveGuide]=useState(null);
  const guide=GUIDES[idx];
  const swipeRef=useRef(null);
  const onTouchStart=(e)=>{swipeRef.current=e.touches[0].clientX;};
  const onTouchEnd=(e)=>{
    if(swipeRef.current===null)return;
    const diff=swipeRef.current-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){diff>0?setIdx(i=>(i+1)%GUIDES.length):setIdx(i=>(i-1+GUIDES.length)%GUIDES.length);}
    swipeRef.current=null;
  };
  return(
    <div style={{padding:"60px 0 60px"}}>
      {/* Title */}
      <div style={{textAlign:"center",marginBottom:32,padding:"0 28px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,letterSpacing:"0.25em",textTransform:"uppercase",color:"#2A2420",marginBottom:8}}>Travel Guides</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:300,color:"#C8956C",fontStyle:"italic",lineHeight:1.15,margin:0}}>Showcase</h2>
        <div style={{width:36,height:1,background:"#C8956C",margin:"16px auto 0"}}/>
      </div>
      {/* Frame */}
      <div style={{position:"relative",width:"100vw"}} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Code-built frame */}
        <div style={{margin:"0 auto",width:"75vw",border:"8px solid #1A1A1A",boxShadow:"0 8px 40px rgba(0,0,0,0.25)",position:"relative",aspectRatio:"3/4",cursor:"pointer"}} onClick={()=>setActiveGuide(guide)}>
          <div style={{position:"absolute",inset:0,backgroundImage:`url('${guide.img}')`,backgroundSize:"cover",backgroundPosition:"center"}}/>
        </div>
        {/* Plaque */}
        <div style={{textAlign:"center",marginTop:16,position:"relative"}}>
          <img src="/plaque.png" alt="" style={{width:"42%",maxWidth:168,display:"block",margin:"0 auto"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:400,color:"#C8956C",letterSpacing:"0.2em",textTransform:"uppercase"}}>{guide.city}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,color:"rgba(200,149,108,0.7)",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:2}}>{guide.country}</div>
          </div>
        </div>
        {/* Arrows */}
        <button onClick={()=>setIdx(i=>(i-1+GUIDES.length)%GUIDES.length)} style={{position:"absolute",left:8,top:"45%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(42,36,32,0.5)",fontSize:28,cursor:"pointer",fontFamily:"'Cormorant Garamond',serif"}}>‹</button>
        <button onClick={()=>setIdx(i=>(i+1)%GUIDES.length)} style={{position:"absolute",right:8,top:"45%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(42,36,32,0.5)",fontSize:28,cursor:"pointer",fontFamily:"'Cormorant Garamond',serif"}}>›</button>
      </div>
      {activeGuide&&<GuideModal guide={activeGuide} onClose={()=>setActiveGuide(null)}/>}
    </div>
  );
}

function MobileAbout(){
  return(
    <div style={{background:"#2A2420",padding:"60px 28px"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",marginBottom:12}}>About</div>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:"#FDFBF8",lineHeight:1.2,margin:"0 0 20px"}}>Josh & Bella</h2>
      <div style={{width:"100%",aspectRatio:"4/3",marginBottom:24,overflow:"hidden"}}>
        <img src="/aboutphoto.png" alt="Josh and Bella" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%"}}/>
      </div>
      <div style={{width:36,height:1,background:"#C8956C",marginBottom:20}}/>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"rgba(253,251,248,0.75)",lineHeight:1.85}}>We started Saeiris because we believed travel deserved more than an itinerary — it deserved a memory you could hold. Every trip we plan is documented on a 1976 Canon AE-1, developed by hand, and pinned to our PhotoGlobe.</p>
    </div>
  );
}

function MobileGetStarted(){
  const[form,setForm]=useState({name:"",email:"",destination:"",message:""});
  const[status,setStatus]=useState("");
  const font="'Cormorant Garamond',serif";
  const inp={width:"100%",padding:"12px 0",borderBottom:"1px solid rgba(200,149,108,0.3)",background:"transparent",fontFamily:font,fontSize:15,color:"#2A2420",border:"none",borderBottom:"1px solid rgba(42,36,32,0.2)",marginBottom:16,outline:"none"};
  const submit=async(e)=>{
    e.preventDefault();
    setStatus("sending");
    try{
      const {supabase}=await import("./supabase");
      const{error}=await supabase.functions.invoke("send-inquiry",{body:form});
      setStatus(error?"error":"sent");
    }catch{setStatus("error");}
  };
  return(
    <div style={{background:"#FDFBF8",padding:"60px 28px"}}>
      <div style={{fontFamily:font,fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",marginBottom:10}}>Get Started</div>
      <h2 style={{fontFamily:font,fontSize:32,fontWeight:300,color:"#2A2420",lineHeight:1.2,margin:"0 0 8px"}}>Plan Your<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>Journey.</span></h2>
      <div style={{width:36,height:1,background:"#C8956C",margin:"16px 0 28px"}}/>
      {status==="sent"?
        <div style={{fontFamily:font,fontSize:16,color:"#C8956C",lineHeight:1.8}}>Thank you — we'll be in touch within 48 hours.</div>:
        <form onSubmit={submit}>
          <input style={inp} placeholder="Your Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/>
          <input style={inp} placeholder="Email Address" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
          <input style={inp} placeholder="Dream Destination" value={form.destination} onChange={e=>setForm(f=>({...f,destination:e.target.value}))}/>
          <textarea style={{...inp,resize:"none",height:100}} placeholder="Tell us about your trip..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/>
          <div style={{fontFamily:font,fontSize:11,color:"#8A7A68",marginBottom:20,letterSpacing:"0.05em"}}>Flat planning fee: $350</div>
          <button type="submit" disabled={status==="sending"} style={{width:"100%",padding:"16px",background:"#2A2420",color:"#C8956C",fontFamily:font,fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",border:"none",cursor:"pointer"}}>
            {status==="sending"?"Sending...":"Send Inquiry"}
          </button>
          {status==="error"&&<div style={{fontFamily:font,fontSize:13,color:"#C8956C",marginTop:12}}>Something went wrong — please email hello@saeiris.com directly.</div>}
        </form>
      }
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App(){
  const[page,setPage]=useState("home");
  const[activeSection,setActiveSection]=useState(0);
  const containerRef=useRef(null);
  const isScrolling=useRef(false);

  const scrollToSection=useCallback((idx)=>{
    if(idx<0||idx>=SECTIONS.length)return;
    isScrolling.current=true;
    setActiveSection(idx);
    const el=containerRef.current;
    if(el){
      el.scrollTo({top:idx*window.innerHeight,behavior:"smooth"});
      setTimeout(()=>{isScrolling.current=false;},1000);
    }
  },[]);

  useEffect(()=>{
    if(page!=="home")return;
    const el=containerRef.current;if(!el)return;
    let lastWheel=0;
    const onWheel=(e)=>{
      e.preventDefault();
      const now=Date.now();
      if(now-lastWheel<900||isScrolling.current)return;
      lastWheel=now;
      if(e.deltaY>0)scrollToSection(activeSection+1);
      else if(e.deltaY<0)scrollToSection(activeSection-1);
    };
    el.addEventListener("wheel",onWheel,{passive:false});
    return()=>el.removeEventListener("wheel",onWheel);
  },[page,activeSection,scrollToSection]);

  useEffect(()=>{
    if(page!=="home")return;
    const onKey=(e)=>{
      if(e.key==="ArrowDown"||e.key===" "){e.preventDefault();scrollToSection(activeSection+1);}
      if(e.key==="ArrowUp"){e.preventDefault();scrollToSection(activeSection-1);}
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[page,activeSection,scrollToSection]);

  if(page==="globe"){
    return <PhotoGlobe onNavigate={(p)=>setPage(p||"home")}/>;
  }

  if(isMobile){
    return(
      <div style={{width:"100vw",height:"100%",fontFamily:"'Cormorant Garamond',serif"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(200,149,108,0.3);color:#2A2420}::-webkit-scrollbar{display:none}input::placeholder,textarea::placeholder{color:#A89A88}input:focus,textarea:focus{outline:none}.wall-texture{background-color:#F5F0EB;background-image:url('/wall-texture.png');background-size:400px 400px;background-repeat:repeat;}`}</style>
        <MobileApp onGlobe={()=>setPage("globe")}/>
      </div>
    );
  }

  return(
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",fontFamily:"'Cormorant Garamond',serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(200,149,108,0.3);color:#2A2420}::-webkit-scrollbar{display:none}input::placeholder,textarea::placeholder{color:#A89A88}input:focus,textarea:focus{outline:none}`}</style>
      <SectionNav active={activeSection} onNav={scrollToSection}/>
      <GlobeTab onClick={()=>setPage("globe")} dark={DARK_SECTIONS[activeSection]}/>
      <div ref={containerRef} style={{width:"100vw",height:"100vh",overflow:"hidden"}}>
        <HeroSection onGlobe={()=>setPage("globe")}/>
        <HowItWorksSection/>
        <TravelGuidesSection onGlobe={()=>setPage("globe")}/>
        <AboutSection/>
        <GetStartedSection/>
      </div>
    </div>
  );
}
