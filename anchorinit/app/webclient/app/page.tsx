'use client';1
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../../../target/idl/anchorinit.json";
import { Anchorinit } from "../../../target/types/anchorinit";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const [count, setCount] = useState<string>("Conecte uma carteira");

  // 1. Configurações de Conexão (Localhost)
  // const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const getProgram = () => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" });
    return new Program(idl as anchor.Idl, provider) as Program<Anchorinit>;
  };

  const fetchCount = async () => {
    const program = getProgram();
    if (!program) return;

    const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global-counter")],
      program.programId
    );

    try {
      const account = await program.account.counter.fetch(counterPda);
      setCount(account.count.toString());
    } catch (e) {
      setCount("Não inicializado");
    }
  };

  const increment = async () => {
    const program = getProgram();
    if (!program) return;

    const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global-counter")],
      program.programId
    );

    await program.methods.increment().accounts({ globalCounter: counterPda }).rpc();
    await fetchCount(); // Atualiza a UI após o sucesso
  };


  useEffect(() => { if (wallet) fetchCount(); }, [wallet]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <WalletMultiButton />
      <h1>Solana Counter</h1>
      <div style={{ fontSize: "3rem", margin: "1rem 0" }}>
        {count}
      </div>
      <button onClick={increment}>Incrementar</button>
    </main>
  );
}
