use anchor_lang::prelude::*;

use crate::{CampaignAccount, CampaignErrors, Tier};

pub fn create_tier(ctx: Context<CreateTier>,tier_name:String, tier_amount: u64) -> Result<()>{
    let owner = ctx.accounts.owner.key();
    msg!("owner = {}",owner);
    let campaign_account = &mut ctx.accounts.campaign_account;
    let campaign_owner = campaign_account.owner.clone();
    require!(owner==campaign_owner,CampaignErrors::NotAuthorized);
    require!(tier_amount < campaign_account.goal_amount,CampaignErrors::NotAllowedTierMoreThanGoalAmount);
    require!(campaign_account.tiers.len()<3,CampaignErrors::TiersMaxLenReached);
    let tier = Tier{
        amount: tier_amount,
        name: tier_name
    };
    require!(!campaign_account.tiers.iter().any(|tie| tie.amount==tier_amount),CampaignErrors::DuplicateTier);

    require!(!campaign_account.tiers.contains(&tier),CampaignErrors::DuplicateTier);
    campaign_account.tiers.push(tier);
    campaign_account.tiers.sort_by(|a,b| a.amount.cmp(&b.amount));
    msg!("Tier Added successfully");

    Ok(())
}

pub fn close_tier(ctx: Context<CreateTier>,tier_index: u16)->Result<()>{
    let campaign_account = &mut ctx.accounts.campaign_account;
    let owner = ctx.accounts.owner.key();
    let campaign_owner = campaign_account.owner;

    require!(owner==campaign_owner,CampaignErrors::NotAuthorized);
    campaign_account.tiers.remove(tier_index as usize);
    msg!("Tier removed successfully");
    Ok(())
}


#[derive(Accounts)]
pub struct CreateTier<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut
    )]
    pub campaign_account :Account<'info,CampaignAccount>,
    pub system_program: Program<'info,System>
}
