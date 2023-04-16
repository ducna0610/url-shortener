import * as dotenv from "dotenv";
dotenv.config();
import nodeMailer from "nodemailer";

export default {
    sendMail: (to, subject, htmlContent) => {
        const transport = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const options = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: to,
            subject: subject,
            html: htmlContent,
        };
        return transport.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);
            }

            console.log("Email with attachment delivered successfully");
        });
    },
};
