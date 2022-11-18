import { Router, Request, Response } from "express";
import { LoginRouter } from "./login";
import { RegisterRouter } from "./register";
import { ConfirmRouter } from "./activateAccount";
import { requireAuth } from "./auth";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  res.json("Welcome to the auth route");
});

router.get(
  "/verification",
  requireAuth,
  async (req: Request, res: Response) => {
    return res.status(200).json({ auth: true, message: "Authenticated." });
  }
);

router.use("/auth", RegisterRouter);
router.use("/auth", LoginRouter);
router.use("/auth", ConfirmRouter);

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.json(user);
  } catch (error) {
    throw new Error("User not found.");
  }
});

export const UserRouter: Router = router;
