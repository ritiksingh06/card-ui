const SHEET_NAME = 'Click Logs';

function doPost(event) {
  const sheet = getLogSheet_();
  const payload = parsePayload_(event);

  sheet.appendRow([
    new Date(),
    payload.readableTime || '',
    payload.timestamp || '',
    payload.action || '',
    payload.pageUrl || '',
    payload.referrer || '',
    payload.viewport || '',
    payload.userAgent || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput('Ishita sorry card logger is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getLogSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Received At',
      'Readable Time',
      'ISO Timestamp',
      'Action',
      'Page URL',
      'Referrer',
      'Viewport',
      'User Agent'
    ]);
  }

  return sheet;
}

function parsePayload_(event) {
  try {
    return JSON.parse(event.postData.contents || '{}');
  } catch (error) {
    return { action: 'invalid log payload', raw: event.postData && event.postData.contents };
  }
}