import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import * as EmailValidator from "email-validator";
import { generateJWT, comparePasswords } from "./auth";
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

    const jwt = generateJWT(user);

    return res.status(200).json({ auth: true, jwt });
});



export const LoginRouter: Router = router;
