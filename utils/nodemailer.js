import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";
let emailsFolderPath = path.join(path.resolve(), "resources/emails");
dotenv.config({ path: `./.env` });

//  add here the admin's emails
const AdminEmailList = ["mohamad2129880@gmail.com"];

const getEmailTemplate = (templateName, data) => {
  const templatePath = path.join(emailsFolderPath, `${templateName}.hbs`);
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateContent);
  const htmlToSend = template({ ...data, date: new Date() });
  return htmlToSend;
};
// this send to new user
export let newUserEmail = async (user_name, email) => {
  const html = getEmailTemplate("NewUserEmail", { user_name });
  let mailOptions = {
    from: `${process.env.PROJECT_NAME} Team<${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: `Welcome to ${process.env.PROJECT_NAME} !🎉`,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error in sending email ", error);
  }
};
// this for verify email by otp
export let verifyEmail = async (user_name, otp, email) => {
  const html = getEmailTemplate("VerifyEmail", { user_name, otp });
  let mailOptions = {
    from: `${process.env.PROJECT_NAME} Team<${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: `${process.env.PROJECT_NAME}  Email Address Verification - Your OTP: ${otp}`,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error in sending email ", error.message);
  }
};
export let resetPassEmail = async (user_name, otp, email) => {
  const html = getEmailTemplate("ResetPassword", { user_name, otp });
  let mailOptions = {
    from: `${process.env.PROJECT_NAME} Team<${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: `Password Reset OTP: ${otp} - Confirm Your New Password !`,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error in sending email ", error);
  }
};
//_________________________________________________________________________--
//  ! For Developer
export const sendFiveHandredErrorsToDevelopers = async (error) => {
  let BackendDevelopersEmails = ["mohamad2129880@gmail.com"];
  BackendDevelopersEmails = BackendDevelopersEmails.concat(AdminEmailList);
  const htmlContent = getEmailTemplate("ServerErrorAlert", error);
  BackendDevelopersEmails.forEach((developerEmail) => {
    let mailOptions = {
      from: `⛔️ ${process.env.PROJECT_NAME} Server Error Alert <${process.env.EMAIL_USERNAME}>`,
      to: developerEmail,
      subject: "Server Error Notification: Something Went Wrong 🚨",
      html: htmlContent,
    };
    transporter.sendMail(mailOptions);
  });
};
export const WafErrorsToDevelopers = async (error) => {
  const htmlContent = getEmailTemplate("WafThreat", {
    ip: error.ip,
    url: error.url,
    method: error.method,
    moduleName: error.moduleName,
  });

  AdminEmailList.forEach((developerEmail) => {
    let mailOptions = {
      from: `⛔️ ${process.env.PROJECT_NAME} Server Threat Alert <${process.env.EMAIL_USERNAME}>`,
      to: developerEmail,
      subject: "Server Error Notification: Waf threat detected🚨",
      html: htmlContent,
    };
    try {
      transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("Something happened when sending WAF error emails ", error);
    }
  });
};
