import nodemailer from "nodemailer";

export const sendEmail = async (option:any)=>{
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6f0ebab4c8ae47",
          pass: "a9b5fd33bcbbca"
        }
      });
      
      var mailOptions = {
        from: '"Verify your email" <security@gmail.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
      };
      
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
}

