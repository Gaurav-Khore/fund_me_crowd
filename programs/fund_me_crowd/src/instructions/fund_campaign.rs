use anchor_lang::{prelude::*, system_program};

use crate::{
    Backer, BackerAccount, CampaignAccount, CampaignErrors, CampaignStatus, CampaignTransaction,
    Treasury, BACKER_SEED, CAMPAIGN_TRANSACTION_SEED, TREASURY_SEED,
};

pub fn fund(ctx: Context<FundCampaign>, tier_index: u8) -> Result<()> {
    let campaign_account = &mut ctx.accounts.campaign_account;
    let backer = &mut ctx.accounts.backer;
    let treasury_account = &mut ctx.accounts.treasury_account;
    let curr_time = Clock::get().unwrap().unix_timestamp;
    let campaign_deadline = campaign_account.duration;
    // Check if the deadline is achieved or not and if achieved then the goal is achieve or not
    if curr_time > campaign_deadline
        && campaign_account.current_amount < campaign_account.goal_amount
    {
        campaign_account.status = CampaignStatus::Failed;
    } else if campaign_account.goal_amount == campaign_account.current_amount {
        campaign_account.status = CampaignStatus::Successful;
    }
    //campaign should be active
    require!(
        campaign_account.status == CampaignStatus::Active,
        CampaignErrors::CampaignInActive
    );
    let tier = &campaign_account.tiers;
    let tier = tier.get(tier_index as usize).unwrap();
    let fund_amount = tier.amount;

    let fund_curr_amt = campaign_account.current_amount + fund_amount;
    require!(
        fund_curr_amt <= campaign_account.goal_amount,
        CampaignErrors::MaxAmountReached
    );
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: backer.to_account_info(),
                to: treasury_account.to_account_info(),
            },
        ),
        fund_amount,
    )?;

    // Add the transaction details to backer

    let backer_account = &mut ctx.accounts.backer_account;
    // backer_account.campaign_list.truncate(0);
    match backer_account
        .campaign_list
        .iter_mut()
        .find(|x| x.campaign == campaign_account.key())
    {
        Some(v) => {
            v.amount += fund_amount;
            v.refund_status= true;

        },
        None => {
            backer_account.campaign_list.push(Backer {
                amount: fund_amount,
                campaign: campaign_account.key(),
                refund_status: true
            });
        }
    };

    let campaign_transaction_account = &mut ctx.accounts.campaign_transaction_account;
    match campaign_transaction_account
        .transaction_list
        .iter_mut()
        .find(|x| x.backer == backer.key())
    {
        Some(v) => v.amount += fund_amount,
        None => {
            campaign_transaction_account
                .transaction_list
                .push(crate::Transactions {
                    backer: backer.key(),
                    amount: fund_amount,
                });
        }
    };

    treasury_account.amount += fund_amount;
    campaign_account.current_amount = fund_curr_amt;
    if fund_curr_amt == campaign_account.goal_amount {
        campaign_account.status = CampaignStatus::Successful;
    } else {
        campaign_account.status = CampaignStatus::Active;
    }
    Ok(())
}

#[derive(Accounts)]
pub struct FundCampaign<'info> {
    #[account(mut)]
    pub backer: Signer<'info>,

    #[account(mut)]
    pub campaign_account: Account<'info, CampaignAccount>,

    #[account(
        init_if_needed,
        payer=backer,
        seeds = [BACKER_SEED,backer.key().as_ref()],
        bump,
        space = 8 + ((8+32+1+8)*50) + 500
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


#[derive(Accounts)]
pub struct CloseBackerAccount<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        close=owner,
        seeds = [BACKER_SEED,owner.key().as_ref()],
        bump
    )]
    pub backer_account: Account<'info,BackerAccount>
}

pub fn close_backer_account(ctx: Context<CloseBackerAccount>) -> Result<()>{
    msg!("Backer account closed");
    Ok(())
}
