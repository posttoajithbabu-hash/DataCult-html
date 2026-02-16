/**
 * Google Apps Script - Assessment form handler
 * Deploy as Web App: Publish > Deploy as web app
 * Set "Execute as: Me" and "Who has access: Anyone"
 * Copy the web app URL into assets/js/custom/assessment.js SUBMIT_URL
 *
 * Setup:
 * 1. Create a new Google Sheet for assessment responses
 * 2. Add sheet headers in row 1: Timestamp, Vertical, Role, Outcome, Focus Area, Focus Area Other, Systems, Systems Other, Connectivity, Cadence, Blocker, Readiness, Email, Name, Company
 * 3. Replace SHEET_ID and RECIPIENT_EMAIL below
 */

function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No data received');
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.vertical || '',
      data.role || '',
      data.outcome || '',
      data.focus_area || '',
      data.focus_area_other || '',
      (data.systems || []).join(', '),
      data.systems_other || '',
      data.connectivity || '',
      data.cadence || '',
      data.blocker || '',
      data.readiness || '',
      data.email || '',
      data.name || '',
      data.company || ''
    ]);

    var recipientEmail = data.email || 'your-team@company.com';
    var subject = 'Assessment submitted: ' + (data.vertical || 'Unknown') + ' - ' + (data.focus_area || data.outcome || '');
    var body = 'New assessment received.\n\n' +
      'Vertical: ' + (data.vertical || '') + '\n' +
      'Role: ' + (data.role || '') + '\n' +
      'Outcome: ' + (data.outcome || '') + '\n' +
      'Focus Area: ' + (data.focus_area || '') + (data.focus_area_other ? ' - ' + data.focus_area_other : '') + '\n' +
      'Systems: ' + (data.systems || []).join(', ') + '\n' +
      'Connectivity: ' + (data.connectivity || '') + '\n' +
      'Cadence: ' + (data.cadence || '') + '\n' +
      'Blocker: ' + (data.blocker || '') + '\n' +
      'Readiness: ' + (data.readiness || '') + '\n\n' +
      'Contact: ' + (data.email || '') + ' / ' + (data.name || '') + ' / ' + (data.company || '');

    MailApp.sendEmail(recipientEmail, subject, body);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
