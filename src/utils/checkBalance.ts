const axiosBalance = require("axios");

//check balance function
const confirmedBalance = async (address)=> {
  try {
    const sochain_network = "BTCTEST";
    address = address.toString();
    const response = await axiosBalance.get(
      `https://sochain.com/api/v2/get_address_balance/${sochain_network}/${address}`
    );
    console.log(response.data.data.confirmed_balance);
  } catch (error) {
    throw new Error("Error while checking balance");
  }
};

const unconfirmedBalance = async (address)=> {
    try {
        const sochain_network = "BTCTEST";
        address = address.toString();
        const response = await axiosBalance.get(
            `https://sochain.com/api/v2/get_address_balance/${sochain_network}/${address}`
        );
        console.log(response.data.data.unconfirmed_balance);
    } catch (error) {
        throw new Error("Error while checking balance");
    }
};

export default {confirmedBalance, unconfirmedBalance};
