THUMBNAIL STUDIO PRO — CLOUDFLARE PAGES PROJECT

Files:
- index.html
- functions/api/channel.js
- functions/api/images.js

This project uses Pixabay stock photographs and varied canvas layouts. It does NOT generate original AI images.
The gallery in this starter uses browser localStorage only. It is not cloud-synced and can be cleared by the browser.
Export size: 1280x720 PNG.

IMPORTANT DEPLOYMENT:
Cloudflare Pages Functions require a Pages project deployed with Functions support (for example, Git integration or Wrangler). A simple drag-and-drop static upload does not run these Functions.

After connecting this GitHub repository to Cloudflare Pages, add these environment secrets in the Pages project:
- YOUTUBE_API_KEY
- PIXABAY_API_KEY

Never put API keys in index.html or commit them to GitHub.
YouTube Data API and Pixabay have quotas/limits. Free availability and limits can change.
