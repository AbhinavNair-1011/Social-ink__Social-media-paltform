const app = require("./app");
const http = require("http");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
  await connectDB();

  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
