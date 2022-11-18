import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();
const prisma = new PrismaClient();

//route for activating account
router.put("/activate/:token",  async (req: Request, res: Response, next) => {
  try {
    const { token }= req.params;
    const userToken = await prisma.user.findFirst({
      where: {
        secretToken: token,
      },
    });
    if (userToken === null) {
      res
        .status(400)
        .json({ message: "Invalid token or account activated" });
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
      res.status(200).json({ message: "Account activated" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
});

export const ConfirmRouter: Router = router;
