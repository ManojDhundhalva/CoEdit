const pool = require("../../db");
const queries = require("../../queries/auth/forgotPassword");
const config = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const resetPassword = async (req, res) => {

    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);

        const results = await pool.query(queries.resetPassword, [username, hashedPassword]);

        if (results.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { rows } = await pool.query(queries.getUserId, [username]);

        const { id, profile_image } = rows[0];

        const token = jwt.sign(
            { id, username, image: profile_image },
            config.JWT_SECRET_KEY,
            { expiresIn: config.JWT_TIMEOUT }
        );

        res.cookie("authToken", token, {
            path: "/", // This allows the cookie to be accessible on all routes
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: "Strict", // Protect against CSRF
        });

        res.cookie("username", username, {
            path: "/", // This allows the cookie to be accessible on all routes
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: "Strict", // Protect against CSRF
        });

        res.cookie("image", profile_image, {
            path: "/", // This allows the cookie to be accessible on all routes
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: "Strict", // Protect against CSRF
        });

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Password not reset" });
    }
}

module.exports = { resetPassword };