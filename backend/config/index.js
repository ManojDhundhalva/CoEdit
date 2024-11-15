require("dotenv").config();

const config = {
    PORT: process.env.PORT || 8000,
    SALT_ROUNDS: String(process.env.SALT_ROUNDS) || 10,
    JWT_TIMEOUT: process.env.JWT_TIMEOUT || "1d",
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "manoj",
    USER_EMAIL: process.env.USER_EMAIL || "abc@gmail.com",
    USER_PASS: process.env.USER_PASS || "abc",
    POSTGRES_URL: process.env.POSTGRES_URL || "postgresql://postgres:123456789@localhost:5432/CoEdit",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
};

module.exports = config;