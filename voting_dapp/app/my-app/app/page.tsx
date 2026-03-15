'use client';
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, IdlAccounts } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../../../target/idl/voting_dapp.json";
import { VotingDapp } from "../../../target/types/voting_dapp";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type VotingPoolAccount = IdlAccounts<VotingDapp>["votingPool"];

interface VotingPoolEntry {
  publicKey: PublicKey;
  account: VotingPoolAccount;
}

export default function Home() {
  const [votingPools, setVotingPools] = useState<VotingPoolEntry[]>([]);

  // 1. Configurações de Conexão (Localhost)
  // const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const getProgram = () => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" });
    return new Program(idl as anchor.Idl, provider) as Program<VotingDapp>;
  };

  const fetchVotingPools = async () => {
    const program = getProgram();
    if (!program) return;

    try {
      const votingPools = await program.account.votingPool.all();
      console.log(votingPools);
      setVotingPools(votingPools);
    } catch (e) {
      setVotingPools([]);
    }
  };


  const voting = async (pollPublicKey: PublicKey) => {
    const program = getProgram();
    if (!program) return;

    // console.log(name, author, wallet?.publicKey.toString(), program.provider.publicKey?.toString(), program.provider.wallet?.publicKey.toString());


    let tx = await program.methods.voting().accounts({ votingPool: pollPublicKey, voter: program.provider.publicKey }).rpc();
    console.log(tx);
    // await program.methods.voting().accounts({ votingPool: votingPoolPda, voter: program.provider.publicKey }).rpc();
    await fetchVotingPools();
  }

  // const increment = async () => {
  //   const program = getProgram();
  //   if (!program) return;

  //   const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("global-counter")],
  //     program.programId
  //   );

  //   await program.methods.increment().accounts({ globalCounter: counterPda }).rpc();
  //   await fetchCount(); // Atualiza a UI após o sucesso
  // };


  useEffect(() => { if (wallet) fetchVotingPools(); }, [wallet]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <WalletMultiButton />
      <h1>Solana Counter</h1>
      <div style={{ fontSize: "3rem", margin: "1rem 0" }}>
        {votingPools.map((votingPool) => (
          <div>
            <h2>{votingPool.account.name}</h2>
            <p>{votingPool.account.pollVotes.toString()}</p>
            <button onClick={() => voting(votingPool.publicKey)}>Votar</button>
          </div>
        ))}
      </div>
    </main>
  );
}
