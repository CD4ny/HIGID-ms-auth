import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailer from 'nodemailer';

interface Email {
  name: string;
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ html, subject, to, name }: Email) => {
  const nodemailerOptions: SMTPTransport.Options = {
    service: 'gmail',
    host: process.env.MAIL_HOST,
    port: Number.parseInt(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(nodemailerOptions);

  const res = await transporter.sendMail({
    from: {
      name,
      address: process.env.MAIL_USER,
    },
    to,
    subject,
    html,
  });

  if (!res.accepted.length) {
    throw new Error('Email not sent');
  }

  return res;
};
