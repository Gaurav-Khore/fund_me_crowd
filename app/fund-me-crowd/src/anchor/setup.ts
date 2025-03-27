import { AnchorProvider, IdlAccounts, Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { FundMeCrowd, IDL } from "./idl";



const programId = new PublicKey("3thsLxeasr6oWXzGpYqHJkndBAqyVLEPtgpvGsJsDQMm");
const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
// export const program = new Program<FundMeCrowd>(IDL, programId, {
//     connection,
//   });


export const getProvider = (wallet) => {
    if(!wallet) {
        console.log("Wallet is not connected");
        return;
    }
    return new AnchorProvider(connection,wallet,{commitment: "processed"})
}

export const getProgram = (wallet) => {
    const provider = getProvider(wallet);
    return new Program(IDL,programId,provider);
}

export const AllCampaignPda = (program) => {
    const [allCampaignPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("AllCampaign")],
        program.programId
    );

    return allCampaignPDA;
}

export const TreasuryAccount = (program) => {
    const [treasuryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("Treasury")],
        program.programId
    );
    return treasuryPDA
}

export const UserCampaignPda = (program,payer) => {
    const [userpda] = PublicKey.findProgramAddressSync(
        [Buffer.from("Campaigns"), payer.toBuffer()],
      program.programId
    );
    return userpda
}


export const CampaignTxPda = (program,campaignAccount) => {
    const [campaignTraxPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("CampaignTransaction"),campaignAccount.toBuffer()],
      program.programId
    );

    return campaignTraxPda;
}


export const BackerAccountPda = (program,user) => {
    const [backerAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("BackerAccount"),user.toBuffer()],
        program.programId
    );

    return backerAccountPda;
}