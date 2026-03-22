import { createClient } from '@supabase/supabase-js';

// pega as variáveis do .env (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// validação (evita tela branca silenciosa)
if (!supabaseUrl) {
  throw new Error('❌ VITE_SUPABASE_URL não definida no .env');
}

if (!supabaseAnonKey) {
  throw new Error('❌ VITE_SUPABASE_ANON_KEY não definida no .env');
}

// cria o client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);