import dotenv from 'dotenv';
dotenv.config({ path: `../.env` });
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../utils/custom_error.js';
import { logMaliciousUser } from '../../utils/helper.js';

export const apiKeyTest = async (req, res, next) => {
  try {
    const api_key = req.headers[ 'api-key' ];

    if (!api_key || api_key != process.env.API_KEY)
      throw new CustomError('Access denied api-key is wrong', 401);

    next();
  } catch (err) {
    let moreData = {
      visitedPath: req.originalUrl,
      method: req.method,
      bodySize: JSON.stringify(req.body).length,
      querySize: JSON.stringify(req.query).length,
      Body: req.body,
      Query: req.query,
      Params: req.params,
      path: req.path,
    };

    logMaliciousUser(req, 'without Api-key', moreData);

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      data: {
        message: err.message,
        error_number: null,
      },
    });
  }
};
