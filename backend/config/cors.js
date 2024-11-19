const config = require("./index");

const corsConfig = {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

module.exports = corsConfig;