'use client';
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../../../target/idl/voting_dapp.json";
import { VotingDapp } from "../../../target/types/voting_dapp";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function Home() {
  const [votingPools, setVotingPools] = useState<any[]>([]);

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



  useEffect(() => { if (wallet) fetchVotingPools(); }, [wallet]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <WalletMultiButton />
      <h1>Solana Counter</h1>
      <div style={{ fontSize: "3rem", margin: "1rem 0" }}>
        {votingPools.map((votingPool) => (
          <div key={votingPool.publicKey.toBase58()}>
            <h2>{votingPool.account.name}</h2>
            <p>{votingPool.account.pollVotes}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
