// Initialize socket.io server
const { Server } = require("socket.io");
const corsConfig = require("./cors");

const initIO = (server) => {
    const io = new Server(server, { cors: corsConfig });
    return io;
}

module.exports = initIO;