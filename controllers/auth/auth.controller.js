import { StatusCodes } from "http-status-codes";
import * as crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: `../.env` });
//UTILS
import { bcrypt, compare } from "../../utils/bcrypt.js";
import { generateToken, verifyToken } from "../../utils/jwt.js";

import CustomError from "../../utils/custom_error.js";
import {
  addToRedisCache,
  deleteFromRedis,
  getFromRedisCache,
} from "../../utils/redis_cache.js";
import { sequelize } from "../../utils/connect.js";
import {
  newUserEmail,
  resetPassEmail,
  verifyEmail,
} from "../../utils/nodemailer.js";
import { generateUuid } from "../../utils/gen_uuid.js";
import { enumStateOfEmail, enumTypeOtp } from "../../utils/enums.js";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
import { Author, UserRefreshToken } from "../../models/index.js";
import { timeToMilliseconds } from "../../utils/helper.js";
import { decryptToken } from "../../utils/aes_encrypting.js";

export default {
  // login controllers function
  logIn: async (req, res) => {
    const body = req.body;
    let author = await Author.findOne({
      raw: true,
      nest: true,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        email: body.email.trim(),
      },
    });
    if (!author) throw new CustomError("the email is incorrect");

    let trying_count = +(await getFromRedisCache(`${author.id}_trying`));
    if (trying_count && trying_count > 4)
      throw new CustomError("please make verification by email");

    let check_pass = await compare(body.password, author.password);
    if (!check_pass) {
      trying_count = trying_count ? trying_count : 0;
      await addToRedisCache(
        `${author.id}_trying`,
        `${trying_count + 1}`,
        1000 * 60 * 60 * 24 * 30 * 360
      );
      throw new CustomError("The password is incorrect");
    }

    const token = generateToken(
      {
        id: author.id,
        email: author.email,
        email_state: author.email_state,
        device: req.device,
      },
      process.env.TOKEN_SECRET_KEY,
      process.env.TOKEN_EXPIRES_IN
    );

    const refresh_token = generateToken(
      {
        id: author.id,
        email: author.email,
        email_state: author.email_state,
        device: req.device,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_EXPIRES_IN
    );

    await sequelize.transaction(async (transaction) => {
      let UserRefresh = await UserRefreshToken.findOne({
        attributes: ["id"],
        raw: true,
        where: { user_id: author.id, device: req.device },
      });
      if (UserRefresh) {
        await UserRefreshToken.destroy(
          {
            where: { id: UserRefresh.id },
          },
          { transaction }
        );
        await deleteFromRedis(`${UserRefresh.id}`);
      }
      let NewUserRefreshTokens = await UserRefreshToken.create(
        {
          token: refresh_token.token,
          user_id: author.id,
          expired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          device: req.device,
        },
        { transaction }
      );

      await addToRedisCache(
        `${NewUserRefreshTokens.id}`,
        `${token.jti}`,
        await timeToMilliseconds(process.env.TOKEN_EXPIRES_IN)
      );
    });

    await deleteFromRedis(`${author.id}_trying`);

    // ! Send Response For Client
    sendHttpResponse(res, StatusCodes.OK, {
      message: `Welcome my friend ${author.author_name}😊`,
      token: token.token,
      refresh_token: refresh_token.token,
      author_id: author._id,
      author_name: author.author_name,
      email: author.email,
      email_verified: author.email_state,
    });
  },
  // logout controllers function
  logout: async (req, res) => {
    let UserRefresh = await UserRefreshToken.findOne({
      raw: true,
      attributes: ["id"],
      where: {
        user_id: req.user.id,
        device: req.user.device,
      },
    });

    await UserRefreshToken.destroy({
      where: { id: UserRefresh.id },
    });
    await deleteFromRedis(`${UserRefresh.id}`);

    // ! Send Response For Client
    sendHttpResponse(res, StatusCodes.OK, {
      message: `good bay my friend 😊🙋‍♂️ `,
    });
  },
  // change password controllers function
  changePass: async (req, res) => {
    const body = req.body;
    const user = await Author.findOne({
      where: { id: req.user.id },
      raw: true,
      nest: true,
      include: [
        {
          model: UserRefreshToken,
          required: false,
          attributes: ["id"],
          where: { device: req.user.device },
        },
      ],
    });

    // if you trying to change after you fail 3 times login
    let trying_count = +(await getFromRedisCache(`${user.id}_trying`));
    if (trying_count && trying_count > 4)
      throw new CustomError("please make verification by email");

    // if the old password not correct
    if (!(await compare(body.old_password, user.password))) {
      trying_count = trying_count ? trying_count : 0;
      await addToRedisCache(
        `${user.id}_trying`,
        `${trying_count + 1}`,
        1000 * 60 * 60 * 24 * 30 * 360
      );
      throw new CustomError("The password is incorrect");
    }
    // update the user password
    await Author.update(
      { password: bcrypt(body.new_password, 10) },
      { where: { id: req.user.id } }
    );
    // to make the user logout and make login again with new pass
    await deleteFromRedis(`${user.UserRefreshTokens.id}`);
    await UserRefreshToken.destroy({
      where: {
        id: user.UserRefreshTokens.id,
      },
    });
    // ! Send Response For Client
    sendHttpResponse(res, StatusCodes.OK, {
      message: `Please login again my friend 😊🙋‍♂️ `,
    });
  },
  // Refresh token  controllers function
  refreshToken: async (req, res) => {
    const body = req.body;
    let refresh_token = body.refresh_token;
    let decoded = null;
    try {
      decoded = await verifyToken(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
    } catch (error) {
      throw new CustomError("Invalid refresh token");
    }

    req.user = decoded;
    const user_id = decoded.id;
    // get the refresh token from database to compare it
    const refresh_token_row = await UserRefreshToken.findOne({
      raw: true,
      nest: true,
      include: [
        {
          model: Author,
          required: true,
        },
      ],
      where: { user_id, device: decoded.device },
    });
    if (!refresh_token_row) throw new CustomError("You have logged out");

    // make decrypt the token to compare it

    let test = decryptToken(refresh_token_row.token);

    if (test !== refresh_token) throw new CustomError("Invalid refresh token");
    // if true make the new token

    if (req.device !== refresh_token_row.device)
      throw new CustomError("The serial dose not match the serial in token ");

    await sequelize.transaction(async (transaction) => {
      if (
        new Date(refresh_token_row.expired).getTime() < new Date().getTime()
      ) {
        await UserRefreshToken.destroy(
          {
            where: { id: refresh_token_row.id },
          },
          { transaction }
        );

        refresh_token = generateToken(
          {
            id: refresh_token_row.Author.id,
            email: refresh_token_row.Author.email,
            email_state: refresh_token_row.Author.email_state,
            device: decoded.device,
          },

          process.env.REFRESH_TOKEN_SECRET_KEY,
          process.env.REFRESH_TOKEN_EXPIRES_IN
        );

        refresh_token_row = await UserRefreshToken.create(
          {
            token: refresh_token,
            user_id: refresh_token_row.Author.id,
            expired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            device: refresh_token_row.device,
          },
          { transaction }
        );
      }
    });
    const token = generateToken(
      {
        id: refresh_token_row.Author.id,
        email: refresh_token_row.Author.email,
        email_state: refresh_token_row.Author.email_state,
        device: decoded.device,
      },

      process.env.TOKEN_SECRET_KEY,
      process.env.TOKEN_EXPIRES_IN
    );

    await addToRedisCache(
      `${refresh_token_row.id}`,
      `${token.jti}`,
      await timeToMilliseconds(process.env.TOKEN_EXPIRES_IN)
    );

    // ! Send Response For Client
    sendHttpResponse(res, StatusCodes.OK, {
      message: `Hello ,this is new token 😊🙋‍♂️ `,
      token: token.token,
      refresh_token: refresh_token.token ? refresh_token.token : refresh_token,
    });
  },
  // verification controllers function
  verification: async (req, res) => {
    const body = req.body;
    const email = body.email;
    const bodyOtp = body.otp;

    let author = await Author.findOne({
      raw: true,
      where: {
        email: email,
      },
    });

    if (!author) {
      throw new CustomError("The email is incorrect");
    }
    if (
      body.otp_type === enumTypeOtp.verify &&
      author.email_state == enumStateOfEmail.verified
    ) {
      throw new CustomError("The email already verified");
    }
    // get the otp code for the email from cash
    const verifiedCode = await getFromRedisCache(`${email.trim()}`);
    if (!verifiedCode) throw new CustomError("Sorry the time is up 🤦‍♀️");
    if (bodyOtp !== verifiedCode)
      throw new CustomError("Sorry the otp is incorrect 🤦‍♀️");

    let userUpdateBody = {
      email_state: enumStateOfEmail.verified,
    };

    if (body.otp_type === enumTypeOtp.reset_pass) {
      if (!body.new_password)
        throw new CustomError(
          "you should send new passwords with type : reset_pass "
        );
      userUpdateBody.password = bcrypt(body.new_password, 10);
    }

    // if the otp correct entered ,make the email authenticated and verified
    await Author.update(userUpdateBody, { where: { id: author.id } });

    const token = generateToken(
      {
        id: author.id,
        email: author.email,
        email_state: enumStateOfEmail.verified,
        device: req.device,
      },

      process.env.TOKEN_SECRET_KEY,
      process.env.TOKEN_EXPIRES_IN
    );

    const refresh_token = generateToken(
      {
        id: author.id,
        email: author.email,
        email_state: enumStateOfEmail.verified,
        device: req.device,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_EXPIRES_IN
    );
    let userRefreshTokens;
    await sequelize.transaction(async (transaction) => {
      let user_ref_token = await UserRefreshToken.findOne({
        attributes: ["id"],
        raw: true,
        where: { user_id: author.id, device: req.device },
      });
      if (user_ref_token) {
        await UserRefreshToken.destroy(
          {
            where: { id: user_ref_token.id },
          },
          { transaction }
        );
        await deleteFromRedis(`${user_ref_token.id}`);
      }
      userRefreshTokens = await UserRefreshToken.create(
        {
          _id: generateUuid(),
          token: refresh_token.token,
          user_id: author.id,
          expired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          device: req.device,
        },
        transaction
      );
    });
    await addToRedisCache(
      `${userRefreshTokens.id}`,
      `${token.jti}`,
      await timeToMilliseconds(process.env.TOKEN_EXPIRES_IN)
    );
    await deleteFromRedis(`${author.id}_trying`);

    await deleteFromRedis(`${email}`);

    // ! Send Response For Client
    sendHttpResponse(res, StatusCodes.OK, {
      message: `Welcome my friend ${author.author_name}😊`,
      token: token.token,
      refresh_token: refresh_token.token,
      author_id: author._id,
      author_name: author.author_name,
      email: author.email,
      email_verified: enumStateOfEmail.verified,
    });
  },

  sendCode: async (req, res) => {
    const body = req.body;
    const author = await Author.findOne({
      raw: true,
      attributes: ["author_name"],
      where: {
        email: body.email.trim(),
      },
    });
    if (!author) throw new CustomError("The email is incorrect");
    const verifiedCode = crypto.randomInt(1000, 9999).toString();
    if (body.type == enumTypeOtp.verify)
      await verifyEmail(author.author_name, verifiedCode, body.email);
    else {
      await resetPassEmail(author.author_name, verifiedCode, body.email);
    }

    await addToRedisCache(`${body.email.trim()}`, `${verifiedCode}`, 5 * 60);

    // ! Send Response For Client
    sendHttpResponse(res, StatusCodes.OK, {
      message: `i send email to :${body.email} 💌`,
    });
  },

  register: async (req, res) => {
    const body = req.body;
    if (
      await Author.findOne({
        attributes: ["id"],
        where: {
          email: body.email,
        },
      })
    )
      throw new CustomError("This email already token");

    if (
      await Author.findOne({
        attributes: ["id"],
        where: {
          author_name: body.author_name,
        },
      })
    )
      throw new CustomError("This author name already token");

    let author = null;
    let token = null;
    let refresh_token = null;

    await sequelize.transaction(async (transaction) => {
      author = await Author.create(
        {
          _id: generateUuid(),
          author_name: body.author_name,
          password: body.password,
          email: body.email,
          email_state: enumStateOfEmail.un_verified,
        },
        { transaction }
      );

      token = generateToken(
        {
          id: author.id,
          email: author.email,
          email_state: author.email_state,
          device: req.device,
        },
        process.env.TOKEN_SECRET_KEY,
        process.env.TOKEN_EXPIRES_IN
      );

      refresh_token = generateToken(
        {
          id: author.id,
          email: author.email,
          email_state: author.email_state,
          device: req.device,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        process.env.REFRESH_TOKEN_EXPIRES_IN
      );
      let userRefreshTokens = await UserRefreshToken.create(
        {
          token: refresh_token.token,
          user_id: author.id,
          expired: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          device: req.device,
        },
        { transaction }
      );
      await addToRedisCache(
        `${userRefreshTokens.id}`,
        `${token.jti}`,
        await timeToMilliseconds(process.env.TOKEN_EXPIRES_IN)
      );
    });
    if (!author) {
      throw new CustomError("someThing went wrong");
    }
    newUserEmail(body.author_name, body.email);

    sendHttpResponse(res, StatusCodes.OK, {
      message: `Welcome my friend ${body.author_name}😊`,
      token: token.token,
      refresh_token: refresh_token.token,
      author_id: author._id,
      author_name: author.author_name,
      email: author.email,
      email_verified: enumStateOfEmail.un_verified,
    });
  },
};
