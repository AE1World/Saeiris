# Saeiris

**Luxury travel planning and analog film photography.**  
Live site: [saeiris.com](https://saeiris.com)

---

## What It Is

Saeiris is a bespoke travel planning studio run by Josh and Bella. We design fully custom international trips — flights, boutique accommodations, restaurant reservations, day-by-day itineraries — and document them on film.

Before every trip, a fully serviced 1976 Canon AE-1 loaded with Kodak UltraMax 400 ships to the client. After the trip, the film is developed, scanned, and the best shots are pinned to the PhotoGlobe.

Current destinations: Madrid · Tuscany · Kauai · Hvar · Seattle · Rome

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React (no TypeScript) |
| Styling | Inline React styles only |
| Backend / Auth | Supabase |
| Globe | react-globe.gl (WebGL / Three.js) |
| Email | Resend + Zoho Mail |
| Hosting | Vercel |
| Domain | saeiris.com |

---

## Local Development

```bash
cd C:\Users\jveld\photoglobe
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Deploy:** `git push` to `main` — Vercel auto-deploys in ~2 minutes.

---

## Environment Variables

Create a `.env` file in the project root (never commit this):


VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


These are also set in Vercel under Project Settings → Environment Variables.

---

## Project Structure
src/

App.jsx          # Full homepage — all 5 sections and city modals

photoglobe.jsx   # PhotoGlobe page — auth, uploads, likes, globe

supabase.js      # Supabase client (uses env vars)

main.jsx         # React entry point

public/

earth-day-8k.jpg # 16K globe texture

hero-bg.png      # Hero section background

[city].png       # City frame photos (Madrid, Tuscany, Kauai, Hvar, Seattle, Rome)

supabase/

functions/

send-inquiry/  # Edge function — contact form → Resend → hello@saeiris.com

---

Built by [Josh Veldman](https://github.com/AE1World) and Bella.
