import { ICradle } from 'src/container';

const nodemailer = require('nodemailer');

export const mailHelper = (iCradle: ICradle) => {
    const sendEmail = async ({
        id,
        username,
        email,
        subject,
        text,
    }: {
        id: string;
        username: string;
        email: string;
        subject?: string;
        text?: string;
    }) => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST || 'smtp.example.com',
                port: process.env.MAIL_PORT || 587,
                secure: true,
            });

            // console.log(
            //     `mail host ${process.env.MAIL_HOST} port ${process.env.MAIL_PORT}  from ${process.env.MAIL_USER} to email ${email}`,
            // );

            await transporter.sendMail({
                from: process.env.MAIL_USER || 'admin@appota.com',
                to: email,
                subject,
                text,
            });

            const response = {
                signal: 1,
                message: 'email sent sucessfully',
            };
            return response;
        } catch (error) {
            const response = {
                signal: 0,
                message: 'email not sent',
            };
            return response;
            // console.log(error, 'email not sent');
        }
    };

    return {
        sendEmail,
    };
};
