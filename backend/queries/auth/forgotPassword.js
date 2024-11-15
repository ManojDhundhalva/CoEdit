const resetPassword = `
    UPDATE users
    SET password = $2, updated_on = CURRENT_TIMESTAMP
    WHERE username = $1
    RETURNING *;
`;

const getUserId = `
SELECT id, profile_image FROM users 
WHERE username = $1;
`;

module.exports = { resetPassword, getUserId };