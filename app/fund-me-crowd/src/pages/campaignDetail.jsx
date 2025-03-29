import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCampaign, getCampaignTxList, onChainErrorMessage, shortDesc } from "../utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CampaignTxPda, getProgram, TreasuryAccount } from "../anchor/setup";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Container, Card, Button, Modal, Form, ListGroup, Row, Col, ProgressBar, Image } from "react-bootstrap";
import { BN } from "@coral-xyz/anchor";
import { TierList } from "../components/tiersList";
import { ToastErrorNotification, ToastSuccessNotification } from "../components/notification";
import addImg from "../assets/add.png";

export const CampaignDetails = () => {
    const location = useLocation();
    const { connection } = useConnection();
    const { publicKey, wallet, sendTransaction } = useWallet();

    const [campaignData, setCampaignData] = useState();
    const [campaignTxList, setCampaignTxList] = useState([]);
    const [owner, setOwner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [tierName, setTierName] = useState("");
    const [tierAmount, setTierAmount] = useState("");
    const [endDate, setEndDate] = useState("");
    const [campaignStatus, setCampaignStatus] = useState("");

    useEffect(() => {
        if (!publicKey) {
            ToastErrorNotification('Wallet is not connected..');
            return;
        }
        const program = getProgram(wallet);
        const getCampaignDetails = async () => {
            const campaignKey = location.state?.campaignKey;
            const campKey = new PublicKey(campaignKey);
            const campaign = await getCampaign(program, campKey, connection);
            const date = new Date(campaign.duration.toNumber() * 1000);
            setEndDate(date.toDateString().substring(date.toDateString().indexOf(" ") + 1));
            const formattedParagraph = campaign.description
                ? campaign.description.split('\n').map((line, index) => (
                    <span key={index}>
                        {line}
                        {index < campaign.description.split('\n').length - 1 && <br />}
                    </span>
                ))
                : "No description available";
            console.log("Formatted data", formattedParagraph);
            campaign.description = formattedParagraph;
            setCampaignData(campaign);

            // if (campaign.currentAmount.toNumber() === campaign.goalAmount.toNumber()) {
            //     setCampaignStatus("Successful");
            // } else if ((campaign.duration.toNumber() * 1000) <= Date.now()) {
            //     setCampaignStatus(campaign.currentAmount.toNumber() === campaign.goalAmount.toNumber() ? "Failed" : "Inactive");
            // } else {
            //     setCampaignStatus("Active");
            // }

            const campStatus = Object.keys(campaign.status)[0];
            setCampaignStatus(
                campStatus === "completed" ? "Completed" :
                    (campStatus === "successful" ? "Successful" :
                        (campStatus === "failed" ? "Failed" :
                            (campStatus === "active" ? "Active" : "Inactive")
                        )
                    )
            );

            if (campaign.owner.toBase58() === publicKey.toBase58()) {
                setOwner(true);
                const campaignTxPda = CampaignTxPda(program, campKey);
                const campaignList = await getCampaignTxList(program, campaignTxPda, connection);
                setCampaignTxList(campaignList);
            }
        }
        getCampaignDetails();
    }, [wallet, publicKey, connection]);


    //subscribing to Campaign Account Changes
    const campaignSubscription = async (campaignAccount, program) => {
        const subscriptionId = connection.onAccountChange(
            campaignAccount,
            async (accountInfo) => {
                const decodeData = program.coder.accounts.decode(
                    "campaignAccount",
                    accountInfo.data
                );
                console.log(decodeData);
                decodeData.campaignKey = campaignAccount;
                setCampaignData(decodeData);

                const campStatus = Object.keys(decodeData.status)[0];
                setCampaignStatus(
                    campStatus === "completed" ? "Completed" :
                        (campStatus === "successful" ? "Successful" :
                            (campStatus === "failed" ? "Failed" :
                                (campStatus === "active" ? "Active" : "Inactive")
                            )
                        )
                );
            }
        );
        return () => {
            connection.removeAccountChangeListener(subscriptionId);

        };

    }

    const CreateTierHandler = (e) => {
        e.preventDefault();
        const program = getProgram(wallet);
        const campaignAccount = new PublicKey(location.state?.campaignKey);
        const createTier = async () => {
            const tierCreate = await program.methods.tierCreate(tierName, new BN(tierAmount * LAMPORTS_PER_SOL)).accounts({
                campaignAccount: campaignAccount,
                owner: publicKey
            }).transaction();

            tierCreate.feePayer = publicKey;
            const simulateTx = await connection.simulateTransaction(tierCreate);
            if (simulateTx.value.err) {
                const errMsg = onChainErrorMessage(program, simulateTx.value.err.InstructionError);
                ToastErrorNotification(errMsg);
                return;
            }

            try {
                const sendtx = await sendTransaction(tierCreate, connection);
                ToastSuccessNotification("Tier Created Successfully..");
            } catch (error) {
                ToastErrorNotification("Failed to Create the tier..");
            }
        }
        createTier();
        handleClose();
        campaignSubscription(campaignAccount, program);
        setTierAmount("");
        setTierName("");
    }

    const WithdrawFundHandler = async () => {
        const program = getProgram(wallet);
        const treasuryAccountPda = TreasuryAccount(program);
        const campaignAccount = new PublicKey(location.state?.campaignKey);
        const withdrawTx = await program.methods.withdrawCampaign().accounts({
            campaignAccount: campaignAccount,
            treasuryAccount: treasuryAccountPda,
            owner: publicKey
        }).transaction();

        withdrawTx.feePayer = publicKey;
        const simulateTx = await connection.simulateTransaction(withdrawTx);
        if (simulateTx.value.err) {
            const errMsg = onChainErrorMessage(program, simulateTx.value.err.InstructionError);
            if (errMsg == "CampaignInActive") {
                ToastErrorNotification("Unable to withdraw. Campaign should be successful.");
            }
            else {
                ToastErrorNotification(errMsg);
            }
            return;
        }
        try {
            const sendTx = await sendTransaction(withdrawTx, connection);
            ToastSuccessNotification("Fund Withdraw Successfully..");
        } catch (error) {
            ToastErrorNotification("Failed to Withdraw Fund..");
        }

        campaignSubscription(campaignAccount, program);

    }

    return (
        <div>
            {campaignData && (
                <Container style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                        <h2 style={{ color: "#512da8" }}>{campaignData.name}</h2>
                    </div>
                    <Row>
                        <Image src={campaignData.imageUrl} style={{ height: "50vh", borderRadius: "10px", objectFit: "cover" }} />
                    </Row>
                    <Row style={{ paddingTop: 10 }}>
                        <Card style={{ border: "none", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                            <Card.Body>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Card.Title style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{campaignData.name}</Card.Title>
                                            <Card.Text style={{
                                                whiteSpace: 'pre-wrap',
                                                maxHeight: '7.5em',
                                                overflowY: 'auto',
                                                lineHeight: '1.5em',
                                            }}>{campaignData.description}</Card.Text>
                                            <Card.Text><strong>Goal:</strong> {campaignData.goalAmount.toNumber() / LAMPORTS_PER_SOL} SOL</Card.Text>
                                            <Card.Text><strong>Current Amount:</strong> {campaignData.currentAmount.toNumber() / LAMPORTS_PER_SOL} SOL</Card.Text>
                                            <Card.Text><strong>End Date:</strong> {endDate}</Card.Text>
                                            <Card.Text><strong>Status:</strong> <span style={{ color: ((campaignStatus === "Successful") || (campaignStatus === "Completed")) ? "green" : campaignStatus === "Failed" ? "red" : "orange" }}>{campaignStatus}</span></Card.Text>
                                        </Col>
                                        <Col style={{ display: "flex", flexDirection: "column", alignContent: "space-evenly" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <Card.Text><strong>Tiers:</strong></Card.Text>
                                                {owner && <Button onClick={handleShow} style={{ backgroundColor: "transparent", border: "none" }}><img src={addImg} alt="Add Tier" style={{ width: "30px", height: "30px" }} /></Button>}
                                            </div>
                                            <Row style={{ paddingTop: "10px" }}>
                                                {campaignData.tiers.length > 0 ? (
                                                    <TierList tiers={campaignData.tiers} campaignAccount={campaignData.campaignKey} campaignOwner={campaignData.owner} isOwner={owner} setTxList={setCampaignTxList} setCampaign={setCampaignData} />
                                                ) : (
                                                    <p>No Tier Found</p>
                                                )}
                                            </Row>
                                            <div style={{ paddingTop: "10px" }}>
                                                <ProgressBar now={(campaignData.currentAmount.toNumber() / campaignData.goalAmount.toNumber()) * 100} label={`${(campaignData.currentAmount.toNumber() / campaignData.goalAmount.toNumber()) * 100}%`} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Row>
                    {owner && (
                        <Button onClick={WithdrawFundHandler} style={{ position: "fixed", zIndex: 9, bottom: "5%", right: "2%", backgroundColor: "#512da8", border: "none", borderRadius: "5px" }}>Withdraw Fund</Button>
                    )}
                    {owner && (
                        <div style={{ paddingTop: "20px" }}>
                            <h5 className="text-center mb-4">Transaction History</h5>
                            {campaignTxList.transactionList && campaignTxList.transactionList.length > 0 ? (
                                <ListGroup>
                                    {campaignTxList.transactionList.map((tx, index) => (
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
                                            {tx.amount.toNumber() > 0 ? (
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold">{tx.backer.toBase58()}</div>
                                                    <div style={{ color: "#6c757d" }}>Amount: {tx.amount.toNumber() / LAMPORTS_PER_SOL} SOL</div>
                                                </div>
                                            ) : null}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-center" style={{ marginTop: "20px", fontSize: "1.2rem", color: "#6c757d" }}>No Transaction Found</p>
                            )}
                        </div>
                    )}
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Tier</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={CreateTierHandler} >
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter tier name"
                                        value={tierName}
                                        onChange={(e) => { setTierName(e.target.value) }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Donation Amount (SOL)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter amount"
                                        value={tierAmount}
                                        onChange={(e) => { setTierAmount(e.target.value) }}
                                        required
                                        min={0}
                                        step={0.1}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            )}
        </div>
    );
}