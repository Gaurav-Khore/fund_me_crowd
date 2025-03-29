# Fund Me Crowd

---

## Overview
Fund Me Crowd is a **campaign funding web app** built using **Anchor (Rust) and React**. The backend is **on-chain**, written on **Solana using Anchor**.

Users can create and manage campaigns with features like setting a goal amount, adding donation tiers, withdrawing funds, and refunding donations. The app ensures all logic related to campaign activity, withdrawals, and refunds is handled securely **on-chain**.

## Features
---
- **Create a Campaign**: Users can start a campaign by providing details like:
  - Name
  - Goal Amount
  - Goal Duration
  - Image Link
  - Short Description
- **Predefined Donation Tiers**: Users can set predefined donation amounts.
- **Campaign Management**:
  - Users can delete their campaigns.
  - Campaign owners can withdraw funds once the goal amount is reached.
- **Donations & Refunds**:
  - Users can donate to campaigns.
  - Users can initiate refunds if the campaign fails.
- **Transaction History**:
  - Campaign owners can view the donation history.
  - Users can see their personal donation history.

## Smart Contract Logic
---
The backend logic is handled on-chain using Solana and Anchor with the following core instructions:
- **Initialize Campaign**: Creates a new campaign account with user-defined details.
- **Fund Campaign**: Allows users to donate funds to the campaign.
- **Withdraw Funds**: Enables the campaign owner to withdraw funds once the goal amount is reached.
- **Refund Donations**: Allows users to request refunds if the campaign fails or does not meet the goal.
- **View Transactions**: Retrieves the history of donations for transparency.

## Smart Contract Accounts
---
The following accounts are used in the smart contract:
- **campaign_account**: Stores campaign details such as name, goal amount, and current amount.
- **treasury_account**: Holds the total funds of all campaigns.
- **user_campaign_account**: Tracks all campaigns created by a specific user.
- **backer_account**: Stores information about backers and their contribution amounts for each campaign.

## Pages
---
- **Home**: Displays all active campaigns.
- **My Campaigns**: Shows all campaigns created by the user, categorized into:
  - Active
  - Inactive
  - History
- **History**: Displays the user's donation history.

## Tech Stack
---
- **Frontend**: React, Vite, TypeScript
- **Backend**: Solana Blockchain (Anchor Framework, Rust)
- **Wallet Integration**: Solana Wallet Adapter

## Installation & Setup
---
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fund-me-crowd.git
   cd fund-me-crowd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Deploy the smart contract (Anchor program) on Solana:
   ```bash
   anchor build
   anchor deploy
   ```

## Screenshots
---
**Home**
![alt text](<home.png>)

**My Campaign**
![alt text](<MyCampaign.png>)

**History**
![alt text](<history.png>)

**Campaign Details**
![alt text](<CampaignDetails.png>)

**Create Campaign**
![alt text](<createCampaign.png>)

