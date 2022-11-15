const { testnet} = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");

export const createHDWallet = (network = testnet) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.ENGLISH);
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  return {
    xpub: xpriv.xpubkey,
    privatekey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString()
  };
};

 