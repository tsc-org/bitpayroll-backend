import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHDWallet } from "../../../../utils/createWallet";
import { requireAuth } from "../../auth/auth";
import { encryptPrivateKey } from "../../../../utils/encrypt";

const router: Router = Router();
const prisma = new PrismaClient();

router.post(
  "/create-wallet/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      //get createHDWallet function from utils
      const wallet = createHDWallet();
      const mnemonic = await wallet.mnemonic;
      const address = await wallet.address;
      const privateKey = (
        await encryptPrivateKey(wallet.privatekey)
      ).toString();
      const xpub = await wallet.xpub;
      //create wallet in wallet and connect with user collection
     await prisma.wallet.create({
        data: {
          address: address,
          privatekey: privateKey,
          xpubkey: xpub,
          user: {
            connect: {
              id: id,
            },
          },
        },
      });
     return res.status(200).json({ mnemonic, address });
    } catch (error) {
     return res.status(500).json({ error: error.message });

    }
  }
);

export const WalletRouter: Router = router;
