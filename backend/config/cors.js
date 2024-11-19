const config = require("./index");

const corsConfig = {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Auth-Token", "X-Username", "X-Image"],
    credentials: true,
};

module.exports = corsConfig;