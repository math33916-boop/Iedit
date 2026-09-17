# I✨R-1 — Smart Editors & AI Assistant

Modern single-page website with:

- **Chat Screenshot Editor** (WhatsApp-style)
- **Screenshot Editor** (crop, blur, pixelate, stickers…)
- **PDF Editor**
- **Image Editor** (background removal, filters, convert…)
- **Document Tools** (PDF ↔ JPG, merge, split, compress)
- **AI Assistant** – helps write better prompts + guides AI edits
- **Contact section** with Osient + Truecaller + one extra number

## How to use

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
2. No build step required – pure HTML + CSS + JS.

## Update contact numbers

Open `index.html` and search for the Contact section.  
Replace the three placeholder numbers:

- Osient → your real number
- Truecaller → your real number
- Extra Number → any additional line you want

## Connect real AI (optional)

The AI chat currently uses smart simulated replies.  
To connect a real model (e.g. xAI Grok API):

1. Get an API key from https://console.x.ai
2. In `script.js`, replace the `generateAiReply` function with a `fetch` call to `https://api.x.ai/v1/chat/completions`
3. Keep the system prompt focused on editing help and prompt engineering.

## Customize

- Colors & fonts → `styles.css` (`:root` variables)
- Feature list → HTML feature cards
- AI personality → `generateAiReply` and the system messages

---

Built for **I✨R-1**
