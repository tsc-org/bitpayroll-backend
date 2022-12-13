import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();
const prisma = new PrismaClient();

//route for activating account
router.put("/activate/:token",  async (req: Request, res: Response,) => {
  try {
    const { token }= req.params;
    await prisma.$connect();
    const userToken = await prisma.user.findFirst({
      where: {
        secretToken: token,
      },
    });
    if (userToken === null) {
      res
        .status(400)
        .json({ message: "Invalid token or account activated please try logging in" });
    } else {
      await prisma.user.update({
        where: {
          id: userToken.id,
        },
        data: {
          isActive: true,
          secretToken: null,
        },
      });
      await prisma.$disconnect();
     return res.status(200).json({ message: "Account activated" });
    }
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
});

export const ConfirmRouter: Router = router;
