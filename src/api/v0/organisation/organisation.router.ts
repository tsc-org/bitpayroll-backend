import { Router, Response, Request } from "express";
import { ProfileRouter } from "./routes/updateProfile";
import { WalletRouter } from "./routes/createWallet";
import { InviteEmployeeRouter } from "./routes/inviteEmployee";
import { SendBitcoinRouter } from "./routes/sendBitcoin";
import { ListEmployeeRouter } from "./routes/listEmployee";
import {ListWalletRouter} from "./routes/listWallet";
import { PaymentDetailsRouter } from "./routes/paymentUpdate";
import { DeleteEmployeeRouter } from "./routes/deleteEmployee";

const router: Router = Router();

router.get("/org", async (req: Request, res: Response) => {
    res.status(200).send("welcome to the organisation route");
});


router.use("/org", ProfileRouter);
router.use("/org", WalletRouter);
router.use("/org", SendBitcoinRouter);
router.use("/org", InviteEmployeeRouter);
router.use("/org", ListEmployeeRouter);
router.use("/org", ListWalletRouter);
router.use("/org", PaymentDetailsRouter);
router.use("/org", DeleteEmployeeRouter);


export const OrgRouter: Router = router;    
