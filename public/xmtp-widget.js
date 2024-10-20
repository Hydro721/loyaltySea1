import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

// Configure chains & providers with the Alchemy provider.
const chains = [mainnet, polygon, optimism, arbitrum];

// Set up Web3Modal
const projectId = 'YOUR_PROJECT_ID'; // Replace with your actual project ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// XMTP Client setup
let xmtp;

async function setupXmtp() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  xmtp = await Client.create(signer, { env: 'production' });
}

// Initialize Web3Modal
const web3Modal = new Web3Modal({ projectId }, ethereumClient);

// Render the XMTP widget
function renderXmtpWidget() {
  const container = document.getElementById('xmtp-widget-container');
  container.innerHTML = `
    <div id="xmtp-widget">
      <button id="connect-wallet">Connect Wallet</button>
      <div id="xmtp-chat" style="display: none;">
        <!-- Add your chat UI here -->
      </div>
    </div>
  `;

  document.getElementById('connect-wallet').addEventListener('click', async () => {
    await web3Modal.openModal();
    await setupXmtp();
    document.getElementById('xmtp-chat').style.display = 'block';
    // Implement your chat functionality here
  });
}

// Call this function when the page loads
window.addEventListener('load', renderXmtpWidget);
