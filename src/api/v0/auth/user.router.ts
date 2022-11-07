import { Router, Request, Response } from "express";
import { LoginRouter } from "./login";
import { RegisterRouter } from "./register";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "./auth";

const router: Router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to the auth route");
});

router.get(
  "/verification",
  requireAuth,
  async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, message: "Authenticated." });
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  res.send(item);
});
router.use("/auth", RegisterRouter);
router.use("/auth", LoginRouter);

export const UserRouter: Router = router;
