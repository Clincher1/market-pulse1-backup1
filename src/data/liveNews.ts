import { NewsItem } from './mockData';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hekzplfftannlzwvgwwm.supabase.co';
const supabaseKey = 'sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchRawNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('cached_news')
      .select('*')
      .order('id', { ascending: false }); 

    if (error || !data || data.length === 0) throw new Error('Нет новостей в кэше');

    return data as NewsItem[];
  } catch (e) {
    console.error('Ошибка загрузки новостей из базы:', e);
    return [];
  }
}

// Заглушка
export async function analyzeNewsWithGroq() {
  return { sentiment: 0, importance: 5, impacts: [{ asset: 'S&P 500', direction: 'up' as const }] };
}