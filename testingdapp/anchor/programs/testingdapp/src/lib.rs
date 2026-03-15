#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("GpWncTLSCRtFWWjkXHjj9F7vHNSULQ3LEbbYF9XSGvLu");

#[program]
pub mod testingdapp {
    use super::*;

    pub fn close(_ctx: Context<CloseTestingdapp>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.testingdapp.count = ctx.accounts.testingdapp.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.testingdapp.count = ctx.accounts.testingdapp.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeTestingdapp>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.testingdapp.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTestingdapp<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Testingdapp::INIT_SPACE,
  payer = payer
    )]
    pub testingdapp: Account<'info, Testingdapp>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTestingdapp<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub testingdapp: Account<'info, Testingdapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub testingdapp: Account<'info, Testingdapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Testingdapp {
    count: u8,
}
