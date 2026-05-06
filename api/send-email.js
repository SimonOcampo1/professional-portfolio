const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        await resend.emails.send({
            // Replace with a verified Resend sender domain, e.g. contact@yourdomain.com
            // Use onboarding@resend.dev only for testing with your own Resend account address
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: 'ocamposimon1@gmail.com',
            reply_to: email,
            subject: `New contact from ${name} — Portfolio`,
            html: `
                <div style="font-family: 'Space Grotesk', sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #fff; padding: 40px; border-radius: 12px;">
                    <h2 style="color: #8c8c8c; font-size: 24px; margin-bottom: 24px; letter-spacing: 0.1em; text-transform: uppercase;">New Contact Message</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; width: 100px;">Name</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 16px;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em;">Email</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 16px;"><a href="mailto:${email}" style="color: #8c8c8c;">${email}</a></td>
                        </tr>
                    </table>
                    <div style="margin-top: 32px;">
                        <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Message</p>
                        <p style="font-size: 16px; line-height: 1.7; color: #e5e5e5;">${message.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }
};
