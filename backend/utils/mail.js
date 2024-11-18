const getText = (username, code) => {
    const text = `
    Hi ${username},

    We received a request to verify your identity for CoEdit. Please use the code below to complete the process:

    YOUR CODE: ${code}

    If you did not request this code, please ignore this email or contact support.

    Thank you,
    The CoEdit Team
    `;
    return text;
}

const getHTML = (username, code) => {
    const html = `
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
    `;
    return html;
}

module.exports = { getText, getHTML };