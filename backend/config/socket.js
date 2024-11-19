// Initialize socket.io server
const { Server } = require("socket.io");
const config = require("./index");

const initIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
            allowedHeaders: "*", //['Content-Type', 'Authorization'],
            credentials: true,
            transports: ['websocket', 'polling']
        }
    });
    return io;
}

module.exports = initIO;