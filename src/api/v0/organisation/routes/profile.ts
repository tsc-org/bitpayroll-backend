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
    return res.status(404).json({ message: "User not found." });
  }
  next();
});

router.post(
  "/create-profile/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { orgName } = req.body;
      const profile = await prisma.profile.create({
        data: {
          orgName: orgName,
          user: {
            connect: {
              id: id,
            },
          },
        },
      });
      if (!profile) {
        return res
          .status(400)
          .json({ message: "You are not authorised to this profile" });
      }
      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

//update profile
router.put(
  "/update-profile/:userID",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { userID } = req.params;
      const { orgName } = req.body;
      const profile = await prisma.profile.update({
        where: {
          userId: userID,
        },
        data: {
          orgName: orgName,
        },
      });
      if (!profile) {
        return res
          .status(400)
          .json({ message: "You are not authorised to this profile" });
      }
      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

        
        
        
export const ProfileRouter: Router = router;
