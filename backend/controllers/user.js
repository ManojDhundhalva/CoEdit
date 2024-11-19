const pool = require("../db");
const queries = require("../queries/user");
const jwt = require("jsonwebtoken");
const config = require("../config");

const getUser = async (req, res) => {
    try {
        const { rows } = await pool.query(queries.getUser, [req.user.id]);
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user data" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query(queries.updateUser, [name, req.user.id]);
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user data" });
    }
}

const updateProfileImage = async (req, res) => {
    try {
        const { profile_image } = req.body;
        const { id, username } = req.user;

        await pool.query(queries.updateProfileImage, [profile_image, id]);

        const token = jwt.sign(
            { id, username, image: profile_image },
            config.JWT_SECRET_KEY,
            { expiresIn: config.JWT_TIMEOUT }
        );

        // res.cookie("authToken", token, {
        //     path: "/", // This allows the cookie to be accessible on all routes
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        //     sameSite: 'None', // Allows cross-site cookie usage
        //     secure: true, // Ensures the cookie is sent over HTTPS only
        // });

        // res.cookie("username", username, {
        //     path: "/", // This allows the cookie to be accessible on all routes
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        //     sameSite: 'None', // Allows cross-site cookie usage
        //     secure: true, // Ensures the cookie is sent over HTTPS only
        // });

        // res.cookie("image", profile_image, {
        //     path: "/", // This allows the cookie to be accessible on all routes
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        //     sameSite: 'None', // Allows cross-site cookie usage
        //     secure: true, // Ensures the cookie is sent over HTTPS only
        // });

        return res.status(200).json({ message: "Profile image updated successfully", authToken: token, username, image: profile_image });
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile image" });
    }
}

module.exports = {
    getUser,
    updateUser,
    updateProfileImage,
};
