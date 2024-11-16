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
            subject: "CoEdit Authentication Code", // Subject line
            text: `Hi ${username},

We received a request to verify your identity for CoEdit. Please use the code below to complete the process:

YOUR CODE: ${code}

If you did not request this code, please ignore this email or contact support.

Thank you,
The CoEdit Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">CoEdit Authentication</h2>
                    <p style="font-size: 16px; color: #555;">
                        Hi <strong>${username}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        We received a request to verify your identity for CoEdit. Please use the code below to complete the process:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; background-color: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #333; border-radius: 5px; border: 1px solid #ccc;">
                            ${code}
                        </span>
                    </div>
                    <p style="font-size: 16px; color: #555;">
                        If you did not request this code, please ignore this email or contact our support team immediately.
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        Thank you,<br>
                        <strong>The CoEdit Team</strong>
                    </p>
                </div>
            `, // HTML body
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


