import { ForecastData } from './mockData';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hekzplfftannlzwvgwwm.supabase.co';
const supabaseKey = 'sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchLiveForecasts(): Promise<ForecastData[]> {
  try {
    const { data, error } = await supabase
      .from('cached_forecasts')
      .select('*');

    if (error || !data || data.length === 0) {
      throw new Error('Нет прогнозов в кэше');
    }

    return data.map((item: any) => ({
      id: item.id,
      asset: item.asset,
      direction: item.direction,
      probability: item.probability,
      window: item.time_window, 
      confidence: item.confidence,
      reason: item.reason,
    }));
  } catch (e) {
    console.error('Ошибка загрузки прогнозов:', e);
    return [];
  }
}