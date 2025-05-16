import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ClaimStatus, AppState } from '../types';

interface EligibilityCheckProps {
  status: ClaimStatus;
  appState: AppState;
  onStartKyc: () => void;
  onClaim: () => void;
  onDisconnect: () => void;
}

const EligibilityCheck: React.FC<EligibilityCheckProps> = ({
  status,
  appState,
  onStartKyc,
  onClaim,
  onDisconnect
}) => {
  const { address } = useAccount();
  
  const isChecking = appState === AppState.CHECKING_ELIGIBILITY;
  const isNotEligible = appState === AppState.NOT_ELIGIBLE;
  const needsKyc = appState === AppState.ELIGIBLE_NEEDS_KYC;
  const canClaim = appState === AppState.READY_TO_CLAIM;
  const isClaiming = appState === AppState.CLAIMING;
  const claimSuccess = appState === AppState.CLAIM_SUCCESS;
  const claimError = appState === AppState.CLAIM_ERROR;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="card glow">
        {/* Connected wallet info */}
        <div className="mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Connected Wallet</p>
              <p className="font-mono text-sm text-white truncate max-w-[220px]">
                {address}
              </p>
            </div>
            <button 
              onClick={onDisconnect}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
        
        {/* Checking eligibility state */}
        {isChecking && (
          <div className="text-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-4"
            >
              <Loader2 className="h-12 w-12 text-primary-500" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">Checking Eligibility</h2>
            <p className="text-gray-400">Please wait while we verify your status...</p>
          </div>
        )}
        
        {/* Not eligible state */}
        {isNotEligible && (
          <div className="text-center py-6">
            <XCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Not Eligible</h2>
            <p className="text-gray-400 mb-6">
              Unfortunately, you are not eligible for this token airdrop.
            </p>
            <button onClick={onDisconnect} className="btn-outline">
              Disconnect Wallet
            </button>
          </div>
        )}
        
        {/* Needs KYC state */}
        {needsKyc && (
          <div className="text-center py-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-dark-400 border border-gray-700 rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold mb-2">KYC Required</h2>
                <p className="text-gray-400 mb-4">
                  You are eligible to claim {status.claimableAmount} tokens, but need to complete KYC verification first.
                </p>
                <button onClick={onStartKyc} className="btn-primary w-full">
                  Start KYC Verification
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Ready to claim state */}
        {canClaim && (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Ready to Claim</h2>
            <div className="bg-dark-400 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Claimable Amount:</span>
                <span className="font-semibold text-white">{status.claimableAmount} Tokens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">KYC Status:</span>
                <span className="text-success-500 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> Verified
                </span>
              </div>
            </div>
            <button 
              onClick={onClaim} 
              className="btn-primary w-full"
            >
              Claim Tokens
            </button>
          </div>
        )}
        
        {/* Claiming state */}
        {isClaiming && (
          <div className="text-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-4"
            >
              <Loader2 className="h-12 w-12 text-primary-500" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">Claiming Tokens</h2>
            <p className="text-gray-400">
              Processing your claim for {status.claimableAmount} tokens...
            </p>
          </div>
        )}
        
        {/* Claim success state */}
        {claimSuccess && (
          <div className="text-center py-6">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">Claim Successful!</h2>
            <p className="text-gray-400 mb-6">
              You have successfully claimed {status.claimableAmount} tokens.
            </p>
            <button onClick={onDisconnect} className="btn-outline">
              Disconnect Wallet
            </button>
          </div>
        )}
        
        {/* Claim error state */}
        {claimError && (
          <div className="text-center py-6">
            <XCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Claim Failed</h2>
            <p className="text-gray-400 mb-6">
              Something went wrong while claiming your tokens. Please try again.
            </p>
            <button onClick={onClaim} className="btn-primary w-full mb-3">
              Try Again
            </button>
            <button onClick={onDisconnect} className="btn-outline w-full">
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EligibilityCheck;