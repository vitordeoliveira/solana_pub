use std::str::FromStr;

use anchor_client::{
    Client, Cluster, solana_sdk::{
        commitment_config::CommitmentConfig, pubkey::Pubkey, signature::{Keypair, read_keypair_file}, signer::Signer,
    }
};
use anchor_spl::{associated_token::get_associated_token_address, token::TokenAccount};
use tokens_nft::accounts::{CreateTokenAccount, MintTokens};

#[test]
fn test_initialize() {
    let program_id = "ErCVP1SCdhdm55EKJNp9DV2rdcBvneSH6Lf29KxVyB7H";
    let anchor_wallet = std::env::var("ANCHOR_WALLET").unwrap();
    let payer = read_keypair_file(&anchor_wallet).unwrap();

    let client = Client::new_with_options(Cluster::Localnet, &payer, CommitmentConfig::confirmed());
    let program_id = Pubkey::from_str(program_id).unwrap();
    let program = client.program(program_id).unwrap();


    let mint = Keypair::new();

    let tx = program.request()
    .accounts(tokens_nft::accounts::CreateNicoinMint{
        authority: payer.pubkey(),
        nicoin_mint: mint.pubkey(),
        token_program: anchor_spl::token::ID,
        system_program: anchor_client::solana_sdk::system_program::ID
    }).signer(&mint)
    .args(tokens_nft::instruction::CreateNicoin{})
    .send().expect("Failed to create nicoin mint");

    println!("Your transaction signature {}", tx);

    let token_account_address = get_associated_token_address(
        &payer.pubkey(), 
        &mint.pubkey()
    );

    let tx = program.request()
    .accounts(CreateTokenAccount{
        signer: payer.pubkey(),
        mint: mint.pubkey(),
        token_program: anchor_spl::token::ID,
        associated_token_program: anchor_spl::associated_token::ID,
        system_program: anchor_client::solana_sdk::system_program::ID,
        token_account: token_account_address})
        .signer(&payer)
        .args(tokens_nft::instruction::CreateTokenAccount{})
        .send().expect("Failed to create token account");

    println!("Your transaction signature {}", tx);

    let balance = program.account::<TokenAccount>(token_account_address).unwrap().amount;
    println!("Balance: {}", balance);
    assert_eq!(balance, 0);

    let tx = program.request()
    .accounts(MintTokens{
        signer: payer.pubkey(),
        mint: mint.pubkey(),
        token_account: token_account_address,
        token_program: anchor_spl::token::ID
    }).signer(&payer)
    .args(tokens_nft::instruction::MintTokens{amount: 100})
    .send().expect("Failed to mint tokens");

    println!("Your transaction signature {}", tx);

    let balance = program.account::<TokenAccount>(token_account_address).unwrap().amount;
    println!("Balance: {}", balance);
    assert_eq!(balance, 100);
}
