const { oauth2client } = require("../../config/google");
const pool = require("../../db");
const queries = require("../../queries/auth/google");
const config = require("../../config");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const googleCredentials = async (req, res) => {
    try {
        const { code } = req.query;

        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens);

        const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`;

        const userResponse = await fetch(url, { method: "GET" });

        if (!userResponse.ok) {
            return res.status(404).json({ message: 'Failed to fetch user info' });
        }

        const { email, name, picture } = await userResponse.json();

        const results = await pool.query(queries.getAccountByEmail, [email]);

        const accountExists = Boolean(results.rows.length > 0);

        if (accountExists) {
            const { id, username, profile_image } = results.rows[0];

            const token = jwt.sign(
                { id, username, image: profile_image },
                config.JWT_SECRET_KEY,
                { expiresIn: config.JWT_TIMEOUT }
            );

            // Set the cookie with the token
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

            return res.status(200).json({ accountExists, message: "Login is successfull" });
        }

        return res.status(200).json({ email, name, image: picture });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Google auth Error" });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { username, emailid, name, image } = req.body;

        const id = uuidv4();
        await pool.query(queries.createAccount, [id, username, emailid, name, image, image, "google"]);

        const token = jwt.sign(
            { id, username, image },
            config.JWT_SECRET_KEY,
            { expiresIn: config.JWT_TIMEOUT }
        );

        // Set the cookie with the token
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

        res.cookie("image", image, {
            path: "/", // This allows the cookie to be accessible on all routes
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: "Strict", // Protect against CSRF
        });

        return res.status(200).json({ message: "Login is successfull" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Google auth Error" });
    }
};

module.exports = { googleLogin, googleCredentials };