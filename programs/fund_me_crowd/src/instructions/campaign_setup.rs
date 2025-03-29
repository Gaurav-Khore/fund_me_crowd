use anchor_lang::prelude::*;


use crate::{add_days_to_clock, campaign::{CampaignAccount, CampaignStatus}, AllCampaign, CampaignErrors, CampaignTransaction, Treasury, UserCampaign, ALL_CAMPAIGN_SEED, CAMPAIGN_TRANSACTION_SEED, TREASURY_SEED, USER_CAMPAIGN_SEED};

pub fn setup_campaign(ctx: Context<SetupCampaign> , 
    name: String,
    description: String,
    goal_amt: u64,
    days: i64,
    image_url: String
) -> Result<()> {
    // campaign account initialized
    let acct =&mut ctx.accounts.campaign_account;
    let owner = &ctx.accounts.payer;
    let todays_date = add_days_to_clock(days);

    acct.name = name;
    acct.description = description;
    acct.goal_amount = goal_amt;
    acct.current_amount = 0;
    acct.duration = todays_date;
    acct.owner = owner.key();
    acct.tiers = vec![];
    acct.status = CampaignStatus::Active;
    acct.image_url = image_url;
    msg!("Camapaign Created ");
    msg!("Campaign Id = {:?}",acct.key());
    //all campaign initialized
    let all_campaign_account = &mut ctx.accounts.all_campaign_account;
    all_campaign_account.campaign_list.push(acct.key().clone());
    msg!("Campaign Added to all campaign");
    //user campaign initialized
    let user_campaign = &mut ctx.accounts.user_campaign_account;
    user_campaign.campaigns.push(acct.key().clone());
    msg!("Campaign Added to User Camapaign");
    
    Ok(())
}


#[derive(Accounts)]
pub struct SetupCampaign<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init_if_needed,
        payer= payer,
        space = 8 + (4+64)+(4+256) + 8 +8 +8+ 32 + 1 + (4+ (3 *(8+4+32))) + (4+256)
    )]
    pub campaign_account:Account<'info,CampaignAccount>,
    #[account(
        init_if_needed,
        seeds = [USER_CAMPAIGN_SEED , payer.key().as_ref()],
        bump,
        payer= payer,
        space = 8+ 4 + (50 * 32)
    )]
    pub user_campaign_account : Account<'info,UserCampaign>,
    #[account(
        mut,
        seeds = [ALL_CAMPAIGN_SEED],
        bump
    )]
    pub all_campaign_account : Account<'info,AllCampaign>,
    #[account(
        init_if_needed,
        payer = payer,
        seeds = [CAMPAIGN_TRANSACTION_SEED,campaign_account.key().as_ref()],
        bump,
        space= 8 + ((8+32)*50)
    )]
    pub campaign_transaction: Account<'info,CampaignTransaction>,
    pub system_program: Program<'info,System>
}



pub fn setup_app(ctx:Context<SetupApp>) -> Result<()> {
    //all camapign initialized
    let all_campaign_account = &mut ctx.accounts.all_campaign_account;
    // all_campaign_account.campaign_list = vec![];
    msg!("All Campaign Intialized");

    //treasury initialized
    let treasury_account = &mut ctx.accounts.treasury_account;
    treasury_account.amount = 0;
    Ok(())
}


#[derive(Accounts)]
pub struct SetupApp<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [ALL_CAMPAIGN_SEED],
        bump,
        payer = signer,
        space = 8+ 4 + (50 * 32)
    )]
    pub all_campaign_account: Account<'info,AllCampaign>,
    #[account(
        init_if_needed,
        seeds = [TREASURY_SEED],
        bump,
        payer = signer,
        space = 8 + 8
    )]
    pub treasury_account : Account<'info,Treasury>,
    pub system_program: Program<'info,System>
}



pub fn campaign_delete(ctx: Context<DeleteCampaign>) -> Result<()> {
    
    let campaign_account = &mut ctx.accounts.campaign_account;
    let owner = &mut ctx.accounts.owner;

    // owner should be cmapign owner
    require!(owner.key() == campaign_account.owner,CampaignErrors::NotAuthorized);
    
    // campaign status should be failed
    // require!(campaign_account.status == CampaignStatus::Failed,CampaignErrors::CampaignIsActive);
    campaign_account.status = CampaignStatus::InActive;
    Ok(())
}


#[derive(Accounts)]
pub struct DeleteCampaign<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut
    )]
    pub campaign_account : Account<'info,CampaignAccount>,

    pub system_program: Program<'info, System>
}