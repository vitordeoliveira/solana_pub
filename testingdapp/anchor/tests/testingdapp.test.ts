import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchTestingdapp,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('testingdapp', () => {
  let payer: KeyPairSigner
  let testingdapp: KeyPairSigner

  beforeAll(async () => {
    testingdapp = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Testingdapp', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, testingdapp: testingdapp })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentTestingdapp = await fetchTestingdapp(rpc, testingdapp.address)
    expect(currentTestingdapp.data.count).toEqual(0)
  })

  it('Increment Testingdapp', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      testingdapp: testingdapp.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTestingdapp(rpc, testingdapp.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Testingdapp Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ testingdapp: testingdapp.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTestingdapp(rpc, testingdapp.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Testingdapp', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      testingdapp: testingdapp.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTestingdapp(rpc, testingdapp.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set testingdapp value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ testingdapp: testingdapp.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchTestingdapp(rpc, testingdapp.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the testingdapp account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      testingdapp: testingdapp.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchTestingdapp(rpc, testingdapp.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${testingdapp.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
