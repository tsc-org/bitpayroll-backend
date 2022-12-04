import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();
const prisma = new PrismaClient();

router.put(
    "/update-detail/:userId", async (req: Request, res: Response) => {
        try {
            const { salary , ref } = req.body;
            const details = await prisma.employee.update({
                where: {   
                    inviteCode: ref
                },
                data: {
                    salary: salary,
                },
            });
            if (!details) {
                return res
                    .status(400)
                    .json({ message: "Pleas check your input again" });
            }
            return res.status(200).json({ details });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);

export const PaymentDetailsRouter: Router = router;


