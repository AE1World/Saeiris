import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════
// AE-1 WORLD — Supabase Configuration
// PASTE YOUR KEYS BELOW
// ═══════════════════════════════════════════════════════

const SUPABASE_URL = 'https://kkwcrzxxtkjgnymhcbci.supabase.co' ;        // e.g. https://abcdefg.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_S17U2c6b5esKDTkb98ZaLA_MHl0rv1x' ; // starts with sb_publishable_...

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
