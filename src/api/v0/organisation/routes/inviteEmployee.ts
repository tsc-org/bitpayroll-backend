import {Router, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import { inviteEmail } from '../../../../helpers/inviteEmail';
import { randomString } from '../../../../helpers/randomString';

const router: Router = Router();
const prisma = new PrismaClient();

//route for inviting employee account
router.post('/invite-employee', async (req:Request, res:Response,) => {
    // const {email, orgName, orgId} = req.body;
    // const inviteCode = randomString(10);
    // const invite = await prisma.invite.create({
    //     data: {
    //         email: email,
    //         orgName: orgName,
    //         orgId: orgId,
    //         inviteCode: inviteCode,
    //     },
    // });
    // if (!invite) {
    //     return res.status(400).json({message: 'invalid params'});
    // }
    // inviteEmail(email, inviteCode);
    // return res.status(200).json({invite});

});

export const InviteEmployeeRouter: Router = router;
