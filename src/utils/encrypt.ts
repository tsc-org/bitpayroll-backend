import crypto from "crypto";
import { config } from "../config/config";

const algorithm = "aes-256-ctr";
const secretKey = config.secret;

export const encryptPrivateKey = async (privateKey: string):Promise<string> => {
  try {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(privateKey),
      cipher.final(),
    ]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error) {
    throw new Error(error);
  }
};

export const decryptPrivateKey = async (hashPrivateKey: string):Promise<string> => {
    try {
        const [iv, encrypted] = hashPrivateKey.split(":");
    
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, "hex"));
    
        const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, "hex")),
        decipher.final(),
        ]);
    
        return decrypted.toString();
    } catch (error) {
        throw new Error(error);
    }
    };