import { StatusCodes } from "http-status-codes";
import fileProcessing from "../utils/file_processing.js";
import { storeError } from "../utils/storeError.js";
export let errorHandler = async (error, req, res, next) => {
    let statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
    let errorMessage = error.message || "Internal Server Error";
    // Send the error response to the client

    if (req.files) {
        await Promise.all(
            req.files.map((item) => {
                fileProcessing.deleteFile(item.filename);
            })
        );
    }
    if (req.file) {
        fileProcessing.deleteFile(req.file.filename);
    }
    let data = { msg: errorMessage, error_number: null };

    if (
        error.name == "ReferenceError" ||
        error.name == "TypeError" ||
        error.name == "SyntaxError" ||
        error.name == "RangeError" ||
        error.name == "URIError" ||
        error.name == "EvalError" ||
        error.name == "ConcurrentModificationError" ||
        error.name == "PromiseRejectionError"
    ) {
        console.log({ error });
        data = await storeError(error);
    }

    return res.status(statusCode).json({
        success: false,
        data: { message: data.msg, error_number: data.error_number },
    });
};
