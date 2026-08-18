import crypto from "crypto";
import { ENV } from "./env.js";

const ENCRYPTION_PREFIX = "aesgcm:";

function getEncryptionKey() {
  const secret = ENV.MESSAGE_ENCRYPTION_SECRET || ENV.JWT_SECRET;
  if (!secret) {
    throw new Error("MESSAGE_ENCRYPTION_SECRET or JWT_SECRET is required for message encryption");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptMessageText(text) {
  if (!text) return text;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTION_PREFIX,
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decryptMessageText(text) {
  if (!text || !text.startsWith(ENCRYPTION_PREFIX)) return text;

  try {
    const [, iv, authTag, encrypted] = text.split(".");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(iv, "base64")
    );

    decipher.setAuthTag(Buffer.from(authTag, "base64"));

    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch (error) {
    console.log("Message decrypt failed:", error.message);
    return "";
  }
}

export function serializeMessage(message) {
  const serializedMessage = message.toObject ? message.toObject() : { ...message };

  return {
    ...serializedMessage,
    text: decryptMessageText(serializedMessage.text),
  };
}
