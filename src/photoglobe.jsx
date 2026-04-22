import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabase";

// ══════════════════════════════════════════════════════════════
// AE-1 WORLD — PhotoGlobe v4
// - Local 8K NASA texture (earth-day-8k.jpg in /public)
// - Bump map for terrain relief
// - Smooth WebGL rotation via react-globe.gl
// ══════════════════════════════════════════════════════════════

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
      if(mode==="login"){const{error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;}
      else{const{error}=await supabase.auth.signUp({email,password,options:{data:{username,display_name:displayName||username}}});if(error)throw error;}
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
      <div style={{textAlign:"center",fontSize:13,color:"#5A8CA8"}}>{mode==="login"?"Don't have an account? ":"Already have an account? "}<button onClick={()=>{setMode(mode==="login"?"signup":"login");setError(null);}} style={{background:"none",border:"none",color:"#2AA6D4",cursor:"pointer",fontWeight:600,fontSize:13}}>{mode==="login"?"Sign Up":"Sign In"}</button></div>
    </div>
  </div>);
}

// ── Globe Canvas ──
function GlobeCanvas({photos, selectedId, onSelect}){
  const globeRef = useRef();
  const containerRef = useRef();
  const [GlobeComponent, setGlobeComponent] = useState(null);
  const [dims, setDims] = useState({w: window.innerWidth, h: window.innerHeight});

  // Load react-globe.gl dynamically
  useEffect(()=>{
    import('react-globe.gl').then(mod=>{setGlobeComponent(()=>mod.default);});
  },[]);

  // Resize observer
  useEffect(()=>{
    const ro = new ResizeObserver(entries=>{
      for(const e of entries) setDims({w:e.contentRect.width, h:e.contentRect.height});
    });
    if(containerRef.current) ro.observe(containerRef.current);
    return ()=>ro.disconnect();
  },[]);

  // Controls + bump map once globe is ready
  useEffect(()=>{
    if(!globeRef.current) return;

    // Smooth rotation + damping
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    globeRef.current.pointOfView({lat:20, lng:-20, altitude:2.2});

    // Apply bump map for terrain relief + boost lighting
    import('three').then(THREE=>{
      const mat = globeRef.current.globeMaterial();
      mat.bumpScale = 12;

      // Bump map — makes mountains physically raised
      new THREE.TextureLoader().load(
        '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png',
        tex=>{ mat.bumpMap = tex; mat.needsUpdate = true; }
      );

      // Boost lighting so globe isn't too dark on shadow side
      const scene = globeRef.current.scene();
      scene.traverse(obj=>{
        if(obj.isAmbientLight) obj.intensity = 1.4;
        if(obj.isDirectionalLight){ obj.intensity = 1.6; obj.position.set(3,1,2); }
      });
    });
  },[GlobeComponent]);

  // Pin data
  const pointsData = useMemo(()=>photos.map(p=>({
    ...p,
    lat: p.lat,
    lng: p.lon,
    size: p.id === selectedId ? 1.8 : 1.0,
    color: p.id === selectedId ? '#FFB347' : '#FF6B35',
  })),[photos, selectedId]);

  if(!GlobeComponent) return(
    <div ref={containerRef} style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{color:'#5A8CA8',fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>Loading globe...</div>
    </div>
  );

  return(
    <div ref={containerRef} style={{width:'100%',height:'100%'}}>
      <GlobeComponent
        ref={globeRef}
        width={dims.w}
        height={dims.h}
        backgroundColor="rgba(0,0,0,0)"

        // Local 8K NASA texture — sharp at any zoom level
        globeImageUrl="/earth-day-8k.jpg"

        // Atmosphere glow
        showAtmosphere={true}
        atmosphereColor="#5AAAD4"
        atmosphereAltitude={0.18}

        // Photo pins
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.012}
        pointResolution={12}
        onPointClick={(point)=>onSelect(point.id === selectedId ? null : point.id)}
        onPointHover={(point)=>{document.body.style.cursor = point ? 'pointer' : 'default';}}

        // Label on selected pin
        labelsData={pointsData.filter(p=>p.id===selectedId)}
        labelLat="lat"
        labelLng="lng"
        labelText={p=>p.city||p.title||''}
        labelSize={1.2}
        labelColor={()=>'#ffffff'}
        labelAltitude={0.025}
        labelResolution={2}
      />
    </div>
  );
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

// ── Location Search ──
function LocationSearch({onSelect,style}){
  const[query,setQuery]=useState("");const[results,setResults]=useState([]);const[loading,setLoading]=useState(false);const[selected,setSelected]=useState(null);
  const debounceRef=useRef(null);
  const search=useCallback((q)=>{
    if(q.length<2){setResults([]);return;}setLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,{headers:{"Accept-Language":"en"}})
      .then(r=>r.json()).then(data=>{setResults(data.map(d=>{const city=d.address?.city||d.address?.town||d.address?.village||d.address?.hamlet||d.address?.municipality||d.address?.county||"";return{display:d.display_name,lat:parseFloat(d.lat),lon:parseFloat(d.lon),city,state:d.address?.state||"",country:d.address?.country||""};
      }));setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  const handleChange=(e)=>{const v=e.target.value;setQuery(v);setSelected(null);if(debounceRef.current)clearTimeout(debounceRef.current);debounceRef.current=setTimeout(()=>search(v),350);};
  const handleSelect=(r)=>{setSelected(r);setQuery(r.display);setResults([]);onSelect(r);};
  return(<div style={{position:"relative",marginBottom:14}}>
    <div style={{position:"relative"}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A8CA8" strokeWidth="2" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <input value={query} onChange={handleChange} placeholder="Search a city or address..." style={{...style,paddingLeft:38}}/>
      {loading&&<div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"#5A8CA8"}}>...</div>}
    </div>
    {selected&&<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"rgba(42,166,212,0.08)",border:"1px solid rgba(42,166,212,0.2)",fontSize:12,color:"#2AA6D4",display:"flex",alignItems:"center",gap:6}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      {selected.city}{selected.state?`, ${selected.state}`:""}, {selected.country}
    </div>}
    {results.length>0&&!selected&&<div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:10,background:"#0A1620",border:"1px solid #1A3040",borderRadius:10,marginTop:4,overflow:"hidden",boxShadow:"0 12px 40px rgba(0,0,0,0.4)",maxHeight:240,overflowY:"auto"}}>
      {results.map((r,i)=><div key={i} onClick={()=>handleSelect(r)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #1A3040",fontSize:13,color:"#E0EEF4",display:"flex",alignItems:"flex-start",gap:8}} onMouseOver={e=>e.currentTarget.style.background="rgba(42,166,212,0.08)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A8CA8" strokeWidth="2" style={{marginTop:2,flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div style={{minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.display}</div>
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
      if(imgFile){const ext=imgFile.name.split('.').pop();const path=`${user.id}/${Date.now()}.${ext}`;const{error:uploadErr}=await supabase.storage.from('photos').upload(path,imgFile);if(uploadErr)throw uploadErr;const{data}=supabase.storage.from('photos').getPublicUrl(path);image_url=data.publicUrl;}
      const{error:insertErr}=await supabase.from('photos').insert({user_id:user.id,title,lat:parseFloat(lat),lon:parseFloat(lon),city,country,image_url,camera,lens:lens||null,film_type:filmType||null,aperture:aperture||null,shutter_speed:shutter||null,iso:iso||null,focal_length:focalLength||null,flash:"Off",white_balance:"Auto",tags:tags.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean),captured_at:new Date().toISOString()});
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
          <label><span style={lS}>Film Stock</span><input value={filmType} onChange={e=>setFilmType(e.target.value)} placeholder="Kodak Portra 400" style={{...iS,marginBottom:14}}/></label>
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
      <button onClick={()=>onNavigate&&onNavigate("home")} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"transparent",color:"#5A8CA8",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>Back to Site</button>
      <div style={{padding:"8px 16px",borderRadius:8,background:"rgba(42,166,212,0.2)",color:"#2AA6D4",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Globe</div>
    </div>
  </div>);
}

// ── Main Export ──
export default function PhotoGlobe({onNavigate}){
  const[photos,setPhotos]=useState([]);const[selectedId,setSelectedId]=useState(null);
  const[showUpload,setShowUpload]=useState(false);const[showAuth,setShowAuth]=useState(false);
  const[filter,setFilter]=useState("all");const[search,setSearch]=useState("");
  const[sidebar,setSidebar]=useState(true);
  const[user,setUser]=useState(null);const[userLikes,setUserLikes]=useState(new Set());

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session)setUser(session.user);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setUser(session?.user||null);});
    return()=>subscription.unsubscribe();
  },[]);

  const loadPhotos=useCallback(async()=>{
    const{data,error}=await supabase.from('photos_with_likes').select('*').order('created_at',{ascending:false});
    if(!error&&data)setPhotos(data);
  },[]);
  useEffect(()=>{loadPhotos();},[loadPhotos]);

  useEffect(()=>{
    if(!user)return;
    supabase.from('likes').select('photo_id').eq('user_id',user.id).then(({data})=>{if(data)setUserLikes(new Set(data.map(l=>l.photo_id)));});
  },[user,photos]);

  const photosWithLikes=useMemo(()=>photos.map(p=>({...p,user_liked:userLikes.has(p.id)})),[photos,userLikes]);

  const handleLike=async(photoId)=>{
    if(!user){setShowAuth(true);return;}
    const liked=userLikes.has(photoId);
    if(liked){await supabase.from('likes').delete().eq('user_id',user.id).eq('photo_id',photoId);setUserLikes(prev=>{const n=new Set(prev);n.delete(photoId);return n;});}
    else{await supabase.from('likes').insert({user_id:user.id,photo_id:photoId});setUserLikes(prev=>new Set(prev).add(photoId));}
    loadPhotos();
  };

  const filtered=useMemo(()=>{
    let r=photosWithLikes;
    if(filter!=="all")r=r.filter(p=>p.tags?.includes(filter));
    if(search){const q=search.toLowerCase();r=r.filter(p=>p.title?.toLowerCase().includes(q)||p.city?.toLowerCase().includes(q)||p.country?.toLowerCase().includes(q)||p.camera?.toLowerCase().includes(q));}
    return r;
  },[photosWithLikes,filter,search]);

  const allTags=useMemo(()=>[...new Set(photos.flatMap(p=>p.tags||[]))].sort(),[photos]);
  const stats=useMemo(()=>({p:photos.length,c:new Set(photos.map(p=>p.country)).size,cam:new Set(photos.map(p=>p.camera)).size}),[photos]);
  const sel=photosWithLikes.find(p=>p.id===selectedId);

  return(<div style={{width:"100vw",height:"100vh",background:"#111A24",fontFamily:"'DM Sans',system-ui,sans-serif",display:"flex",overflow:"hidden",position:"relative",color:"#E0EEF4"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0A1620}::-webkit-scrollbar-thumb{background:#1A3040;border-radius:3px}input::placeholder{color:#3A6080}input:focus{border-color:rgba(42,166,212,0.5)!important}`}</style>

    {/* Sidebar */}
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
      <div style={{padding:"14px 20px",flexShrink:0,borderTop:"1px solid #1A3040"}}><button onClick={()=>{if(!user){setShowAuth(true);}else{setShowUpload(true);}}} style={{width:"100%",padding:"13px",borderRadius:12,background:"linear-gradient(135deg,#FF6B35,#ff8c5a)",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 20px rgba(255,107,53,0.25)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Upload Photo</button></div>
    </div>

    {/* Globe area */}
    <div style={{flex:1,position:"relative",overflow:"hidden"}}>
      <GlobeNav onNavigate={onNavigate}/>
      <button onClick={()=>setSidebar(!sidebar)} style={{position:"absolute",top:60,left:20,zIndex:40,width:40,height:40,borderRadius:10,background:"rgba(10,22,32,0.8)",border:"1px solid #1A3040",color:"#5A8CA8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{sidebar?<path d="M15 18l-6-6 6-6"/>:<path d="M9 18l6-6-6-6"/>}</svg></button>
      <div style={{position:"absolute",bottom:24,left:20,zIndex:40,display:"flex",gap:16,padding:"10px 16px",borderRadius:12,background:"rgba(10,22,32,0.8)",border:"1px solid #1A3040",backdropFilter:"blur(10px)",fontSize:11,color:"#5A8CA8"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:"#FF6B35",border:"2px solid #fff"}}/>Photo</div><div style={{color:"#3A6080"}}>Drag · Scroll to zoom</div></div>
      <GlobeCanvas photos={filtered} selectedId={selectedId} onSelect={id=>setSelectedId(selectedId===id?null:id)}/>
      {sel&&<PhotoDetail photo={sel} onClose={()=>setSelectedId(null)} onLike={handleLike} user={user}/>}
    </div>

    {showUpload&&user&&<UploadModal onClose={()=>setShowUpload(false)} onUpload={loadPhotos} user={user}/>}
    {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={()=>{loadPhotos();}}/>}
  </div>);
}
