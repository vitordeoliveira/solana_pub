"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// // Importar o CSS padrão para o botão de carteira
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaProvider = ({ children }: { children: React.ReactNode }) => {
  // Para desenvolvimento local, usamos o endpoint do validador (127.0.0.1:8899)
  const endpoint = "http://127.0.0.1:8899"; 

  // Definimos quais carteiras queremos suportar
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};