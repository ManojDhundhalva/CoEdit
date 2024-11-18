const getUser = `
SELECT *
FROM users
WHERE id = $1;
`;

const updateUser = `
UPDATE users
SET name = $1, updated_on = CURRENT_TIMESTAMP
WHERE id = $2;
`;

const updateProfileImage = `
UPDATE users
SET profile_image = $1, updated_on = CURRENT_TIMESTAMP
WHERE id = $2;
`;

module.exports = {
    getUser,
    updateUser,
    updateProfileImage,
};
