import { Router, Response, Request } from "express";
import { ProfileRouter } from "./routes/profile";
import {UpdateDetailsRouter } from "./routes/updateDetails";


const router: Router = Router();

router.get("/emp", async (req: Request, res: Response) => {
    res.status(200).send("welcome to the employee route");
});


router.use("/emp", ProfileRouter);
router.use("/emp", UpdateDetailsRouter);





export const EmployeeRouter: Router = router;   

