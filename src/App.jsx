import { useState, useEffect, useRef, useCallback } from "react";
import PhotoGlobe from "./photoglobe";

// ═══════════════════════════════════════════════════════════
// AE-1 VIEWPOINT — Travel Agency + Film Camera Experience
// ═══════════════════════════════════════════════════════════

// Aesthetic: Editorial warmth meets analog nostalgia
// Fonts: Playfair Display (editorial headlines) + Libre Franklin (clean body)
// Colors: Cream (#FAF8F4) + Burnt Orange (#E8622A) + Warm Charcoal (#2A2A2A)

const COLORS = {
  cream: "#FAF8F4",
  warmWhite: "#FFF9F2",
  orange: "#E8622A",
  orangeLight: "#F0864E",
  orangeGlow: "rgba(232,98,42,0.08)",
  orangeGlow2: "rgba(232,98,42,0.15)",
  charcoal: "#2A2A2A",
  darkText: "#1E1E1E",
  bodyText: "#4A4A4A",
  muted: "#8A8580",
  border: "#E8E4DE",
  borderLight: "#F0EDE8",
  cardBg: "#FFFFFF",
};

const BEACH_PLACEHOLDER = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80";
const FILM_TEXTURE = "https://images.unsplash.com/photo-1495837174058-628aafc7d610?w=1920&q=80";
const CAMERA_IMG = "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&q=80";

function NavBar({ activePage, onNavigate, scrolled }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "how", label: "How It Works" },
    { id: "deals", label: "Deals & Experiences" },
    { id: "globe", label: "PhotoGlobe" },
    { id: "about", label: "About" },
    { id: "contact", label: "Get Started" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(250,248,244,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", border: `2px solid ${scrolled ? COLORS.orange : "#fff"}`,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={scrolled ? COLORS.orange : "#fff"} strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="7" r="1" fill={scrolled ? COLORS.orange : "#fff"}/>
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: 17, fontWeight: 700, fontFamily: "'Playfair Display',serif",
              color: scrolled ? COLORS.charcoal : "#fff", letterSpacing: "0.02em", transition: "color 0.4s",
            }}>AE-1 Viewpoint</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="desktop-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => onNavigate(l.id)}
              style={{
                padding: "8px 16px", borderRadius: 24, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: activePage === l.id ? 700 : 500,
                fontFamily: "'Libre Franklin',sans-serif", letterSpacing: "0.01em",
                background: activePage === l.id ? (scrolled ? COLORS.orangeGlow2 : "rgba(255,255,255,0.15)") : "transparent",
                color: activePage === l.id
                  ? (scrolled ? COLORS.orange : "#fff")
                  : (scrolled ? COLORS.bodyText : "rgba(255,255,255,0.8)"),
                transition: "all 0.3s",
              }}
              onMouseOver={e => { if (activePage !== l.id) e.currentTarget.style.background = scrolled ? COLORS.orangeGlow : "rgba(255,255,255,0.1)"; }}
              onMouseOut={e => { if (activePage !== l.id) e.currentTarget.style.background = "transparent"; }}
            >{l.label}</button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" stroke={scrolled ? COLORS.charcoal : "#fff"} strokeWidth="2" fill="none">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: "rgba(250,248,244,0.98)", backdropFilter: "blur(20px)", padding: "12px 40px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
          {links.map(l => (
            <button key={l.id} onClick={() => { onNavigate(l.id); setMenuOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "14px 0",
                background: "none", border: "none", borderBottom: `1px solid ${COLORS.borderLight}`,
                fontSize: 15, fontWeight: activePage === l.id ? 700 : 400, color: activePage === l.id ? COLORS.orange : COLORS.bodyText,
                fontFamily: "'Libre Franklin',sans-serif", cursor: "pointer",
              }}
            >{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── HERO / LANDING PAGE ──
function HomePage({ onNavigate }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${BEACH_PLACEHOLDER})`,
          backgroundSize: "cover", backgroundPosition: "center 40%",
          filter: "brightness(0.55) contrast(1.1) saturate(0.85)",
          transform: "scale(1.05)",
        }}/>
        {/* Film grain overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px)",
          mixBlendMode: "multiply", opacity: 0.5,
        }}/>
        {/* Warm vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(42,42,42,0.5) 100%)",
        }}/>

        <div style={{
          position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, padding: "0 32px",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{
            display: "inline-block", padding: "6px 20px", borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)", fontSize: 12, fontWeight: 600,
            color: "rgba(255,255,255,0.9)", letterSpacing: "0.15em", textTransform: "uppercase",
            fontFamily: "'Libre Franklin',sans-serif", marginBottom: 28,
          }}>Travel + Film Photography</div>

          <h1 style={{
            fontSize: "clamp(42px, 7vw, 80px)", fontFamily: "'Playfair Display',serif",
            fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: "0 0 24px",
            letterSpacing: "-0.02em",
          }}>
            See the World.<br/>
            <span style={{ color: COLORS.orange, fontStyle: "italic" }}>Shoot It on Film.</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.8)",
            lineHeight: 1.65, maxWidth: 560, margin: "0 auto 44px",
            fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300,
          }}>
            We plan your dream trip, handle every detail, and ship you a Canon AE-1
            with a roll of 36 exposures. Travel with intention. Come home with something real.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("contact")} style={{
              padding: "16px 36px", borderRadius: 32, border: "none",
              background: COLORS.orange, color: "#fff", fontSize: 15, fontWeight: 600,
              fontFamily: "'Libre Franklin',sans-serif", cursor: "pointer",
              boxShadow: "0 8px 32px rgba(232,98,42,0.4)",
              transition: "all 0.3s",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,98,42,0.5)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(232,98,42,0.4)"; }}
            >Plan My Trip</button>

            <button onClick={() => onNavigate("how")} style={{
              padding: "16px 36px", borderRadius: 32,
              border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)", color: "#fff", fontSize: 15, fontWeight: 500,
              fontFamily: "'Libre Franklin',sans-serif", cursor: "pointer",
              transition: "all 0.3s",
            }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >How It Works</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: loaded ? 0.6 : 0, transition: "opacity 1.5s ease 0.8s",
        }}>
          <span style={{ fontSize: 11, color: "#fff", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Libre Franklin',sans-serif" }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)" }}/>
        </div>
      </section>

      {/* Intro strip */}
      <section style={{ background: COLORS.cream, padding: "100px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "'Playfair Display',serif",
            fontWeight: 700, color: COLORS.charcoal, lineHeight: 1.15, margin: "0 0 24px",
          }}>
            Not Just a Trip.<br/>A <span style={{ color: COLORS.orange, fontStyle: "italic" }}>Memory</span> You Can Hold.
          </h2>
          <p style={{
            fontSize: 17, color: COLORS.bodyText, lineHeight: 1.75, fontFamily: "'Libre Franklin',sans-serif",
            fontWeight: 300,
          }}>
            We take care of every detail — flights, accommodation, excursions, and communication with hosts.
            But what sets us apart is what arrives at your door before you leave: a vintage Canon AE-1
            loaded with a fresh roll of 36 exposures. No filters. No edits. Just you and the world.
          </p>
        </div>
      </section>

      {/* 3 Feature Cards */}
      <section style={{ background: COLORS.warmWhite, padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          {[
            { icon: "✈", title: "Full-Service Planning", desc: "Flights, hotels, excursions — we handle everything. We negotiate directly with hosts to get you the best rates.", color: "#E8622A" },
            { icon: "📷", title: "Canon AE-1 Experience", desc: "A vintage film camera shipped to your door before departure. 36 shots to capture your journey the analog way.", color: "#C4550F" },
            { icon: "🌍", title: "Join the Globe", desc: "Your developed photos join our interactive PhotoGlobe — a growing map of real travel moments from real cameras.", color: "#A8460A" },
          ].map((f, i) => (
            <div key={i} style={{
              background: COLORS.cardBg, borderRadius: 20, padding: "44px 36px",
              border: `1px solid ${COLORS.border}`,
              transition: "all 0.3s", cursor: "default",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.06)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: COLORS.orangeGlow2,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, marginBottom: 24,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 21, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 12px" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: COLORS.bodyText, lineHeight: 1.7, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{
        background: COLORS.charcoal, padding: "80px 40px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          background: "repeating-linear-gradient(45deg, #fff 0px, transparent 1px, transparent 8px)",
        }}/>
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 38px)", fontFamily: "'Playfair Display',serif",
            fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.2,
          }}>Ready to See the World Differently?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginBottom: 32, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, lineHeight: 1.65 }}>
            Tell us where you dream of going. We'll take it from there.
          </p>
          <button onClick={() => onNavigate("contact")} style={{
            padding: "16px 40px", borderRadius: 32, border: "none",
            background: COLORS.orange, color: "#fff", fontSize: 15, fontWeight: 600,
            fontFamily: "'Libre Franklin',sans-serif", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(232,98,42,0.35)", transition: "all 0.3s",
          }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
          >Get Started</button>
        </div>
      </section>
    </div>
  );
}

// ── HOW IT WORKS ──
function HowItWorksPage() {
  const steps = [
    { num: "01", title: "Tell Us Your Dream Trip", desc: "Fill out a quick form with your destination ideas, dates, budget, and travel style. We'll take it from there.", icon: "💬" },
    { num: "02", title: "We Plan Everything", desc: "Flights, accommodation, excursions — we research, negotiate, and book the best options. We communicate directly with hosts to push for the best rates.", icon: "🗺" },
    { num: "03", title: "Your Camera Arrives", desc: "Before you leave, a Canon AE-1 loaded with a fresh roll of 36 exposures arrives at your door. A simple guide is included — no experience needed.", icon: "📦" },
    { num: "04", title: "Travel & Shoot", desc: "Experience your trip with intention. 36 shots means every frame matters. No screens, no filters — just you and the moment.", icon: "🌅" },
    { num: "05", title: "Send It Back", desc: "When you return, ship the camera back to us in the prepaid mailer. We handle the rest.", icon: "📮" },
    { num: "06", title: "Relive the Magic", desc: "We develop your film and send you the prints and digital scans. With your permission, your best shots join our PhotoGlobe for the world to see.", icon: "✨" },
  ];

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ background: COLORS.cream, padding: "80px 40px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 16px" }}>
          How It <span style={{ color: COLORS.orange, fontStyle: "italic" }}>Works</span>
        </h1>
        <p style={{ fontSize: 17, color: COLORS.muted, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, maxWidth: 500, margin: "0 auto" }}>
          From first message to developed film — here's the full experience.
        </p>
      </section>

      <section style={{ background: COLORS.cream, padding: "40px 40px 100px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 32, marginBottom: i < steps.length - 1 ? 0 : 0,
              position: "relative", paddingBottom: 48,
            }}>
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", left: 27, top: 60, bottom: 0, width: 2,
                  background: `linear-gradient(to bottom, ${COLORS.orange}, ${COLORS.border})`,
                }}/>
              )}
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: COLORS.orange, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 800, fontFamily: "'Libre Franklin',sans-serif",
                boxShadow: "0 4px 20px rgba(232,98,42,0.3)", zIndex: 2,
              }}>{s.num}</div>
              <div style={{ paddingTop: 6 }}>
                <div style={{ fontSize: 13, marginBottom: 8 }}>{s.icon}</div>
                <h3 style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: COLORS.bodyText, lineHeight: 1.7, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── DEALS & EXPERIENCES ──
function DealsPage() {
  const deals = [
    { dest: "Bali, Indonesia", price: "1,200", budget: "Budget-Friendly", duration: "7 nights", desc: "Rice terraces, temple visits, surf lessons, and sunset dinners. Includes private villa stay and local guide.", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", tag: "Popular" },
    { dest: "Amalfi Coast, Italy", price: "2,800", budget: "Mid-Range", duration: "5 nights", desc: "Coastal drives, lemon groves, boat tours, and handmade pasta classes in a cliffside hotel.", img: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=600&q=80", tag: "Romantic" },
    { dest: "Tokyo & Kyoto, Japan", price: "3,200", budget: "Mid-Range", duration: "10 nights", desc: "City neon and ancient temples. Street food tours, bullet train, ryokan stay, and cherry blossom walks.", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", tag: "Cultural" },
    { dest: "Patagonia, Chile", price: "4,500", budget: "Premium", duration: "8 nights", desc: "Glacier trekking, horseback riding, and luxury eco-lodge stays at the edge of the world.", img: "https://images.unsplash.com/photo-1508009603885-50cf7c8a1ee8?w=600&q=80", tag: "Adventure" },
    { dest: "Marrakech, Morocco", price: "1,600", budget: "Budget-Friendly", duration: "6 nights", desc: "Souks, Sahara camping, camel treks, and traditional riad accommodation in the old medina.", img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80", tag: "Exotic" },
    { dest: "Iceland Ring Road", price: "3,800", budget: "Premium", duration: "9 nights", desc: "Waterfalls, geysers, northern lights, and volcanic landscapes. Self-drive with curated stops.", img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&q=80", tag: "Photography" },
  ];

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ background: COLORS.cream, padding: "80px 40px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 16px" }}>
          Deals & <span style={{ color: COLORS.orange, fontStyle: "italic" }}>Experiences</span>
        </h1>
        <p style={{ fontSize: 17, color: COLORS.muted, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          Curated trips at every budget. Every package includes your Canon AE-1 film camera experience.
        </p>
      </section>

      <section style={{ background: COLORS.cream, padding: "40px 40px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 24 }}>
          {deals.map((d, i) => (
            <div key={i} style={{
              background: COLORS.cardBg, borderRadius: 20, overflow: "hidden",
              border: `1px solid ${COLORS.border}`, transition: "all 0.3s", cursor: "pointer",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.08)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", backgroundImage: `url(${d.img})`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform 0.5s" }}
                  className="deal-img"/>
                <div style={{
                  position: "absolute", top: 14, left: 14, padding: "5px 14px", borderRadius: 20,
                  background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)",
                  fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.05em",
                  fontFamily: "'Libre Franklin',sans-serif",
                }}>{d.tag}</div>
                <div style={{
                  position: "absolute", top: 14, right: 14, padding: "5px 14px", borderRadius: 20,
                  background: COLORS.orange, fontSize: 11, fontWeight: 700, color: "#fff",
                  fontFamily: "'Libre Franklin',sans-serif",
                }}>{d.budget}</div>
              </div>
              <div style={{ padding: "24px 28px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 20, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: 0 }}>{d.dest}</h3>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 13, color: COLORS.muted, fontFamily: "'Libre Franklin',sans-serif" }}>
                  <span>{d.duration}</span>
                  <span style={{ color: COLORS.border }}>·</span>
                  <span>Canon AE-1 included</span>
                </div>
                <p style={{ fontSize: 14, color: COLORS.bodyText, lineHeight: 1.65, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, margin: "0 0 20px" }}>{d.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Libre Franklin',sans-serif" }}>from </span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: COLORS.orange, fontFamily: "'Libre Franklin',sans-serif" }}>${d.price}</span>
                    <span style={{ fontSize: 12, color: COLORS.muted }}> /person</span>
                  </div>
                  <div style={{
                    padding: "8px 20px", borderRadius: 20, background: COLORS.orangeGlow2,
                    color: COLORS.orange, fontSize: 13, fontWeight: 600, fontFamily: "'Libre Franklin',sans-serif",
                  }}>View Details →</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── ABOUT ──
function AboutPage() {
  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ background: COLORS.cream, padding: "80px 40px 100px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 40px", textAlign: "center" }}>
            About <span style={{ color: COLORS.orange, fontStyle: "italic" }}>Us</span>
          </h1>

          {/* Photo placeholder */}
          <div style={{
            width: "100%", height: 400, borderRadius: 24, marginBottom: 48,
            backgroundImage: `url(${CAMERA_IMG})`,
            backgroundSize: "cover", backgroundPosition: "center",
            border: `1px solid ${COLORS.border}`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(42,42,42,0.6) 0%, transparent 50%)",
            }}/>
            <div style={{
              position: "absolute", bottom: 28, left: 28, color: "#fff",
              fontFamily: "'Libre Franklin',sans-serif",
            }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Your photo here</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>A photo of you and your wife will go here</div>
            </div>
          </div>

          <div style={{ fontFamily: "'Libre Franklin',sans-serif", color: COLORS.bodyText, fontSize: 17, lineHeight: 1.85, fontWeight: 300 }}>
            <p style={{ marginBottom: 24 }}>
              We're a husband-and-wife team who believe the best travel memories aren't stored on a phone — they're held in your hands.
              After years of planning trips for friends and family (and always packing our Canon AE-1), we turned our passion into AE-1 Viewpoint.
            </p>
            <p style={{ marginBottom: 24 }}>
              The idea is simple: we handle every detail of your trip — finding the best flights, negotiating with hosts for the best rates,
              booking excursions, managing all the back-and-forth communication — so you can focus entirely on the experience.
            </p>
            <p style={{ marginBottom: 24 }}>
              But what makes us different is the camera. Before every trip, we ship you a Canon AE-1 loaded with a fresh roll of 36 exposures.
              No digital backup. No do-overs. Just 36 chances to capture something real. When you get home, you send the camera back, and we develop your film.
            </p>
            <p>
              The wait. The anticipation. Then the moment you see your photos for the first time — that's the magic we're chasing.
              And if you'd like, your best shots join our PhotoGlobe: an ever-growing collection of real moments from real travelers, pinned to the places where they happened.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── CONTACT / GET STARTED ──
function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ background: COLORS.cream, padding: "80px 40px 100px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 16px" }}>
              Let's Plan Your <span style={{ color: COLORS.orange, fontStyle: "italic" }}>Trip</span>
            </h1>
            <p style={{ fontSize: 17, color: COLORS.muted, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300 }}>
              Tell us where you want to go. We'll handle the rest.
            </p>
          </div>

          {!submitted ? (
            <div style={{
              background: COLORS.cardBg, borderRadius: 24, padding: "44px 40px",
              border: `1px solid ${COLORS.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
            }}>
              {[
                { label: "Your Name", placeholder: "First and last name", type: "text" },
                { label: "Email", placeholder: "you@example.com", type: "email" },
                { label: "Where do you want to go?", placeholder: "e.g., Japan, Italy, Bali — or 'surprise me'", type: "text" },
                { label: "Travel Dates (approximate)", placeholder: "e.g., March 2026, flexible", type: "text" },
                { label: "Budget Range (per person)", placeholder: "e.g., $1,500 - $3,000", type: "text" },
                { label: "Group Size", placeholder: "e.g., 2 adults, couple, solo", type: "text" },
              ].map((field, i) => (
                <label key={i} style={{ display: "block", marginBottom: 20 }}>
                  <span style={{
                    display: "block", fontSize: 12, fontWeight: 600, color: COLORS.muted,
                    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
                    fontFamily: "'Libre Franklin',sans-serif",
                  }}>{field.label}</span>
                  <input type={field.type} placeholder={field.placeholder} style={{
                    width: "100%", padding: "14px 18px", borderRadius: 12,
                    border: `1px solid ${COLORS.border}`, background: COLORS.cream,
                    fontSize: 15, color: COLORS.charcoal, fontFamily: "'Libre Franklin',sans-serif",
                    outline: "none", transition: "border-color 0.3s",
                  }}
                    onFocus={e => e.currentTarget.style.borderColor = COLORS.orange}
                    onBlur={e => e.currentTarget.style.borderColor = COLORS.border}
                  />
                </label>
              ))}

              <label style={{ display: "block", marginBottom: 28 }}>
                <span style={{
                  display: "block", fontSize: 12, fontWeight: 600, color: COLORS.muted,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
                  fontFamily: "'Libre Franklin',sans-serif",
                }}>Anything else we should know?</span>
                <textarea placeholder="Special occasions, dietary needs, interests, must-see places..." rows={4} style={{
                  width: "100%", padding: "14px 18px", borderRadius: 12,
                  border: `1px solid ${COLORS.border}`, background: COLORS.cream,
                  fontSize: 15, color: COLORS.charcoal, fontFamily: "'Libre Franklin',sans-serif",
                  outline: "none", resize: "vertical", transition: "border-color 0.3s",
                }}
                  onFocus={e => e.currentTarget.style.borderColor = COLORS.orange}
                  onBlur={e => e.currentTarget.style.borderColor = COLORS.border}
                />
              </label>

              <div style={{
                padding: "14px 20px", borderRadius: 12, background: COLORS.orangeGlow,
                border: `1px solid ${COLORS.orangeGlow2}`, marginBottom: 28,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>📷</span>
                <span style={{ fontSize: 13, color: COLORS.bodyText, fontFamily: "'Libre Franklin',sans-serif", lineHeight: 1.5 }}>
                  Every trip includes our Canon AE-1 film camera experience — shipped to you before departure with a roll of 36 exposures.
                </span>
              </div>

              <button onClick={() => setSubmitted(true)} style={{
                width: "100%", padding: "16px", borderRadius: 12, border: "none",
                background: COLORS.orange, color: "#fff", fontSize: 16, fontWeight: 700,
                fontFamily: "'Libre Franklin',sans-serif", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(232,98,42,0.3)", transition: "all 0.3s",
              }}
                onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
              >Send My Trip Request</button>
            </div>
          ) : (
            <div style={{
              background: COLORS.cardBg, borderRadius: 24, padding: "64px 40px", textAlign: "center",
              border: `1px solid ${COLORS.border}`,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.1)",
                margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <h2 style={{ fontSize: 28, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: COLORS.charcoal, margin: "0 0 12px" }}>We're On It!</h2>
              <p style={{ fontSize: 16, color: COLORS.muted, fontFamily: "'Libre Franklin',sans-serif", fontWeight: 300, lineHeight: 1.65 }}>
                We'll be in touch within 24 hours with trip ideas tailored just for you. Start dreaming — we'll handle the rest.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ── GLOBE PAGE (wrapper) ──
function GlobePage() {
  return (
    <div style={{ paddingTop: 0, height: "100vh" }}>
      <PhotoGlobe />
    </div>
  );
}

// ── FOOTER ──
function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: COLORS.charcoal, padding: "64px 40px 40px", color: "rgba(255,255,255,0.6)",
      fontFamily: "'Libre Franklin',sans-serif",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${COLORS.orange}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="4"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display',serif" }}>AE-1 Viewpoint</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.65, maxWidth: 280, margin: 0 }}>
            Travel planning + film photography.<br/>See the world. Shoot it on film.
          </p>
        </div>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Navigate</div>
            {["home","how","deals","globe","about","contact"].map(id => (
              <div key={id}><button onClick={() => onNavigate(id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer", padding: "6px 0", fontFamily: "'Libre Franklin',sans-serif", display: "block" }}
                onMouseOver={e => e.currentTarget.style.color = COLORS.orange}
                onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              >{{home:"Home",how:"How It Works",deals:"Deals",globe:"PhotoGlobe",about:"About",contact:"Get Started"}[id]}</button></div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
        © {new Date().getFullYear()} AE-1 Viewpoint. All rights reserved.
      </div>
    </footer>
  );
}

// ── MAIN APP ──
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef(null);

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isGlobe = page === "globe";

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.cream,
      fontFamily: "'Libre Franklin',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Libre+Franklin:wght@200;300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${COLORS.cream}; }
        ::selection { background: ${COLORS.orangeGlow2}; color: ${COLORS.charcoal}; }
        input::placeholder, textarea::placeholder { color: #C4C0BA; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.cream}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {!isGlobe && <NavBar activePage={page} onNavigate={navigate} scrolled={page === "home" ? scrolled : true} />}

      <main>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "how" && <HowItWorksPage />}
        {page === "deals" && <DealsPage />}
        {page === "globe" && <GlobePage />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
      </main>

      {!isGlobe && <Footer onNavigate={navigate} />}
    </div>
  );
}
