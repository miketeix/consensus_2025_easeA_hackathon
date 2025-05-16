import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { loadForteScript, initForteKYC } from '../utils/helpers';
import { ForteKYCSuccessEvent } from '../types';

interface KYCProcessProps {
  userId: string;
  onBack: () => void;
  onKycSuccess: (event: ForteKYCSuccessEvent) => void;
}

const KYCProcess: React.FC<KYCProcessProps> = ({ userId, onBack, onKycSuccess }) => {
  const kycContainerId = 'forte-kyc-container';
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    const initKyc = async () => {
      if (isInitializedRef.current) return;
      
      try {
        // Load the Forte script
        await loadForteScript();
        
        // Initialize the KYC widget
        initForteKYC(userId, kycContainerId);
        
        isInitializedRef.current = true;
        
        // Add event listener for KYC success
        window.addEventListener('ForteKYCSuccess', onKycSuccess as EventListener);
      } catch (error) {
        console.error('Failed to initialize KYC:', error);
      }
    };
    
    initKyc();
    
    // Cleanup
    return () => {
      window.removeEventListener('ForteKYCSuccess', onKycSuccess as EventListener);
    };
  }, [userId, onKycSuccess]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="card glow">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-dark-200 rounded-full transition-colors mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">KYC Verification</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-400 mb-4">
            Complete the verification process below to claim your tokens. This will only take a few minutes.
          </p>
        </div>
        
        <div id={kycContainerId} className="w-full min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-4"
            >
              <Loader2 className="h-8 w-8 text-primary-500" />
            </motion.div>
            <p className="text-gray-400">Loading KYC verification...</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KYCProcess;