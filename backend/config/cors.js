const config = require("./index");

const corsConfig = {
    origin: config.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-fingerprint-id"],
    credentials: true,
};

module.exports = corsConfig;