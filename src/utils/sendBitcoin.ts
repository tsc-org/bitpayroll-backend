import axios from "axios";
const bitcore = require("bitcore-lib");

type Recipient = {
  address: string;
  amount: number;
};

export const sendBitcoin = async (
  sourceAddress: string,
  recipients: Recipient[],
  privateKey: string
) => {
  try {
    const sochain_network = "BTCTEST";
    sourceAddress = sourceAddress.toString();
    privateKey = privateKey.toString();
    let satoshiToSend = 0;
    let recieverAddresses = [];
    recipients.forEach((recipient) => {
      satoshiToSend += recipient.amount * 100000000;
      recieverAddresses.push(recipient.address);
    });
    recieverAddresses = recieverAddresses.map((address) => address.toString());
    let fee = 0;
    let inputCount = 0;
    let outputCount = recieverAddresses.length;

    const response = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
    );

    const recommendedFee = await axios.get(
      "https://bitcoinfees.earn.com/api/v1/fees/recommended"
    );

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    let utxos = response.data.data.txs;

    for (const element of utxos) {
      let utxo = {
        satoshis: Math.floor(Number(element.value) * 100000000),
        address: response.data.data.address,
        script: element.script_hex,
        txId: element.txid,
        outputIndex: element.output_no,
      };
      inputs.push(utxo);
      totalAmountAvailable += utxo.satoshis;
      inputCount += 1;
    }
    recipients.forEach((recipient, index) => {
      transaction.to(recipient.address, recipient.amount * 100000000);
    });

    /**
     * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
     * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
     * from the transaction as well.
     * */

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;

    fee = (transactionSize * recommendedFee.data.hourFee) / 3; // satoshi per byte
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }
    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    // recipients.forEach((recipient, index) => {
    //   transaction.to(recipient.address, recipient.amount * 100000000);
    // });

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(inputs[0].address, totalAmountAvailable - satoshiToSend - fee);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(Math.round(fee));

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();

    // Send transaction
    const result = await axios({
      method: "POST",
      url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
      data: {
        tx_hex: serializedTransaction,
      },
    });
    return result.data.data;
  } catch (error) {
    throw new Error("Error sending bitcoin: " + error.message);
  }
};
