import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHDWallet } from "../../../../utils/createWallet";
import { requireAuth } from "../../auth/auth";
import { encryptPrivateKey } from "../../../../utils/encrypt";

const router: Router = Router();
const prisma = new PrismaClient();


router.post(
  "/create-wallet",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      //get createHDWallet function from utils
      const wallet = await createHDWallet();
      const mnemonic = wallet.mnemonic;
      const address = wallet.address;
      const privateKey = (
        await encryptPrivateKey(wallet.privatekey)
      ).toString();
      const xpub = wallet.xpub;
     await prisma.wallet.create({
        data: {
          wallet_address: address,
          privatekey: privateKey,
          xpubkey: xpub,
        },
      });

      res.status(200).json({ mnemonic, address });
    } catch (error) {
      res.status(500).json({ error: error.message });
      throw new Error(error);
    }
  }
);

export const WalletRouter: Router = router;
