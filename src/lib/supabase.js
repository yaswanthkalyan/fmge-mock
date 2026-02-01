import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zonlpomnxihjaxcgdgyt.supabase.co"

const supabaseAnonKey = "sb_publishable_ic1DpqbypkozgDy6Mw6TCg_vIaXAyFG";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);