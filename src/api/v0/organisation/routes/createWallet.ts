import { Router, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { createHDWallet } from "../../../../utils/createWallet";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

//encrypt the private key using bcrypt

const encryptPrivateKey = async (privateKey:string):Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPrivateKey = await bcrypt.hash(privateKey, salt);
  return hashPrivateKey;
};



router.post("/create-wallet", requireAuth, async (req: Request, res: Response) => {
  try {
    //get createHDWallet function from utils
  const wallet = await createHDWallet();
  //get the mnemonic from the wallet
  const mnemonic = wallet.mnemonic;
  //get the address from the wallet
  const address = wallet.address;
  //get the private key from the wallet
  const privateKey = (await encryptPrivateKey(wallet.privatekey)).toString();
  //get the xpub from the wallet
  const xpub = wallet.xpub;
  //get the organisation id from the request

  //update the wallet with the new wallet details
  const walletDetails = await prisma.wallet.create({
   data: {
      wallet_address: address,
      privatekey: privateKey,
      xpubkey: xpub,
    }
  });
  res.status(200).json({walletDetails});
  } catch (error) {
    res.status(500).json({error: error.message});
    throw new Error(error);
  }
});

export const WalletRouter: Router = router;
