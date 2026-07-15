const brevoInstance = require("../config/brevo");

async function sendEmail({ to, subject, html }) {
  await brevoInstance.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },

    to: [
      {
        email: to,
      },
    ],

    subject,

    htmlContent: html,
  });
}

module.exports = {
  sendEmail,
};
