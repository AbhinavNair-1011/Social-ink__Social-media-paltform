const crypto = require("crypto");

const { getSession } = require("../config/neo4j");

async function createSession({
  userId,
  refreshTokenHash,
  userAgent,
  ipAddress,
  expiresAt,
}) {
  const session = getSession();

  try {
    const id = crypto.randomUUID();

    const result = await session.run(
      `
      CREATE (s:Session {
        id: $id,
        userId: $userId,
        refreshTokenHash: $refreshTokenHash,
        userAgent: $userAgent,
        ipAddress: $ipAddress,
        expiresAt: datetime($expiresAt),
        createdAt: datetime(),
        updatedAt: datetime()
      })

      RETURN s
      `,
      {
        id,
        userId,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt: expiresAt.toISOString(),
      },
    );

    return result.records[0].get("s").properties;
  } finally {
    await session.close();
  }
}

async function findById(id) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (s:Session)

      WHERE s.id = $id

      RETURN s
      `,
      { id },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("s").properties;
  } finally {
    await session.close();
  }
}

async function updateRefreshTokenHash(id, refreshTokenHash) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (s:Session)

      WHERE s.id = $id

      SET
        s.refreshTokenHash = $refreshTokenHash,
        s.updatedAt = datetime()

      RETURN s
      `,
      {
        id,
        refreshTokenHash,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("s").properties;
  } finally {
    await session.close();
  }
}

async function deleteById(id) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (s:Session)

      WHERE s.id = $id

      DETACH DELETE s
      `,
      { id },
    );
  } finally {
    await session.close();
  }
}

async function deleteByUserId(userId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (s:Session)

      WHERE s.userId = $userId

      DETACH DELETE s
      `,
      { userId },
    );
  } finally {
    await session.close();
  }
}

module.exports = {
  createSession,
  findById,
  updateRefreshTokenHash,
  deleteById,
  deleteByUserId,
};