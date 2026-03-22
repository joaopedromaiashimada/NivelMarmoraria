import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwncavmdvloxxssbgyeu.supabase.co'
const supabaseKey = 'sb_publishable_JElXPhMCuM4Iri728GZsVQ_UOLALXD0'

export const supabase = createClient(supabaseUrl, supabaseKey)