import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();
const prisma = new PrismaClient();

router.delete("/delete-emp/:orgId", async (req: Request, res: Response) => {
  const { ref } = req.body;
  await prisma.employee.delete({
    where: {
      inviteCode: ref,
    },
  });
  return res.status(200).json({ message: "Employee deleted" });
});

export const DeleteEmployeeRouter: Router = router;
