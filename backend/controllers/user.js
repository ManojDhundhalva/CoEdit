const pool = require("../db");
const queries = require("../queries/user");

// get functionality
const getUser = async (req, res) => {      
    try {
        const { rows } = await pool.query(queries.getUser, [req.user.id]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching user data: ", error);
        res.status(500).json({ message: "Error fetching user data" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query(queries.updateUser, [name, req.user.id]);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user data: ", error);
        res.status(500).json({ message: "Error updating user data" });
    }
}

module.exports = {
    getUser,
    updateUser,
};