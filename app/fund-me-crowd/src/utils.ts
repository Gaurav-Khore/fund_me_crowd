import { getProgram } from "./anchor/setup";
export const getCampaign = async (program, campaignKey, connection) => {
    console.log("get Campaign Key = ", campaignKey);
    const fetchedData = await connection.getAccountInfo(campaignKey);
    console.log("Fetched Data", fetchedData.data);
    const campaignData = program.coder.accounts.decode(
        "campaignAccount",
        fetchedData.data
    );
    console.log(campaignData);
    campaignData.campaignKey = campaignKey;
    return campaignData;
}


export const getCampaignTxList = async (program, campaignTxAccount, connection) => {
    const fetchedData = await connection.getAccountInfo(campaignTxAccount);

    const txList = program.coder.accounts.decode(
        "campaignTransaction",
        fetchedData.data
    );

    console.log(txList);
    return txList;
}

export const getBackerTxList = async (program, backerAccountPda, connection) => {
    console.log("test");
    const fetchedData = await connection.getAccountInfo(backerAccountPda);
    console.log(fetchedData.data);
    const txList = program.coder.accounts.decode(
        "backerAccount",
        fetchedData.data
    );
    console.log(txList);
    return txList;
    
}


export const onChainErrorMessage = (program, error) => {
    console.log(error);
    console.log(error[1].Custom);

    if (error[1].Custom === 1) {
        return "Insufficient Balance.."
    }
    const msg = program.idl.errors.find((element) => {
        return element.code == error[1].Custom
    });
    console.log(msg);
    if (msg.name) {
        return msg.name;

    }

    return "Try Again.."
}

export const shortDesc = (desc) => {
    if (desc.split(/\s+/).length > 4) {
        return desc.split(/\s+/).slice(0, 4).join(" ").trim() + "..."
    }
    return desc
}