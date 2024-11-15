const { google } = require("googleapis");
const config = require("./index");

exports.oauth2client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    "postmessage"
);
