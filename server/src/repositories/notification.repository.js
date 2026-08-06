const crypto = require("crypto");
const { getSession } = require("../config/neo4j");
const formatNode = require("../utils/FormatNodeDate");

async function findNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (n:Notification)

      WHERE
        n.receiver = $receiver
        AND n.sender = $sender
        AND n.type = $type
        AND n.post = $post
        AND n.comment = $comment

      RETURN n
      `,
      {
        receiver,
        sender,
        type,
        post,
        comment,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return formatNode(result.records[0].get("n").properties);
  } finally {
    await session.close();
  }
}

async function createNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  const session = getSession();

  try {
    const id = crypto.randomUUID();

    const result = await session.run(
      `
      CREATE (n:Notification {
        id: $id,
        receiver: $receiver,
        sender: $sender,
        type: $type,
        post: $post,
        comment: $comment,
        createdAt: datetime()
      })

      RETURN n
      `,
      {
        id,
        receiver,
        sender,
        type,
        post,
        comment,
      },
    );

    return formatNode(result.records[0].get("n").properties);
  } finally {
    await session.close();
  }
}

async function deleteNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (n:Notification)

      WHERE
        n.receiver = $receiver
        AND n.sender = $sender
        AND n.type = $type
        AND n.post = $post
        AND n.comment = $comment

      WITH n

      DETACH DELETE n

      RETURN n.id AS id
      `,
      {
        receiver,
        sender,
        type,
        post,
        comment,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("id");
  } finally {
    await session.close();
  }
}

async function countNotifications(receiver) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (n:Notification)

      WHERE n.receiver = $receiver

      RETURN count(n) AS totalNotifications
      `,
      {
        receiver,
      },
    );

    return Number(result.records[0].get("totalNotifications"));
  } finally {
    await session.close();
  }
}
async function getNotifications(receiver, page, limit) {
  const session = getSession();

  try {
    const skip = (page - 1) * limit;

    const result = await session.run(
      `
      MATCH (n:Notification)
      MATCH (sender:User {id:n.sender})

      WHERE n.receiver = $receiver

      RETURN n,sender

      ORDER BY n.createdAt DESC

      SKIP $skip
      LIMIT $limit
      `,
      {
        receiver,
        skip,
        limit,
      },
    );

    return result.records.map((record) => {
      const notification = formatNode(record.get("n").properties);
      const sender = formatNode(record.get("sender").properties);

      return {
        ...notification,
        _id: notification.id,

        sender: {
          _id: sender.id,
          name: sender.name,
          userName: sender.userName,
          profileImage: sender.profileImage,
          createdAt: sender.createdAt,
        },
      };
    });
  } finally {
    await session.close();
  }
}

async function markAsRead(notificationId, receiver) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (n:Notification {
        id:$notificationId,
        receiver:$receiver
      })

      SET n.isRead = true

      RETURN n
      `,
      {
        notificationId,
        receiver,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return formatNode(result.records[0].get("n").properties);
  } finally {
    await session.close();
  }
}
async function markAllAsRead(receiver) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (n:Notification)

      WHERE
      n.receiver=$receiver
      AND coalesce(n.isRead,false)=false

      SET n.isRead=true
      `,
      {
        receiver,
      },
    );
  } finally {
    await session.close();
  }
}

async function countUnreadNotifications(receiver) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (n:Notification)

      WHERE
      n.receiver=$receiver
      AND coalesce(n.isRead,false)=false

      RETURN count(n) AS unreadCount
      `,
      {
        receiver,
      },
    );

    return Number(result.records[0].get("unreadCount"));
  } finally {
    await session.close();
  }
}
module.exports = {
  findNotification,
  createNotification,
  deleteNotification,
  countNotifications,
  getNotifications,
  markAsRead,markAllAsRead
  ,countUnreadNotifications
  ,
  
};