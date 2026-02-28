import { useState, useEffect, useRef, useCallback } from "react";
import PhotoGlobe from "./photoglobe";

const SECTIONS = ["Home","How It Works","Travel Guides","About","Get Started"];
// Which sections have dark backgrounds (for nav color adaptation)
const DARK_SECTIONS = [false,false,false,true,false];

// ── Section Navigation (left sidebar) — adapts color to background ──
function SectionNav({active,onNav}){
  const isDark=DARK_SECTIONS[active];
  const accent="#C8956C";
  const inactiveColor=isDark?"rgba(255,255,255,0.3)":"rgba(42,36,32,0.3)";
  const inactiveDot=isDark?"rgba(255,255,255,0.2)":"rgba(42,36,32,0.2)";
  return(
    <div style={{position:"fixed",left:28,top:"50%",transform:"translateY(-50%)",zIndex:100,display:"flex",flexDirection:"column",gap:20,alignItems:"flex-start"}}>
      {SECTIONS.map((s,i)=>(
        <button key={s} onClick={()=>onNav(i)} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:0}}>
          <div style={{width:active===i?10:6,height:active===i?10:6,borderRadius:"50%",background:active===i?accent:inactiveDot,transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",boxShadow:active===i?"0 0 12px rgba(200,149,108,0.4)":"none"}}/>
          <span style={{fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:active===i?accent:inactiveColor,transition:"all 0.4s",fontFamily:"'Cormorant Garamond',serif",whiteSpace:"nowrap"}}>{s}</span>
        </button>
      ))}
    </div>
  );
}

// ── Globe Tab (top right) ──
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
// SECTION 1: HERO — Full background image with logo overlay
// ══════════════════════════════════════════════════════════════
function HeroSection(){
  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}>
      {/* Full background image */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/hero-bg.png')",backgroundSize:"cover",backgroundPosition:"center bottom",backgroundColor:"#F5F0EB"}}>
        {/* Subtle overlay to ensure text readability in upper area */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(245,240,235,0.55) 0%,rgba(245,240,235,0.2) 35%,transparent 55%)"}}/>
      </div>

      {/* Logo — top left */}
      <div style={{position:"absolute",top:32,left:80,zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:28,fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.02em"}}>
            AE-1 <span style={{fontStyle:"italic",fontWeight:400}}>Viewpoint</span>
          </div>
        </div>
        <div style={{fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",marginTop:2,marginLeft:2}}>Curated travel · Captured on film</div>
      </div>

      {/* Tagline — centered upper area */}
      <div style={{position:"absolute",top:"50%",left:"37.66%",transform:"translateY(-50%)",textAlign:"center",zIndex:2}}>
        <h1 style={{fontSize:"clamp(38px,5.5vw,72px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.08,margin:0,letterSpacing:"-0.02em"}}>
          Your Journey.<br/><span style={{fontStyle:"italic",fontWeight:400,color:"#C8956C"}}>On Film.</span>
        </h1>
        <div style={{width:40,height:1,background:"#C8956C",margin:"24px auto 0"}}/>
      </div>

      {/* Scroll indicator */}
      <div style={{position:"absolute",bottom:36,left:"48.43%",display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0.4,zIndex:2}}>
        <span style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif"}}>Scroll</span>
        <div style={{width:1,height:24,background:"linear-gradient(to bottom,#8A7A68,transparent)"}}/>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 2: HOW IT WORKS — clean minimal cards over image bg
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

function HowItWorksSection(){
  const[activeService,setActiveService]=useState(null);
  const[hoveredIdx,setHoveredIdx]=useState(null);
  const hotspots=[
    {left:-5.51,top:0.12,width:34.83,height:76.33,rotation:-13.5,serviceIdx:0},
    {left:40.30,top:18.10,width:26.83,height:22.02,rotation:10.5,serviceIdx:1},
    {left:69.24,top:46.23,width:13.49,height:40.56,rotation:27.5,serviceIdx:2},
  ];

  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}>
      {/* Background image — full opacity */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/howitworks-bg.png')",backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#F8F4F0"}}/>

      {/* Title */}
      <div style={{position:"absolute",top:"50%",left:"33.94%",transform:"translateY(-50%)",textAlign:"center",zIndex:2,pointerEvents:"none"}}>
        <h2 style={{fontSize:"clamp(30px,4.5vw,52px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.15,margin:0,textShadow:"0 2px 20px rgba(248,244,240,1), 0 0 40px rgba(248,244,240,0.8)"}}>
          Not Just a Trip.<br/><span style={{fontStyle:"italic",fontWeight:400,color:"#C8956C"}}>A Memory</span> You Can Hold.
        </h2>
      </div>

      {/* Subtitle hint */}
      <div style={{position:"absolute",top:"2.34%",left:"41.68%",textAlign:"center",zIndex:2,pointerEvents:"none"}}>
        <p style={{fontSize:13,color:"#8A7A68",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.06em",textShadow:"0 1px 8px rgba(248,244,240,0.9)"}}>Click the objects to learn more</p>
      </div>

      {/* Interactive hotspots */}
      {hotspots.map((h,i)=>(
        <div key={i}
          onClick={()=>setActiveService(SERVICES[h.serviceIdx])}
          onMouseEnter={()=>setHoveredIdx(i)}
          onMouseLeave={()=>setHoveredIdx(null)}
          style={{position:"absolute",left:h.left+"%",top:h.top+"%",width:h.width+"%",height:h.height+"%",transform:`rotate(${h.rotation}deg)`,zIndex:1,cursor:"pointer",borderRadius:6,transition:"all 0.4s ease",boxShadow:hoveredIdx===i?"0 0 30px rgba(200,149,108,0.4), inset 0 0 30px rgba(200,149,108,0.08)":"none",background:hoveredIdx===i?"rgba(200,149,108,0.08)":"transparent",border:hoveredIdx===i?"1px solid rgba(200,149,108,0.25)":"1px solid transparent"}}>
          {/* Service label on hover */}
          {hoveredIdx===i&&<div style={{position:"absolute",bottom:"105%",left:"50%",transform:"translateX(-50%) rotate("+(-h.rotation)+"deg)",whiteSpace:"nowrap",padding:"6px 14px",background:"rgba(42,36,32,0.85)",backdropFilter:"blur(8px)",borderRadius:6,boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>
            <span style={{fontSize:12,fontWeight:600,color:"#F5F0EB",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.08em"}}>{SERVICES[h.serviceIdx].title}</span>
          </div>}
        </div>
      ))}
      <ServiceModal service={activeService} onClose={()=>setActiveService(null)}/>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 3: TRAVEL GUIDES — picture frames on a wall
// ══════════════════════════════════════════════════════════════
const GUIDES=[
  {city:"Madrid",country:"Spain",img:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=500&q=80",tagline:"Tapas, plazas & golden light",budget:"$2,800 – $4,200",duration:"7 nights",highlight:"Rooftop sunset at Círculo de Bellas Artes"},
  {city:"Tuscany",country:"Italy",img:"https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=500&q=80",tagline:"Rolling hills & Chianti roads",budget:"$3,200 – $5,000",duration:"8 nights",highlight:"Private vineyard tasting in Montalcino"},
  {city:"Kauai",country:"Hawaii",img:"https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=500&q=80",tagline:"The Garden Isle, untouched",budget:"$3,500 – $5,500",duration:"6 nights",highlight:"Nā Pali Coast helicopter tour at sunrise"},
  {city:"Hvar",country:"Croatia",img:"https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=500&q=80",tagline:"Lavender, stone & Adriatic blue",budget:"$2,400 – $3,800",duration:"5 nights",highlight:"Sunset kayak to the Pakleni Islands"},
  {city:"Seattle",country:"USA",img:"https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=500&q=80",tagline:"Coffee, rain & emerald views",budget:"$1,800 – $3,000",duration:"4 nights",highlight:"Ferry ride to Bainbridge Island"},
  {city:"Rome",country:"Italy",img:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&q=80",tagline:"Eternal city, timeless film",budget:"$2,600 – $4,400",duration:"6 nights",highlight:"Private twilight Colosseum tour"},
];

function GuideModal({guide,onClose}){
  if(!guide)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,18,15,0.4)",backdropFilter:"blur(10px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:640,maxHeight:"85vh",background:"#FDFBF8",borderRadius:16,overflow:"hidden",boxShadow:"0 40px 120px rgba(0,0,0,0.4)"}}>
        <div style={{height:260,background:`url(${guide.img}) center/cover`,position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.4)",border:"none",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>×</button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"36px 28px 18px",background:"linear-gradient(transparent,rgba(0,0,0,0.6))"}}>
            <h3 style={{fontSize:28,fontWeight:300,color:"#fff",fontFamily:"'Cormorant Garamond',serif",margin:0}}>{guide.city}, <span style={{fontStyle:"italic"}}>{guide.country}</span></h3>
          </div>
        </div>
        <div style={{padding:"24px 28px 32px",overflowY:"auto",maxHeight:"calc(85vh - 260px)"}}>
          <p style={{fontSize:13,color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,margin:"0 0 16px"}}>{guide.tagline}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:22}}>
            {[{l:"Budget Range",v:guide.budget},{l:"Duration",v:guide.duration},{l:"Highlight",v:guide.highlight}].map((s,i)=>(
              <div key={i} style={{padding:"12px 14px",background:"rgba(200,149,108,0.05)",border:"1px solid rgba(200,149,108,0.1)"}}>
                <div style={{fontSize:9,color:"#8A7A68",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:5,fontFamily:"'Cormorant Garamond',serif"}}>{s.l}</div>
                <div style={{fontSize:12.5,color:"#2A2420",fontWeight:500,fontFamily:"'Cormorant Garamond',serif"}}>{s.v}</div>
              </div>
            ))}
          </div>
          <h4 style={{fontSize:15,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 10px"}}>What's Included</h4>
          <p style={{fontSize:12.5,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.75,marginBottom:20}}>
            Round-trip flights & airport transfers · Hand-picked accommodations · Custom day-by-day itinerary with restaurant reservations · Canon AE-1 camera + Kodak UltraMax 400 film · Film development & high-res scans · Emergency travel support
          </p>
          <h4 style={{fontSize:15,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 10px"}}>Sample Itinerary</h4>
          <p style={{fontSize:12.5,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.75,marginBottom:20}}>
            <strong>Day 1:</strong> Arrival & neighborhood orientation walk · <strong>Day 2:</strong> Guided cultural excursion & local market visit · <strong>Day 3:</strong> Free exploration with curated recommendations · <strong>Day 4:</strong> Signature experience ({guide.highlight}) · <strong>Day 5+:</strong> Adventures tailored to your interests · <strong>Final Day:</strong> Farewell breakfast & departure
          </p>
          <h4 style={{fontSize:15,fontWeight:600,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:"0 0 10px"}}>Restaurant Picks</h4>
          <p style={{fontSize:12.5,color:"#6A5A48",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.75,margin:0}}>
            Each guide includes 4–6 curated restaurant recommendations — from hidden family-run spots to celebrated dining rooms — with reservation details, dress code, and our personal menu picks.
          </p>
        </div>
      </div>
    </div>
  );
}

function TravelGuidesSection(){
  const[selected,setSelected]=useState(null);
  const frames=[
    {left:30.77,top:4.94,width:11.02,height:31.22,...GUIDES[0]},
    {left:45.28,top:5.05,width:12.43,height:31.22,...GUIDES[1]},
    {left:61.47,top:4.94,width:11.38,height:31.33,...GUIDES[2]},
    {left:30.82,top:42.14,width:11.02,height:33.49,...GUIDES[3]},
    {left:45.33,top:42.25,width:12.32,height:33.49,...GUIDES[4]},
    {left:61.47,top:42.25,width:11.38,height:33.49,...GUIDES[5]},
  ];
  return(
    <section style={{width:"100vw",height:"100vh",position:"relative",overflow:"hidden",flexShrink:0}}>
      <img src="/guides-wall.png" alt="" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",pointerEvents:"none"}}/>
      {/* Title — right of frames, top-aligned with Kauai frame, left-aligned text */}
      <div style={{position:"absolute",left:"77.77%",top:"3.45%",textAlign:"left",zIndex:2}}>
        <div style={{fontSize:"clamp(9px,0.85vw,12px)",fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#C8956C",fontFamily:"'Cormorant Garamond',serif",marginBottom:6}}>Explore</div>
        <h2 style={{fontSize:"clamp(20px,2.5vw,34px)",fontWeight:300,color:"#2A2420",fontFamily:"'Cormorant Garamond',serif",margin:0,lineHeight:1.15,textShadow:"0 1px 12px rgba(255,255,255,0.8)"}}>
          Travel<br/>Guide<br/><span style={{fontStyle:"italic",color:"#C8956C"}}>Showcase</span>
        </h2>
      </div>
      {/* Photos positioned over frames */}
      {frames.map((f,i)=>(
        <div key={i} style={{position:"absolute",left:f.left+"%",top:f.top+"%",width:f.width+"%",height:f.height+"%",zIndex:1}}>
          <div onClick={()=>setSelected(f)} style={{width:"100%",height:"100%",overflow:"hidden",cursor:"pointer"}}>
            <img src={f.img} alt={f.city} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.5s cubic-bezier(0.16,1,0.3,1)",filter:"brightness(0.97)"}}
              onMouseOver={e=>{e.currentTarget.style.transform="scale(1.06)";e.currentTarget.style.filter="brightness(1.02)";}}
              onMouseOut={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.filter="brightness(0.97)";}}/>
          </div>
        </div>
      ))}
      <GuideModal guide={selected} onClose={()=>setSelected(null)}/>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION 4: ABOUT
// ══════════════════════════════════════════════════════════════
function AboutSection(){
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#2A2420",position:"relative",overflow:"hidden",flexShrink:0}}>
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
            We're Josh and Bella — a couple who fell in love with the world through the lens of a 1976 Canon AE-1. What started as a hobby on our first trip to Europe in Tuscany turned into an obsession: analog photography, intentional travel, and the irreplaceable feeling of holding a developed roll of film from a trip you'll never forget.
          </p>
          <p style={{fontSize:16,color:"rgba(245,240,235,0.6)",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,margin:0}}>
            AE-1 Viewpoint was born from the belief that the best trips aren't the most expensive — they're the most intentional. We plan every detail so you can be present, camera in hand, capturing moments the way they were meant to be captured.
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
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));
  const iS={width:"100%",padding:"14px 16px",border:"none",borderBottom:"1px solid rgba(200,149,108,0.2)",background:"transparent",color:"#2A2420",fontSize:16,fontFamily:"'Cormorant Garamond',serif",outline:"none",transition:"border-color 0.3s"};
  return(
    <section style={{width:"100vw",height:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"flex-start",background:"#FDFBF8",position:"relative",overflow:"hidden",flexShrink:0}}>
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
            <button onClick={()=>setSubmitted(true)} style={{width:"100%",padding:"16px",borderRadius:0,background:"#2A2420",color:"#F5F0EB",border:"none",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.12em",textTransform:"uppercase",transition:"all 0.3s"}}
              onMouseOver={e=>e.currentTarget.style.background="#C8956C"}
              onMouseOut={e=>e.currentTarget.style.background="#2A2420"}>
              Send Inquiry
            </button>
            <p style={{fontSize:12,color:"#A89A88",textAlign:"center",fontFamily:"'Cormorant Garamond',serif",margin:0}}>No commitment — just a conversation about your perfect trip.</p>
          </div>
        )}
      </div>
    </section>
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::selection{background:rgba(200,149,108,0.3);color:#2A2420}::-webkit-scrollbar{display:none}input::placeholder,textarea::placeholder{color:#A89A88}input:focus,textarea:focus{outline:none}`}</style>
      <SectionNav active={activeSection} onNav={scrollToSection}/>
      <GlobeTab onClick={()=>setPage("globe")} dark={DARK_SECTIONS[activeSection]}/>
      <div ref={containerRef} style={{width:"100vw",height:"100vh",overflow:"hidden"}}>
        <HeroSection/>
        <HowItWorksSection/>
        <TravelGuidesSection/>
        <AboutSection/>
        <GetStartedSection/>
      </div>
    </div>
  );
}
