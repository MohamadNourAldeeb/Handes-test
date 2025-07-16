import express from "express";
const router = express.Router();
import controller from "../../controllers/auth/auth.controller.js";
import {
    validate,
    type,
    execute,
    authentication,
} from "../../config/header_routers.js";
import { schema } from "../../validations/schema/auth/auth.schema.js";
import { limitAuth, publicLimit } from "../../middlewares/security/limit.js";

router.post(
    "/log-in",
    limitAuth,
    validate(schema.logIn, type.body),
    execute(controller.logIn)
);

router.post(
    "/refresh-token",
    limitAuth,
    validate(schema.refreshToken, type.body),
    execute(controller.refreshToken)
);
router.post(
    "/change-password",
    publicLimit,
    authentication,
    validate(schema.ChangePass, type.body),
    execute(controller.changePass)
);

router.post(
    "/send-code",
    limitAuth,
    validate(schema.SendCode, type.body),
    execute(controller.sendCode)
);

router.post(
    "/verification",
    limitAuth,
    validate(schema.verification, type.body),
    execute(controller.verification)
);

router.post(
    "/register",
    limitAuth,
    validate(schema.register, type.body),
    execute(controller.register)
);

router.get("/log-out", authentication, execute(controller.logout));

export default router;
