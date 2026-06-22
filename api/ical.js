export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url param');

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'FamilyHub/1.0' }
    });
    if (!response.ok) return res.status(502).send('Upstream error');
    const text = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min on Vercel edge
    res.send(text);
  } catch (e) {
    res.status(500).send('Failed to fetch calendar');
  }
}
