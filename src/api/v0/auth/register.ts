import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as EmailValidator from "email-validator";
import { generatePassword, generateJWT } from "./auth";
import { randomString } from "../../../helpers/randomString";
import { confirmationEmail } from "../../../helpers/confirmationEmail";

const router: Router = Router();
const prisma = new PrismaClient();

router.post("/register-organisation", async (req: Request, res: Response) => {
  try {
    const secretToken = randomString();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }
    if (!EmailValidator.validate(email)) {
      return res.status(400).json({ message: "Email not valid." });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const passwordHash = await generatePassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: passwordHash,
        isActive: false,
        secretToken: secretToken,
        role: "ORGANISATION",
      },
    });

    await confirmationEmail(secretToken, email);
    const jwt = await generateJWT(newUser);
    return res.status(201).json({ token: jwt });
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
});

router.post("/register-employee", async (req: Request, res: Response) => {
  const secretToken = randomString();
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }
  if (!EmailValidator.validate(email)) {
    return res.status(400).json({ message: "Email not valid." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return res.status(400).json({ message: "Email already in use." });
  }

  const passwordHash = await generatePassword(password);

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: passwordHash,
      isActive: false,
      secretToken: secretToken,
      role: "EMPLOYEE",
    },
  });

  await confirmationEmail(secretToken, email);
  const jwt = await generateJWT(newUser);
  return res.status(201).json({ token: jwt });
});

//delete user

router.delete("/delete-user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
   return res.status(500).json({ error: error.message });
   
  }
});

export const RegisterRouter: Router = router;
