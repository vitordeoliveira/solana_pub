use anchor_lang::prelude::*;

declare_id!("FvhLEqxV4KW2RAcm4kTGp7ySJmpjdKWdBHwggBG85FQB");

#[program]
pub mod anchorinit {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.global_counter;
        counter.count = 0;
        msg!("Global counter initialized with count: {}", counter.count);
        Ok(())
    }

    pub fn increment(ctx: Context<UpdateCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.global_counter;
        counter.count += 1;
        msg!("Global counter incremented to: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 8,
        seeds = [b"global-counter"],
        bump,
    )]
    pub global_counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCounter<'info> {
    #[account(
        mut, 
        seeds = [b"global-counter"], 
        bump
    )]
    pub global_counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u64, // O valor do contador (8 bytes) [6]
}
