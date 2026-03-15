import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Anchorinit } from "../target/types/anchorinit";
import { assert } from "chai";

describe("anchorinit", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchorinit as Program<Anchorinit>;

  const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global-counter")],
    program.programId
  );

  it("Is initialized!", async () => {
    // Add your test here.
    program.methods.initialize().rpc().then((tx) => {
      console.log("Your transaction signature", tx);
    }).catch((err) => {
      console.log("Account already initialized");
    });
  });

  it("Is incremented!", async () => {

    let initialCount = (await program.account.counter.fetch(counterPda)).count.toNumber();
    await program.methods.increment().rpc();

    let finalCount = (await program.account.counter.fetch(counterPda)).count.toNumber();

    console.log("Counter account", finalCount);
    assert.equal(finalCount, initialCount + 1);
  });
});
