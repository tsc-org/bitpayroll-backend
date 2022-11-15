import {Router, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const router: Router = Router();


//route for activating account
router.put('/activate/:token',  async (req:Request, res:Response, next) => {
    const prisma = new PrismaClient();
    const token = req.params.token;
    const user = await prisma.user.findFirst({
        where: {
          secretToken: token
        }
    });
    if(!user) {
        res.status(400).json({message: "Invalid token"});
    } else {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isActive: true,
                secretToken: null
            }
        });
        res.status(200).json({message: "Account activated"});
    }
}
);

export const ConfirmRouter: Router = router;