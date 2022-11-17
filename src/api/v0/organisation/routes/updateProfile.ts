import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

// Preload user profile on routes with ':username'
router.param("id", async (req: Request, res: Response, next, id) => {
    await prisma.$connect();
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    await prisma.$disconnect();
    if (!user) {
        return res.status(404).json({ message: "User not found."});
    }
    next();
});

router.put("/update-profile/:id", requireAuth, async (req: Request, res: Response) => {
    const { orgName,} = req.body;
    const user = await prisma.user.update({
        where: {
            id: req.params.id,
        },
        data: {
            orgName: orgName,
        },
    });
    if (!user) {
        return res.status(400).json({ message: "invalid params" });
    }
    return res.status(200).json({ user });
});

export const UpdateAccountRouter: Router = router;
