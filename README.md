# Vegasty Public Profile — HTTPS server version

This project serves the Vegasty HTML page over HTTP/HTTPS and provides a same-origin `/api/lookup` endpoint for **public Roblox profile data only**.

## Deploy (simple option: Render)

1. Extract this ZIP on a computer, or upload the folder to a GitHub repository.
2. Create a new **Web Service** on Render and connect that repository.
3. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
4. Deploy, then open the HTTPS URL Render gives you.
5. Use the username lookup on the page.

## Run locally
Requires Node.js 18+:
```sh
npm install
npm start
```
Then open `http://localhost:3000`.

## Safety and limits
- No Roblox password, `.ROBLOSECURITY` cookie, session token, or 2FA code is collected.
- Only public profile, creation date, description, and avatar thumbnail are queried.
- Roblox or the hosting provider can still rate-limit or block requests.
