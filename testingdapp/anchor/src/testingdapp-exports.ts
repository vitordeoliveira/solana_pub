// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Testingdapp, TESTINGDAPP_DISCRIMINATOR, TESTINGDAPP_PROGRAM_ADDRESS, getTestingdappDecoder } from './client/js'
import TestingdappIDL from '../target/idl/testingdapp.json'

export type TestingdappAccount = Account<Testingdapp, string>

// Re-export the generated IDL and type
export { TestingdappIDL }

export * from './client/js'

export function getTestingdappProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getTestingdappDecoder(),
    filter: getBase58Decoder().decode(TESTINGDAPP_DISCRIMINATOR),
    programAddress: TESTINGDAPP_PROGRAM_ADDRESS,
  })
}
