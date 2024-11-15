const { emailRegex, usernameRegex } = require("./regex");

const isValidEmail = (email) => emailRegex.test(email);
const isValidUserName = (email) => usernameRegex.test(email);

module.exports = { isValidEmail, isValidUserName };
