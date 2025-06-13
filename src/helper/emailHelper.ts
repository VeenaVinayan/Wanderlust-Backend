
class EmailHelper{

    public static generateEmailBody(token: string){
        
        const body: string = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Welcome Back to Wanderlust</h2>
        <p>Hi,</p>
        <p>Please click on the link mentioned below for reset password it will expires after 15 minutus:</p>
        <div style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:3000/resetPassword/${token}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Resend Email</a>
        </div>
        <p>If you didn’t request this, please ignore this email or contact our support Team !! </p>
        <p>Thanks,<br>The Wanderlust Team</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply directly to this message.</p>
      </div>`;

      return body;
    }

    public static generateBookingEmailBody(bookingData: any) {
      const email = bookingData.email;
      const title="Booking Confirmation - Wanderlust Travels";
      const body =`<div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
                   <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                   <h2 style="color: #4CAF50;">🌍 Your Trip is Confirmed!</h2>
                   <p>Hi <strong>{{userName}}</strong>,</p>

                   <p>Thank you for booking your adventure with <strong>Wanderlust</strong>! We're excited to have you on board. Below are your booking details:</p>

                   <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

                  <h3 style="color: #333;">📄 Booking Summary:</h3>
                  <p><strong>Package:</strong> Package </p>
                  <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
                  <p><strong>Trip Date:</strong> ${bookingData.bookingDate}</p>
                  <p><strong>Guests:</strong> ${bookingData.totalGuest}</p>
                  <p><strong>Total Amount:</strong> ₹${bookingData.totalAmount}</p>
                  <p><strong>Status:</strong> ${bookingData.tripStatus}</p>
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  <h3 style="color: #333;">🧳 What's Next?</h3>
                  <ul>
                     <li>We'll contact you soon with more trip details.</li>
                     <li>Make sure to check your email for updates or changes.</li>
                     <li>You can always reach out to us for any questions.</li>
                  </ul>
                  <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@wanderlust.com">support@wanderlust.com</a>.</p>
                  <p>We can’t wait to see you on your journey!</p>
                  <p style="margin-top: 30px;">Warm regards,<br><strong>Team Wanderlust</strong></p>
                  <div style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
                  © 2025 Wanderlust Travels. All rights reserved.
                  </div>
                </div>
              </div>
              `;
             return { email, title, body} 
    }
               
}
export default EmailHelper;