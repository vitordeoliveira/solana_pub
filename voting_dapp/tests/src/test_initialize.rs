use std::{str::FromStr, sync::LazyLock};

use anchor_client::{
    Client, Cluster, anchor_lang, solana_sdk::{
        commitment_config::CommitmentConfig, pubkey::Pubkey, signature::read_keypair_file, signer::Signer,
    }
};
use rand::RngExt;
use voting_dapp::{VotingPool, Vote};


// static RANDOM_STRING: LazyLock<i32> = LazyLock::new(|| {
//     rand::rng().random_range(1..1_000_000)
// });

#[test]
fn test_initialize() {
    let program_id = "3zubcAgTjgtGnnVi2j41ZNn2gNhcuqkJ4EhD955q96MP";
    let anchor_wallet = std::env::var("ANCHOR_WALLET").unwrap();
    let payer = read_keypair_file(&anchor_wallet).unwrap();

    let client = Client::new_with_options(Cluster::Localnet, &payer, CommitmentConfig::confirmed());
    let program_id = Pubkey::from_str(program_id).unwrap();
    let program = client.program(program_id).unwrap();

    let random_string = rand::rng().random_range(1..1_000_000);

    let poll_name = format!("Test Poll {}", random_string);

    let (voting_pool_pda, _bump) = Pubkey::find_program_address(
        &[b"voting_pool", poll_name.as_bytes(), payer.pubkey().as_ref()], 
        &program_id
    );

    let tx = program
        .request()
        .accounts(voting_dapp::accounts::CreatePoll {
            voting_pool: voting_pool_pda,
            author: payer.pubkey(),
            system_program: anchor_lang::system_program::ID,
        })
        .args(voting_dapp::instruction::CreatePoll {
            name: poll_name
        })
        .send()
        .expect("");

    println!("Your transaction signature {}", tx);
}

#[test]
fn test_vote() {
    let program_id = "3zubcAgTjgtGnnVi2j41ZNn2gNhcuqkJ4EhD955q96MP";
    let anchor_wallet = std::env::var("ANCHOR_WALLET").unwrap();
    let payer = read_keypair_file(&anchor_wallet).unwrap();

    let client = Client::new_with_options(Cluster::Localnet, &payer, CommitmentConfig::confirmed());
    let program_id = Pubkey::from_str(program_id).unwrap();
    let program = client.program(program_id).unwrap();

    let random_string = rand::rng().random_range(1..1_000_000);
    let poll_name = format!("Test Poll {}", random_string);

    let (voting_pool_pda, _bump) = Pubkey::find_program_address(
        &[b"voting_pool", poll_name.as_bytes(), payer.pubkey().as_ref()], 
        &program_id
    );

    let tx = program
        .request()
        .accounts(voting_dapp::accounts::CreatePoll {
            voting_pool: voting_pool_pda,
            author: payer.pubkey(),
            system_program: anchor_lang::system_program::ID,
        })
        .args(voting_dapp::instruction::CreatePoll {
            name: poll_name
        })
        .send()
        .expect("");

    let voting_pool = program.account::<VotingPool>(voting_pool_pda).expect("Voting pool not found");
    assert_eq!(voting_pool.poll_votes, 0);

    let tx = program
        .request()
        .accounts(voting_dapp::accounts::Vote {
            voting_pool: voting_pool_pda,
            voter: payer.pubkey(),
        }).args(voting_dapp::instruction::Voting{})
        .send()
        .expect("");

    println!("Your transaction signature {}", tx);

    let voting_pool_after = program.account::<VotingPool>(voting_pool_pda).expect("Voting pool not found");
    assert_eq!(voting_pool_after.poll_votes, 1);
}
