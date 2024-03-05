import { randomBytes } from "crypto";

export const randomString = (length) =>
  randomBytes(length).toString("hex").substring(0, length);
