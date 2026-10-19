import { AssetData } from './mockData';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hekzplfftannlzwvgwwm.supabase.co';
const supabaseKey = 'sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchLiveAssets(): Promise<AssetData[]> {
  try {
    const { data, error } = await supabase
      .from('cached_assets')
      .select('*');

    if (error || !data || data.length === 0) {
      throw new Error('Нет данных в кэше');
    }

    const order = ['usd-eur', 'sp500', 'brent', 'gold', 'btc'];
    const sortedData = order
      .map(id => data.find(d => d.id === id))
      .filter(Boolean) as AssetData[];

    // УМНОЖАЕМ ПРЯМО ЗДЕСЬ
    return sortedData.map(asset => {
      if (asset.id === 'sp500') {
        const rawPrice = parseFloat(asset.price.replace(/,/g, ''));
        return {
          ...asset,
          price: (rawPrice * 10).toLocaleString('en-US', { maximumFractionDigits: 0 }),
          sparkline: asset.sparkline.map(v => v * 10),
        };
      }
      if (asset.id === 'gold') {
        const rawPrice = parseFloat(asset.price.replace('$', '').replace(/,/g, ''));
        return {
          ...asset,
          price: '$' + (rawPrice * 10).toLocaleString('en-US', { maximumFractionDigits: 0 }),
          sparkline: asset.sparkline.map(v => v * 10),
        };
      }
      return asset;
    });
  } catch (e) {
    console.error('Ошибка загрузки кэша:', e);
    return [];
  }
}