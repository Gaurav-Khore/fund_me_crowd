import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { getProgram } from "../anchor/setup";
import { getCampaign, onChainErrorMessage, shortDesc } from "../utils";
import { Container, Row, Col, Card, Button, ProgressBar } from "react-bootstrap";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import { ToastErrorNotification, ToastSuccessNotification } from "./notification";

export const GridViewCampaign = (props) => {
    const navigate = useNavigate();
    const { publicKey, wallet, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const deleteCampaign = async (campaignKey) => {
        const program = await getProgram(wallet);
        const tx = await program.methods.deleteCampaign().accounts({
            campaignAccount: campaignKey,
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
            ToastSuccessNotification("Campaign Deleted Successfully..");
        } catch (error) {
            ToastErrorNotification("Failed to delete the campaign..");
        }
    }

    return (
        <Container>
            <h2 className="text-center mt-4" style={{ color: "#512da8", fontWeight: "bold" }}>{props.heading}</h2>
            {
                props.campaignList && props.campaignList.length > 0 ? (
                    <Row>
                        {
                            props.campaignList.map((campaign, index) => (
                                <Col key={index} md={4} lg={3} sm={6} className="mb-4">
                                    <Card className="campaign-card" style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                        <Card.Img variant="top" src={campaign.imageUrl} style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px", height: "200px", objectFit: "cover" }} />
                                        <Card.Body onClick={() => {
                                            navigate('/campaignDetails', { state: { campaignKey: campaign.campaignKey.toBase58() } });
                                        }} style={{ cursor: "pointer" }}>
                                            <Card.Title style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#512da8" }}>{campaign.name}</Card.Title>
                                            <Card.Text>{shortDesc(campaign.description)}</Card.Text>
                                            <Card.Text><strong>Goal:</strong> {campaign.goalAmount.toNumber() / LAMPORTS_PER_SOL} SOL</Card.Text>
                                            <Card.Text><strong>Current Amount:</strong> {campaign.currentAmount.toNumber() / LAMPORTS_PER_SOL} SOL</Card.Text>
                                            <ProgressBar now={(campaign.currentAmount.toNumber() / campaign.goalAmount.toNumber()) * 100} label={`${(campaign.currentAmount.toNumber() / campaign.goalAmount.toNumber()) * 100}%`} />
                                        </Card.Body>
                                        {
                                            props.deleteButton && 
                                            <Card.Footer style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #e0e0e0", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}>
                                                <Button onClick={() => deleteCampaign(campaign.campaignKey)} style={{ backgroundColor: "#dc3545", border: "none", width: "100%" }}>Delete</Button>
                                            </Card.Footer>
                                        }
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                ) : (
                    <p className="text-center" style={{ marginTop: "20px", fontSize: "1.2rem", color: "#6c757d" }}>No Data Found</p>
                )
            }
        </Container>
    );
}