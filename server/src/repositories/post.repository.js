const { getSession } = require("../config/neo4j");
const crypto = require("crypto");
const formatNode = require("../utils/FormatNodeDate");

async function countPostsByAuthor(authorId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $authorId})-[:CREATED]->(p:Post)

      RETURN count(p) AS postsCount
      `,
      {
        authorId,
      },
    );

    return Number(result.records[0].get("postsCount"));
  } finally {
    await session.close();
  }
}


async function createPost({
  authorId,
  content,
  imageUrl,
}) {
  const session = getSession();

  try {
    const postId = crypto.randomUUID();

    const result = await session.run(
      `
      MATCH (u:User {id: $authorId})

      CREATE (p:Post {
        id: $postId,
        content: $content,
        imageUrl: $imageUrl,
        likesCount: 0,
        commentsCount: 0,
        createdAt: datetime(),
        updatedAt: datetime()
      })

      CREATE (u)-[:CREATED]->(p)

      RETURN p
      `,
      {
        authorId,
        postId,
        content,
        imageUrl,
      },
    );

    return formatNode(result.records[0].get("p").properties);
  } finally {
    await session.close();
  }
}

async function countPosts() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (:User)-[:CREATED]->(p:Post)

      RETURN count(p) AS totalPosts
      `,
    );

    return Number(result.records[0].get("totalPosts"));
  } finally {
    await session.close();
  }
}

async function getFeed({
  userId,
  page,
  limit,
}) {
  const session = getSession();

  try {
    const skip = (page - 1) * limit;

    const result = await session.run(
      `
    MATCH (author:User)-[:CREATED]->(p:Post)

OPTIONAL MATCH (:User {id:$userId})-[l:LIKED]->(p)

WITH
  p,
  author,
  COUNT(l) AS likeCount

RETURN
  p,
  author,
  likeCount > 0 AS isLikedByMe

ORDER BY p.createdAt DESC
SKIP $skip
LIMIT $limit
      `,
      {
        userId,
        skip,
        limit,
      },
    );

    return result.records.map((record) => {
      const post = formatNode(record.get("p").properties);
      const author = formatNode(record.get("author").properties);

      return {
        ...post,

        _id: post.id,

        author: {
          _id: author.id,
          name: author.name,
          userName: author.userName,
          profileImage: author.profileImage,
        },

        isLikedByMe: record.get("isLikedByMe"),

        isOwner: author.id === userId,
      };
    });
  } finally {
    await session.close();
  }
}
async function getPostById({
  postId,
  userId,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (author:User)-[:CREATED]->(p:Post {id: $postId})

      OPTIONAL MATCH (:User {id: $userId})-[l:LIKED]->(p)

      RETURN
        p,
        author,
        COUNT(l) > 0 AS isLikedByMe
      `,
      {
        postId,
        userId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const post = formatNode(record.get("p").properties);
    const author = formatNode(record.get("author").properties);

    return {
      ...post,
      _id: post.id,

      author: {
        _id: author.id,
        name: author.name,
        userName: author.userName,
        profileImage: author.profileImage,
      },

      isLikedByMe: record.get("isLikedByMe"),
      isOwner: author.id === userId,
    };
  } finally {
    await session.close();
  }
}

async function updatePost({
  postId,
  userId,
  content,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED]->(p:Post {id: $postId})

      SET
        p.content = $content,
        p.updatedAt = datetime()

      RETURN p
      `,
      {
        postId,
        userId,
        content,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    const post = formatNode(result.records[0].get("p").properties);

    return {
      ...post,
      _id: post.id,
    };
  } finally {
    await session.close();
  }
}

async function deletePost({
  postId,
  userId,
}) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED]->(p:Post {id: $postId})

      DETACH DELETE p

      RETURN COUNT(*) AS deleted
      `,
      {
        postId,
        userId,
      },
    );

    return Number(result.records[0].get("deleted")) > 0;
  } finally {
    await session.close();
  }
}

async function findOwner(postId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:CREATED]->(p:Post {id: $postId})

      RETURN {
        postId: p.id,
        authorId: u.id
      } AS post
      `,
      {
        postId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("post");
  } finally {
    await session.close();
  }
}

async function getMyPosts({
  userId,
  page,
  limit,
  type,
}) {
  const session = getSession();

  try {
    const skip = (page - 1) * limit;

    let imageFilter = "";
    console.log(type)
    if (type === "images") {
      imageFilter = "AND p.imageUrl <> ''";
    }

    if (type === "text") {
      imageFilter = "AND (p.imageUrl IS NULL OR p.imageUrl = '')";
    }

    const result = await session.run(
      `
     MATCH (author:User {id:$userId})-[:CREATED]->(p:Post)
WHERE
  ($type = 'all')
  OR ($type = 'images' AND coalesce(p.imageUrl, '') <> '')
  OR ($type = 'text' AND coalesce(p.imageUrl, '') = '')

OPTIONAL MATCH (:User {id:$userId})-[l:LIKED]->(p)

RETURN
  p,
  author,
  COUNT(l) > 0 AS isLikedByMe

ORDER BY p.createdAt DESC
SKIP $skip
LIMIT $limit
      `,
    {
  userId,
  page,
  limit,
  skip,
  type,
},
    );

    return result.records.map((record) => {
      const post = formatNode(record.get("p").properties);
      const author = formatNode(record.get("author").properties);

      return {
        ...post,
        _id: post.id,

        author: {
          _id: author.id,
          name: author.name,
          userName: author.userName,
          profileImage: author.profileImage,
        },

        isOwner: true,
        isLikedByMe: record.get("isLikedByMe"),
      };
    });
  } finally {
    await session.close();
  }
}
async function getUserPosts({
  profileUserId,
  currentUserId,
  page,
  limit,
  type,
}) {
  const session = getSession();

  try {
    const skip = (page - 1) * limit;

    let imageFilter = "";

    if (type === "images") {
      imageFilter = "AND p.imageUrl <> ''";
    }

    if (type === "text") {
      imageFilter = "AND (p.imageUrl IS NULL OR p.imageUrl = '')";
    }

    const result = await session.run(
      `
      MATCH (author:User {id:$profileUserId})-[:CREATED]->(p:Post)

      OPTIONAL MATCH (:User {id:$currentUserId})-[l:LIKED]->(p)

      WHERE 1 = 1
      ${imageFilter}

      RETURN
        p,
        author,
        COUNT(l) > 0 AS isLikedByMe

      ORDER BY p.createdAt DESC

      SKIP $skip
      LIMIT $limit
      `,
      {
        profileUserId,
        currentUserId,
        skip,
        limit,
      },
    );

    return result.records.map((record) => {
      const post = formatNode(record.get("p").properties);
      const author = formatNode(record.get("author").properties);

      return {
        ...post,
        _id: post.id,

        author: {
          _id: author.id,
          name: author.name,
          userName: author.userName,
          profileImage: author.profileImage,
        },

        isOwner: author.id === currentUserId,
        isLikedByMe: record.get("isLikedByMe"),
      };
    });
  } finally {
    await session.close();
  }
}

async function countUserPosts(userId, type = "all") {
  const session = getSession();

  try {
    let imageFilter = "";

    if (type === "images") {
      imageFilter = "AND p.imageUrl <> ''";
    }

    if (type === "text") {
      imageFilter = "AND (p.imageUrl IS NULL OR p.imageUrl = '')";
    }

    const result = await session.run(
      `
      MATCH (:User {id:$userId})-[:CREATED]->(p:Post)

      WHERE 1 = 1
      ${imageFilter}

      RETURN count(p) AS totalPosts
      `,
      {
        userId,
      },
    );

    return Number(result.records[0].get("totalPosts"));
  } finally {
    await session.close();
  }
}
async function countPosts() {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (p:Post)

      RETURN count(p) AS totalPosts
      `,
    );

    return Number(result.records[0].get("totalPosts"));
  } finally {
    await session.close();
  }
}

async function getPostRealtimeData(postId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (p:Post {id: $postId})

      RETURN p
      `,
      {
        postId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    const post = formatNode(result.records[0].get("p").properties);

    return {
      _id: post.id,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    };
  } finally {
    await session.close();
  }
}


module.exports = {
  countPostsByAuthor,
  createPost,
  countPosts,
  getFeed,
  getPostById,
  updatePost,
    findOwner,
  getMyPosts,
  getUserPosts,
  countUserPosts,
  countPosts,
  deletePost,
  getPostRealtimeData,
  
  
  
  
};