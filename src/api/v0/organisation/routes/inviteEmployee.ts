import {Router, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import { inviteEmail } from '../../../../helpers/inviteEmail';
import { randomString } from '../../../../helpers/randomString';

const router: Router = Router();
const prisma = new PrismaClient();

//route for inviting employee account
router.post('/invite-employee', async (req:Request, res:Response,) => {
 
});

export const InviteEmployeeRouter: Router = router;
