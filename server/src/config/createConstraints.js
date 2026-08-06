const { driver } = require("./neo4j");

async function createConstraints() {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE,
  });

  try {
    await session.run(`
      CREATE CONSTRAINT user_id_unique IF NOT EXISTS
      FOR (u:User)
      REQUIRE u.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT user_email_unique IF NOT EXISTS
      FOR (u:User)
      REQUIRE u.email IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT user_username_unique IF NOT EXISTS
      FOR (u:User)
      REQUIRE u.userName IS UNIQUE
    `);

    console.log(" Neo4j Constraints Ready");
  } finally {
    await session.close();
  }
}

module.exports = createConstraints;
