exports.welcomeEmail = (firstName) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f9fc; padding: 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(33,203,243,0.08);">
      <tr>
        <td style="padding: 32px 40px 16px 40px; text-align: center;">
          <img src="https://i.imgur.com/8Km9tLL.png" alt="Adverse Logo" width="80" style="margin-bottom: 16px;" />
          <h2 style="color: #1976d2; margin-bottom: 8px;">Welcome to Adverse, ${firstName || "User"}!</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 40px 24px 40px; color: #333;">
          <p style="font-size: 18px; margin-bottom: 16px;">
            We're excited to have you join our platform.
          </p>
          <p style="font-size: 16px; margin-bottom: 16px;">
            Your account has been created successfully. You can now log in and start exploring advertising opportunities, manage your profile, and connect with our vibrant community.
          </p>
          <p style="font-size: 16px; margin-bottom: 24px;">
            If you have any questions or need assistance, our support team is here to help you at any time.
          </p>
          <a href="https://your-app-url.com/login" style="display: inline-block; padding: 12px 32px; background: linear-gradient(90deg, #1976d2 60%, #21cbf3 100%); color: #fff; border-radius: 5px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Login to your account
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px 40px 32px 40px; color: #888; font-size: 14px; text-align: center;">
          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 16px;" />
          Thank you for choosing <span style="color: #1976d2; font-weight: bold;">Adverse</span>.<br/>
          <span style="font-size: 13px;">&copy; ${new Date().getFullYear()} Adverse. All rights reserved.</span>
        </td>
      </tr>
    </table>
  </div>
`;