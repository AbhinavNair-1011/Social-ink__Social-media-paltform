const verificationRepository = require("../repositories/verification.repository");

const generateVerificationCode = require("../utils/generateVerificationCode");
const hashToken = require("../utils/hashToken");

async function createVerification({ userId, purpose }) {
  await verificationRepository.deleteMany({
    userId,
    purpose,
  });

  const code = generateVerificationCode();

  const codeHash = hashToken(code);

  await verificationRepository.createVerification({
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
