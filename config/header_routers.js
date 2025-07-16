import { authentication } from "../middlewares/auth.js";
import { validate } from "../validations/validation.js";
import { enumTypeInput } from "../utils/enums.js";
import fileProcessing from "../utils/file_processing.js";

const execute = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next)).catch(async (error) => {
        if (req.files)
            await Promise.all(
                req.files.map(async (item) => {
                    await fileProcessing.deleteFile(item.file_name);
                })
            );
        if (req.file) {
            try {
                await fileProcessing.deleteFile(req.file.file_name);
            } catch (error) {}
        }
        if (error.code == "ENOENT") {
        } else next(error);
    });
};

export { authentication, execute, validate, enumTypeInput as type };
