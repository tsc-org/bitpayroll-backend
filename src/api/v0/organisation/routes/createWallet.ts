import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createHDWallet } from "../../../../utils/createWallet";
import { requireAuth } from "../../auth/auth";
import { encryptPrivateKey } from "../../../../utils/encrypt";

const router: Router = Router();
const prisma = new PrismaClient();

//get current logged in organisation account details from database
router.get("/get-account", requireAuth, async (req: Request, res: Response) => {
  const orgid = req.params.orgid;
  const organisation = await prisma.user.findUnique({
    where: {
      id: orgid,
    },
  });
  if (!organisation) {
    return res.status(400).json({ message: "Organisation not found." });
  }
  return res.status(200).json(organisation);
});




router.post(
  "/create-wallet/:orgid",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      //get createHDWallet function from utils
      const wallet = createHDWallet();
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
          orgID: req.params.orgid,
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
