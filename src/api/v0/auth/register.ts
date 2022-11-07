import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import * as EmailValidator from "email-validator";
import { requireAuth, generatePassword, generateJWT } from "./auth";

const router: Router = Router();
const prisma = new PrismaClient();



router.post("/register-organisation", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password required." });
  }
  if (!EmailValidator.validate(email)) {
    return res.status(400).send({ message: "Email not valid." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return res.status(400).send({ message: "Email already in use." });
  }

  const passwordHash = await generatePassword(password);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: passwordHash,
      isActive: false,
      role: "ORGANISATION",
    },
  });

  const jwt = generateJWT(newUser);

  return res.status(201).send({ jwt });
});

router.post("/register-employee", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password required." });
  }
  if (!EmailValidator.validate(email)) {
    return res.status(400).send({ message: "Email not valid." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return res.status(400).send({ message: "Email already in use." });
  }

  const passwordHash = await generatePassword(password);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: passwordHash,
      isActive: false,
      role: "EMPLOYEE",
    },
  });

  const jwt = generateJWT(newUser);

  return res.status(201).send({ token:jwt });
});

export const RegisterRouter: Router = router;