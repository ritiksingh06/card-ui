# Server-Side Click Logs

GitHub Pages can host this card for free, but it cannot store server-side logs by itself. The easiest free backend is Google Sheets with Apps Script.

## Setup

1. Create a Google Sheet.
2. Open `Extensions > Apps Script`.
3. Paste the code from `google-apps-script-logger.js` into Apps Script.
4. Click `Deploy > New deployment`.
5. Choose `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Click `Deploy` and copy the Web App URL.
9. In `index.html`, replace this line:

```html
window.SORRY_CARD_LOG_ENDPOINT = window.SORRY_CARD_LOG_ENDPOINT || '';
```

with:

```html
window.SORRY_CARD_LOG_ENDPOINT = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```

After that, every card click still logs locally and also gets appended to the Google Sheet.

## What Gets Logged

- Button/action clicked
- Timestamp
- Page URL
- Referrer
- Viewport size
- Browser user agent