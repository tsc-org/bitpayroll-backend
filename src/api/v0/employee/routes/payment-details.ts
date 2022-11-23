import { Router, Response, Request, request } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

router.put(
    "/payment-details/:inviteCode", requireAuth, async (req: Request, res: Response) => {
     try {
        const {inviteCode }= req.params;
        const { firstName, lastName, wallet_address } = req.body;
        const payment_details = await prisma.employee.update({
            where: {
                inviteCode: inviteCode,
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                wallet_address: wallet_address,
            },
        });
        if (!payment_details) {
            return res
                .status(400)
                .json({ message: "Please check your details and submit again" });
        }
        return res.status(200).json({ payment_details });
     } catch (error) {
        return res.status(500).json({ message: error.message });
     }
    }
);

export const PaymentDetailsRouter: Router = router;