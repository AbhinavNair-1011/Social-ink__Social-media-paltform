const crypto = require("crypto");
const { getSession } = require("../config/neo4j");
const formatNode = require("../utils/FormatNodeDate");

async function getMyConversations(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (me:User {id:$userId})-[r:PARTICIPATES_IN]->(c:Conversation)

      MATCH (other:User)-[:PARTICIPATES_IN]->(c)

      WHERE other.id <> $userId

      OPTIONAL MATCH (c)-[:LAST_MESSAGE]->(m:Message)

      RETURN
        c,
        r.unreadCount AS unreadCount,
        other,
        m

      ORDER BY c.lastMessageAt DESC
      `,
      {
        userId,
      },
    );

    return result.records.map((record) => {
      const conversation = formatNode(
        record.get("c").properties,
      );

      const other = formatNode(
        record.get("other").properties,
      );

      const message = record.get("m")
        ? formatNode(record.get("m").properties)
        : null;

      return {
        ...conversation,

        _id: conversation.id,

        participants: [
          {
            _id: other.id,
            name: other.name,
            userName: other.userName,
            profileImage: other.profileImage,
          },
        ],

        lastMessage: message,

        unreadCount: Number(record.get("unreadCount")),
      };
    });
  } finally {
    await session.close();
  }
}

async function createConversation(myId, otherUserId) {
  const session = getSession();

  try {
    const conversationId = crypto.randomUUID();

    const result = await session.run(
      `
      MATCH (u1:User {id:$myId})
      MATCH (u2:User {id:$otherUserId})

      CREATE (c:Conversation{
        id:$conversationId,
        lastMessageAt:datetime(),
        createdAt:datetime(),
        updatedAt:datetime()
      })

      CREATE (u1)-[:PARTICIPATES_IN {
        unreadCount:0
      }]->(c)

      CREATE (u2)-[:PARTICIPATES_IN {
        unreadCount:0
      }]->(c)

      RETURN c
      `,
      {
        myId,
        otherUserId,
        conversationId,
      },
    );

    return formatNode(result.records[0].get("c").properties);
  } finally {
    await session.close();
  }
}

async function countUnreadConversations(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (:User {id:$userId})-[r:PARTICIPATES_IN]->(:Conversation)

      WHERE r.unreadCount > 0

      RETURN count(r) AS unreadCount
      `,
      {
        userId,
      },
    );

    return Number(result.records[0].get("unreadCount"));
  } finally {
    await session.close();
  }
}   

async function markConversationAsRead(
  conversationId,
  userId,
) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (:User {id:$userId})-[r:PARTICIPATES_IN]->(:Conversation {id:$conversationId})

      SET r.unreadCount = 0
      `,
      {
        conversationId,
        userId,
      },
    );
  } finally {
    await session.close();
  }
}

async function updateLastMessage(
  conversationId,
  messageId,
  createdAt,
) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (c:Conversation {id:$conversationId})

      SET
        c.lastMessageId = $messageId,
        c.lastMessageAt = datetime($createdAt),
        c.updatedAt = datetime()
      `,
      {
        conversationId,
        messageId,
        createdAt,
      },
    );
  } finally {
    await session.close();
  }
}

async function incrementUnreadCount(
  conversationId,
  senderId,
) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[r:PARTICIPATES_IN]->(c:Conversation {id:$conversationId})

      WHERE u.id <> $senderId

      SET r.unreadCount = coalesce(r.unreadCount,0) + 1

      RETURN u.id AS userId
      `,
      {
        conversationId,
        senderId,
      },
    );

    return result.records.map((record) => record.get("userId"));
  } finally {
    await session.close();
  }
}

async function findConversationById(
  conversationId,
  userId,
) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id:$userId})-[r:PARTICIPATES_IN]->(c:Conversation {id:$conversationId})

      RETURN
        c,
        r.unreadCount AS unreadCount
      `,
      {
        conversationId,
        userId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const conversation = formatNode(
      record.get("c").properties,
    );

    return {
      ...conversation,
      _id: conversation.id,
      unreadCount: Number(record.get("unreadCount")),
    };
  } finally {
    await session.close();
  }
}

async function markConversationAsRead(
  conversationId,
  userId,
) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (:User {id:$userId})-[r:PARTICIPATES_IN]->(c:Conversation {id:$conversationId})

      SET r.unreadCount = 0
      `,
      {
        conversationId,
        userId,
      },
    );
  } finally {
    await session.close();
  }
}

async function findConversationBetweenUsers(myId, otherUserId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (me:User {id:$myId})-[r:PARTICIPATES_IN]->(c:Conversation)
      MATCH (other:User {id:$otherUserId})-[:PARTICIPATES_IN]->(c)

      OPTIONAL MATCH (sender:User)-[:SENT]->(m:Message {id:c.lastMessageId})

      RETURN
        c,
        r.unreadCount AS unreadCount,
        me,
        other,
        m,
        sender
      `,
      {
        myId,
        otherUserId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const conversation = formatNode(record.get("c").properties);
    const me = formatNode(record.get("me").properties);
    const other = formatNode(record.get("other").properties);

    const message = record.get("m")
      ? formatNode(record.get("m").properties)
      : null;

    const sender = record.get("sender")
      ? formatNode(record.get("sender").properties)
      : null;

    return {
      ...conversation,
      _id: conversation.id,

      participants: [
        {
          _id: me.id,
          name: me.name,
          userName: me.userName,
          profileImage: me.profileImage,
        },
        {
          _id: other.id,
          name: other.name,
          userName: other.userName,
          profileImage: other.profileImage,
        },
      ],

      lastMessage: message
        ? {
            ...message,
            _id: message.id,
            sender: sender && {
              _id: sender.id,
              name: sender.name,
              userName: sender.userName,
              profileImage: sender.profileImage,
            },
          }
        : null,

      unreadCount: Number(record.get("unreadCount")),
    };
  } finally {
    await session.close();
  }
}
module.exports={
    getMyConversations,
    createConversation,
    countUnreadConversations,
    markConversationAsRead,
    updateLastMessage,
    incrementUnreadCount,
    findConversationById,
    markConversationAsRead,
    findConversationBetweenUsers
    
}