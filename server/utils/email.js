import nodemailer from 'nodemailer';

// Create transporter — uses Gmail by default, configure via .env
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send a welcome email to a newly registered user
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  // Skip if email credentials are not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured — skipping welcome email for', userEmail);
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Brado" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎉 Welcome to Brado — Your Premium Shopping Destination!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#059669,#047857);padding:40px 40px 30px;text-align:center;">
                    <div style="background:rgba(255,255,255,0.2);display:inline-block;padding:12px 24px;border-radius:12px;margin-bottom:16px;">
                      <span style="color:#ffffff;font-size:28px;font-weight:800;letter-spacing:1px;">B</span>
                      <span style="color:#ffffff;font-size:28px;font-weight:800;letter-spacing:1px;margin-left:4px;">Brado</span>
                    </div>
                    <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:16px 0 8px;">Welcome Aboard! 🎉</h1>
                    <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Your premium shopping experience starts now</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
                      Hi <strong style="color:#059669;">${userName}</strong>,
                    </p>
                    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
                      Thank you for joining <strong>Brado</strong> — your premium quick-commerce destination! 
                      We're thrilled to have you as part of our growing community of smart shoppers.
                    </p>

                    <!-- Features -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                      <tr>
                        <td style="padding:14px 16px;background:#f0fdf4;border-radius:12px;margin-bottom:8px;">
                          <table><tr>
                            <td style="padding-right:12px;font-size:22px;vertical-align:top;">🚚</td>
                            <td>
                              <strong style="color:#059669;font-size:14px;">Lightning-Fast Delivery</strong>
                              <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">Get your orders delivered in 10–30 minutes</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:14px 16px;background:#eff6ff;border-radius:12px;">
                          <table><tr>
                            <td style="padding-right:12px;font-size:22px;vertical-align:top;">🛍️</td>
                            <td>
                              <strong style="color:#2563eb;font-size:14px;">Premium Products</strong>
                              <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">From Mobiles to Fashion — everything you need</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:14px 16px;background:#fdf4ff;border-radius:12px;">
                          <table><tr>
                            <td style="padding-right:12px;font-size:22px;vertical-align:top;">💰</td>
                            <td>
                              <strong style="color:#9333ea;font-size:14px;">Best Prices</strong>
                              <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">Exclusive deals and offers just for you</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:8px 0 28px;">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                             style="display:inline-block;background:linear-gradient(135deg,#22c55e,#059669);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
                            Start Shopping →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;">

                    <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;text-align:center;">
                      Need help? Our AI support assistant is available 24/7 on the website,
                      or email us at <a href="mailto:support@brado.com" style="color:#059669;text-decoration:none;">support@brado.com</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="color:#9ca3af;font-size:11px;margin:0;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
                      © 2026 Brado • Premium Quick Commerce
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Welcome email sent to', userEmail, '— Message ID:', info.messageId);
    return info;
  } catch (error) {
    // Don't throw — email failure shouldn't block registration
    console.error('📧 Failed to send welcome email:', error.message);
    return null;
  }
};
