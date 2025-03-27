use anchor_lang::prelude::*;

use crate::{CampaignAccount, CampaignErrors, CampaignStatus, Treasury,TREASURY_SEED};

pub fn withdraw_fund(ctx: Context<WithdrawFund>) -> Result<()> {
    let campaign_account = &mut ctx.accounts.campaign_account;
    let owner = ctx.accounts.owner.key();
    // let all_camapign_account = &mut ctx.accounts.all_campaign_account;
    // let user_campaign_account = &mut ctx.accounts.user_campaign_account;
    require!(
        owner == campaign_account.owner,
        CampaignErrors::NotAuthorized
    );

    require!(
        campaign_account.current_amount == campaign_account.goal_amount,
        CampaignErrors::GoalNotAchieved
    );

    require!(campaign_account.status == CampaignStatus::Successful, CampaignErrors::CampaignInActive);

    

    let withdraw_amount = campaign_account.current_amount;
    let treasury_account = &mut ctx.accounts.treasury_account;
    // **campaign_account.to_account_info().try_borrow_mut_lamports()? -= withdraw_amount;
    **treasury_account.to_account_info().try_borrow_mut_lamports()? -= withdraw_amount;
    **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? +=withdraw_amount; 
    treasury_account.amount -= withdraw_amount;

    // all_camapign_account.campaign_list.retain(|&x| x!=campaign_account.key());
    // user_campaign_account.campaigns.retain(|&x| x!=campaign_account.key());

    campaign_account.status = CampaignStatus::Completed;
    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFund<'info> {
    pub owner: Signer<'info>,
    #[account(
        mut
    )]
    pub campaign_account: Account<'info, CampaignAccount>,
    // #[account(
    //     mut,
    //     seeds=[BACKER_SEED,campaign_account.key().as_ref(),],
    //     bump,
    //     close = owner
    // )]
    // pub backer_account : Account<'info, BackerAccount>,

    // #[account(
    //     mut,
    //     seeds = [USER_CAMPAIGN_SEED , owner.key().as_ref()],
    //     bump
    // )]
    // pub user_campaign_account : Account<'info,UserCampaign>,
    // #[account(
    //     mut,
    //     seeds = [ALL_CAMPAIGN_SEED],
    //     bump
    // )]
    // pub all_campaign_account : Account<'info,AllCampaign>,
    #[account(
        mut,
        seeds= [TREASURY_SEED],
        bump
    )]
    pub treasury_account : Account<'info,Treasury>,
    pub system_program: Program<'info, System>,
}
