const nodemailer = require('nodemailer');

const isEmailConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const getTransporter = () => {
  if (!isEmailConfigured()) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('Email skipped (local mode — EMAIL_PASS not set)');
    return null;
  }

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

const sendContactNotification = async ({ name, email, subject, message }) => {
  const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `Portfolio Contact: ${subject || name}`,
    html,
  });
};

module.exports = { sendEmail, sendContactNotification };
