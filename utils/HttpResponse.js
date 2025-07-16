export const sendHttpResponse = (res, status, data, req) => {
  if (!data) {
    data = {
      message: "operation accomplished successfully",
      error_code: null,
    };
  }

  return res.status(status).send({
    success: true,
    data,
  });
};
export const sendErrorHttpResponse = (
  res,
  status = 400,
  errorCode,
  errorMessage,
  errorDetails
) => {
  if (!errorMessage) {
    errorMessage[0] = "Internal Server Error";
  }
  errorCode = errorCode ? errorCode : null;

  return res.status(status).send({
    success: false,
    data: {
      message: errorMessage,
      error_code: errorCode,
    },
  });
};
