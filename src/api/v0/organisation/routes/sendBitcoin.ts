import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { decryptPrivateKey } from "../../../../utils/encrypt";
import { sendBitcoin } from "../../../../utils/sendBitcoin";

const router: Router = Router();
const prisma = new PrismaClient();

router.post("/send-bitcoin", async (req: Request, res: Response) => {
  const { amount, toAddress, fromAddress, privateKey } = req.body;
  const decryptedPrivateKey = decryptPrivateKey(privateKey);
  const transaction = await sendBitcoin(
    amount,
    toAddress,
    fromAddress,
    decryptedPrivateKey
  );
  return res.status(200).json({ transaction });
 
});

export const SendBitcoinRouter: Router = router;
