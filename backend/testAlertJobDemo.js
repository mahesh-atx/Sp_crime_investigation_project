/**
 * WhatsApp Test Demo - Simple version without database connection
 * Shows how messages will look without needing MongoDB
 * 
 * Usage: node testAlertJobDemo.js
 */

require('dotenv').config();
const { sendWhatsAppTemplateTest } = require('./src/utils/whatsappTest');

const testAlertJobDemo = async () => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 WhatsApp Alert System - TEST MODE DEMO');
    console.log('='.repeat(70) + '\n');

    // Simulate 3 test cases
    const testCases = [
      {
        firNumber: 'FIR-2025-001',
        daysElapsed: 30,
        templateName: 'investigation_reminder_30',
        phone: '919876543210',
        ioName: 'SI Sharma',
        description: '30 Days - Investigation Reminder'
      },
      {
        firNumber: 'FIR-2025-002',
        daysElapsed: 60,
        templateName: 'investigation_critical_60',
        phone: '919876543211',
        ioName: 'Insp. Kumar',
        description: '60 Days - Critical Alert'
      },
      {
        firNumber: 'FIR-2025-003',
        daysElapsed: 75,
        templateName: 'investigation_overdue',
        phone: '919876543212',
        ioName: 'Const. Patel',
        description: '75 Days - Overdue Alert'
      }
    ];

    console.log('📊 TEST CASES TO BE PROCESSED:');
    console.log('─'.repeat(70));
    testCases.forEach((testCase, index) => {
      console.log(`${index + 1}. ${testCase.description}`);
      console.log(`   FIR: ${testCase.firNumber}`);
      console.log(`   Officer: ${testCase.ioName}`);
      console.log(`   Phone: ${testCase.phone}`);
      console.log();
    });

    console.log('\n' + '='.repeat(70));
    console.log('📱 SIMULATING MESSAGE SENDING');
    console.log('='.repeat(70) + '\n');

    // Send test messages
    for (const testCase of testCases) {
      const params = testCase.daysElapsed === 75 
        ? [testCase.firNumber, testCase.daysElapsed.toString()]
        : [testCase.firNumber];

      await sendWhatsAppTemplateTest(testCase.phone, testCase.templateName, params);
      
      // Add delay between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ TEST DEMO COMPLETED SUCCESSFULLY');
    console.log('='.repeat(70));
    
    console.log('\n📝 MESSAGE LOG DETAILS:');
    console.log('─'.repeat(70));
    console.log('Location: ./logs/whatsapp-test.log');
    console.log('Format: JSON');
    console.log('Contains: Timestamp, Phone, Template, Parameters, Message ID');
    console.log('\n✨ In production mode with real Meta credentials,');
    console.log('   these messages would be sent to officers\' WhatsApp phones!\n');

    console.log('🔧 Next Steps:');
    console.log('1. Review the messages above');
    console.log('2. Check logs/whatsapp-test.log for full details');
    console.log('3. When ready for production:');
    console.log('   - Create Meta Business Account');
    console.log('   - Create message templates');
    console.log('   - Get API credentials');
    console.log('   - Update .env with WHATSAPP_MODE=production');
    console.log('   - Fill in real credentials\n');

  } catch (error) {
    console.error('❌ Error in test demo:', error.message);
    process.exit(1);
  }
};

// Run the demo
testAlertJobDemo();
