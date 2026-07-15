const Verification = require("../models/verification.model");

const generateVerificationCode = require("../utils/generateVerificationCode");

const hashToken = require("../utils/hashToken");

async function createVerification({ userId, purpose }) {
  await Verification.deleteMany({
    userId,
    purpose,
  });

  const code = generateVerificationCode();

  const codeHash = hashToken(code);

  await Verification.create({
    userId,

    purpose,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  return code;
}

module.exports = {
  createVerification,
};
