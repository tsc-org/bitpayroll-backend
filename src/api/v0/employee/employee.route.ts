import { Router, Response, Request } from "express";
import { ProfileRouter } from "./routes/profile";


const router: Router = Router();

router.get("/emp", async (req: Request, res: Response) => {
    res.status(200).send("welcome to the employee route");
});


router.use("/emp", ProfileRouter);





export const EmployeeRouter: Router = router;    
