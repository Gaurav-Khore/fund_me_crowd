use anchor_lang::prelude::*;
pub mod campaign;
pub mod instructions;
pub mod utils;
pub mod errors;
pub use campaign::*;
pub use instructions::*;
pub use utils::*;
pub use errors::*;
declare_id!("3thsLxeasr6oWXzGpYqHJkndBAqyVLEPtgpvGsJsDQMm");

const USER_CAMPAIGN_SEED: &[u8] = b"Campaigns";
const ALL_CAMPAIGN_SEED: &[u8] = b"AllCampaign";
const BACKER_SEED: &[u8] = b"BackerAccount";
const TREASURY_SEED: &[u8] = b"Treasury";
const CAMPAIGN_TRANSACTION_SEED: &[u8] = b"CampaignTransaction";

#[program]
pub mod fund_me_crowd {
use super::*;

    pub fn intialize_app(ctx:Context<SetupApp>) -> Result<()> {
        msg!("Initialize the app");
        msg!("program_id = {:?}",ctx.program_id);
        setup_app(ctx)
    }

    pub fn initialize_campaign(ctx: Context<SetupCampaign>,name: String,
        description: String,
        goal_amt: u64,
        days: i64,
        img_url: String) -> Result<()> {
            msg!("Initialized");
            msg!("program_id = {:?}",ctx.program_id);
            msg!("Campaign Name :- {:?}",name);
            setup_campaign(ctx, name, description, goal_amt, days,img_url)
    }

    pub fn tier_create(ctx: Context<CreateTier>,tier_name:String,tier_amount: u64) -> Result<()> {
        msg!("Create Tier");
        msg!("program_id = {:?}",ctx.program_id);
        msg!("Campaign Name :- {:?}",ctx.accounts.campaign_account.name);
        create_tier(ctx, tier_name, tier_amount)
    }

    pub fn remove_tier(ctx: Context<CreateTier>,tier_index: u16) -> Result<()> {
        msg!("Remove Tier");
        msg!("program_id = {:?}",ctx.program_id);
        msg!("Campaign Name :- {:?}",ctx.accounts.campaign_account.name);
        close_tier(ctx, tier_index)
    }

    pub fn fund_campaign(ctx: Context<FundCampaign>,tier_index: u8) -> Result<()> {
        msg!("Fund Campaign");
        msg!("program_id = {:?}",ctx.program_id);
        msg!("Campaign Name :- {:?}",ctx.accounts.campaign_account.name);
        fund(ctx, tier_index)
    }

    pub fn withdraw_campaign(ctx:Context<WithdrawFund>) -> Result<()> {
        msg!("Withdraw Campaign");
        msg!("program_id = {:?}",ctx.program_id);
        msg!("Campaign Name :- {:?}",ctx.accounts.campaign_account.name);
        withdraw_fund(ctx)
    }

    pub fn refund_campaign(ctx:Context<Refund>) -> Result<()> {
        msg!("Refund Campaign");
        msg!("program_id = {:?}",ctx.program_id);
        msg!("Campaign Name :- {:?}",ctx.accounts.campaign_account.name);
        refund(ctx)
    }

    pub fn delete_campaign(ctx: Context<DeleteCampaign>) -> Result<()> {
        msg!("deete Campaign");
        msg!("program_id = {:?}",ctx.program_id);
        msg!("Campaign Name :- {:?}",ctx.accounts.campaign_account.name);
        campaign_delete(ctx)
    }

    pub fn backer_account_close(ctx: Context<CloseBackerAccount>) -> Result<()> {
        msg!("deete Campaign");
        msg!("program_id = {:?}",ctx.program_id);
        close_backer_account(ctx)
    }
}