const updateUser = `
UPDATE users
SET name = $1, updated_on = CURRENT_TIMESTAMP
WHERE id = $2;
`;

module.exports = {
    updateUser,
};
