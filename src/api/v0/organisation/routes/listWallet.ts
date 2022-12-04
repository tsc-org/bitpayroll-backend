import {Router, Response, Request} from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

//list all wallets that belong to an organisation

router.get("/list-wallet/:id", requireAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const wallets = await prisma.wallet.findMany({
            where: {
                userId: id
            },
            select: {
                address: true,
            }
        });
        res.status(200).send(wallets);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});


export const ListWalletRouter: Router = router;


