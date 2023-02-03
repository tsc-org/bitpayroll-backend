import {test} from '@japa/runner'
import { createWallet } from '../../src/utils/createWallet';


test('create wallet', async ({assert}) => {
    const wallet = createWallet();
    assert.exists(wallet.mnemonic);
    assert.exists(wallet.address);
    assert.exists(wallet.wif);
    assert.exists(wallet.privateKey);
}
)

