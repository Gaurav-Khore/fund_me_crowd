import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FundMeCrowd } from "../target/types/fund_me_crowd";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

describe("fund_me_crowd", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.FundMeCrowd as Program<FundMeCrowd>;

  const fundName1 = "Fund 1";
  const desc1 = "Test description for fund 1";
  const goalAmt1 = new anchor.BN(100);
  const days1 = new anchor.BN(1);

  const user2 = Keypair.fromSecretKey(new Uint8Array([
    // 169, 192, 242,  11, 129,  70,  94,
    //   112, 125, 218, 196, 246, 192, 190,
    //   208, 212, 125,   1, 131, 148, 110,
    //   198, 248, 211, 176, 103,   8, 204,
    //   245, 225,  25,  70
    178, 99, 130, 129, 84, 30, 54, 111, 23, 148, 106,
    24, 75, 217, 233, 192, 130, 67, 245, 191, 235, 166,
    187, 212, 184, 116, 183, 97, 30, 79, 55, 81, 169,
    192, 242, 11, 129, 70, 94, 112, 125, 218, 196, 246,
    192, 190, 208, 212, 125, 1, 131, 148, 110, 198, 248,
    211, 176, 103, 8, 204, 245, 225, 25, 70
  ]));

  const user3 = Keypair.fromSecretKey(new Uint8Array([
    32, 190,  76, 142, 127, 232, 191, 229, 168,  29,   9,
       48, 186,  25,   7, 207,  92, 207,  29,  64, 101,  37,
      185, 184,  28,  88,  60,  58,  97, 209, 201,  74, 173,
      179,  11, 102, 255, 132, 232, 136, 167, 198, 102, 242,
      251, 210,  87,  16, 108,  57,  90, 229,  90, 154,  22,
       90, 130, 231,  15, 194,  25, 117, 211,  41
  ]));

  // it("Is initialized!", async () => {
  //   // Add your test here.

  //   const campaignAccountPDA = anchor.web3.Keypair.generate();
  //   console.log("campaignAccount = ",campaignAccountPDA.publicKey);

  //   const [allCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("AllCampaign")],
  //     program.programId
  //   );

  //   const [userCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"),payer.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const [campaign_txPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
  //         [Buffer.from("CampaignTransaction"),campaignAccountPDA.publicKey.toBuffer()],
  //         program.programId
  //       );
  //   const tx = await program.methods.initializeCampaign("Fund1",desc1,goalAmt1,days1,"sdfsdfj")
  //   .accounts({
  //     campaignAccount: campaignAccountPDA.publicKey,
  //     allCampaignAccount: allCampaignPDA,
  //     userCampaignAccount: userCampaignPDA,
  //     payer: payer.publicKey,
  //     campaignTransaction: campaign_txPDA
  //   }).rpc();
  //   console.log("Your transaction signature", tx);

  //   //campaign account
  //   const campaignAccount = await program.account.campaignAccount.fetch(campaignAccountPDA.publicKey);
  //   console.log("Account = ",campaignAccount);
  //   console.log("name = ",campaignAccount.name);
  //   console.log("duration = ",campaignAccount.duration.toNumber());
  //   console.log("owner = ",campaignAccount.owner);

  //   //all campaign
  //   const allCampaign = await program.account.allCampaign.fetch(allCampaignPDA);
  //   console.log("all campaign = ",allCampaign);

  //   //user campaigns
  //   const userCampaign = await program.account.userCampaign.fetch(userCampaignPDA);
  //   console.log("user campaigns = ",userCampaign);
  // });



  // it("Fetch User Campaign", async () => {
  //   const [userCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"), payer.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   //user campaigns
  //   const userCampaign = await program.account.userCampaign.fetch(userCampaignPDA);
  //   console.log("user campaigns = ", userCampaign);
  //   console.log(userCampaign.campaigns[0]);
  //   if(userCampaign.campaigns.length!=0) {
  //   const cpa = userCampaign.campaigns[0];
  //   const tx = await program.account.campaignAccount.fetch(cpa);
  //   console.log(tx); 
  //   }
  //   else {
  //     console.log("No data found ");
  //   }
  // });

  // it("Create Tier", async () => {
  //   const [userCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"),payer.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const tier1 = "Basic";
  //   const amount = new anchor.BN(10);
  //   const userCampaign = await program.account.userCampaign.fetch(userCampaignPDA);
  //   const campaignAccount = userCampaign.campaigns[0];
  //   console.log(campaignAccount);
  //   const tx = await program.methods.tierCreate(tier1,amount).accounts({
  //     campaignAccount: campaignAccount,
  //     owner: payer.publicKey
  //   }).rpc();

  //   console.log("Tier added");
  //   const campaignAccountUpdated = await program.account.campaignAccount.fetch(campaignAccount);
  //   console.log(campaignAccountUpdated); 
  // });

  // it("Remove Tier" , async () => {
  //   const [userCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"),payer.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const userCampaign = await program.account.userCampaign.fetch(userCampaignPDA);
  //   const campaignAccount = userCampaign.campaigns[0];
  //   console.log(campaignAccount);

  //   const tx = await program.methods.removeTier(0).accounts({
  //     campaignAccount: campaignAccount,
  //     owner: payer.publicKey
  //   }).rpc();

  //   console.log("Tier removed successfully");
  //   const userCampaign1 = await program.account.userCampaign.fetch(userCampaignPDA);
  //   const campaignAccount1 = userCampaign1.campaigns[0];
  //   console.log(campaignAccount1);
  // });


  // it("Fund Campaign", async () => {
  //   console.log("Backer is ", user2.publicKey);
  //   const [userCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"), payer.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   //user campaigns
  //   const userCampaign = await program.account.userCampaign.fetch(userCampaignPDA);
  //   console.log("user campaigns = ", userCampaign);
  //   console.log(userCampaign.campaigns[0]);
  //   const cpa = userCampaign.campaigns[0];
  //   console.log("Funding below account");
  //   const tx = await program.account.campaignAccount.fetch(cpa);
  //   console.log(tx);

  //   console.log("Funding initiated");
  //   const [backer_account] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("BackerAccount"), cpa.toBuffer()],
  //     program.programId
  //   );

  //   const tier_index = tx.tiers[0];
  //   console.log("funded tier = ", tier_index);
  //   const fund_tx = await program.methods.fundCampaign(0).accounts({
  //     campaignAccount: cpa,
  //     backerAccount: backer_account,
  //     backer: user2.publicKey
  //   }).signers([user2]).rpc();

  //   // backers details
  //   console.log("Backer infromation");
  //   const backer = await program.account.backerAccount.fetch(backer_account);
  //   console.log(backer);

  //   //campaign status
  //   console.log("Campaign");
  //   const camp_acc = await program.account.campaignAccount.fetch(cpa);
  //   console.log(camp_acc);
  // });

  // it("Withdraw Fund", async () => {
  //   console.log("user2 = ",user3.publicKey);
  //   //a new campaign
  //   const campaignAccount = anchor.web3.Keypair.generate();
  //   console.log("Camapign Account = ", campaignAccount);

  //   // all campaign list
  //   const [ALlCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("AllCampaign")],
  //     program.programId
  //   );

  //   // user campaign list pda
  //   const [userCampaignPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"), payer.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   //Treasury pda
  //   const [treasuryPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Treasury")],
  //     program.programId
  //   );

  //   //intialize the app
  //   const app_tx = await program.methods.intializeApp()
  //   .accounts({
  //     allCampaignAccount: ALlCampaignPDA,
  //     signer: payer.publicKey,
  //     treasuryAccount: treasuryPDA
  //   }).rpc();
  //   console.log("Intialized the app");
  //   //Campaign Transaction pda
  //   const [campaign_txPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("CampaignTransaction"),campaignAccount.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const goalAmt = 2*LAMPORTS_PER_SOL;
  //   //Create a new Campaign
  //   const tx = await program.methods.initializeCampaign("Fund", "Withdraw fund test", new anchor.BN(goalAmt), new anchor.BN(1))
  //     .accounts({
  //       payer: payer.publicKey,
  //       allCampaignAccount: ALlCampaignPDA,
  //       campaignAccount: campaignAccount.publicKey,
  //       userCampaignAccount: userCampaignPda,
  //       campaignTransaction: campaign_txPDA
  //     })
  //     .signers([campaignAccount]).rpc();
    
  //   console.log("Camapign Account initialize transaction :-",tx);
  //   console.log("Campaign Account created successfully");

  //   //fetch the new campaign created
  //   const camp_acct = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account = ",camp_acct);
  //   // fetch all the campaign
  //   const all_camp = await program.account.allCampaign.fetch(ALlCampaignPDA);
  //   console.log("All Campaign = ",all_camp);
  //   //fetch user all campaign
  //   const user_camp = await program.account.userCampaign.fetch(userCampaignPda);
  //   console.log("User campaign list = ",user_camp);

  //   //Create a tier
  //   console.log("Tier Creation initiated");
  //   const tierAmt = 1*LAMPORTS_PER_SOL;
  //   const tier_tx = await program.methods.tierCreate("Basic",new anchor.BN(tierAmt))
  //     .accounts({
  //       campaignAccount: campaignAccount.publicKey,
  //       owner: payer.publicKey
  //     }).rpc();
  //   console.log("Tier Creation successfull = ",tier_tx);
  //   // Campaign account after tier added
  //   const camp_acct_1 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account = ",camp_acct_1);

  //   //backer account pda
  //   const [backerAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("BackerAccount"),user3.publicKey.toBuffer()],
  //     program.programId
  //   );

    
  //   //Fund the campaign
  //   const fund_tx1 = await program.methods.fundCampaign(0)
  //   .accounts({
  //     backerAccount: backerAccountPDA,
  //     backer: user3.publicKey,
  //     campaignAccount: campaignAccount.publicKey,
  //     treasuryAccount: treasuryPDA,
  //     campaignTransactionAccount: campaign_txPDA
  //   }).signers([user3]).rpc();
  //   console.log("First Transaction Completed");
    
  //   const fund_tx2 = await program.methods.fundCampaign(0)
  //   .accounts({
  //     backerAccount: backerAccountPDA,
  //     backer: user3.publicKey,
  //     campaignAccount: campaignAccount.publicKey,
  //     treasuryAccount: treasuryPDA,
  //     campaignTransactionAccount: campaign_txPDA
  //   }).signers([user3]).rpc();
  //   console.log("Second Transaction Completed");

  //   // Campaign State after two transactions
  //   const camp_acct_2 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account after two tx = ",camp_acct_2);

  //   //backer account after two transactions
  //   const back_acct = await program.account.backerAccount.fetch(backerAccountPDA);
  //   console.log("Backer account after two transactions = ",back_acct);

  //   //campaign transaction account after two transactions
  //   const camp_tx_acct = await program.account.campaignTransaction.fetch(campaign_txPDA);
  //   console.log("Campaign Tx after two transactions = ",camp_tx_acct);

  //   //treasury account after two transaction
  //   const trea_acct = await program.account.treasury.fetch(treasuryPDA);
  //   console.log("Treasury account after two transactions",trea_acct);

  //   //Withdraw
  //   const withdraw_tx = await program.methods.withdrawCampaign()
  //     .accounts({
  //       campaignAccount: campaignAccount.publicKey,
  //       owner: payer.publicKey,
  //       treasuryAccount: treasuryPDA,allCampaignAccount: ALlCampaignPDA,
  //       userCampaignAccount: userCampaignPda
  //     }).rpc();
  //   console.log("Withdraw is successfull");
  //   const camp_acct_3 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account after withdraw = ",camp_acct_3);

  //   //treasury account after withdraw
  //   const trea_acct_1 = await program.account.treasury.fetch(treasuryPDA);
  //   console.log("Treasury account after withdraw",trea_acct_1);

  //   // fetch all the campaign
  //   const all_camp_1 = await program.account.allCampaign.fetch(ALlCampaignPDA);
  //   console.log("All Campaign = ",all_camp_1);
  //   //fetch user all campaign
  //   const user_camp_1 = await program.account.userCampaign.fetch(userCampaignPda);
  //   console.log("User campaign list = ",user_camp_1);
  // });
  

  // it("Refund",async () => {
  //   console.log("user3 = ",user3.publicKey);
  //   //a new campaign
  //   const campaignAccount = anchor.web3.Keypair.generate();
  //   console.log("Camapign Account = ", campaignAccount);

  //   // all campaign list
  //   const [ALlCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("AllCampaign")],
  //     program.programId
  //   );

  //   // user campaign list pda
  //   const [userCampaignPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"), payer.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   //Treasury pda
  //   const [treasuryPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Treasury")],
  //     program.programId
  //   );

  //   //intialize the app
  //   const app_tx = await program.methods.intializeApp()
  //   .accounts({
  //     allCampaignAccount: ALlCampaignPDA,
  //     signer: payer.publicKey,
  //     treasuryAccount: treasuryPDA
  //   }).rpc();
  //   console.log("Intialized the app");
  //   //Campaign Transaction pda
  //   const [campaign_txPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("CampaignTransaction"),campaignAccount.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const goalAmt = 2*LAMPORTS_PER_SOL;
  //   //Create a new Campaign
  //   const tx = await program.methods.initializeCampaign("Fund", "Withdraw fund test", new anchor.BN(goalAmt), new anchor.BN(1))
  //     .accounts({
  //       payer: payer.publicKey,
  //       allCampaignAccount: ALlCampaignPDA,
  //       campaignAccount: campaignAccount.publicKey,
  //       userCampaignAccount: userCampaignPda,
  //       campaignTransaction: campaign_txPDA
  //     })
  //     .signers([campaignAccount]).rpc();
    
  //   console.log("Camapign Account initialize transaction :-",tx);
  //   console.log("Campaign Account created successfully");

  //   //fetch the new campaign created
  //   const camp_acct = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account = ",camp_acct);
  //   // fetch all the campaign
  //   const all_camp = await program.account.allCampaign.fetch(ALlCampaignPDA);
  //   console.log("All Campaign = ",all_camp);
  //   //fetch user all campaign
  //   const user_camp = await program.account.userCampaign.fetch(userCampaignPda);
  //   console.log("User campaign list = ",user_camp);

  //   //Create a tier
  //   console.log("Tier Creation initiated");
  //   const tierAmt = 1*LAMPORTS_PER_SOL;
  //   const tier_tx = await program.methods.tierCreate("Basic",new anchor.BN(tierAmt))
  //     .accounts({
  //       campaignAccount: campaignAccount.publicKey,
  //       owner: payer.publicKey
  //     }).rpc();
  //   console.log("Tier Creation successfull = ",tier_tx);
  //   // Campaign account after tier added
  //   const camp_acct_1 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account = ",camp_acct_1);

  //   //backer account pda
  //   const [backerAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("BackerAccount"),user3.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   //Fund the campaign
  //   const fund_tx1 = await program.methods.fundCampaign(0)
  //   .accounts({
  //     backerAccount: backerAccountPDA,
  //     backer: user3.publicKey,
  //     campaignAccount: campaignAccount.publicKey,
  //     treasuryAccount: treasuryPDA,
  //     campaignTransactionAccount: campaign_txPDA
  //   }).signers([user3]).rpc();
  //   console.log("First Transaction Completed");

  //     // Campaign State after two transactions
  //   const camp_acct_2 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account after one tx = ",camp_acct_2);

  //   //treasury account after two transaction
  //   const trea_acct = await program.account.treasury.fetch(treasuryPDA);
  //   console.log("Treasury account after 1 transactions",trea_acct);

  //   //backer account 
  //   const back_acct = await program.account.backerAccount.fetch(backerAccountPDA);
  //   console.log("Backer account after first tx = ",back_acct);
    
  //   //campaign transaction account after two transactions
  //   const camp_tx_acct = await program.account.campaignTransaction.fetch(campaign_txPDA);
  //   console.log("Campaign Tx after two transactions = ",camp_tx_acct);
    
  //   //refund intiate
  //   const refund_tx = await program.methods.refundCampaign().accounts({
  //     backerAccount: backerAccountPDA,
  //     campaignAccount: campaignAccount.publicKey,
  //     owner: user3.publicKey,
  //     treasuryAccount: treasuryPDA
  //   }).signers([user3]).rpc();
  //   console.log("Refund intiatited");

  //   //treasury account after refund transaction
  //   const trea_acct_1 = await program.account.treasury.fetch(treasuryPDA);
  //   console.log("Treasury account after refund transactions",trea_acct_1);

  //   // Campaign State after refund transactions
  //   const camp_acct_3 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account after refund = ",camp_acct_3);

  //   //backer account 
  //   const back_acct_1 = await program.account.backerAccount.fetch(backerAccountPDA);
  //   console.log("Backer account after first tx = ",back_acct_1);
    
  //   //campaign transaction account after two transactions
  //   const camp_tx_acct_2 = await program.account.campaignTransaction.fetch(campaign_txPDA);
  //   console.log("Campaign Tx after two transactions = ",camp_tx_acct_2);
  // });

  // it("Delete Campaign", async () => {

  //   console.log("User3 is = ",user3.publicKey);

  //   //a new campaign
  //   const campaignAccount = anchor.web3.Keypair.generate();
  //   console.log("Camapign Account = ", campaignAccount);

  //   // all campaign list
  //   const [ALlCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("AllCampaign")],
  //     program.programId
  //   );

  //   // user campaign list pda
  //   const [userCampaignPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Campaigns"), payer.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   //Treasury pda
  //   const [treasuryPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("Treasury")],
  //     program.programId
  //   );

  //   //intialize the app
  //   const app_tx = await program.methods.intializeApp()
  //   .accounts({
  //     allCampaignAccount: ALlCampaignPDA,
  //     signer: payer.publicKey,
  //     treasuryAccount: treasuryPDA
  //   }).rpc();
  //   console.log("Intialized the app");
    
  //   //Campaign Transaction pda
  //   const [campaign_txPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("CampaignTransaction"),campaignAccount.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const goalAmt = 2*LAMPORTS_PER_SOL;
  //   //Create a new Campaign
  //   const tx = await program.methods.initializeCampaign("Fund", "Withdraw fund test", new anchor.BN(goalAmt), new anchor.BN(1),"sdfsdf")
  //     .accounts({
  //       payer: payer.publicKey,
  //       allCampaignAccount: ALlCampaignPDA,
  //       campaignAccount: campaignAccount.publicKey,
  //       userCampaignAccount: userCampaignPda,
  //       campaignTransaction: campaign_txPDA
  //     })
  //     .signers([campaignAccount]).rpc();
    
  //   console.log("Camapign Account initialize transaction :-",tx);
  //   console.log("Campaign Account created successfully");

  //   //fetch the new campaign created
  //   const camp_acct = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account = ",camp_acct);
  //   // fetch all the campaign
  //   const all_camp = await program.account.allCampaign.fetch(ALlCampaignPDA);
  //   console.log("All Campaign = ",all_camp);
  //   //fetch user all campaign
  //   const user_camp = await program.account.userCampaign.fetch(userCampaignPda);
  //   console.log("User campaign list = ",user_camp);

  //   //Create a tier
  //   console.log("Tier Creation initiated");
  //   const tierAmt = 1*LAMPORTS_PER_SOL;
  //   const tier_tx = await program.methods.tierCreate("Basic",new anchor.BN(tierAmt))
  //     .accounts({
  //       campaignAccount: campaignAccount.publicKey,
  //       owner: payer.publicKey
  //     }).rpc();
  //   console.log("Tier Creation successfull = ",tier_tx);
  //   // Campaign account after tier added
  //   const camp_acct_1 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account = ",camp_acct_1);

  //   //backer account pda
  //   const [backerAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("BackerAccount"),user3.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   //Fund the campaign
  //   const fund_tx1 = await program.methods.fundCampaign(0)
  //   .accounts({
  //     backerAccount: backerAccountPDA,
  //     backer: user3.publicKey,
  //     campaignAccount: campaignAccount.publicKey,
  //     treasuryAccount: treasuryPDA,
  //     campaignTransactionAccount: campaign_txPDA
  //   }).signers([user3]).rpc();
  //   console.log("First Transaction Completed");

  //     // Campaign State after two transactions
  //   const camp_acct_2 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account after one tx = ",camp_acct_2);

  //   // campaign transaction after one tx
  //   const camp_tx_acct = await program.account.campaignTransaction.fetch(campaign_txPDA);
  //   console.log("Campaign Transaction account after one transaction = ", camp_tx_acct);

  //   // delete campaign intiated
  //   const delete_tx = await program.methods.deleteCampaign().accounts({
  //     campaignAccount: campaignAccount.publicKey,
  //     owner: payer.publicKey
  //   }).rpc();
  //   console.log("Campaign deleted successfully");

  //   // Campaign State after two transactions
  //   const camp_acct_3 = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
  //   console.log("Campaign Account after delete campaign = ",camp_acct_3);

  // });

  // it("Fetch all campaign" , async () => {
  
  //   const [allCampaignPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("AllCampaign")],
  //     program.programId
  //   );

  //   const test = await program.account.allCampaign.fetch(allCampaignPda);
  //   console.log("Test ",test);

  // })

  it("Fund the Camapaign" , async () => {

    //setup app
    const [treasuryAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("Treasury")],
      program.programId
    );

    const campaignAccountPDA = anchor.web3.Keypair.generate();
    console.log("campaignAccount = ",campaignAccountPDA.publicKey);

    const [allCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("AllCampaign")],
      program.programId
    );

    const [userCampaignPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("Campaigns"),payer.publicKey.toBuffer()],
      program.programId
    );

    const [campaign_txPDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("CampaignTransaction"),campaignAccountPDA.publicKey.toBuffer()],
          program.programId
        );

    const setup_tx = await program.methods.intializeApp().accounts({
      allCampaignAccount: allCampaignPDA,
      treasuryAccount: treasuryAccountPDA,
    }).rpc();
    console.log("Setup completed , ",setup_tx);
    const tx = await program.methods.initializeCampaign("Fund1",desc1,goalAmt1,days1,"sdfsdfj")
    .accounts({
      campaignAccount: campaignAccountPDA.publicKey,
      allCampaignAccount: allCampaignPDA,
      userCampaignAccount: userCampaignPDA,
      payer: payer.publicKey,
      campaignTransaction: campaign_txPDA
    }).signers([campaignAccountPDA]).rpc();
    console.log("Your transaction signature", tx);

    //campaign account
    const campaignAccount = await program.account.campaignAccount.fetch(campaignAccountPDA.publicKey);
    console.log("Account = ",campaignAccount);
    console.log("name = ",campaignAccount.name);
    console.log("duration = ",campaignAccount.duration.toNumber());
    console.log("owner = ",campaignAccount.owner);

    //all campaign
    const allCampaign = await program.account.allCampaign.fetch(allCampaignPDA);
    console.log("all campaign = ",allCampaign);

    //user campaigns
    const userCampaign = await program.account.userCampaign.fetch(userCampaignPDA);
    console.log("user campaigns = ",userCampaign);

    //create tier
    const tier_tx = await program.methods.tierCreate("Basic",new anchor.BN(1)).accounts({
      campaignAccount: campaignAccountPDA.publicKey,
      owner: payer.publicKey
    }).rpc();
    console.log("tier created ",tier_tx);


    const [backerAccountPDA ]= anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("BackerAccount"),payer.publicKey.toBuffer()],
      program.programId
    );

    //fund the campaign
    const fund_tx = await program.methods.fundCampaign(0).accounts({
      backer: payer.publicKey,
      backerAccount: backerAccountPDA,
      campaignAccount: campaignAccountPDA.publicKey,
      campaignTransactionAccount: campaign_txPDA,
      treasuryAccount: treasuryAccountPDA
    }).rpc();

    console.log("campaign funded ",fund_tx);

    //campaign account
    const campaignAccount1 = await program.account.campaignAccount.fetch(campaignAccountPDA.publicKey);
    console.log("Account = ",campaignAccount1);
  })
});
