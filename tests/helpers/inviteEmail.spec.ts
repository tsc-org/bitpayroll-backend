import {test} from '@japa/runner'
import { inviteEmail } from '../../src/helpers/inviteEmail';

test('invite email', async ({assert}) => {
    const invite = inviteEmail('token', 'olusegunsamson95@gmail.com', 'orgName');
    assert.exists(invite);
}
)