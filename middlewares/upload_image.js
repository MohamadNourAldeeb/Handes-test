import { StatusCodes } from "http-status-codes";

import { configUpload } from "../utils/helper.js";

//use to upload image from client to server and save it in images folder
export let uploadImage = (field, type) => {
    return async (req, res, next) => {
        try {
            let showError = (err) => {
                try {
                    if (err) {
                        if (err.code === "LIMIT_FILE_SIZE")
                            throw Error("File size is larger than required ");
                        else if (err.code === "LIMIT_UNEXPECTED_FILE")
                            throw Error(
                                "Please make sure that the file is entered correctly "
                            );
                        else if (err) throw Error(err.message);
                    }
                    next();
                } catch (error) {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ success: false, error: error.message });
                }
            };
            //for config upload
            let upload = await configUpload(field, type, req.query.file_type);

            upload(req, res, showError);
        } catch (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ success: false, error: error.message });
        }
    };
};
