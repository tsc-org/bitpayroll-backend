import { Router, Response, Request } from "express";
import { UpdateAccountRouter } from "./routes/profile";
import { WalletRouter } from "./routes/createWallet";
import { InviteEmployeeRouter } from "./routes/inviteEmployee";
import { SendBitcoinRouter } from "./routes/sendBitcoin";
import { ListEmployeeRouter } from "./routes/listEmployee";

const router: Router = Router();

router.get("/org", async (req: Request, res: Response) => {
    res.status(200).send("welcome to the organisation route");
});


router.use("/org", UpdateAccountRouter);
router.use("/org", WalletRouter);
router.use("/org", SendBitcoinRouter);
router.use("/org", InviteEmployeeRouter);
router.use("/org", ListEmployeeRouter);




export const OrgRouter: Router = router;    
