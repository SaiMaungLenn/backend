const fetch = require('node-fetch');

const TELEGRAM_BOT_TOKEN = '7729679602:AAF-YwGBK91IaVgUIp9zF4xvaMkuJJcqQrs';
const TELEGRAM_CHAT_ID = '7552675526';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const text = `📩 New Contact Form Submission\n\n` +
                 `👤 Name: ${name}\n` +
                 `📧 Email: ${email}\n` +
                 (subject ? `📝 Subject: ${subject}\n` : '') +
                 `💬 Message:\n${message}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      throw new Error('Telegram API error: ' + telegramData.description);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
