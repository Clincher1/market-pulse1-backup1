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

    // Применяем коэффициенты для "красивых" цифр
    return sortedData.map(asset => {
      // S&P 500 (было 763, станет ~7630)
      if (asset.id === 'sp500') {
        return {
          ...asset,
          price: (parseFloat(asset.price.replace(/,/g, '')) * 10).toLocaleString('en-US', { maximumFractionDigits: 0 }),
          sparkline: asset.sparkline.map(v => v * 10),
        };
      }
      // Gold (было 382, станет ~3820)
      if (asset.id === 'gold') {
        return {
          ...asset,
          price: '$' + (parseFloat(asset.price.replace('$', '').replace(/,/g, '')) * 10).toLocaleString('en-US', { maximumFractionDigits: 0 }),
          sparkline: asset.sparkline.map(v => v * 10),
        };
      }
      // Brent (переименовываем в USO)
      if (asset.id === 'brent') {
        return {
          ...asset,
          name: 'USO (Нефть)',
        };
      }
      return asset;
    });
  } catch (e) {
    console.error('Ошибка загрузки кэша:', e);
    return [];
  }
}