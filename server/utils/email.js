const nodemailer = require("nodemailer");
require("dotenv").config();

const sendConfirmationEmail = async(user_id, email, password_hash) => {

    let account;
    if (process.env.NODE_ENV === "production") {
        account = { user: process.env.email_user, pass: process.env.email-password };
    } else {
        account = await nodemailer.createTestAccount();
    }

    const transporter = nodemailer.createTransport({
        name: "ethereal.email",
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    const info = await transporter.sendMail({
        from: '"MathShowdown" <mathshowdown@example.com>',
        to: email,
        subject: "Confirm Account",
        text: "Hello",
        html: "<b>Hello world?</b>"
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log(account);
}

module.exports = sendConfirmationEmail;