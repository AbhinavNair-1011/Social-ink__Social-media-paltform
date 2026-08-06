const { getSession } = require("../config/neo4j");
async function likePost(userId, postId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      MATCH (p:Post {id: $postId})

      MERGE (u)-[r:LIKED]->(p)
      ON CREATE SET
        p.likesCount = coalesce(p.likesCount, 0) + 1
      `,
      {
        userId,
        postId,
      },
    );
  } finally {
    await session.close();
  }
}
async function unlikePost(userId, postId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})-[r:LIKED]->(p:Post {id: $postId})

      DELETE r

      SET p.likesCount =
        CASE
          WHEN p.likesCount > 0 THEN p.likesCount - 1
          ELSE 0
        END
      `,
      {
        userId,
        postId,
      },
    );
  } finally {
    await session.close();
  }
}

async function isLiked(userId, postId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (:User {id:$userId})-[r:LIKED]->(:Post {id:$postId})

      RETURN COUNT(r) > 0 AS liked
      `,
      {
        userId,
        postId,
      },
    );

    return result.records[0].get("liked");
  } finally {
    await session.close();
  }
}

async function getLikedPostIds(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (:User {id:$userId})-[:LIKED]->(p:Post)

      RETURN p.id AS postId
      `,
      {
        userId,
      },
    );

    return result.records.map((record) => record.get("postId"));
  } finally {
    await session.close();
  }
}

module.exports = {
  likePost,
  unlikePost,
  isLiked,
  getLikedPostIds,

};