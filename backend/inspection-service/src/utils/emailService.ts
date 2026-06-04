import nodemailer from 'nodemailer';

export async function sendEmailToInspectors(message: string): Promise<boolean> {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (SMTP_EMAIL && SMTP_PASSWORD && SMTP_PASSWORD !== 'your_app_password_here') {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SMTP_EMAIL,
          pass: SMTP_PASSWORD,
        },
      });

      // Assuming you might fetch actual inspector emails from the auth service in the future.
      // For now, we'll just send an alert to the SMTP_EMAIL itself or you can pass a list.
      const mailOptions = {
        from: SMTP_EMAIL,
        to: SMTP_EMAIL, // Send to self as a test, or map to inspectors
        subject: 'New Inspection Scheduled',
        text: message,
      };

      console.log(`[EMAIL SERVICE] Sending email via Nodemailer...`);
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Email sent successfully.`);
      return true;
    } catch (error) {
      console.error(`[EMAIL SERVICE] Failed to send email via Nodemailer:`, error);
      throw new Error('Failed to send email to inspectors.');
    }
  }

  // Fallback to Mock email service if no real credentials are provided
  console.log(`[EMAIL SERVICE MOCK] Sending mock email to all inspectors: ${message}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        console.log(`[EMAIL SERVICE MOCK] Email sent successfully.`);
        resolve(true);
      } else {
        console.error(`[EMAIL SERVICE MOCK] Failed to send email! Network error.`);
        reject(new Error('Failed to send email to inspectors.'));
      }
    }, 1000); 
  });
}
