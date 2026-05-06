export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint' });
  }

  // Pass key as both header AND query param as the API docs show
  params['rapidapi-key'] = process.env.POKEMON_API_KEY;

  const qs = new URLSearchParams(params).toString();
  const url = `https://pokemon-tcg-api.p.rapidapi.com/${endpoint}?${qs}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': process.env.POKEMON_API_KEY,
        'x-rapidapi-host': 'pokemon-tcg-api.p.rapidapi.com'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
}
