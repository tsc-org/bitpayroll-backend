import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { inviteEmail } from "../../../../helpers/inviteEmail";
import { randomString } from "../../../../helpers/randomString";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

//route for inviting employee account
router.post(
  "/invite-employee/:orgId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const { email, salary } = await req.body;
      const inviteCode = randomString(10);
      const orgName = await prisma.profile.findUnique({
        where: {
          userId: orgId,
        }
      });
      await prisma.employee.create({
        data: {
          email: email,
          salary: salary,
          inviteCode: inviteCode,
          organisation: orgName.orgName,
          user: {
            connect: {
              id: orgId,
            },
          },
        },
      });
      if (email === undefined) {
        return res.status(400).json({ message: "Email is required." });
      }
      //check if email is already in use by the organisation
      const employee = await prisma.employee.findFirst({
        where: {
          email: email,
        },
      });
      if (employee) {
        return res.status(400).json({ message: "Email already in use." });
      }
      //send invite email
      await inviteEmail(inviteCode, email, orgName.orgName);
      return res.status(200).json({ message: "Invitation sent" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export const InviteEmployeeRouter: Router = router;
