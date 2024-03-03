import * as AWS from 'aws-sdk';
// import * as nodemailer from "nodemailer";
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});
AWS.config.getCredentials(function (error) {
  if (error) {
    console.log(error.stack);
  }
});
const ses = new AWS.SES({ apiVersion: 'latest' });
// const transporter = nodemailer.createTransport({
//     SES: ses,
// });

// One way
export async function sendEmail({ to, from, subject, message }) {
  const params = {
    Source: from,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: message } },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent:', result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// One way
// const adminMail = "yourmail@mail.com";
// const transporter = nodemailer.createTransport({
//     SES: ses,
// });
// export const testMail = async (userEmail) => {
//     try {
//         const response = await transporter.sendMail({
//             from: adminMail,
//             to: userEmail,
//             subject: "Test Mail",
//             html: `
//                 <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
//                 <html>
//                 <head>
//                 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//                 </head>
//                 <body>
//                 <div style="padding:20px;">
//                 <div style="max-width: 500px;">
//                 <h2>Test Mail</h2>
//                 <p>
//                 Hi there,<br/><br/>
//                 This is a test mail.
//                 </p>
//                 </div>
//                 </div>
//                 </body>
//                 </html>
//             `,
//         });
//         return response?.messageId
//     ? { ok: true }
//     : { ok: false, msg: "Failed to send email" };
//     } catch (error) {
//         console.log("ERROR", error.message);
//         return { ok: false, msg: "Failed to send email" };
//     }
// };
