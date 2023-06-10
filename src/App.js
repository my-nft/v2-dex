import Header from "./components/header/header";

import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
// import { zkSyncMainetChain } from "./web3/chain";
import { sepoliaChain } from "./web3/chain";

import {
  EthereumClient,
  w3mProvider,
  w3mConnectors,
} from "@web3modal/ethereum";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Suspense, lazy } from "react";
import { Blocks } from "react-loader-spinner";
import PageHeader from "./components/header/pageHeader";
import blueGlow from "./assets/img/circle-blue.png";
import purpleGlow from "./assets/img/circle-purple.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NetworkWarning from "./components/networkWarning/networkWarning";

const HomePage = lazy(() => import("./pages/home/home"));
const LiquidityPage = lazy(() => import("./pages/liquidity/liquidity"));

const chains = [sepoliaChain];

const projectId = "e651bebe6a2ae7105aa10f32f25adc40";
// Wagmi client
export const { provider } = configureChains(chains, [
  w3mProvider({
    projectId,
  }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  const location = useLocation();
  const [chainErrorDialogOpen, setChainErrorDialogOpen] = useState(false);
  const [chain, setChain] = useState(ethereumClient.getNetwork().chain);

  const checkChain = () => {
    const currentChain = ethereumClient.getNetwork().chain;

    if (currentChain && currentChain.id !== sepoliaChain.id) {
      setChainErrorDialogOpen(true);
    } else {
      setChainErrorDialogOpen(false);
    }
  };

  const switchChain = async (e) => {
    e.preventDefault();

    await ethereumClient
      .switchNetwork({
        chainId: sepoliaChain.id,
      })
      .then(() => {
        setChain(ethereumClient.getNetwork().chain);
      })
      .catch((err) => {
        toast.error("Failed to switch network chain to sepolia");
      });
  };

  useEffect(() => {
    checkChain();
  }, [chain]);

  useEffect(() => {
    ethereumClient.watchNetwork((chain) => {
      setChain(chain);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-pageBackground min-h-screen flex flex-col">
      <ToastContainer newestOnTop={true} limit={5} />
      <WagmiConfig client={wagmiClient}>
        {chainErrorDialogOpen && <NetworkWarning switchChain={switchChain} />}
        <Header />
        <PageHeader />
        {location.pathname === "/" && (
          <>
            <img
              src={blueGlow}
              alt=""
              className="absolute top-0 left-0 z-[5] opacity-30 w-max h-max"
            />
            <img
              src={purpleGlow}
              alt=""
              className="absolute bottom-0 right-0 z-[5] opacity-30 w-max h-max "
            />
          </>
        )}
        <Suspense
          fallback={
            <div className="mx-auto my-12">
              <Blocks visible={true} height={100} width={100} />
            </div>
          }
        >
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/liquidity" element={<LiquidityPage />} />
          </Routes>
        </Suspense>

        {/* <Footer /> */}
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeZIndex={1000000}
        themeColor="orange"
        themeMode="dark"
      />
    </div>
  );
}

export default App;
