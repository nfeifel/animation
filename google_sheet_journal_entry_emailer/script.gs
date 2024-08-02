function sendMemories() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('memories'); // Change 'memories' to your sheet name if different
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() is zero-based
  const currentDay = today.getDate();
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  let entries = [];
  
  for (let i = 1; i < values.length; i++) { // first row is headers
    const [date, memory] = values[i];
    const entryDate = new Date(date);
    
    if (entryDate.getDate() === currentDay && (entryDate.getMonth() + 1) === currentMonth) {
      const year = entryDate.getFullYear();
      const dayOfWeek = dayNames[entryDate.getDay()];
      entries.push(`<b>${year} (${dayOfWeek})</b>:<br>${memory}`);
    }
  }
  
  if (entries.length > 0) {
    const subject = `Memories on ${currentMonth}/${currentDay}`;
    const body = entries.join('<br><br>');
    const email = Session.getEffectiveUser().getEmail();
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
  }
}

function createTrigger() {
  ScriptApp.newTrigger('sendMemories')
    .timeBased()
    .everyDays(1)
    .atHour(7) // Change to the hour you want the email to be sent
    .create();
}
