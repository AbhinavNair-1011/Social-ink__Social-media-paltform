const { BrevoClient } = require("@getbrevo/brevo");

const brevoInstance = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

module.exports = brevoInstance;