import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import useragent from "useragent";
import LogMaliciousUser from "../models/log_malicious_user.model.js";
import { generateUuid } from "./gen_uuid.js";
// this code for print welcome logging in terminal
export let WelcomeLog = () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "┌────────────────────────────────────────────┐"
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `│ Welcome to the        backend  project 🆗  │`
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `│ This project is built using expressJs      │`
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `│ and Mysql database with redis NoSql    🔛  │`
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `│ This is the development version ,      🔃  │`
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    `│ Developer : Eng Mohamed Nour El-Deeb   😊  │`
  );
  console.log(
    "\x1b[33m%s\x1b[0m",
    "└────────────────────────────────────────────┘"
  );
};
// this code for move file
export let moveFile = (file, dir2) => {
  var f = path.basename(file);
  var dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err) => {
    if (err) throw Error(err);
  });
  return dest;
};
// this code for delete photos
export let removePic = async (myPath) => {
  try {
    if (await fsExtra.pathExists(myPath)) {
      await fsExtra.remove(myPath);
    }
  } catch (error) {
    console.log(`Error when delete photo : ${error}`);
  }
};
// this code for use it in route middleware when upload files

// this code for log the Malicious requests in db
export const logMaliciousUser = async (req, type, moreData = {}) => {
  const userAgent = req.headers["user-agent"];
  let ipAddress = req.headers["x-forwarded-for"] || req.ip;
  let agent = useragent.parse(req.headers["user-agent"]);
  let data = { type, moreData, userAgent, ipAddress, agent_info: agent };

  await LogMaliciousUser.create({
    _id: generateUuid(),
    data,
  });
};
// this code for compare the app versions
export const compareVersions = (currentVersion, newVersion) => {
  const currentParts = currentVersion.split(".").map(Number);
  const newParts = newVersion.split(".").map(Number);

  if (
    newParts[0] > currentParts[0] ||
    (newParts[0] === currentParts[0] && newParts[1] > currentParts[1]) ||
    (newParts[0] === currentParts[0] &&
      newParts[1] === currentParts[1] &&
      newParts[2] > currentParts[2])
  ) {
    return true;
  }

  return false;
};

export async function timeToMilliseconds(timeString) {
  const parts = timeString.split(" ");
  let totalMilliseconds = 0;

  for (const part of parts) {
    const [value, unit] = part.match(/(\d+)([dhm])/).slice(1);

    switch (unit.toLowerCase()) {
      case "h":
        totalMilliseconds += parseInt(value) * 3600; // Convert hours to milliseconds
        break;
      case "d":
        totalMilliseconds += parseInt(value) * 86400; // Convert days to milliseconds
        break;
      case "m":
        totalMilliseconds += parseInt(value) * 60; // Convert minutes to milliseconds
        break;
      default:
        console.error(`Unknown unit: ${unit}`);
    }
  }

  return totalMilliseconds;
}
