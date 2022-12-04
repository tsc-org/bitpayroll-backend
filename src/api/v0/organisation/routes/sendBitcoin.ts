import { Router, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { decryptPrivateKey } from "../../../../utils/encrypt";
import { sendBitcoin } from "../../../../utils/sendBitcoin";

const router: Router = Router();
const prisma = new PrismaClient();

//send to multiple employee addresses that belongs to the same organisation
router.post("/send-payment/:orgId", async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    //get req body from for selection of employees
    const { employeeIds } = req.body;
    //get organisation from db
    const orgWallet = await prisma.wallet.findUnique({
      where: {
        id: orgId,
      },
    });
    //get organisation's private key
    const privateKey = decryptPrivateKey(orgWallet.privatekey);
    //get organisation's bitcoin address
    const orgAddress = orgWallet.address;
    //get all employees that belong to the organisation
    const employees = await prisma.employee.findMany({
      where: {
        userId: orgId,
      },
    });
    //filter employees that are selected
    const selectedEmployees = employees.filter((employee) =>
      employeeIds.includes(employee.id)
    );
    //get all addresses of selected employees
    const addresses = selectedEmployees.map((employee) => employee.wallet_address);

    //get salary amount of selected employees
    const amount = selectedEmployees.map((employee) => employee.salary)
    //send bitcoin to all selected employees
    const txId = await sendBitcoin(
      orgAddress,
      addresses,
      amount,
      privateKey,
    );

    //TODO: update db schema to include balance instead of fetching for sochian API always and avoid rate limiting.
    //update employee's balance
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
    res.status(200).json({ txId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export const SendBitcoinRouter: Router = router;
