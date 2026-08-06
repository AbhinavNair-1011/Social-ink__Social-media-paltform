const app = require("./app");
const http = require("http");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");
const { connectNeo4j } = require("./config/neo4j");
const createConstraints = require("./config/createConstraints");



const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
  await connectDB();
  await connectNeo4j();
  // await createConstraints();
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
