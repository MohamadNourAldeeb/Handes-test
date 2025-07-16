import path from "path";
import app from "./app.js";
import { sequelize } from "./utils/connect.js";
import { WelcomeLog } from "./utils/helper.js";
import { getAllInRedis } from "./utils/redis_cache.js";
import fs from "fs";

let createRelations = async () => {
  let all = await import("./models/index.js");
  try {
    await sequelize.sync({ alter: true });
    console.log("Successfully synced all models ✅✅");
  } catch (err) {
    console.error("Error syncing models:", err);
  }
};

app.listen(process.env.PORT, async () => {
  await createRelations();

  // await getAllInRedis();

  const publicDirectoryPathImageFiles = path.join(
    path.resolve(),
    "./public/files"
  );
  if (!fs.existsSync(publicDirectoryPathImageFiles)) {
    fs.mkdirSync(publicDirectoryPathImageFiles, { recursive: true });
  }

  const publicDirectoryPathImage = path.join(path.resolve(), "./public/images");
  if (!fs.existsSync(publicDirectoryPathImage)) {
    fs.mkdirSync(publicDirectoryPathImage, { recursive: true });
  }

  WelcomeLog();
  console.log(
    `Listening at ${process.env.LINK}:${process.env.PORT} ✅ , Mode : ${process.env.NODE_ENV}`
  );
});
