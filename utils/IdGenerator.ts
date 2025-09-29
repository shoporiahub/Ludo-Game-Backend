import * as crypto from "crypto";

/** Generate a unique ID with optional prefix */
export function generateId(prefix: string = ""): string {
  return prefix + crypto.randomBytes(6).toString("hex");
}
