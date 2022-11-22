import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

router.post(
  "/profile/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { firstName, lastName } = req.body;
      const profile = await prisma.profile.create({
        data: {
          firstName: firstName,
          lastName: lastName,
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
    "/profile/:userID",
    requireAuth,
    async (req: Request, res: Response) => {
        try {
            const { userID } = req.params;
            const { firstName, lastName } = req.body;
            const profile = await prisma.profile.update({
                where: {
                    userId: userID,
                },
                data: {
                    firstName: firstName,
                    lastName: lastName,
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
