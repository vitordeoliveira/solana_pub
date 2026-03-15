use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{TokenAccount, Mint, TokenInterface, MintTo}};


declare_id!("ErCVP1SCdhdm55EKJNp9DV2rdcBvneSH6Lf29KxVyB7H");

#[program]
pub mod tokens_nft {
    use anchor_spl::token_interface;

    use super::*;

    pub fn create_nicoin(ctx: Context<CreateNicoinMint>) -> Result<()> {
        msg!("Created Mint Account: {:?}", ctx.accounts.nicoin_mint.key());
        Ok(())
    }


    pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
        msg!(
            "Created Token Account: {:?}",
            ctx.accounts.token_account.key()
        );
        Ok(())
    }

    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        msg!("Minting Tokens: {:?}", amount);

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        };
     
        let cpi_program_id = ctx.accounts.token_program.to_account_info();
     
        let cpi_context = CpiContext::new(cpi_program_id, cpi_accounts);
     
        token_interface::mint_to(cpi_context, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNicoinMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6, 
        mint::authority = authority.key(),
        mint::freeze_authority = authority.key(),
    )]
    pub nicoin_mint: InterfaceAccount<'info, Mint>,

    // Programas necessários para a criação do Mint
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, anchor_lang::system_program::System>,
}

#[derive(Accounts)]
pub struct CreateTokenAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    // The mint authority
    #[account(mut)]
    pub signer: Signer<'info>,
    // The mint account
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    // The destination token account
    #[account(mut)]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    // The token program
    pub token_program: Interface<'info, TokenInterface>,
}


// #[derive(Accounts)]
// pub struct MintNicoin<'info> {
//     #[account(mut)]
//     pub nicoin_mint: Account<'info, Mint>,

//     #[account(
//         mut,
//         token::mint = nicoin_mint,
//     )]
//     pub user_token_account: Account<'info, TokenAccount>,

//     pub authority: Signer<'info>,

//     pub token_program: Program<'info, anchor_spl::token::Token>,
// }