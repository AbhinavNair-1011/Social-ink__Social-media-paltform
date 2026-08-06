const crypto = require("crypto");
const { getSession } = require("../config/neo4j");
const formatNode = require("../utils/FormatNodeDate");

async function createMessage({
  conversationId,
  senderId,
  text,
  imageUrl,
}) {
  const session = getSession();

  try {
    const messageId = crypto.randomUUID();

    const result = await session.run(
      `
      MATCH (u:User {id:$senderId})
      MATCH (c:Conversation {id:$conversationId})

      CREATE (m:Message{
        id:$messageId,
        text:$text,
        imageUrl:$imageUrl,
        createdAt:datetime(),
        updatedAt:datetime()
      })

      CREATE (u)-[:SENT]->(m)
      CREATE (m)-[:IN]->(c)
      CREATE (u)-[:SEEN]->(m)

      RETURN
        m,
        u,
        c
      `,
      {
        messageId,
        conversationId,
        senderId,
        text,
        imageUrl,
      },
    );

    const record = result.records[0];

    const message = formatNode(record.get("m").properties);
    const sender = formatNode(record.get("u").properties);
    const conversation = formatNode(record.get("c").properties);

    return {
      ...message,
      _id: message.id,

      conversation: conversation.id,

      sender: {
        _id: sender.id,
        name: sender.name,
        userName: sender.userName,
        profileImage: sender.profileImage,
      },
    };
  } finally {
    await session.close();
  }
}
async function getMessages(conversationId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:SENT]->(m:Message)-[:IN]->(c:Conversation {id:$conversationId})

      RETURN
        m,
        u,
        c

      ORDER BY m.createdAt ASC
      `,
      {
        conversationId,
      },
    );

    return result.records.map((record) => {
      const message = formatNode(record.get("m").properties);
      const sender = formatNode(record.get("u").properties);
      const conversation = formatNode(record.get("c").properties);

      return {
        ...message,
        _id: message.id,

        conversation: conversation.id,

        sender: {
          _id: sender.id,
          name: sender.name,
          userName: sender.userName,
          profileImage: sender.profileImage,
        },
      };
    });
  } finally {
    await session.close();
  }
}

async function findMessageById(messageId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:SENT]->(m:Message {id:$messageId})-[:IN]->(c:Conversation)

      RETURN
        m,
        u,
        c
      `,
      {
        messageId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const message = formatNode(record.get("m").properties);
    const sender = formatNode(record.get("u").properties);
    const conversation = formatNode(record.get("c").properties);

    return {
      ...message,
      _id: message.id,

      conversation: conversation.id,

      sender: {
        _id: sender.id,
        name: sender.name,
        userName: sender.userName,
        profileImage: sender.profileImage,
      },
    };
  } finally {
    await session.close();
  }
}

module.exports = {
  createMessage,
  getMessages,
  findMessageById,
};