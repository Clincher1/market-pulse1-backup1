import { next } from '@vercel/edge';

export const config = {
  matcher: '/',
};

export default async function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Проверяем, бот ли это
  const isBot = /bot|crawler|spider|telegram|whatsapp|facebook|twitter|linkedin|slack|discord|claude|gpt|deepseek/i.test(userAgent);

  // Если это НЕ бот, сразу отдаем обычный React-сайт
  if (!isBot) {
    return next();
  }

  // Если это бот — пытаемся отдать HTML с данными
  try {
    const [tensionRes, assetsRes, newsRes] = await Promise.all([
      fetch('https://hekzplfftannlzwvgwwm.supabase.co/rest/v1/cached_tension?select=*&apikey=sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-'),
      fetch('https://hekzplfftannlzwvgwwm.supabase.co/rest/v1/cached_assets?select=*&apikey=sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-'),
      fetch('https://hekzplfftannlzwvgwwm.supabase.co/rest/v1/cached_news?select=*&apikey=sb_publishable_FPAh2Z30aCCKpbfDdDrM_g_urRwk8r-&limit=5')
    ]);

    // Если хоть один запрос упал, отдаем обычный сайт
    if (!tensionRes.ok || !assetsRes.ok || !newsRes.ok) {
      return next();
    }

    const tension = await tensionRes.json();
    const assets = await assetsRes.json();
    const news = await newsRes.json();

    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Market Pulse — Аналитика новостей и рынков</title>
        <meta name="description" content="Профессиональная аналитика мировых новостей и рынков на основе искусственного интеллекта.">
      </head>
      <body>
        <h1>Market Pulse</h1>
        <h2>Шкала напряжённости мира: ${tension[0]?.value || 0} (${tension[0]?.label || 'Нет данных'})</h2>
        
        <h2>Ключевые активы</h2>
        <ul>
          ${assets.map((a: any) => `<li>${a.name}: ${a.price} (${a.change > 0 ? '+' : ''}${a.change}%)</li>`).join('')}
        </ul>

        <h2>Лента новостей</h2>
        <ul>
          ${news.map((n: any) => `<li>${n.source}: ${n.title} (Тональность: ${n.sentiment}, Важность: ${n.importance})</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (e) {
    // Если произошла любая ошибка (например, таймаут), отдаем обычный сайт
    return next();
  }
}