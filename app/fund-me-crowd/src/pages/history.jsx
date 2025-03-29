import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { BackerAccountPda, CampaignTxPda, getProgram, TreasuryAccount } from "../anchor/setup";
import { getBackerTxList, getCampaign, onChainErrorMessage, shortDesc } from "../utils";
import { ListGroup, Button, Container } from "react-bootstrap";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import { ToastErrorNotification, ToastSuccessNotification } from "../components/notification";

const History = () => {
    const { connection } = useConnection();
    const { wallet, publicKey, sendTransaction } = useWallet();
    const [backerTxList, setBackerTxList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!publicKey) {
            ToastErrorNotification('Wallet is not connected..');
            return;
        }

        const program = getProgram(wallet);
        const getTxList = async () => {
                const backerAccountPda = BackerAccountPda(program, publicKey);
                const list = await getBackerTxList(program, backerAccountPda, connection);
                console.log("list = ",list);
                const txList = [];
    
                for (let tx of list.campaignList) {
                    const campaignData = await getCampaign(program, tx.campaign, connection);
                    tx.campaignName = campaignData.name;
                    tx.description = campaignData.description;
                    tx.campaignStatus = Object.keys(campaignData.status)[0];
                    console.log(tx.refundStatus);
                }
    
                setBackerTxList(list);
        };
                getTxList(); 
            
    }, [connection, publicKey, wallet]);

    const refundHandler = async (campaignAccount) => {
        const program = getProgram(wallet);
        const treasuryAccountPda = TreasuryAccount(program);
        const backerAccountPda = BackerAccountPda(program, publicKey);
        const campaignTxAcctPda = CampaignTxPda(program, campaignAccount);

        const tx = await program.methods.refundCampaign().accounts({
            backerAccount: backerAccountPda,
            campaignAccount: campaignAccount,
            treasuryAccount: treasuryAccountPda,
            campaignTransactionAccount: campaignTxAcctPda,
            owner: publicKey
        }).transaction();

        tx.feePayer = publicKey;
        const simulateTx = await connection.simulateTransaction(tx);
        if (simulateTx.value.err) {
            const errMsg = onChainErrorMessage(program, simulateTx.value.err.InstructionError);
            ToastErrorNotification(errMsg);
            return;
        }

        try {
            const sendTx = await sendTransaction(tx, connection);
            ToastSuccessNotification("Refund is successful..");
        } catch (error) {
            ToastErrorNotification("Try Again..");
        }

        //Subscribe to baclerAccount pda
        const subscriptionId = connection.onAccountChange(
            backerAccountPda,
            async (accountInfo) => {
                const decodeData = program.coder.accounts.decode(
                    "backerAccount",
                    accountInfo.data
                );
                const txList = [];

                for (let tx of decodeData.campaignList) {
                    const campaignData = await getCampaign(program, tx.campaign, connection);
                    tx.campaignName = campaignData.name;
                    tx.description = campaignData.description;
                    tx.campaignStatus = Object.keys(campaignData.status)[0];
                }

                setBackerTxList(decodeData);
            }
        );
        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    };

    const deleteBackerAccount = async () => {
        const program = getProgram(wallet);
        const backerAccountPda = BackerAccountPda(program, publicKey);

        const tx = await program.methods.backerAccountClose().accounts({
            backerAccount: backerAccountPda,
            owner: publicKey
        }).transaction();

        tx.feePayer = publicKey;

        try {
            const sendTx = await sendTransaction(tx,connection);
        ToastSuccessNotification("Transaction History deleted");
        }
        catch(err) {
            console.log("error while deleting = ", err);
            ToastErrorNotification("what the fuck");
        }
        
    }

    return (
        <Container style={{ padding: "20px" }}>
            <h1 className="text-center mb-4">Donation History</h1>
            {backerTxList.campaignList && backerTxList.campaignList.length > 0 ? (
                <ListGroup>
                    {backerTxList.campaignList.map((tx, index) => (
                        <ListGroup.Item
                            key={index}
                            className="d-flex justify-content-between align-items-start"
                            style={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                padding: "15px",
                                backgroundColor: "#f8f9fa", // Light background color
                                transition: "background-color 0.3s, box-shadow 0.3s", // Smooth transition for hover effect
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#e9ecef"; // Darker background on hover
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Shadow effect on hover
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#f8f9fa"; // Reset background
                                e.currentTarget.style.boxShadow = "none"; // Reset shadow
                            }}
                        >
                            <div className="ms-2 me-auto" onClick={() => navigate('/campaignDetails', { state: { campaignKey: tx.campaign.toBase58() } })}>
                                <div className="fw-bold" style={{ fontSize: "1.1rem" }}>{tx.campaignName}</div>
                                <div style={{ color: "#6c757d" }}>Description: {shortDesc(tx.description)}</div>
                                <div style={{ fontWeight: "500" }}>Campaign Status: {tx.campaignStatus.toUpperCase()}</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: "bold" }}>Amount: {tx.amount.toNumber() / LAMPORTS_PER_SOL} SOL</div>
                                {(tx.refundStatus && (tx.campaignStatus != "completed")) && (
                                    <Button onClick={() => refundHandler(tx.campaign)} variant="danger" style={{ marginTop: "10px" }}>
                                        Refund
                                    </Button>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="text-center" style={{ marginTop: "20px", fontSize: "1.2rem", color: "#6c757d" }}>No Transaction Found</p>
            )}
        </Container>
    );
};

export default History;