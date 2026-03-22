import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https;//lwncavmdvloxxssbgyeu.supabase.co;
const supabaseAnonKey = import.meta.env.sb_publishable_JElXPhMCuM4Iri728GZsVQ_UOLALXD0 ;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);