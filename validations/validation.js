import { StatusCodes } from "http-status-codes";

import { enumTypeInput as type } from "../utils/enums.js";
import { removePic } from "../utils/helper.js";

export const validate = (schema, typeSchema) => {
  let result = false;
  return (req, res, next) => {
    switch (typeSchema) {
      //validate body
      case type.body:
        result = schema.validate(req.body);
        break;
      ///validate query
      case type.query:
        result = schema.validate(req.query);
        break;
      ///validate params
      case type.params:
        result = schema.validate(req.params);
        break;
    }
    if (result.error) {
      removePic(req);
      const { details } = result.error;
      const message = details.map((i) => i.message).join(" , ");
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        success: false,
        data: {
          message: message,
          error_number: null,
        },
      });
    }
    next();
  };
};
