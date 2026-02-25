import { useState, useEffect, useRef, useCallback } from "react";
import PhotoGlobe from "./photoglobe";

// ══════════════════════════════════════════════════════════════
// AE-1 VIEWPOINT — Full Website with Snap-Scroll Sections
// ══════════════════════════════════════════════════════════════

const SECTIONS = ["Home","How It Works","Travel Guides","About","Get Started"];

// ── Section Navigation (left sidebar dots) ──
function SectionNav({active,onNav}){
  return(
    <div style={{position:"fixed",left:28,top:"50%",transform:"translateY(-50%)",zIndex:100,display:"flex",flexDirection:"column",gap:20,alignItems:"flex-start"}}>
      {SECTIONS.map((s,i)=>(
        <button key={s} onClick={()=>onNav(i)} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:0}}>
          <div style={{width:active===i?10:6,height:active===i?10:6,borderRadius:"50%",background:active===i?"#C8956C":"rgba(255,255,255,0.25)",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",boxShadow:active===i?"0 0 12px rgba(200,149,108,0.4)":"none"}}/>
          <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:active===i?"#C8956C":"rgba(255,255,255,0.3)",transition:"all 0.4s",fontFamily:"'Cormorant Garamond',serif",whiteSpace:"nowrap"}}>{s}</span>
        </button>
      ))}
    </div>
  );
}

// ── Globe Tab (top right) ──
function GlobeTab({onClick}){
  return(
    <button onClick={onClick} style={{position:"fixed",top:28,right:32,zIndex:100,display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:40,background:"rgba(15,25,35,0.7)",border:"1px solid rgba(200,149,108,0.25)",color:"#C8956C",cursor:"pointer",backdropFilter:"blur(16px)",fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Cormorant Garamond',serif",transition:"all 0.3s"}}
      onMouseOver={e=>{e.currentTarget.style.background="rgba(200,149,108,0.12)";e.currentTarget.style.borderColor="rgba(200,149,108,0.5)";}}
      onMouseOut={e=>{e.currentTarget.style.background="rgba(15,25,35,0.7)";e.currentTarget.style.borderColor="rgba(200,149,108,0.25)";}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
      Globe
    </button>
  );
}

// ── Section 1: Hero / Landing ──
function HeroSection(){
  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#F5F0EB 0%,#E8E2DA 50%,#DDD5CC 100%)"}}>
        <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"}}/>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{width:"80%",maxWidth:1100,height:"85%",borderRadius:"4px 4px 0 0",border:"2px dashed rgba(160,140,120,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(120,100,80,0.5)",fontSize:14,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.05em"}}>
          Drop your hero image here (1920×1080 — Canon AE-1, Kodak film, Tuscany book)
        </div>
      </div>
      <div style={{position:"relative",zIndex:2,textAlign:"center",marginBottom:"18vh"}}>
        <div style={{fontSize:13,fontWeight:500,letterSpacing:"0.35em",textTransform:"uppercase",color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>Est. 2025</div>
        <h1 style={{fontSize:"clamp(42px,6vw,80px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.05,margin:"0 0 16px",letterSpacing:"-0.02em"}}>
          AE-1 <span style={{fontStyle:"italic",fontWeight:400}}>Viewpoint</span>
        </h1>
        <p style={{fontSize:16,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",fontWeight:400,maxWidth:500,margin:"0 auto"}}>
          Curated travel experiences. Captured on film.
        </p>
        <div style={{width:40,height:1,background:"#C8956C",margin:"28px auto 0"}}/>
      </div>
      <div style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0.5}}>
        <span style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif"}}>Scroll</span>
        <div style={{width:1,height:24,background:"linear-gradient(to bottom,#8A7A68,transparent)"}}/>
      </div>
    </section>
  );
}

// ── Section 2: How It Works ──
function HowItWorksSection(){
  const cards=[
    {icon:"✈",title:"Full-Service Planning",desc:"Flights, hotels, excursions — we handle everything. We negotiate directly with hosts to get you the best rates."},
    {icon:"📷",title:"Canon AE-1 Experience",desc:"A vintage film camera shipped to your door before departure. 36 shots to capture your journey the analog way."},
    {icon:"🌍",title:"Join the Globe",desc:"Your developed photos join our interactive PhotoGlobe — a growing map of real travel moments from real cameras."}
  ];
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#FDFBF8",position:"relative",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:900,padding:"0 40px"}}>
        <h2 style={{fontSize:"clamp(32px,4.5vw,56px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.15,margin:"0 0 8px"}}>
          Not Just a Trip.<br/><span style={{fontStyle:"italic",fontWeight:400,color:"#C8956C"}}>A Memory</span> You Can Hold.
        </h2>
        <p style={{fontSize:15,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.7,maxWidth:620,margin:"20px auto 48px",letterSpacing:"0.02em"}}>
          We take care of every detail — flights, accommodation, excursions, and communication with hosts. But what sets us apart is what arrives at your door before you leave: a vintage Canon AE-1 loaded with a fresh roll of 36 exposures. No filters. No edits. Just you and the world.
        </p>
        <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
          {cards.map((c,i)=>(
            <div key={i} style={{flex:"1 1 260px",maxWidth:300,padding:"36px 28px",borderRadius:16,background:"rgba(245,240,235,0.7)",border:"1px solid rgba(200,180,160,0.2)",textAlign:"left",transition:"all 0.3s"}}
              onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{width:48,height:48,borderRadius:12,background:"rgba(200,149,108,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:18}}>{c.icon}</div>
              <h3 style={{fontSize:17,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 10px",letterSpacing:"0.02em"}}>{c.title}</h3>
              <p style={{fontSize:13,color:"#8A7A68",lineHeight:1.65,margin:0,fontFamily:"'Cormorant Garamond',serif"}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Travel Guides ──
const GUIDES=[
  {city:"Madrid",country:"Spain",img:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80",tagline:"Tapas, plazas & golden light",budget:"$2,800 – $4,200",duration:"7 nights",highlight:"Rooftop sunset at Círculo de Bellas Artes"},
  {city:"Tuscany",country:"Italy",img:"https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80",tagline:"Rolling hills & Chianti roads",budget:"$3,200 – $5,000",duration:"8 nights",highlight:"Private vineyard tasting in Montalcino"},
  {city:"Kauai",country:"Hawaii",img:"https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=600&q=80",tagline:"The Garden Isle, untouched",budget:"$3,500 – $5,500",duration:"6 nights",highlight:"Nā Pali Coast helicopter tour at sunrise"},
  {city:"Hvar",country:"Croatia",img:"https://images.unsplash.com/photo-1555990538-1a6f1e437498?w=600&q=80",tagline:"Lavender, stone & Adriatic blue",budget:"$2,400 – $3,800",duration:"5 nights",highlight:"Sunset kayak to the Pakleni Islands"},
  {city:"Seattle",country:"USA",img:"https://images.unsplash.com/photo-1502175353174-a7a70e73b4c3?w=600&q=80",tagline:"Coffee, rain & emerald views",budget:"$1,800 – $3,000",duration:"4 nights",highlight:"Ferry ride to Bainbridge Island"},
  {city:"Rome",country:"Italy",img:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",tagline:"Eternal city, timeless film",budget:"$2,600 – $4,400",duration:"6 nights",highlight:"Private twilight Colosseum tour"},
];

function GuideModal({guide,onClose}){
  if(!guide)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,18,15,0.85)",backdropFilter:"blur(20px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:680,maxHeight:"88vh",background:"#FDFBF8",borderRadius:20,overflow:"hidden",boxShadow:"0 40px 120px rgba(0,0,0,0.4)"}}>
        <div style={{height:280,background:`url(${guide.img}) center/cover`,position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.4)",border:"none",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>×</button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 32px 20px",background:"linear-gradient(transparent,rgba(0,0,0,0.6))"}}>
            <h3 style={{fontSize:32,fontWeight:300,color:"#fff",fontFamily:"'Cormorant Garamond',serif",margin:0}}>{guide.city}, <span style={{fontStyle:"italic"}}>{guide.country}</span></h3>
          </div>
        </div>
        <div style={{padding:"28px 32px 36px",overflowY:"auto",maxHeight:"calc(88vh - 280px)"}}>
          <p style={{fontSize:14,color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,margin:"0 0 16px"}}>{guide.tagline}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
            {[{l:"Budget Range",v:guide.budget},{l:"Duration",v:guide.duration},{l:"Highlight",v:guide.highlight}].map((s,i)=>(
              <div key={i} style={{padding:"14px 16px",borderRadius:10,background:"rgba(200,149,108,0.06)",border:"1px solid rgba(200,149,108,0.12)"}}>
                <div style={{fontSize:10,color:"#8A7A68",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:6,fontFamily:"'Cormorant Garamond',serif"}}>{s.l}</div>
                <div style={{fontSize:13,color:"#2A2420",fontWeight:500,fontFamily:"'Cormorant Garamond',serif"}}>{s.v}</div>
              </div>
            ))}
          </div>
          <h4 style={{fontSize:16,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 12px"}}>What's Included</h4>
          <p style={{fontSize:13,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,marginBottom:24}}>
            Round-trip flights & airport transfers · Hand-picked accommodations (boutique hotels & Airbnbs) · Custom day-by-day itinerary with restaurant reservations · Canon AE-1 camera + Kodak UltraMax 400 film shipped to your door · Film development & high-res scans after your trip · Emergency travel support throughout your journey
          </p>
          <h4 style={{fontSize:16,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 12px"}}>Sample Itinerary</h4>
          <p style={{fontSize:13,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,marginBottom:24}}>
            <strong>Day 1:</strong> Arrival & neighborhood orientation walk · <strong>Day 2:</strong> Guided cultural excursion & local market visit · <strong>Day 3:</strong> Free exploration day with curated recommendations · <strong>Day 4:</strong> Signature experience ({guide.highlight}) · <strong>Day 5+:</strong> Additional adventures tailored to your interests · <strong>Final Day:</strong> Farewell breakfast & departure
          </p>
          <h4 style={{fontSize:16,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 12px"}}>Restaurant Picks</h4>
          <p style={{fontSize:13,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:0}}>
            We research and reserve tables at the best local restaurants — from hidden family-run spots to celebrated dining rooms. Each guide includes 4–6 curated restaurant recommendations with reservation details, dress code, and our personal menu picks.
          </p>
        </div>
      </div>
    </div>
  );
}

function TravelGuidesSection(){
  const[selected,setSelected]=useState(null);
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#F5F0EB",position:"relative",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:1100,padding:"0 40px",width:"100%"}}>
        <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 6px"}}>
          Travel Guide <span style={{fontStyle:"italic",color:"#C8956C"}}>Showcase</span>
        </h2>
        <p style={{fontSize:14,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 40px",letterSpacing:"0.03em"}}>
          Click any destination to explore a complete sample guide
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {GUIDES.map((g,i)=>(
            <div key={i} onClick={()=>setSelected(g)} style={{cursor:"pointer",position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"4/5",background:"#E8E2DA",boxShadow:"6px 8px 24px rgba(40,30,20,0.12),0 1px 2px rgba(0,0,0,0.06)",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",border:"6px solid #F5F0EB"}}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.02)";e.currentTarget.style.boxShadow="8px 12px 36px rgba(40,30,20,0.2),0 2px 4px rgba(0,0,0,0.08)";}}
              onMouseOut={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="6px 8px 24px rgba(40,30,20,0.12),0 1px 2px rgba(0,0,0,0.06)";}}>
              <img src={g.img} alt={g.city} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"32px 16px 14px",background:"linear-gradient(transparent,rgba(0,0,0,0.55))"}}>
                <div style={{fontSize:18,fontWeight:400,color:"#fff",fontFamily:"'Cormorant Garamond',serif"}}>{g.city}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.05em"}}>{g.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GuideModal guide={selected} onClose={()=>setSelected(null)}/>
    </section>
  );
}

// ── Section 4: About ──
function AboutSection(){
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#2A2420",position:"relative",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:60,maxWidth:1100,padding:"0 60px",width:"100%"}}>
        <div style={{flex:"0 0 420px",height:500,borderRadius:12,background:"linear-gradient(135deg,#3A3430,#4A4035)",border:"1px solid rgba(200,149,108,0.15)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          <div style={{textAlign:"center",color:"rgba(200,149,108,0.4)",fontFamily:"'Cormorant Garamond',serif"}}>
            <div style={{fontSize:48,marginBottom:12}}>📸</div>
            <div style={{fontSize:14,letterSpacing:"0.05em"}}>Your photo here</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",marginBottom:14}}>Our Story</div>
          <h2 style={{fontSize:"clamp(30px,3.5vw,44px)",fontWeight:300,color:"#F5F0EB",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.2,margin:"0 0 24px"}}>
            Built on a love of<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>travel & film</span>
          </h2>
          <p style={{fontSize:15,color:"rgba(245,240,235,0.65)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:"0 0 18px"}}>
            We're Josh and Sarah — a couple who fell in love with the world through the viewfinder of a 1976 Canon AE-1. What started as a hobby on our honeymoon in Tuscany turned into an obsession: analog photography, intentional travel, and the irreplaceable feeling of holding a developed roll of film from a trip you'll never forget.
          </p>
          <p style={{fontSize:15,color:"rgba(245,240,235,0.65)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:0}}>
            AE-1 Viewpoint was born from the belief that the best trips aren't the most expensive ones — they're the most intentional. We plan every detail so you can be present, camera in hand, capturing moments the way they were meant to be captured. No screens. No algorithms. Just light, film, and the world in front of you.
          </p>
          <div style={{width:40,height:1,background:"#C8956C",marginTop:28}}/>
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Get Started ──
function GetStartedSection(){
  const[form,setForm]=useState({name:"",email:"",destination:"",travelers:"",dates:"",message:""});
  const[submitted,setSubmitted]=useState(false);
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));
  const iS={width:"100%",padding:"13px 16px",borderRadius:10,border:"1px solid rgba(200,149,108,0.2)",background:"rgba(245,240,235,0.5)",color:"#2A2420",fontSize:14,fontFamily:"'Cormorant Garamond',serif",outline:"none",transition:"border-color 0.3s"};
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#FDFBF8",position:"relative",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:560,width:"100%",padding:"0 40px"}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.25em",textTransform:"uppercase",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",marginBottom:14}}>Start Your Journey</div>
        <h2 style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.15,margin:"0 0 8px"}}>
          Let's Plan<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>Something Beautiful</span>
        </h2>
        <p style={{fontSize:14,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 36px",lineHeight:1.6}}>
          Tell us where you'd love to go. We'll handle the rest — from flights and stays to a loaded Canon AE-1 at your doorstep.
        </p>
        {submitted?(
          <div style={{padding:"40px",borderRadius:16,background:"rgba(200,149,108,0.06)",border:"1px solid rgba(200,149,108,0.15)"}}>
            <div style={{fontSize:36,marginBottom:12}}>✈️</div>
            <div style={{fontSize:20,fontWeight:400,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>We'll be in touch!</div>
            <div style={{fontSize:13,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif"}}>Check your email for next steps.</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:14,textAlign:"left"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <input value={form.name} onChange={e=>up("name",e.target.value)} placeholder="Your name" style={iS}/>
              <input value={form.email} onChange={e=>up("email",e.target.value)} placeholder="Email" type="email" style={iS}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <input value={form.destination} onChange={e=>up("destination",e.target.value)} placeholder="Dream destination" style={iS}/>
              <input value={form.travelers} onChange={e=>up("travelers",e.target.value)} placeholder="Number of travelers" style={iS}/>
            </div>
            <input value={form.dates} onChange={e=>up("dates",e.target.value)} placeholder="Preferred travel dates (flexible is fine!)" style={iS}/>
            <textarea value={form.message} onChange={e=>up("message",e.target.value)} placeholder="Anything else you'd like us to know?" rows={3} style={{...iS,resize:"none"}}/>
            <button onClick={()=>setSubmitted(true)} style={{width:"100%",padding:"15px",borderRadius:10,background:"#2A2420",color:"#F5F0EB",border:"none",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em",transition:"all 0.3s"}}
              onMouseOver={e=>e.currentTarget.style.background="#C8956C"}
              onMouseOut={e=>e.currentTarget.style.background="#2A2420"}>
              Send Inquiry
            </button>
            <p style={{fontSize:11,color:"#A89A88",textAlign:"center",fontFamily:"'Cormorant Garamond',serif",margin:0}}>No commitment — just a conversation about your perfect trip.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main App ──
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
      setTimeout(()=>{isScrolling.current=false;},800);
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
    const el=containerRef.current;if(!el)return;
    let startY=0;
    const onTS=(e)=>{startY=e.touches[0].clientY;};
    const onTE=(e)=>{
      if(isScrolling.current)return;
      const dy=startY-e.changedTouches[0].clientY;
      if(Math.abs(dy)>50){
        if(dy>0)scrollToSection(activeSection+1);
        else scrollToSection(activeSection-1);
      }
    };
    el.addEventListener("touchstart",onTS,{passive:true});
    el.addEventListener("touchend",onTE,{passive:true});
    return()=>{el.removeEventListener("touchstart",onTS);el.removeEventListener("touchend",onTE);};
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

  return(
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",fontFamily:"'Cormorant Garamond',serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(200,149,108,0.3);color:#2A2420}::-webkit-scrollbar{display:none}input::placeholder,textarea::placeholder{color:#A89A88}input:focus,textarea:focus{border-color:rgba(200,149,108,0.5)!important;outline:none}`}</style>
      <SectionNav active={activeSection} onNav={scrollToSection}/>
      <GlobeTab onClick={()=>setPage("globe")}/>
      <div ref={containerRef} style={{width:"100vw",height:"100vh",overflow:"hidden",scrollBehavior:"smooth"}}>
        <HeroSection/>
        <HowItWorksSection/>
        <TravelGuidesSection/>
        <AboutSection/>
        <GetStartedSection/>
      </div>
    </div>
  );
}
