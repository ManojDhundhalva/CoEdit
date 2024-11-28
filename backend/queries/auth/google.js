const getAccountByEmail = `
SELECT id, username, profile_image
FROM users 
WHERE emailid = $1;
`;

const createAccount = `
INSERT INTO users (
    id,
    username,
    emailid,
    name,
    image,
    profile_image,
    mode
)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

const updateUserImage = `
UPDATE users 
SET image = $1
WHERE username = $2;
`;

module.exports = { getAccountByEmail, createAccount, updateUserImage };