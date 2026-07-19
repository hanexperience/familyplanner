// Vercel serverless function — proxies the family calendar fetch.
// The calendar URL is a "secret" link (anyone who has it can read your
// calendar), so it lives server-side only, in the FAMILY_ICAL_URL
// environment variable — never in client code or git history.
//
// Set it in: Vercel → Project → Settings → Environment Variables
//   Name:  FAMILY_ICAL_URL
//   Value: your Google Calendar "Secret address in iCal format"
// Then redeploy.
export default async function handler(req, res) {
  const icalUrl = process.env.FAMILY_ICAL_URL;
  if (!icalUrl) {
    return res.status(500).send(
      'FAMILY_ICAL_URL environment variable is not set. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    );
  }

  try {
    const response = await fetch(icalUrl, {
      headers: { 'User-Agent': 'FamilyHub/1.0' }
    });
    if (!response.ok) return res.status(502).send('Upstream error');
    const text = await response.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min on Vercel edge
    res.send(text);
  } catch (e) {
    res.status(500).send('Failed to fetch calendar');
  }
}
