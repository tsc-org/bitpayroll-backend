import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { decryptPrivateKey } from "../../../../utils/encrypt";
import { sendBitcoin } from "../../../../utils/sendBitcoin";

const router: Router = Router();
const prisma = new PrismaClient();

router.post("/send-payment/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { employeeIds, walletId } = req.body;
    const wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
    if (!wallet) {
      res.status(400).json({ error: "No wallet found" });
    }

    const privateKey = (await decryptPrivateKey(wallet.privatekey)).toString();
    const employees = await prisma.employee.findMany({
      where: {
        userId: orgId,
      },
    });
    //check if there is no employee
    if (!employees.length) {
      res.status(400).json({ error: "No employees found" });
    }
  
    const selectedEmployees = employees.filter((employee) =>
      employeeIds.includes(employee.id)
    );
   
    if (!selectedEmployees.length) {
      res.status(400).json({ error: "No selected employees found" });
      throw new Error("No selected employees found");
    }
    const recipients = selectedEmployees.map((employee) => ({
      address: employee.wallet_address,
      amount: employee.salary,
    }));
  
    const payment = await sendBitcoin(wallet.address, recipients, privateKey);
    
    return res.status(200).json({ message: "Payment sent", payment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export const SendBitcoinRouter: Router = router;

// TODO: update db schema to include balance instead of fetching for blockstream API always and avoid rate limiting.
// update employee's balance
// await prisma.employee.updateMany({
//   where: {
//     id: {
//       in: employeeIds,
//     },
//   },
//   data: {
//     balance: {
//       increment: amount,
//     },
//   },
// });
// //update organisation's balance
// await prisma.wallet.update({
//   where: {
//     id: orgId,
//   },
//   data: {
//     balance: {
//       decrement: amount,
//     },
//   },
// });
