const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = async (email, name) => {
  try {
    await sgMail.send({
      to: email,
      from: "kevinkhalifa911@gmail.com",
      subject: "Thanks for joining in",
      text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log(error);
  }
};

const sendEmailOnDeleteAccount = async (email, name) => {
  try {
    await sgMail.send({
      to: email,
      from: "kevinkhalifa911@gmail.com",
      subject: "Thanks for having us",
      text: `Goodbye ${name}. Please let us know what we would have done to improve our app`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendEmailOnDeleteAccount,
};
