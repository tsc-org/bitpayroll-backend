const { PrivateKey } = require("bitcore-lib");
const { testnet} = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");

const createHDWallet = (network = testnet) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.ENGLISH);
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  return {
    xpub: xpriv.xpubkey,
    privatekey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    nmenonic: passPhrase.toString()
  };
};

console.log(createHDWallet());