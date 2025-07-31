
import nodemailer, { SentMessageInfo} from 'nodemailer';

const mailSender = async (email: string, title: string, body: string): Promise<SentMessageInfo> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      to: email,
      from: process.env.MAIL_USER,
      subject: title,
      html: body,
    });

    return info;
  } catch (err) {
    console.error("Error in Send Mail ::", err);
    throw err;
  }
};

export default mailSender;
