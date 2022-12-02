import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as EmailValidator from "email-validator";
import { generateJWT, comparePasswords, requireAuth } from "./auth";
const router: Router = Router();

const prisma = new PrismaClient();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

  if (!email || !EmailValidator.validate(email)) {
    return res
      .status(400)
      .json({ auth: false, message: "Email is required or malformed." });
  }

  if (!password) {
    return res
      .status(400)
      .json({ auth: false, message: "Password is required." });
  }

  await prisma.$connect();
  const user = await prisma.user.findUnique({
    where: {
        email: email,
    },
    });

    if (!user) {
        return res.status(404).json({ auth: false, message: "User not found." });
    }

    const validatePassword = await comparePasswords(password, user.password);

    if (!validatePassword) {
        return res.status(401).json({ auth: false, message: "Invalid password." });
    }

    const jwt = await generateJWT(user);
    await prisma.$disconnect();

    return res.status(200).json({ auth: true, jwt });
});

//get all users
router.get("/get-users", requireAuth, async (req: Request, res: Response) => {
    await prisma.$connect();
    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    return res.status(200).json({ users });
});

//delete a single user
router.delete("/delete-user/:id", requireAuth, async (req: Request, res: Response) => {
    await prisma.$connect();
    const { id } = req.params;
    const user = await prisma.user.delete({
        where: {
            id: id,
        },
    });
    await prisma.$disconnect();
    return res.status(200).json({ user });
});

export const LoginRouter: Router = router;
