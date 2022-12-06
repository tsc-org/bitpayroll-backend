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
    //get wallet details from db
    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: orgId,
      },
    });
    //get organisation's bitcoin address
    const orgAddress = wallet.address;

    // get organisation's private key
    const privateKey = (await decryptPrivateKey(wallet.privatekey)).toString()
  

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
    //send bitcoin to each selected employee
    const payment = addresses.forEach(async (address, index) => {
      await sendBitcoin(orgAddress, address, amount[index], privateKey);
    });

    console.log(payment)

    // TODO: update db schema to include balance instead of fetching for sochian API always and avoid rate limiting.
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
    return res.status(200).json({ message: "Payment sent", payment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export const SendBitcoinRouter: Router = router;
