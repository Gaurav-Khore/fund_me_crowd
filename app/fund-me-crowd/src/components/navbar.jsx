import * as walletAdapter from "@solana/wallet-adapter-react-ui";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import "@solana/wallet-adapter-react-ui/styles.css";

export const HeaderNavBar = () => {
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#512da8', color: 'white' }}>
            <Container>
                <Navbar.Brand href="#home" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>
                    Fund Me Crowd
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            onClick={() => navigate('/')} 
                            style={{ color: 'white', marginRight: '15px' }} 
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffcc00'} 
                            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link 
                            onClick={() => navigate('/mycampaign')} 
                            style={{ color: 'white', marginRight: '15px' }} 
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffcc00'} 
                            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        >
                            My Campaigns
                        </Nav.Link>
                        <Nav.Link 
                            onClick={() => navigate('/history')} 
                            style={{ color: 'white', marginRight: '15px' }} 
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffcc00'} 
                            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        >
                            History
                        </Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <walletAdapter.WalletMultiButton 
                            style={{ backgroundColor: '#ffcc00', border: 'none', color: '#000' }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6b800'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffcc00'} 
                        />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}