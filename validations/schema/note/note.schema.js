import Joi from "joi";
import { getErrorMessages, message } from "../../../utils/getMessageError.js";
import detectedBad from "../../../utils/modifyText/detectBad.js";
export const schema = {
  body: {
    create: Joi.object({
      content: Joi.string()
        .trim()
        .min(2)
        .max(500)
        .required()
        .messages(getErrorMessages("content"))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === "error") return helpers.message(message);
          else return checkResult;
        }),

      title: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages(getErrorMessages("title"))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === "error") return helpers.message(message);
          else return checkResult;
        }),
    }),

    update: Joi.object({
      content: Joi.string()
        .trim()
        .min(2)
        .max(500)
        .required()
        .messages(getErrorMessages("content"))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === "error") return helpers.message(message);
          else return checkResult;
        }),

      title: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages(getErrorMessages("title"))
        .custom((value, helpers) => {
          let checkResult = detectedBad(value);
          if (checkResult === "error") return helpers.message(message);
          else return checkResult;
        }),
    }),
  },
  params: Joi.object({
    id: Joi.string().min(5).max(30).messages(getErrorMessages("id")),
  }),
  query: Joi.object({}),
  pagination: Joi.object({
    size: Joi.number()
      .required()
      .integer()
      .min(1)
      .max(1e3)
      .messages(getErrorMessages("size")),
    page: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(1e5)
      .messages(getErrorMessages("page")),
    q: Joi.string().min(2).max(255).messages(getErrorMessages("q")),
  }),
  empty: Joi.object({}),
};
