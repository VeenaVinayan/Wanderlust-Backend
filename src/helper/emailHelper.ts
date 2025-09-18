import { IBookingCompleteData } from '../Types/Booking.types';

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
    public static generateBookingEmailBody(bookingData: IBookingCompleteData) {
      const email = bookingData.email;
      const title="Booking Confirmation - Wanderlust Travels";
      const body =`<div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
                   <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                   <h2 style="color: #4CAF50;">🌍 Your Trip is Confirmed!</h2>
                   <p>Hi <strong>${bookingData.userDetails.name}</strong>,</p>

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
    public static generateBookingNotificationToAgent(bookingData : IBookingCompleteData){
      const email = bookingData.agentDetails.email;
      const title = "New Booking Notification - Wanderlust Travels";
      const body = `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #4CAF50;">📩 New Booking Alert!</h2>
                    <p>Dear Agent,</p>
                    <p>You have a new booking request from <strong>${bookingData.userDetails.name}</strong>. Here are the details:</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <h3 style="color: #333;">Booking Details:</h3>
                    <p><strong>Package:</strong> ${bookingData.packageDetails.name}</p>
                    <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
                    <p><strong>User Email ID:</strong> ${bookingData.email}</p>
                    <p><strong>Phone:</strong> ${bookingData.phone}</p>
                    <p><strong>Trip Date:</strong> ${bookingData.tripDate}</p>
                    <p><strong>Total Guests:</strong> ${bookingData.totalGuest}</p>
                    <p><strong>Total Amount:</strong> ₹${bookingData.totalAmount}</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <h3 style="color: #333;">Next Steps:</h3>
                    <ul>
                      <li>Review the booking details.</li>
                      <li>Contact the customer if needed.</li>
                      <li>Update the booking status in your dashboard.</li>
                    </ul>
                    <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:`;
                    return { email,title, body};
    }
    public static generateCancellationNotification(bookingData : IBookingCompleteData){
      const email = bookingData.email;
      const title = "Cancellation of Booking Notification - Wanderlust Travels";
      const body = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f4f4f4; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <h2 style="color: #e53935; margin-bottom: 10px;">❗ Booking Cancelled</h2>
              <p style="font-size: 16px; line-height: 1.6;">
                Dear <strong>${bookingData.userDetails.name}</strong>,
              </p>
              
              <p style="font-size: 16px; line-height: 1.6;">
                We regret to inform you that your booking for the <strong>${bookingData.packageDetails.name}</strong> has been <strong>cancelled</strong> due to an unforeseen emergency situation.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #666;">
                We sincerely apologize for the inconvenience caused. We understand how important your travel plans are and we assure you this decision was not taken lightly.
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

              <h3 style="color: #333; margin-bottom: 10px;">📋 Booking Summary</h3>
              <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
              <p><strong>Package:</strong> ${bookingData.packageDetails.name}</p>
              <p><strong>Trip Date:</strong> ${new Date(bookingData.tripDate).toLocaleDateString()}</p>
              <p><strong>Total Guests:</strong> ${bookingData.totalGuest}</p>
              <p><strong>Total Amount:</strong> ₹${bookingData.totalAmount}</p>
              <p><strong>Email:</strong> ${bookingData.email}</p>
              <p><strong>Phone:</strong> ${bookingData.phone}</p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

              <h3 style="color: #333;">What Happens Next?</h3>
              <ul style="padding-left: 20px; color: #555;">
                <li>We will initiate a full refund (if applicable) within 3–5 business days.</li>
                <li>Our team may contact you for further clarification or assistance.</li>
                <li>If you'd like to reschedule or book an alternative package, we’re happy to help.</li>
              </ul>

              <p style="margin-top: 30px; font-size: 16px; color: #666;">
                Again, we deeply regret any inconvenience this may have caused. Please feel free to reach out to our support team at <a href="mailto:support@example.com" style="color: #1e88e5;">support@example.com</a> for any questions or concerns.
              </p>

              <p style="margin-top: 40px; font-size: 15px; color: #999;">— The Wanderlust Team</p>
           </div>
         </div>
    `;
    return { email,title, body};
 }
                      
    
}
export default EmailHelper;