const cron = require('node-cron');
const Case = require('../models/Case');
const { sendWhatsAppMessage } = require('../utils/whatsappConfig');

// Daily check at 10:00 AM
const startAlertJob = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('🚨 Running daily investigation alert check...');
    
    try {
      // 1. Update all days elapsed counts
      await Case.updateAllDaysElapsed();
      
      // 2. Fetch cases that need alerts
      const casesToAlert = await Case.find({
        isCompleted: false,
        $or: [
          { daysElapsed: 30 },
          { daysElapsed: 60 },
          { daysElapsed: { $gt: 60 } }
        ]
      });

      console.log(`📡 Found ${casesToAlert.length} cases requiring alerts.`);

      for (const caseDoc of casesToAlert) {
        let templateName = '';
        let params = [];
        
        // Note: You must register these template names in Meta Dashboard
        if (caseDoc.daysElapsed === 30) {
          templateName = 'investigation_reminder_30'; // {{1}} = FIR No
          params = [caseDoc.firNumber];
        } else if (caseDoc.daysElapsed === 60) {
          templateName = 'investigation_critical_60'; // {{1}} = FIR No
          params = [caseDoc.firNumber];
        } else {
          templateName = 'investigation_overdue'; // {{1}} = FIR No, {{2}} = days
          params = [caseDoc.firNumber, caseDoc.daysElapsed.toString()];
        }

        // WhatsApp number must include country code without '+' for Meta API
        // Assuming Indian numbers (91)
        const phone = `91${caseDoc.ioPhone.replace(/\D/g, '').slice(-10)}`; 
        
        await sendWhatsAppMessage(phone, templateName, params);
      }

    } catch (error) {
      console.error('❌ Error in daily alert job:', error);
    }
  });
  
  console.log('✅ Daily Alert Cron Job Scheduled (10 AM)');
};

module.exports = startAlertJob;
