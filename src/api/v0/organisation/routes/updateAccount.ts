import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

//route for organisation account update
router.post("/update-account/:orgid", requireAuth, async (req: Request, res: Response) => {
    const { name, address, city, country, postcode, phone, email } = req.body;
    const orgid = req.params.orgid;
    const organisation = await prisma.organisation.findUnique({
        where: {
            id: orgid
        }
    });
    if (!organisation) {
        return res.status(400).json({ message: "Organisation not found." });
    }
    if (!name || !address || !city || !country || !postcode || !phone || !email) {
        return res.status(400).json({ message: "All fields are required." });
    }
    await prisma.organisation.update({
        where: {
            id: orgid
        },
        data: {
            name: name,
            state: city,
            country: country,
            phone: phone,
            email: email
        }
    });
    return res.status(200).json({ message: "Organisation updated." });
});


export const UpdateAccountRouter: Router = router;
