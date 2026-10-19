import { TensionData } from './mockData';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hekzplfftannlzwvgwwm.supabase.co';
const supabaseKey = 'sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchLiveTension(): Promise<TensionData | null> {
  try {
    const { data, error } = await supabase
      .from('cached_tension')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) throw new Error('Нет данных о напряжённости');

    return {
      current: data.value,
      label: data.label,
      history: data.history || [],
      newsCount: data.news_count,
    };
  } catch (e) {
    console.error('Ошибка загрузки напряжённости:', e);
    return null;
  }
}