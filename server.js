const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Accept': 'application/json', ...(options.headers || {}) },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error(`Roblox API returned HTTP ${response.status}`);
  return response.json();
}

app.post('/api/lookup', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  if (!username || username.length > 40) {
    return res.status(400).json({ error: 'Enter a valid Roblox username.' });
  }

  try {
    const lookup = await fetchJson('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });
    const found = lookup.data?.[0];
    if (!found) return res.status(404).json({ error: 'No public account found for that username.' });

    const detail = await fetchJson(`https://users.roblox.com/v1/users/${encodeURIComponent(found.id)}`);
    let avatarUrl = '';
    try {
      const thumbs = await fetchJson(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(found.id)}&size=150x150&format=Png&isCircular=false`
      );
      avatarUrl = thumbs.data?.[0]?.imageUrl || '';
    } catch (_) {}

    res.set('Cache-Control', 'no-store');
    return res.json({ ...detail, id: found.id, avatarUrl });
  } catch (error) {
    console.error('Public profile lookup failed:', error.message);
    return res.status(502).json({ error: 'Could not retrieve public Roblox data right now. Please try again later.' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Vegasty is running on port ${PORT}`));
