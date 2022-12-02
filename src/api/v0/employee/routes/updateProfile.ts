import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../auth/auth";

const router: Router = Router();
const prisma = new PrismaClient();

//update profile
router.put(
  "/emp-update-profile/:empId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { empId } = req.params;
      const { firstName, lastName, country, city, phone, state, } = req.body;
      const profile = await prisma.profile.update({
        where: {
          userId: empId,
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          country: country,
          state: state,
          city: city,
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
