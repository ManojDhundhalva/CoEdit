require("dotenv").config();

const config = {
    PORT: Number(process.env.PORT),
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
    JWT_TIMEOUT: process.env.JWT_TIMEOUT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASS: process.env.USER_PASS,
    POSTGRES_URL: process.env.POSTGRES_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

module.exports = config;