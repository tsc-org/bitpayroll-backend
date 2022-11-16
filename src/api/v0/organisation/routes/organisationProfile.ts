import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/profile", requireAuth, async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return res.status(400).json({ message: "Not a User." });
    }
    return res.status(200).json({ user });
});

router.get("/update-account", requireAuth, async (req: Request, res: Response) => {
    const userId = req.params.id;   
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return res.status(400).json({ message: "Not a User." });
    }
    const { name, email, password } = req.body;
});





export const UpdateAccountRouter: Router = router;
