import { Router, Response, Request } from "express";
import { UpdateAccountRouter } from "./routes/updateAccount";
import { WalletRouter } from "./routes/createWallet";

const router: Router = Router();

router.get("/org", async (req: Request, res: Response) => {
    res.status(200).send("welcome to the organisation route");
});
router.use("/org", UpdateAccountRouter);
router.use("/org", WalletRouter);


export const OrgRouter: Router = router;    
