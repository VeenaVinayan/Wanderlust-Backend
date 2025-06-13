import crypto from 'crypto';

class OtpHelper{
     
    public static generateOtp(length: number = 6) : string {
        const otp : string = crypto.randomInt(10 ** 5, 10 ** 6).toString();
        return otp;
     }
     public static generateEmailBody(otp : string) : string {
        const body : string= `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Wanderlust</h2>
        <p> Hi,</p>
        <p>We received a request to authenticate your account. Use the following OTP to complete the process:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">${otp}</div>
        <p>This OTP is valid for <strong>1 minute</strong>.</p>
        <p>If you didn’t request this, please ignore this email or contact our support team at support@example.com.</p>
        <p>Thanks,<br>The Wanderlust Team</p>
        <hr>
        <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply directly to this message.</p>
      </div>`;
      return body;
     }
}

export default OtpHelper;

    