import Jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import CustomError from "./custom_error.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

export let verifyToken = async (token, SECRET_KEY) => {
  try {
    const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");

    const decoded = Jwt.verify(token, SECRET_KEY);

    if (!decoded || !decoded.hasOwnProperty("encrypted")) {
      throw new Error("Invalid token");
    }
    // Decrypt the payload
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      secretKey,
      Buffer.alloc(16)
    );
    let decrypted = decipher.update(decoded.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const timeLeftInSeconds = decoded.exp - currentTimeInSeconds;

    return { ...JSON.parse(decrypted), exp: timeLeftInSeconds };
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export let generateToken = (payload, SECRET_KEY, expiresIn) => {
  const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
  const jti = uuidv4();
  const payloadStr = JSON.stringify({ ...payload, jti });
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.alloc(16)
  );
  let encrypted = cipher.update(payloadStr, "utf8", "hex");
  encrypted += cipher.final("hex");
  const token = Jwt.sign(
    {
      encrypted,
    },
    SECRET_KEY,
    {
      expiresIn,
    }
  );
  return { token, jti };
};
