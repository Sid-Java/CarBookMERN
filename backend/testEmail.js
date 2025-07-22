const sendEmail = require('./utils/sendEmail');

async function testEmail() {
  try {
    await sendEmail(
      process.env.EMAIL_USER, // sending to yourself as a test
      'Test Email from Car Booking System',
      `
        <h1>Test Email</h1>
        <p>This is a test email from your car booking system.</p>
        <p>If you received this, your email configuration is working correctly!</p>
      `
    );
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

testEmail(); 