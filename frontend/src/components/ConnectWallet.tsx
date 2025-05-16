import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

interface ConnectWalletProps {
  onConnect: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount({
    onConnect: () => {
      onConnect();
    },
  });

  // Don't render if already connected
  if (isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="card glow">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-dark-200 border border-gray-700 mb-4"
          >
            <Wallet className="h-10 w-10 text-primary-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-1">Token Airdrop Claim</h1>
          <p className="text-gray-400 mb-6">Connect your wallet to check eligibility</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => open()}
          className="btn-primary w-full"
        >
          Connect Wallet
        </motion.button>
        
        <div className="mt-5 text-center text-sm text-gray-500">
          <p>Connect to the Base Sepolia testnet to check if you're eligible for the token airdrop</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectWallet;