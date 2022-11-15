import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { decryptPrivateKey } from "../../../../utils/encrypt";
import { sendBitcoin } from "../../../../utils/sendBitcoin";

const router: Router = Router();
const prisma = new PrismaClient();

// const decryptPrivateKey = async (privateKey: string, hashPrivateKey) => {
//   return await bcrypt.compare(privateKey, hashPrivateKey);
// };

router.post("/send-bitcoin", async (req: Request, res: Response) => {
  try {
    const { sourceAddress, recieverAddress, amount } = req.body;
    const send = await sendBitcoin(
      sourceAddress,
      recieverAddress,
      amount,
      hashedPrivateKey,
      );
    res.status(200).json({ send });
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
});
