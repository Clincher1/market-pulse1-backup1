import { useState, useEffect } from 'react';
import { NewsItem } from '@/data/mockData';
import { fetchRawNews } from '@/data/liveNews';

export function useLiveNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const raw = await fetchRawNews();
      if (isMounted) {
        setNews(raw);
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 300_000); // обновление каждые 5 минут
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { news, loading };
}