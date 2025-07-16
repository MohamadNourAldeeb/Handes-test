import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/custom_error.js";

export const deviceCheckTest = async (req, res, next) => {
  try {
    let deviceSerial = req.headers["device"];
    if (!deviceSerial)
      throw new CustomError(
        "device serial not exists, please set device serial in headers and try again 🚬",
        StatusCodes.UNAUTHORIZED
      );

    req.device = deviceSerial;

    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      data: {
        message: err.message,
        error_number: null,
      },
    });
  }
};
