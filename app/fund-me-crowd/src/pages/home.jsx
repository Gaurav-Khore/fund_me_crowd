import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { HeaderNavBar } from '../components/navbar';
import { useEffect, useState } from 'react';
import { AllCampaignPda, getProgram, TreasuryAccount } from '../anchor/setup';
import { GridViewCampaign } from '../components/gridView';
import { getCampaign } from '../utils';
import { ToastErrorNotification, ToastSuccessNotification } from '../components/notification';
import { Spinner, Container } from 'react-bootstrap';

export const Home = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet } = useWallet();
    const [allCampaignData, setAllCampaignData] = useState();
    const [userActiveCampaignList, setUserActiveCampaignList] = useState();
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (!publicKey) {
            ToastErrorNotification('Wallet is not connected..');
            return;
        }

        const program = getProgram(wallet);
        const allCampaignPDA = AllCampaignPda(program);
        const treasuryPDA = TreasuryAccount(program);

        const fetchAllCampaign = async () => {
            setLoading(true); // Start loading
            try {
                const fetchedData = await connection.getAccountInfo(allCampaignPDA);
                const decodeData = program.coder.accounts.decode("allCampaign", fetchedData.data);
                setAllCampaignData(decodeData);

                const activeCampaignList = [];
                for (let i = 0; i < decodeData.campaignList.length; i++) {
                    const campData = await getCampaign(program, decodeData.campaignList[i], connection);
                    if ((campData.duration.toNumber() * 1000) >= Date.now() && !(("inActive" in campData.status) || ("completed" in campData.status))) {
                        activeCampaignList.push(campData);
                    }
                }
                setUserActiveCampaignList(activeCampaignList);
                ToastSuccessNotification("Campaigns Updated...");
            } catch (error) {
                console.error("Error fetching all campaign data:", error);
                ToastErrorNotification("Failed to fetch campaign data.");
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchAllCampaign();
    }, [publicKey, connection, wallet]);

    return (
        <div>
            <Container style={{ padding: "20px" }}>
                {loading ? (
                    <div className="text-center" style={{ marginTop: "50px" }}>
                        <Spinner animation="border" variant="primary" />
                        <p>Loading campaigns...</p>
                    </div>
                ) : (
                    <div>
                        {allCampaignData && (
                            <GridViewCampaign heading="Campaigns" campaignList={userActiveCampaignList} fundButton={true} createTierButton={false} deleteButton={false}/>
                        )}
                        {!allCampaignData && (
                            <div className="text-center" style={{ marginTop: "20px", fontSize: "1.2rem", color: "#6c757d" }}>
                                No campaigns available.
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
}