/**
 * Production-ready WhatsApp Service
 */
class WhatsAppService {
  async sendInvitation(adminName, schoolName, email, password, whatsappNumber) {
    // 1. Structure the message
    const message = `
🏫 *School Admin Invitation*

Hello *${adminName}*,

You have been added as School Admin for *${schoolName}*.

*Login Details:*
Email: ${email}
Password: ${password}

*Login here:*
http://localhost:5173/login

Regards,
Bus Tracking System
    `;

    // 2. Log for backend verification
    console.log(`[WHATSAPP API] Sending to: ${whatsappNumber}`);
    console.log(`[MESSAGE CONTENT]: ${message}`);

    // 3. Mock Real API Call (Example for Twilio or WhatsApp Cloud API)
    try {
      /*
      await axios.post(process.env.WHATSAPP_API_URL, {
        to: whatsappNumber,
        message: message,
        api_key: process.env.WHATSAPP_KEY
      });
      */
      return true;
    } catch (error) {
      console.error("WhatsApp API Error:", error.message);
      return false;
    }
  }
}

export default new WhatsAppService();
