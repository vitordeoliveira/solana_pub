use anchor_lang::prelude::*;

declare_id!("8TUpE3cePUeSA4sPDFZ22ynBGW67FvXTm91p7T27epjQ");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
