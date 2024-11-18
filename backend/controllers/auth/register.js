const pool = require("../../db");
const queries = require("../../queries/auth/register");
const bcrypt = require("bcrypt");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const { isValidEmail } = require("../../utils/validation");

const saltRounds = 10;
const hashAsync = util.promisify(bcrypt.hash);

const createAccount = async (req, res) => {
    const { username, emailid, password, profile_image } = req.body;

    const isFromValid = () => {
        return (
            username &&
            emailid &&
            password &&
            username.trim() !== "" &&
            isValidEmail(emailid) &&
            password.length >= 8 &&
            password.length < 255
        );
    }

    // Validate required fields
    if (!isFromValid()) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    try {
        // Check if the username or email already exists
        const userCheck = await pool.query(queries.getUserName, [username, emailid]);

        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: "User already exists." });
        }

        // Hash the password
        const hashedPassword = await hashAsync(password, saltRounds);

        // Create a new user with a unique ID
        const userId = uuidv4();
        await pool.query(queries.createAccount, [
            userId,
            username,
            emailid,
            hashedPassword,
            profile_image,
            "manual"  // mode of register
        ]);

        const token = jwt.sign(
            { id: userId, username, image: profile_image },
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

        return res.status(201).json({ message: "Account created successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    createAccount,
};
