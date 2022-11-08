import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { sendBitcoin } from "../../../../utils/sendBitcoin";

const router: Router = Router();
const prisma = new PrismaClient();

const decryptPrivateKey = async(privateKey:string, hashPrivateKey) => {
    return await bcrypt.compare(privateKey, hashPrivateKey);
};


router.post("/send-bitcoin", async (req: Request, res: Response) => {
  //get the private from the database
  const privateKey = prisma.wallet.findUnique({
    where: {
      id: "1",
    },
  });
  try {
    const { sourceAddress, recieverAddress, amount } = req.body;
    const send = await sendBitcoin(
      sourceAddress,
      recieverAddress,
      amount,
      privateKey
    );
    res.status(200).json({ send });
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
});
