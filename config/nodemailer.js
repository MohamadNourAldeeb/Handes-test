import nodemailer from "nodemailer";

export default nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    secure: true,
    debug: false,
    port: process.env.EMAIL_PORT,
    secureConnection: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnAuthorized: false },
    priority: "high",
});
