import crypto from "crypto";
import * as zlib from "zlib";
import dotenv from "dotenv";
dotenv.config();
// ______________________________________________________
export let encrypt = (value) => {
  const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.alloc(16)
  );
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
// ______________________________________________________

export let decrypt = (value) => {
  const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.alloc(16)
  );
  let decrypted = decipher.update(value, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
// ______________________________________________________

export let encryptToken = (plaintext) => {
  const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
  const compressed = zlib.deflateSync(plaintext);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.alloc(16)
  );
  let encrypted = cipher.update(compressed);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("base64");
};
// ______________________________________________________

export let decryptToken = (encryptedText) => {
  const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
  const encrypted = Buffer.from(encryptedText, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.alloc(16)
  );

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return zlib.inflateSync(decrypted).toString("utf8");
};
