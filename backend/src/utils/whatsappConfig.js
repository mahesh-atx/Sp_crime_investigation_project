/**
 * WhatsApp Configuration
 * Easily switch between test mode and production mode
 */

const { sendWhatsAppTemplate } = require('./whatsapp');
const { sendWhatsAppTemplateTest } = require('./whatsappTest');

// Get mode from environment variable
const MODE = process.env.WHATSAPP_MODE || 'test'; // 'test' or 'production'

console.log(`\n📱 WhatsApp Mode: ${MODE.toUpperCase()}`);
if (MODE === 'test') {
  console.log('⚠️  Using TEST MODE - Messages will be simulated and logged\n');
} else {
  console.log('✅ Using PRODUCTION MODE - Messages will be sent via Meta API\n');
}

/**
 * Wrapper function - sends real or test messages based on config
 */
const sendWhatsAppMessage = async (to, templateName, parameters = []) => {
  if (MODE === 'test') {
    return sendWhatsAppTemplateTest(to, templateName, parameters);
  } else {
    return sendWhatsAppTemplate(to, templateName, parameters);
  }
};

module.exports = { sendWhatsAppMessage };
