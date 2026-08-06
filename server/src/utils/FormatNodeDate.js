const neo4j = require("neo4j-driver");

function formatNode(properties) {
  const data = { ...properties };

  
  Object.keys(data).forEach((key) => {
    if (neo4j.isInt(data[key])) {
      data[key] = data[key].toNumber();
    }
  });

[
  "createdAt",
  "updatedAt",
  "lastMessageAt",
  "expiresAt",
].forEach((field) => {
  if (data[field]) {
    data[field] = new Date(data[field].toString()).toISOString();
  }
});
  return data;
}

module.exports = formatNode;