const mailer = require("nodemailer");
require("dotenv").config();


const sendingMail = async (to, subject, text) => {

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.USER_MAIL,
        to: to,
        subject: subject,
        text: text
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;
}

module.exports = {
    sendingMail
};