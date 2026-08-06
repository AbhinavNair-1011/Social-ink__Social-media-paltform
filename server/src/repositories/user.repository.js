const crypto = require("crypto");
const { getSession } = require("../config/neo4j");

const formatNode = require("../utils/FormatNodeDate");

async function createUser(userData) {
const session = getSession();

  try {
    const id = crypto.randomUUID();

    const result = await session.run(
      `
      CREATE (u:User {
        id: $id,
        name: $name,
        email: $email,
        password: $password,
        userName: $userName,
        bio: "",
        dob: $dob,
        profileImage: "",
        isEmailVerified: false,
        twoFactorEnabled: $twoFactorEnabled,
        createdAt: datetime(),
        updatedAt: datetime()
      })

      RETURN u
      `,
      {
        id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        userName: userData.userName,
        dob: userData.dob || "",
        twoFactorEnabled: userData.twoFactorEnabled || false,
      },
    );

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}

async function findByEmail(email) {
const session = getSession();


  try {
    const result = await session.run(
      `
      MATCH (u:User)

      WHERE u.email = $email

      RETURN u
      `,
      {
        email,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}

async function findByUserName(userName) {
const session = getSession();


  try {
    const result = await session.run(
      `
      MATCH (u:User)

      WHERE u.userName = $userName

      RETURN u
      `,
      {
        userName,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return formatNode(result.records[0].get("u").properties);

  } finally {
    await session.close();
  }
}


async function findProfileById(id) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)

      WHERE u.id = $id

      RETURN {
        _id: u.id,
        name: u.name,
        email: u.email,
        userName: u.userName,
        dob: u.dob,
        bio: u.bio,
        profileImage: u.profileImage,
        createdAt: u.createdAt
      } AS user
      `,
      {
        id,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

    return formatNode(result.records[0].get("user"));
  } finally {
    await session.close();
  }
}
async function findById(id) {
const session = getSession();


  try {
    const result = await session.run(
      `
      MATCH (u:User)

      WHERE u.id = $id

      RETURN u
      `,
      {
        id,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}

async function updatePassword(userId, password) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)

      WHERE u.id = $userId

      SET
        u.password = $password,
        u.updatedAt = datetime()

      RETURN u
      `,
      {
        userId,
        password,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}

async function verifyEmail(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)
      WHERE u.id = $userId

      SET
        u.isEmailVerified = true,
        u.updatedAt = datetime()

      RETURN u
      `,
      { userId },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}

async function changeEmail(userId, newEmail) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)
      WHERE u.id = $userId

      SET
        u.email = $newEmail,
        u.isEmailVerified = false,
        u.updatedAt = datetime()

      RETURN u
      `,
      {
        userId,
        newEmail,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}

async function updateUser(userId, data) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})

      SET
        u.name = $name,
        u.bio = $bio,
        u.dob = $dob,
        u.updatedAt = datetime()

      RETURN u
      `,
      {
        userId,
        name: data.name,
        bio: data.bio,
        dob: data.dob
          ? data.dob.toISOString().split("T")[0]
          : null,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}
async function findPublicById(userId) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})

      RETURN {
        _id: u.id,
        name: u.name,
        userName: u.userName,
        bio: u.bio,
        profileImage: u.profileImage,
        createdAt: u.createdAt
      } AS user
      `,
      {
        userId,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("user"));
  } finally {
    await session.close();
  }
}

async function searchUsers(currentUserId, search) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)

      WHERE
        u.id <> $currentUserId
        AND (
          toLower(u.name) CONTAINS toLower($search)
          OR
          toLower(u.userName) CONTAINS toLower($search)
        )

      RETURN {
        _id: u.id,
        name: u.name,
        userName: u.userName,
        profileImage: u.profileImage,
        bio: u.bio
      } AS user

      LIMIT 10
      `,
      {
        currentUserId,
        search,
      },
    );

    return result.records.map((record) => record.get("user"));
  } finally {
    await session.close();
  }
}

async function updateProfileImage(userId, profileImage) {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})

      SET
        u.profileImage = $profileImage,
        u.updatedAt = datetime()

      RETURN u
      `,
      {
        userId,
        profileImage,
      },
    );

    if (result.records.length === 0) {
      return null;
    }

return formatNode(result.records[0].get("u").properties);
  } finally {
    await session.close();
  }
}
module.exports = {
  createUser,
  findByEmail,
  findByUserName,
  findById,
  findProfileById,
  updatePassword,
  verifyEmail,
  changeEmail,
  updateUser,
  findPublicById,
  searchUsers,
  updateProfileImage
  
   
};
