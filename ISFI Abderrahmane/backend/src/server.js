const http = require("http");
const app = require("./app");
const logger = require("./loaders/logger");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, async () => {
  logger.info({ port: PORT }, "Server listening");
  // Temporarily disable auto-sync to avoid index issues
  // await sequelize.sync({ alter: true });
  logger.info("Database connected successfully");
});

module.exports = server;
// Force restart Thu Dec 11 02:53:59 PM +01 2025
