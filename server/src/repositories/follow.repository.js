const { getSession } = require("../config/neo4j");

async function followUser(followerId, followingId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (follower:User {id:$followerId})
      MATCH (following:User {id:$followingId})

      MERGE (follower)-[:FOLLOWS]->(following)
      `,
      {
        followerId,
        followingId,
      },
    );
  } finally {
    await session.close();
  }
}

async function unfollowUser(followerId, followingId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (follower:User {id:$followerId})-[r:FOLLOWS]->(following:User {id:$followingId})

      DELETE r
      `,
      {
        followerId,
        followingId,
      },
    );
  } finally {
    await session.close();
  }
}

async function isFollowing(followerId, followingId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (follower:User {id:$followerId})-[r:FOLLOWS]->(following:User {id:$followingId})

      RETURN COUNT(r) > 0 AS isFollowing
      `,
      {
        followerId,
        followingId,
      },
    );

    return result.records[0].get("isFollowing");
  } finally {
    await session.close();
  }
}

async function countFollowers(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (:User)-[:FOLLOWS]->(u:User {id:$userId})

      RETURN count(*) AS followersCount
      `,
      {
        userId,
      },
    );

    return Number(result.records[0].get("followersCount"));
  } finally {
    await session.close();
  }
}

async function countFollowing(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id:$userId})-[:FOLLOWS]->(:User)

      RETURN count(*) AS followingCount
      `,
      {
        userId,
      },
    );

    return Number(result.records[0].get("followingCount"));
  } finally {
    await session.close();
  }
}
async function getFollowers(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:FOLLOWS]->(:User {id: $userId})

      RETURN {
        _id: u.id,
        name: u.name,
        userName: u.userName,
        profileImage: u.profileImage,
        bio: u.bio
      } AS user
      `,
      {
        userId,
      },
    );

    return result.records.map((record) => record.get("user"));
  } finally {
    await session.close();
  }
}

async function getFollowing(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (:User {id: $userId})-[:FOLLOWS]->(u:User)

      RETURN {
        _id: u.id,
        name: u.name,
        userName: u.userName,
        profileImage: u.profileImage,
        bio: u.bio
      } AS user
      `,
      {
        userId,
      },
    );

    return result.records.map((record) => record.get("user"));
  } finally {
    await session.close();
  }
}
async function followUser(followerId, followingId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (follower:User {id: $followerId})
      MATCH (following:User {id: $followingId})

      MERGE (follower)-[:FOLLOWS]->(following)
      `,
      {
        followerId,
        followingId,
      },
    );
  } finally {
    await session.close();
  }
}
module.exports = {
  followUser,
  unfollowUser,
  isFollowing,
  countFollowers,
  countFollowing,
  getFollowers,
  getFollowing,
  followUser
};