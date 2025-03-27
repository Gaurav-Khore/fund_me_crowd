import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletMultiButton, WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from '@solana/web3.js';
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { HeaderNavBar } from './components/navbar';
import Container from 'react-bootstrap/esm/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home } from './pages/home';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import { MyCampaign } from './pages/myCampaign'
import { CampaignDetails } from './pages/campaignDetail'
import History from './pages/history'
import { ToastContainer,Bounce } from 'react-toastify'


function App() {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = [
    new SolflareWalletAdapter()
  ]

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <HeaderNavBar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/mycampaign' element={<MyCampaign />} />
              <Route path='/campaignDetails' element={<CampaignDetails />} />
              <Route path='/history' element={<History />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
          />
          {/* <Home/> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
