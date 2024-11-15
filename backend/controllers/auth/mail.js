const nodemailer = require('nodemailer');
const config = require('../../config');
const { generate4DigitRandomCode } = require("../../utils/generators");
const pool = require('../../db');
const queries = require("../../queries/auth/mail");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: config.USER_EMAIL,
        pass: config.USER_PASS,
    },
});

async function main(sourceMail, destinationMail, username, code) {

    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: {
                name: "CoEdit Service", // sender name
                address: sourceMail,  // sender address
            },
            to: destinationMail, // list of receivers
            subject: "CoEdit Authentication", // Subject line
            text: `Hello ${username}`, // plain text body
            html: `<h1><b>YOUR CODE: ${code}</b></h1>`, // html body
        });

        return info.messageId;

    } catch (error) {
        throw new Error(error);
    }
}

const sendMail = async (req, res) => {
    try {
        const { userNameOrEmail } = req.body;
        const code = generate4DigitRandomCode();
        const userInfo = await pool.query(queries.getUserInfo, [userNameOrEmail]);

        if (userInfo.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { emailid, username, profile_image } = userInfo.rows[0];
        console.log(emailid, username, code, profile_image);

        const results = await main(config.USER_EMAIL, emailid, username, code);
        return res.status(200).json({ message: "Mail sent successfully", code, username, image: profile_image });

    } catch (error) {
        return res.status(500).json({ message: "Mail not sent" });
    }
}

module.exports = { sendMail }


