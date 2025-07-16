import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import expressSanitizer from "express-sanitizer";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routers/router.js";
import compression from "compression";
import fs from "fs";
// imports middlewares
import { apiKeyTest } from "./middlewares/security/api_key.js";
import wafMiddleware from "./middlewares/security/wafMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// imports configs
import helmet from "./config/helmet.js";
import logRegisterConfig from "./config/log.js";
import corsConfig from "./config/cors.js";
import { deviceCheckTest } from "./middlewares/deviceCheck.js";

dotenv.config({ path: `.env` });

let app = express();
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// use statics files
const publicDirectoryPathImage = path.join(path.resolve(), "./public/images");
app.use("/public/images", express.static(publicDirectoryPathImage));
const publicDirectoryPathImageFiles = path.join(
  path.resolve(),
  "./public/files"
);
app.use("/public/files", express.static(publicDirectoryPathImageFiles));

app.use(expressSanitizer());
corsConfig(app);
helmet(app);
logRegisterConfig(app);
app.use(compression());
app.use(wafMiddleware);
app.use(apiKeyTest);
app.use(deviceCheckTest);

app.use(router);
app.use(errorHandler);
export default app;
