import {Router, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';


const  route: Router = Router();
const prisma = new PrismaClient();


route.get('/getEmployee', async (req: Request, res: Response) => {
    try {
        await prisma.$connect();
    const employee = await prisma.employee.findMany();
    await prisma.$disconnect();
    if (!employee) {
        return res.status(404).json({ message: "Employee not found."});
    }
    return res.status(200).json({ employee });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
});
