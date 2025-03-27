use anchor_lang::prelude::*;


#[account]
pub struct CampaignAccount {
    pub name: String,
    pub description: String,
    pub goal_amount: u64,
    pub current_amount: u64,
    pub duration: i64,
    pub owner: Pubkey,
    pub tiers: Vec<Tier>,
    pub status: CampaignStatus,
    pub image_url: String
}

#[derive(AnchorDeserialize,AnchorSerialize,Clone,PartialEq, PartialOrd)]
pub enum CampaignStatus {
    Active,
    Successful,
    Failed,
    InActive,
    Completed
}

#[derive(AnchorDeserialize,AnchorSerialize,Clone,PartialEq,Eq, PartialOrd, Ord)]
pub struct Tier {
    pub name: String,
    pub amount: u64
}

//Backers 
#[account]
pub struct BackerAccount {
    pub campaign_list: Vec<Backer>
    // pub amount: u64
}

#[derive(AnchorDeserialize,AnchorSerialize,Clone)]
pub struct Backer {
    pub campaign: Pubkey,
    pub amount: u64,
    pub refund_status: bool
}


#[account]
pub struct AllCampaign {
    pub campaign_list : Vec<Pubkey>
}

#[account]
pub struct UserCampaign {
    pub campaigns: Vec<Pubkey>
}

#[account]
pub struct Treasury {
    pub amount: u64
}

#[account]
pub struct CampaignTransaction {
    pub transaction_list: Vec<Transactions>
}

#[derive(AnchorDeserialize,AnchorSerialize,Clone)]
pub struct Transactions {
    pub backer: Pubkey,
    pub amount: u64
}