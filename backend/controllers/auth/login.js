const pool = require("../../db");
const queries = require("../../queries/auth/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");
const config = require("../../config");

const compareAsync = util.promisify(bcrypt.compare);


const getAccount = async (req, resp) => {
    const { username, password } = req.body;

    const isFromValid = () => {
        return (
            username &&
            password &&
            username.trim() !== "" &&
            password.length >= 8 &&
            password.length < 255
        );
    }

    // Validate request body
    if (!isFromValid()) {
        return resp.status(400).json({ message: "REQUEST - Fields are Empty!" });
    }

    try {
        // Query the database for the user account
        const results = await pool.query(queries.getAccount, [username]);

        // Check if a user was found
        if (results.rows.length !== 1) {
            return resp
                .status(404)
                .json({ message: "Username or Email ID doesn't exist." });
        }

        const { id, password: storedPassword, profile_image } = results.rows[0];

        if (!storedPassword) {
            return resp.status(404).json({ message: "You're Google Authenticated" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await compareAsync(password, storedPassword);

        if (isPasswordValid) {
            // Create a JWT token for the authenticated user
            const token = jwt.sign(
                { id, username, image: profile_image },
                config.JWT_SECRET_KEY,
                { expiresIn: "1d" }
            );

            // Set the cookie with the token
            resp.cookie("authToken", token, {
                path: "/", // This allows the cookie to be accessible on all routes
                // httpOnly: true, // Protect cookie from XSS
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                sameSite: "Strict", // Protect against CSRF
            });

            resp.cookie("username", username, {
                path: "/", // This allows the cookie to be accessible on all routes
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                sameSite: "Strict", // Protect against CSRF
            });

            resp.cookie("image", profile_image, {
                path: "/", // This allows the cookie to be accessible on all routes
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                sameSite: "Strict", // Protect against CSRF
            });

            // Respond with the token and username
            return resp.status(200).json({ message: "Login is successfull" });
        } else {
            return resp.status(401).json({ message: "Incorrect Password" });
        }
    } catch (error) {
        return resp
            .status(500)
            .json({ message: "DATABASE - Internal Server Error" });
    }
};

module.exports = {
    getAccount,
};
