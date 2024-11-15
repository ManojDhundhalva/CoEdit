const isEmailExists = `
SELECT id FROM users
WHERE emailid = $1;
`;

const isUsernameExists = `
SELECT id FROM users
WHERE username = $1;
`;

const isGoogleAuthenticated = `
SELECT id 
FROM users 
WHERE (username = $1 OR emailid = $1) 
AND mode = 'google';
`;

const isUserNameOrEmailExists = `
SELECT id
FROM users
WHERE username = $1 OR emailid = $1;
`;

module.exports = {
    isEmailExists,
    isUsernameExists,
    isGoogleAuthenticated,
    isUserNameOrEmailExists
};