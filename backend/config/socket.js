// Initialize socket.io server
const { Server } = require("socket.io");
const config = require("./index");

const initIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: config.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
            transports: ['websocket', 'polling']
        }
    });
    return io;
}

module.exports = initIO;