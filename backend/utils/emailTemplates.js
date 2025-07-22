const registrationEmail = (name) => ({
  subject: 'Welcome to A&S Car Booking Service',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to A&S Car Booking Service!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with A&S Car Booking Service. We're excited to have you on board!</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our selection of vehicles</li>
        <li>Make bookings</li>
        <li>View your booking history</li>
      </ul>
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,<br>A&S Car Booking Team</p>
    </div>
  `
});

const bookingConfirmationEmail = (name, vehicleName, bookingDate, price) => ({
  subject: 'Booking Confirmation - A&S Car Booking Service',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Booking Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Your booking has been confirmed! Here are the details:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Vehicle:</strong> ${vehicleName}</p>
        <p><strong>Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ₹${price}</p>
      </div>
      <p>If you need to make any changes to your booking, please contact us.</p>
      <p>Thank you for choosing A&S Car Booking Service!</p>
      <p>Best regards,<br>A&S Car Booking Team</p>
    </div>
  `
});

const bookingCancellationEmail = (name, vehicleName, bookingDate) => ({
  subject: 'Booking Cancellation - A&S Car Booking Service',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Booking Cancellation</h2>
      <p>Dear ${name},</p>
      <p>Your booking has been cancelled as requested. Here are the details:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Vehicle:</strong> ${vehicleName}</p>
        <p><strong>Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
      </div>
      <p>If you wish to make a new booking, please visit our website.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,<br>A&S Car Booking Team</p>
    </div>
  `
});

module.exports = {
  registrationEmail,
  bookingConfirmationEmail,
  bookingCancellationEmail
}; 