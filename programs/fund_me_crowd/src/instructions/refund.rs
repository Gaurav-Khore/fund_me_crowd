use anchor_lang::prelude::*;

use crate::{
    BackerAccount, CampaignAccount, CampaignErrors, CampaignStatus, CampaignTransaction, Treasury,
    BACKER_SEED, CAMPAIGN_TRANSACTION_SEED, TREASURY_SEED,
};

pub fn refund(ctx: Context<Refund>) -> Result<()> {
    let campaign_account = &mut ctx.accounts.campaign_account;
    let backer_account = &mut ctx.accounts.backer_account;
    let treasury_account = &mut ctx.accounts.treasury_account;
    let campaign_transaction_account = &mut ctx.accounts.campaign_transaction_account;
    let owner = &ctx.accounts.owner;
    require!(
        campaign_account.status != CampaignStatus::Completed,
        CampaignErrors::NoRefundInititated
    );

    let refund_amt = backer_account
        .campaign_list
        .iter()
        .find(|x| x.campaign == campaign_account.key());
    if refund_amt.is_none() {
        return Err(CampaignErrors::NoRefundInititated.into());
    }
    let refund_amt = refund_amt.unwrap().amount;
    msg!("Refund amount = {}", refund_amt);
    **ctx
        .accounts
        .owner
        .to_account_info()
        .try_borrow_mut_lamports()? += refund_amt;
    msg!(
        "backer account lamports {:?}",
        backer_account.to_account_info().lamports()
    );
    **treasury_account
        .to_account_info()
        .try_borrow_mut_lamports()? -= refund_amt;
    treasury_account.amount -= refund_amt;
    let curr_time = Clock::get().unwrap().unix_timestamp;
    let campaign_deadline = campaign_account.duration;
    // Check if the deadline is achieved or not and if achieved then the goal is achieve or not
    if campaign_account.status != CampaignStatus::InActive {
        if curr_time > campaign_deadline
            && campaign_account.current_amount < campaign_account.goal_amount
        {
            campaign_account.status = CampaignStatus::Failed;
        } else if campaign_account.goal_amount != campaign_account.current_amount {
            campaign_account.status = CampaignStatus::Active;
        }

        campaign_account.current_amount -= refund_amt;

        match campaign_transaction_account
            .transaction_list
            .iter_mut()
            .find(|x| x.backer == owner.key())
        {
            Some(v) => v.amount -= refund_amt,
            None => return Err(CampaignErrors::NoRefundInititated.into()),
        };
    }

    match backer_account
        .campaign_list
        .iter_mut()
        .find(|x| x.campaign == campaign_account.key())
    {
        Some(v) => {
            v.amount -= refund_amt;
            if v.amount == 0 {
                v.refund_status = false;
            } else {
                v.refund_status = true;
            }
        }
        None => return Err(CampaignErrors::NoRefundInititated.into()),
    };

    Ok(())
}

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub campaign_account: Account<'info, CampaignAccount>,

    #[account(
        mut,
        seeds = [BACKER_SEED,owner.key().as_ref()],
        bump
    )]
    pub backer_account: Account<'info, BackerAccount>,

    #[account(
        mut,
        seeds = [CAMPAIGN_TRANSACTION_SEED,campaign_account.key().as_ref()],
        bump
    )]
    pub campaign_transaction_account: Account<'info, CampaignTransaction>,

    #[account(
        mut,
        seeds = [TREASURY_SEED],
        bump
    )]
    pub treasury_account: Account<'info, Treasury>,
    pub system_program: Program<'info, System>,
}
