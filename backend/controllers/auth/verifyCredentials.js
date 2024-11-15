const pool = require("../../db");
const queries = require("../../queries/auth/verifyCredentials");
const { isValidEmail } = require("../../utils/validation");

const isEmailExists = async (req, res) => {
    try {
        const { emailid } = req.query;

        if (!emailid) {
            return res.status(400).json({ error: "Email is required" });
        }

        if (!isValidEmail(emailid)) {
            return res.status(400).json({ error: "inValid email" });
        }

        const user = await pool.query(queries.isEmailExists, [emailid]);
        const count = user.rows.length;
        return res.status(200).json({ exists: Boolean(count) });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const isUsernameExists = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const user = await pool.query(queries.isUsernameExists, [username]);
        const count = user.rows.length;
        return res.status(200).json({ exists: Boolean(count) });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const isGoogleAuthenticated = async (req, res) => {
    try {
        const { userNameOrEmail } = req.query;

        if (!userNameOrEmail) {
            return res.status(400).json({ error: "Filed is required" });
        }

        const results = await pool.query(queries.isUserNameOrEmailExists, [userNameOrEmail]);
        const count = results.rows.length;

        return res.status(200).json({ isAccountExists: Boolean(count) });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { isEmailExists, isUsernameExists, isGoogleAuthenticated };