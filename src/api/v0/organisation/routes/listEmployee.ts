import {Router, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';


const router: Router = Router();
const prisma = new PrismaClient();

router.get("/list-employee/:id", async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        await prisma.$connect();
        const employee = await prisma.employee.findMany({
            where: {
                userId: id
            },
           select: {
            firstName: true,
            lastName: true,
            email: true,
            wallet_address: true,
            organisation: true,
            salary: true,
        }
        });
        await prisma.$disconnect();
        return res.status(200).json({employee});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

export const ListEmployeeRouter: Router = router;