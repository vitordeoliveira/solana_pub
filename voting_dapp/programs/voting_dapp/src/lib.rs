use anchor_lang::prelude::*;

declare_id!("3zubcAgTjgtGnnVi2j41ZNn2gNhcuqkJ4EhD955q96MP");

#[program]
pub mod voting_dapp {
    use super::*;

    pub fn create_poll(ctx: Context<CreatePoll>, name: String) -> Result<()> {
        let poll = &mut ctx.accounts.voting_pool;
        poll.name = name.clone();
        poll.poll_votes = 0;
        Ok(())
    }
    pub fn voting(ctx: Context<Vote>) -> Result<()> {
        let voting_pool = &mut ctx.accounts.voting_pool;
        voting_pool.poll_votes = voting_pool.poll_votes + 1;
        msg!("Voted for: {:?}", voting_pool.name);
        Ok(())
    }
}


#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreatePoll<'info> {
    #[account(init, payer = author, space = 8 + VotingPool::INIT_SPACE, seeds = [b"voting_pool", name.as_bytes(), author.key().as_ref()], bump)]
    pub voting_pool: Account<'info, VotingPool>,

    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct VotingPool {
    #[max_len(32)]
    pub name: String,
    pub poll_votes: u64,
}


#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub voting_pool: Account<'info, VotingPool>,

    #[account(mut)]
    pub voter: Signer<'info>,
}