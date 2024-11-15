const pool = require("../db");
const queries = require("../queries/user");

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
    updateUser,
};
