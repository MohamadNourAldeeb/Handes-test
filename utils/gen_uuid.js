import * as crypto from "crypto";

export let generateUuid = () => {
  let uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  return uniqueId;
};
