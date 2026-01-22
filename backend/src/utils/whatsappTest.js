/**
 * WhatsApp Testing Utility - Simulates message sending without actual API
 * This is for development/testing purposes
 * Switch to whatsapp.js in production with real credentials
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Test function that simulates WhatsApp message sending
 * Logs messages to file and console instead of sending
 */
const sendWhatsAppTemplateTest = async (to, templateName, parameters = []) => {
  const timestamp = new Date().toISOString();
  
  // Format the message based on template
  let messageContent = '';
  
  switch(templateName) {
    case 'investigation_reminder_30':
      messageContent = `
🚨 Investigation Reminder

FIR ${parameters[0]} Investigation Status

Your investigation has been pending for 30 days. 
Please provide an update or closure status.

Action Required:
- Update investigation status
- Submit pending reports
- Upload evidence if applicable

Thank you,
Crime Investigation Dashboard
`;
      break;
      
    case 'investigation_critical_60':
      messageContent = `
🚨 CRITICAL: Investigation Overdue

FIR ${parameters[0]} - Investigation Status CRITICAL

Your investigation has exceeded 60 days!
Immediate action required.

⚠️ This case is now in CRITICAL status
⏰ 60 days have elapsed
📋 Court may reject if not disposed soon

URGENT Actions Needed:
1. Finalize investigation immediately
2. Submit final report to court
3. Upload all evidence to e-Sakshi
4. Schedule court appearance

Contact: Your Supervisor / Station Head

Crime Investigation Dashboard
`;
      break;
      
    case 'investigation_overdue':
      messageContent = `
🔴 OVERDUE: Investigation Severely Delayed

FIR ${parameters[0]} - ${parameters[1]} Days Elapsed

Your investigation is severely overdue!
IMMEDIATE ESCALATION REQUIRED

📊 Investigation Status: OVERDUE
⏰ Days Elapsed: ${parameters[1]} days (CRITICAL)
🚨 Court May Issue Contempt Notice

MANDATORY ACTIONS:
1. Report to Station Head IMMEDIATELY
2. File status report with Court
3. Complete investigation within 7 days
4. Upload all evidence to e-Sakshi
5. Prepare for judicial questioning

This case requires URGENT intervention.
Failure to act may result in legal consequences.

Contact your Police Station immediately.

Crime Investigation Dashboard
`;
      break;
      
    default:
      messageContent = `Template: ${templateName}\nParameters: ${parameters.join(', ')}`;
  }

  // Create log entry
  const logEntry = {
    timestamp,
    to,
    templateName,
    parameters,
    message: messageContent,
    status: 'SIMULATED',
    mockMessageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  // Log to console
  console.log('\n' + '='.repeat(70));
  console.log('📱 [TEST MODE] WhatsApp Message Simulation');
  console.log('='.repeat(70));
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`📞 To: ${to}`);
  console.log(`📋 Template: ${templateName}`);
  console.log(`🔢 Parameters: ${parameters.join(', ')}`);
  console.log('─'.repeat(70));
  console.log('📝 MESSAGE CONTENT:');
  console.log('─'.repeat(70));
  console.log(messageContent);
  console.log('─'.repeat(70));
  console.log(`✅ Mock Message ID: ${logEntry.mockMessageId}`);
  console.log('='.repeat(70) + '\n');

  // Write to test log file
  try {
    const logFile = path.join(logsDir, 'whatsapp-test.log');
    const logLine = `\n${JSON.stringify(logEntry, null, 2)}\n`;
    fs.appendFileSync(logFile, logLine);
    console.log(`📄 Logged to: ${logFile}`);
  } catch (error) {
    console.error('Error writing to log file:', error.message);
  }

  // Return mock response
  return {
    success: true,
    id: logEntry.mockMessageId,
    mode: 'TEST',
    timestamp,
    to,
    templateName,
    parameters,
    message: 'This is a simulated message. To send real messages, configure WhatsApp Business API credentials.'
  };
};

module.exports = { sendWhatsAppTemplateTest };
