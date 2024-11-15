const getAccount = `
SELECT id, password, profile_image
FROM users
WHERE username = $1 OR emailid = $1;
`;

module.exports = { getAccount };
