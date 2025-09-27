
// import { env } from 'process'; // Removed

interface WhatsAppMessagePayload {
  to: string; // Recipient phone number in international format
  type: 'text';
  text: { body: string };
  // Future: add template support
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts?: Array<{ input: string; wa_id: string }>;
  messages?: Array<{ id: string }>;
  error?: { message: string; type: string; code: number; fbtrace_id: string };
}

const WHATSAPP_CLOUD_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`; // Use process.env

export const whatsappClient = {
  sendWhatsAppMessage: async (payload: WhatsAppMessagePayload): Promise<WhatsAppResponse> => {
    if (process.env.WHATSAPP_NOTIFICATIONS_ENABLED !== 'true') { // Use process.env
      console.log('WhatsApp notifications are disabled. Message not sent.', payload);
      return { messaging_product: 'whatsapp' }; // Return a mock success
    }

    const token = process.env.WHATSAPP_CLOUD_API_TOKEN; // Use process.env
    if (!token) {
      console.error('WhatsApp Cloud API token is not set.');
      throw new Error('WhatsApp Cloud API token is not set.');
    }

    if (!process.env.WHATSAPP_PHONE_NUMBER_ID) { // Use process.env
      console.error('WhatsApp Phone Number ID is not set.');
      throw new Error('WhatsApp Phone Number ID is not set.');
    }

    try {
      const response = await fetch(WHATSAPP_CLOUD_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: payload.to,
          type: payload.type,
          text: payload.text,
        }),
      });

      const data: WhatsAppResponse = await response.json();

      if (!response.ok) {
        console.error(`Failed to send WhatsApp message to ${payload.to}: `, data);
        throw new Error(data.error?.message || 'Failed to send WhatsApp message');
      }

      console.log(`WhatsApp message sent successfully to ${payload.to}. Message ID: ${data.messages?.[0]?.id}`);
      // Log to a more persistent store in a real application
      return data;
    } catch (error) {
      console.error(`Error sending WhatsApp message to ${payload.to}: `, error);
      throw error;
    }
  },
};
