import { createWeb3Modal } from '@web3modal/wagmi';
import { defaultWagmiConfig } from '@web3modal/wagmi';
import { baseSepolia } from 'viem/chains';

// 1. Define constants
export const projectId = 'a966b3b715ec63a4f05778e2a7ab3f1e'; // This is a placeholder, as we don't have a W3M project ID
const chains = [baseSepolia];

// 2. Create wagmiConfig
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'Token Airdrop Claiming',
    description: 'Claim your airdrop tokens on Base Sepolia testnet',
    url: 'https://your-website.com',
    icons: ['https://your-website.com/favicon.ico'],
  },
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7c3aed',
    '--w3m-color-fg-1': '#f9fafb',
    '--w3m-color-bg-1': '#0e0e13',
    '--w3m-color-bg-2': '#15151d',
    '--w3m-color-bg-3': '#1e1e2a',
  },
});