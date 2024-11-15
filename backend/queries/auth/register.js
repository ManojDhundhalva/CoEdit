const createAccount = `
INSERT INTO users (
    id,
    username,
    emailid,
    password,
    profile_image,
    mode
) 
VALUES ($1, $2, $3, $4, $5, $6);
`;

const getUserName = `
SELECT id 
FROM 
  users 
WHERE 
  username = $1 OR emailid = $2;
`;

module.exports = {
  createAccount,
  getUserName,
};
