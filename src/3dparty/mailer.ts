import nodemailer from "nodemailer";
import { config } from "../config";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const subjectText = "E-TOS";
const from = "absdtada@gmail.com";
// const from = "bumbayar0223@gmail.com";
const transporter = nodemailer.createTransport({
  // ...config.aws.smtp,
});

const mailBuildAndSend = (options: MailOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

interface SendOtpOptions {
  code: string;
}

const sendOtp = async (to: string, options: SendOtpOptions): Promise<void> => {
  const otpHtml = `<h1>Сайн байна уу?</h1>
    <strong>Таны баталгаажуулах код: </strong><h1>${options.code}</h1></p>
      <p>Баталгаажуулах кодны идвэхтэй хугацаа : 3минут</p>
        <p>Баярлалаа.</p>
          <p><a href="wedding.zto.mn">wedding.zto.mn</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="wedding.zto.mn">Support</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="wedding.zto.mn">Terms</a><p>`;

  const mailOptions: MailOptions = {
    from: from,
    to,
    subject: `${subjectText} OTP code`,
    html: otpHtml,
  };

  await mailBuildAndSend(mailOptions);
};
const sendPassword = async (
  to: string,
  options: SendOtpOptions
): Promise<void> => {
  const otpHtml = `<h1>Сайн байна уу?</h1>
    <strong>Таны шинэ нууц үг: ${options.code}</strong>
        <p>Баярлалаа.</p>
          <p><a href="wedding.zto.mn">wedding.zto.mn</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="wedding.zto.mn">Support</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="wedding.zto.mn">Terms</a><p>`;

  const mailOptions: MailOptions = {
    from: from,
    to,
    subject: `${subjectText} OTP code`,
    html: otpHtml,
  };

  await mailBuildAndSend(mailOptions);
};
export default {
  sendOtp,
  sendPassword,
};
