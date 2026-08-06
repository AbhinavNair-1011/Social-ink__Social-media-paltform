const crypto = require("crypto");

const { getSession } = require("../config/neo4j");

async function createVerification({ userId, purpose, codeHash, expiresAt }) {
  const session = getSession();

  try {
    const id = crypto.randomUUID();

    const result = await session.run(
      `
      CREATE (v:Verification {
        id: $id,
        userId: $userId,
        purpose: $purpose,
        codeHash: $codeHash,
        expiresAt: datetime($expiresAt),
        createdAt: datetime(),
        updatedAt: datetime()
      })

      RETURN v
      `,
      {
        id,
        userId,
        purpose,
        codeHash,
        expiresAt: expiresAt.toISOString(),
      },
    );

    return result.records[0].get("v").properties;
  } finally {
    await session.close();
  }
}

async function findVerification({
  codeHash,
  purpose,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (v:Verification)

      WHERE
        v.codeHash = $codeHash
        AND v.purpose = $purpose

      RETURN v
      `,
      {
        codeHash,
        purpose,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("v").properties;
  } finally {
    await session.close();
  }
}

async function findVerificationByUser({
  userId,
  codeHash,
  purpose,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (v:Verification)

      WHERE
        v.userId = $userId
        AND v.codeHash = $codeHash
        AND v.purpose = $purpose

      RETURN v
      `,
      {
        userId,
        codeHash,
        purpose,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("v").properties;
  } finally {
    await session.close();
  }
}
async function deleteById(id) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (v:Verification)

      WHERE v.id = $id

      DETACH DELETE v
      `,
      { id },
    );
  } finally {
    await session.close();
  }
}

async function deleteMany({ userId, purpose }) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (v:Verification)

      WHERE
        v.userId = $userId
        AND v.purpose = $purpose

      DETACH DELETE v
      `,
      {
        userId,
        purpose,
      },
    );
  } finally {
    await session.close();
  }
}

module.exports = {
  createVerification,
  findVerification,
  findVerificationByUser,
  deleteById,
  deleteMany,
};
