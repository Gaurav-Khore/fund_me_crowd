import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { AllCampaignPda, CampaignTxPda, getProgram, UserCampaignPda } from '../anchor/setup';
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { GridViewCampaign } from "../components/gridView";
import { Button, Form, Modal, Tab, Nav, Row, Col, Container } from "react-bootstrap";
import { getCampaign, onChainErrorMessage } from "../utils";
import { ToastErrorNotification, ToastSuccessNotification } from "../components/notification";

export const MyCampaign = () => {
    const { connection } = useConnection();
    const { publicKey, wallet, sendTransaction } = useWallet();
    const [createCampaignPopup, setCreateCampaignPopup] = useState(false);
    const handleShow = () => setCreateCampaignPopup(true);
    const handleClose = () => setCreateCampaignPopup(false);
    const [campaignName, setCampaignName] = useState("");
    const [campaignDescription, setCampaignDescription] = useState("");
    const [campaignImg, setCampaignImg] = useState("");
    const [campaignGoalAmt, setCampaignGoalAmt] = useState("");
    const [campaignDuration, setCampaignDuration] = useState("");

    const [userActiveCampaignList, setUserActiveCampaignList] = useState([]);
    const [userInActiveCampaignList, setUserInActiveCampaignList] = useState([]);
    const [userCompletedCampaignList, setUserCompletedCampaignList] = useState([]);

    useEffect(() => {
        if (!publicKey) {
            ToastErrorNotification('Wallet is not connected..');
            return;
        }

        const program = getProgram(wallet);
        const userCampaignPda = UserCampaignPda(program, publicKey);

        const fetchUserCampaignData = async () => {
            try {
                const accountData = await connection.getAccountInfo(userCampaignPda);
                const decodedData = program.coder.accounts.decode("userCampaign", accountData.data);
                const activeCampaignList = [];
                const inActiveCampaignList = [];
                const completedCampaignList = [];

                for (let i = 0; i < decodedData.campaigns.length; i++) {
                    const campData = await getCampaign(program, decodedData.campaigns[i], connection);
                    console.log(campData.duration.toNumber());
                    console.log(Date.now());
                    if (("inActive" in campData.status) || ("completed" in campData.status)) {
                        completedCampaignList.push(campData);
                    } else if ((campData.duration.toNumber() * 1000) >= Date.now()) {
                        activeCampaignList.push(campData);
                    } else {
                        inActiveCampaignList.push(campData);
                    }
                }

                setUserActiveCampaignList(activeCampaignList);
                setUserInActiveCampaignList(inActiveCampaignList);
                setUserCompletedCampaignList(completedCampaignList);
            } catch (error) {
                console.log("Error while fetching user Campaign Data = ", error);
            }
        }

        fetchUserCampaignData();
    }, [connection, publicKey, wallet]);

    const CreateCampaignHandler = async (e) => {
        e.preventDefault();
        setCreateCampaignPopup(false);

        const program = getProgram(wallet);
        const campaignKey = Keypair.generate();
        const campaignTxAcctPda = CampaignTxPda(program, campaignKey.publicKey);
        const userCampaignPda = UserCampaignPda(program, publicKey);
        const allCampaignPDA = AllCampaignPda(program);

        const initializeCampaign = async () => {
            const tx = await program.methods.initializeCampaign(
                campaignName,
                campaignDescription,
                new BN(campaignGoalAmt * LAMPORTS_PER_SOL),
                new BN(campaignDuration),
                campaignImg
            ).accounts({
                allCampaignAccount: allCampaignPDA,
                campaignAccount: campaignKey.publicKey,
                campaignTransaction: campaignTxAcctPda,
                userCampaignAccount: userCampaignPda,
                payer: publicKey,
                systemProgram: SystemProgram.programId
            }).transaction();

            tx.feePayer = publicKey;
            const simulateTx = await connection.simulateTransaction(tx);
            if (simulateTx.value.err) {
                const errMsg = onChainErrorMessage(program, simulateTx.value.err.InstructionError);
                ToastErrorNotification(errMsg);
                return;
            }

            try {
                const sendTx = await sendTransaction(tx, connection, { signers: [campaignKey] });
                ToastSuccessNotification("Campaign Created Successfully..");
            } catch (error) {
                ToastErrorNotification("Failed to Create Campaign..");
            }

            setCampaignName("");
            setCampaignDescription("");
            setCampaignImg("");
            setCampaignGoalAmt("");
            setCampaignDuration("");
        }
        initializeCampaign();

        //subscribe to userCampaign Account changes
        const subscription = connection.onAccountChange(
            userCampaignPda,
            async (accountInfo) => {
                const decodeData = program.coder.accounts.decode(
                    "userCampaign",
                    accountInfo.data
                );
                const activeCampaignList = [];
                const inActiveCampaignList = [];
                const completedCampaignList = [];
                for (let i = 0; i < decodeData.campaigns.length; i++) {
                    const campData = await getCampaign(program, decodeData.campaigns[i], connection);

                    if (("inActive" in campData.status) && ("completed" in campData.status)) {
                        completedCampaignList.push(campData);
                    } else if ((campData.duration.toNumber() * 1000) >= Date.now()) {
                        activeCampaignList.push(campData);
                    } else {
                        inActiveCampaignList.push(campData);
                    }
                }

                setUserActiveCampaignList(activeCampaignList);
                setUserInActiveCampaignList(inActiveCampaignList);
                setUserCompletedCampaignList(completedCampaignList);

            }
        );

        return () => {
            connection.removeAccountChangeListener(subscription);
        }
    }

    return (
        <Container style={{ padding: "20px" }}>
            <Button onClick={handleShow} style={{ position: "fixed", zIndex: 9, bottom: "5%", right: "2%", backgroundColor: "#512da8", color: "#fff", border: "none", borderRadius: "5px" }}>
                Create Campaign
            </Button>
            <Tab.Container id="left-tabs-example" defaultActiveKey="Active">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="Active" style={{ fontWeight: "bold" }}>Active</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Failed" style={{ fontWeight: "bold" }}>Failed</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="History" style={{ fontWeight: "bold" }}>History</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="Active">
                                <GridViewCampaign heading="Active Campaign" campaignList={userActiveCampaignList} deleteButton={true} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="Failed">
                                <GridViewCampaign heading="Failed Campaign" campaignList={userInActiveCampaignList} deleteButton={true} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="History">
                                <GridViewCampaign heading="History" campaignList={userCompletedCampaignList} deleteButton={false} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>

            <Modal show={createCampaignPopup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Campaign</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={CreateCampaignHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Campaign Name"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Campaign Description"
                                value={campaignDescription}
                                onChange={(e) => setCampaignDescription(e.target.value)}
                                required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Campaign Image URL"
                                value={campaignImg}
                                onChange={(e) => setCampaignImg(e.target.value)}
                                required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Goal Amount (SOL)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Campaign Goal Amount"
                                value={campaignGoalAmt}
                                onChange={(e) => setCampaignGoalAmt(e.target.value)}
                                min={1}
                                step={0.1}
                                required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration (in days)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Campaign Duration"
                                value={campaignDuration}
                                onChange={(e) => setCampaignDuration(e.target.value)}
                                min={1}
                                step={1}
                                required />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ width: "100%" }}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}