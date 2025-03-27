import { Container, Row, ListGroup, Button } from "react-bootstrap";
import { BackerAccountPda, CampaignTxPda, getProgram, TreasuryAccount } from "../anchor/setup";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ToastErrorNotification, ToastSuccessNotification } from "./notification";
import { onChainErrorMessage } from "../utils";
import xyz from "../assets/bin.png";

export const TierList = (props) => {
    const { connection } = useConnection();
    const { wallet, publicKey, sendTransaction } = useWallet();

    const DeleteTierHandler = async (tierIndex) => {
        if (!publicKey) {
            ToastErrorNotification('Wallet is not connected..');
            return;
        }
        const program = getProgram(wallet);
        const tx = await program.methods.removeTier(tierIndex).accounts({
            campaignAccount: props.campaignAccount,
            owner: props.campaignOwner
        }).transaction();

        tx.feePayer =publicKey;
        const simulateTx = await connection.simulateTransaction(tx);
        if (simulateTx.value.err) {
            const errMsg = onChainErrorMessage(program, simulateTx.value.err.InstructionError);
            ToastErrorNotification(errMsg);
            return;
        }
        try {
            const sendTx = await sendTransaction(tx, connection);
            ToastSuccessNotification("Tier Deleted Successfully..");
        } catch (error) {
            ToastErrorNotification("Failed to delete the Tier..");
        }

        //subscribe to campaign account change
        const subscriptionId = connection.onAccountChange(
            props.campaignAccount,
            async (accountInfo) => {
                const decodeData = program.coder.accounts.decode(
                    "campaignAccount",
                    accountInfo.data
                );
                console.log(decodeData);
                decodeData.campaignKey = props.campaignAccount;
                props.setCampaign(decodeData);
            }
        );
        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
        
    }

    const DonateCampaignHandler = async (tierIndex) => {
        if (!publicKey) {
            ToastErrorNotification('Wallet is not connected..');
            return;
        }
        const program = getProgram(wallet);
        const backerAccountPda = BackerAccountPda(program, publicKey);
        const treasuryAccountPda = TreasuryAccount(program);
        const campaignTxPda = CampaignTxPda(program, props.campaignAccount);

        const donateTx = await program.methods.fundCampaign(tierIndex).accounts({
            treasuryAccount: treasuryAccountPda,
            backerAccount: backerAccountPda,
            campaignAccount: props.campaignAccount,
            campaignTransactionAccount: campaignTxPda,
            backer: publicKey
        }).transaction();
        donateTx.feePayer = publicKey;
        const simulateTx = await connection.simulateTransaction(donateTx);
        if (simulateTx.value.err) {
            const errMsg = onChainErrorMessage(program, simulateTx.value.err.InstructionError);
            ToastErrorNotification(errMsg);
            return;
        }
        try {
            const sendTx = await sendTransaction(donateTx, connection);
            ToastSuccessNotification("Thank You for your Donation...");
        } catch (error) {
            ToastErrorNotification("Failed to donate...");
        }

        // Subscribe the backer tx list update
        const subscriptionID = connection.onAccountChange(
            campaignTxPda,
            async (accountInfo) => {
                const decodeData = program.coder.accounts.decode(
                    "campaignTransaction",
                    accountInfo.data
                );
                props.setTxList(decodeData);
            }
        );
        () => {
            connection.removeAccountChangeListener(subscriptionID);
        };

        //subscribe to campaign account change
        const subscriptionId = connection.onAccountChange(
            props.campaignAccount,
            async (accountInfo) => {
                const decodeData = program.coder.accounts.decode(
                    "campaignAccount",
                    accountInfo.data
                );
                console.log(decodeData);
                decodeData.campaignKey = props.campaignAccount;
                props.setCampaign(decodeData);
            }
        );
        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };


    }

    return (
        <Container>
            <Row style={{ justifyContent: "flex-start", padding: "20px 0" }}>
                <ListGroup>
                    {props.tiers.map((tier, index) => (
                        <ListGroup.Item key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "8px", marginBottom: "10px", padding: "15px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ fontWeight: "bold", marginRight: "10px" }}>{tier.name}</span>
                                {props.isOwner && (
                                    <Button style={{ background: "transparent", border: "none" }} onClick={() => DeleteTierHandler(index)}>
                                        <img src={xyz} alt="Delete" style={{ width: "25px", height: "25px" }} />
                                    </Button>
                                )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ marginRight: "10px" }}><strong>Amount:</strong> {tier.amount.toNumber() / LAMPORTS_PER_SOL} SOL</span>
                                <Button onClick={() => DonateCampaignHandler(index)} style={{ backgroundColor: "#512da8", color: "#fff", border: "none", borderRadius: "5px" }}>Donate</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Row>
        </Container>
    );
}