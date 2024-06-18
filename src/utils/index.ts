import { authConfigurations } from "app/config";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Schema } from "mongoose";

const APP_SECRET = authConfigurations.APP_SECRET;

/**
 * Generate salt
 */
export async function generateSalt() {
  return bcrypt.genSalt();
}

/**
 * Hash password
 * @param password
 * @returns
 */
export async function hashPassword(password: string, salt: string) {
  return bcrypt.hash(password, salt);
}

/**
 * Compare password
 * @param enteredPassword
 * @param savedPassword
 * @param salt
 * @returns
 */
export async function comparePassword(
  enteredPassword: string,
  savedPassword: string,
  salt: string,
) {
  const hashedPassword = await hashPassword(enteredPassword, salt);
  return hashedPassword === savedPassword;
}

/**
 * Generate signature
 * @param payload
 * @returns
 */
export async function generateSignature(payload: any) {
  return jwt.sign(payload, APP_SECRET);
}

/**
 * Verify signature
 * @param signature
 * @returns
 */
export function verifySignature(token: string) {
  const tokenJwt = token.split(" ")[1];
  const payload = jwt.verify(tokenJwt, APP_SECRET);

  return payload;
}

/**
 * Auto increment plugin
 */
export function autoIncrementPlugin(schema: Schema) {
  schema.pre("save", async function (next) {
    if (!this.id) {
      const highestIdDoc = await this.model().findOne().sort("-id").exec();

      this.id = highestIdDoc ? highestIdDoc.id + 1 : 1;
    }
    next();
  });
}

/**
 * Format data
 */
export function formatData(data: any) {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
}
