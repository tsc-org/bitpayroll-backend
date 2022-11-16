import { Router, Request, Response } from "express";
import { LoginRouter } from "./login";
import { RegisterRouter } from "./register";
import { ConfirmRouter } from "./activateAccount";
import { requireAuth } from "./auth";

const router: Router = Router();
// const prisma = new PrismaClient();

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

// router.get("/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const item = await prisma.user.findUnique({
//     where: {
//       id: id,
//     },
//   });
//   res.json(item);
// });

router.use("/auth", RegisterRouter);
router.use("/auth", LoginRouter);
router.use("/auth", ConfirmRouter);


export const UserRouter: Router = router;
