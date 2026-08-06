const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME,
    process.env.NEO4J_PASSWORD,
  ),
);

async function connectNeo4j() {
  try {
    await driver.verifyConnectivity();

    console.log(" Connected to CognoDB");
  } catch (error) {
    console.error(" CognoDB Connection Failed");
    console.error(error);

    process.exit(1);
  }
}

function getSession() {
  return driver.session({
    database: process.env.NEO4J_DATABASE,
  });
}

module.exports ={ driver, connectNeo4j, getSession};