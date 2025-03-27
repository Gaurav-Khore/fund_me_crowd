use anchor_lang::error_code;

#[error_code]
pub enum CampaignErrors {
    //Not authorized to do changes
    NotAuthorized,
    //Tier amount not allowed more than goal amount
    NotAllowedTierMoreThanGoalAmount,
    // Duplicate Tier
    DuplicateTier,
    //Tiers ma length reached (max len = 3)
    TiersMaxLenReached,
    //For a campaign with the tier amount more than goal will be achieved so select a new tier
    MaxAmountReached,
    //Campaign is in active/ Campaign Deadline Reached
    CampaignInActive,
    //Goal not achieved 
    GoalNotAchieved,
    NoRefundInititated,
    CampaignIsActive
}