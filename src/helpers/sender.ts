import nodemailer from "nodemailer";

const sender = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "hhoang.it@hotmail.com",
    pass: "Hunter0909@!",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export { sender };
