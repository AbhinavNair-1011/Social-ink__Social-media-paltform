const crypto = require("crypto");

const { getSession } = require("../config/neo4j");
const formatNode = require("../utils/FormatNodeDate");

async function createComment({ userId, postId, content }) {
  const session = getSession();

  try {
    const commentId = crypto.randomUUID();

    const result = await session.run(
      `
      MATCH (u:User {id:$userId})
      MATCH (p:Post {id:$postId})

      CREATE (c:Comment {
        id:$commentId,
        content:$content,
        createdAt:datetime(),
        updatedAt:datetime()
      })

      CREATE (u)-[:COMMENTED]->(c)
      CREATE (c)-[:ON]->(p)

      RETURN c
      `,
      {
        userId,
        postId,
        commentId,
        content,
      },
    );

    return formatNode(result.records[0].get("c").properties);
  } finally {
    await session.close();
  }
}

async function findById(commentId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (author:User)-[:COMMENTED]->(c:Comment {id:$commentId})-[:ON]->(p:Post)
      MATCH (owner:User)-[:CREATED]->(p)

      RETURN {
        _id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,

        userId: {
          _id: author.id,
          name: author.name,
          userName: author.userName,
          profileImage: author.profileImage
        },

        postId: p.id,
        postOwnerId: owner.id
      } AS comment
      `,
      {
        commentId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return formatNode(result.records[0].get("comment"));
  } finally {
    await session.close();
  }
}

async function getComments(postId, currentUserId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:COMMENTED]->(c:Comment)-[:ON]->(p:Post {id:$postId})

      RETURN
      c,
      u

      ORDER BY c.createdAt DESC
      `,
      {
        postId,
      },
    );

    return result.records.map((record) => {
      const comment = formatNode(record.get("c").properties);
      const user = formatNode(record.get("u").properties);

      return {
        ...comment,

        _id: comment.id,

        userId: {
          _id: user.id,
          name: user.name,
          userName: user.userName,
          profileImage: user.profileImage,
        },

        isOwner: user.id === currentUserId,
      };
    });
  } finally {
    await session.close();
  }
}

async function updateComment(commentId, userId, content) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id:$userId})-[:COMMENTED]->(c:Comment {id:$commentId})

      SET
      c.content=$content,
      c.updatedAt=datetime()

      RETURN c
      `,
      {
        commentId,
        userId,
        content,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return formatNode(result.records[0].get("c").properties);
  } finally {
    await session.close();
  }
}

async function deleteComment(commentId, userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id:$userId})-[:COMMENTED]->(c:Comment {id:$commentId})

      OPTIONAL MATCH (c)-[:ON]->(p:Post)

      WITH c,p

      DETACH DELETE c

      RETURN p.id AS postId
      `,
      {
        commentId,
        userId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("postId");
  } finally {
    await session.close();
  }
}

async function incrementCommentsCount(postId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (p:Post {id:$postId})

      SET p.commentsCount = coalesce(p.commentsCount,0) + 1
      `,
      {
        postId,
      },
    );
  } finally {
    await session.close();
  }
}

async function decrementCommentsCount(postId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (p:Post {id:$postId})

      SET
      p.commentsCount =
      CASE
        WHEN p.commentsCount > 0
        THEN p.commentsCount - 1
        ELSE 0
      END
      `,
      {
        postId,
      },
    );
  } finally {
    await session.close();
  }
}
module.exports = {
  createComment,
  findById,
  getComments,
  updateComment,
  deleteComment,
  incrementCommentsCount,
    decrementCommentsCount,

};
