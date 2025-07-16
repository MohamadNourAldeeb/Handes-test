import dotenv from "dotenv";
dotenv.config();
import ApiError from "../models/api_error.model.js";
import { StatusCodes } from "http-status-codes";
import { sendFiveHandredErrorsToDevelopers } from "./nodemailer.js";

let storeError = async (error) => {
  let data = {};
  let errorRecord = null;
  const errorMessage = error.message;
  const errorCode = error.name;

  if (
    errorCode == "ReferenceError" ||
    errorCode == "TypeError" ||
    errorCode == "SyntaxError" ||
    errorCode == "RangeError" ||
    errorCode == "URIError" ||
    errorCode == "EvalError" ||
    errorCode == "ConcurrentModificationError" ||
    errorCode == "PromiseRejectionError"
  ) {
    let error_number = null;
    let checkError = await ApiError.findOne({
      raw: true,
      where: { message: errorMessage.trim() },
    });
    errorRecord = checkError;
    if (checkError) {
      error_number = checkError.id;
      errorRecord.error_number = error_number;
    } else {
      const errorLine = error.stack.split("\n")[1];

      let errorLineNumber = 1;
      let errorFilePath = "not found path";

      if (errorLine.match(/:(\d+):\d+\)$/))
        errorLineNumber = errorLine.match(/:(\d+):\d+\)$/)[1];
      if (errorLine.match(/\((.*):[0-9]+:[0-9]+\)$/))
        errorFilePath = errorLine.match(/\((.*):[0-9]+:[0-9]+\)$/)[1];
      errorRecord = await ApiError.create({
        code: 500,
        message: errorMessage,
        file: errorFilePath,
        line: errorLineNumber,
      });

      error_number = errorRecord.dataValues.id;
      errorRecord = { ...errorRecord.dataValues, error_number };
    }
    data = {
      msg: "There are some error in server ! please check error number",
      error_number,
    };
  } else if (error.statusCode == StatusCodes.UNAUTHORIZED) {
    data = {
      msg: error.message,
      error_number: null,
    };
  } else {
    data = {
      msg: error.message,
      error_number: null,
    };
  }

  // ! Send Email to Backend Developers
  if (process.env.DB_USER == "admin")
    await sendFiveHandredErrorsToDevelopers(errorRecord);
  return data;
};
export { storeError };
