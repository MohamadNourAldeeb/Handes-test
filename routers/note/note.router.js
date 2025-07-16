import express from "express";
const router = express.Router();
import { schema } from "../../validations/schema/note/note.schema.js";
import { type, validate, execute } from "../../config/header_routers.js";
import controller from "../../controllers/note/note.controllers.js";
import { authentication } from "../../middlewares/auth.js";
import { publicLimit } from "../../middlewares/security/limit.js";
router.post(
  "/",
  authentication,
  publicLimit,
  validate(schema.body.create, type.body),
  execute(controller.create)
);

router.put(
  "/:id",
  authentication,
  publicLimit,
  validate(schema.body.update, type.body),
  validate(schema.params, type.params),
  execute(controller.update)
);

router.delete(
  "/:id",
  authentication,
  publicLimit,
  validate(schema.params, type.params),
  validate(schema.empty, type.query),
  execute(controller.delete)
);
router.get(
  "/:id",
  authentication,
  publicLimit,
  validate(schema.params, type.params),
  validate(schema.empty, type.query),
  execute(controller.getOne)
);
router.get(
  "/",
  authentication,
  publicLimit,
  validate(schema.empty, type.params),
  validate(schema.pagination, type.query),
  execute(controller.getAll)
);
export default router;
