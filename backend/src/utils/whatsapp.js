const axios = require('axios');

/**
 * Sends a WhatsApp message using Meta Cloud API
 * @param {string} to - Recipient phone number with country code (e.g. 91xxxxxxxxxx)
 * @param {string} templateName - The name of the approved template
 * @param {Array} parameters - Array of strings for template variables {{1}}, {{2}}, etc.
 */
const sendWhatsAppTemplate = async (to, templateName, parameters = []) => {
  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_ID } = process.env;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn('⚠️ WhatsApp credentials missing in .env. Falling back to log.');
    console.log(`[WHATSAPP LOG] To: ${to}, Template: ${templateName}, Vars: ${parameters.join(', ')}`);
    return { success: false, message: 'Credentials missing' };
  }

  const url = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`;
  
  const data = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en_US'
      },
      components: [
        {
          type: 'body',
          parameters: parameters.map(val => ({
            type: 'text',
            text: val
          }))
        }
      ]
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ WhatsApp sent to ${to}: ${response.data.messages[0].id}`);
    return { success: true, id: response.data.messages[0].id };
  } catch (error) {
    console.error('❌ WhatsApp API Error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

module.exports = { sendWhatsAppTemplate };
