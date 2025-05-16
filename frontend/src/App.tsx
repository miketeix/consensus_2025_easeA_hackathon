import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ClaimStatus, AppState, ForteKYCSuccessEvent } from './types';
import { checkEligibility, claimTokens } from './utils/helpers';
import Layout from './components/Layout';
import ConnectWallet from './components/ConnectWallet';
import EligibilityCheck from './components/EligibilityCheck';
import KYCProcess from './components/KYCProcess';

// Declare forte global for TypeScript
declare global {
  interface Window {
    forte: {
      initKYC: (config: any) => void;
    };
  }
}

function App() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [appState, setAppState] = useState<AppState>(AppState.DISCONNECTED);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>({
    isEligible: false,
    hasTokens: false,
    isKycApproved: false,
    claimableAmount: '0',
  });
  
  // Handle wallet connection
  const handleConnect = async () => {
    if (isConnected && address) {
      setAppState(AppState.CHECKING_ELIGIBILITY);
      await checkClaimEligibility(address);
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnect();
    setAppState(AppState.DISCONNECTED);
    setClaimStatus({
      isEligible: false,
      hasTokens: false,
      isKycApproved: false,
      claimableAmount: '0',
    });
  };
  
  // Check if the user is eligible to claim tokens
  const checkClaimEligibility = async (walletAddress: string) => {
    try {
      setAppState(AppState.CHECKING_ELIGIBILITY);
      
      const eligibility = await checkEligibility(walletAddress);
      setClaimStatus(eligibility);
      
      if (!eligibility.isEligible || !eligibility.hasTokens) {
        setAppState(AppState.NOT_ELIGIBLE);
      } else if (!eligibility.isKycApproved) {
        setAppState(AppState.ELIGIBLE_NEEDS_KYC);
      } else {
        setAppState(AppState.READY_TO_CLAIM);
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setAppState(AppState.NOT_ELIGIBLE);
    }
  };
  
  // Start KYC process
  const handleStartKyc = () => {
    setAppState(AppState.KYC_IN_PROGRESS);
  };
  
  // KYC success handler
  const handleKycSuccess = (event: ForteKYCSuccessEvent) => {
    console.log('KYC Success Event:', event.detail);
    
    // Update claim status with KYC approval
    setClaimStatus(prev => ({
      ...prev,
      isKycApproved: true,
    }));
    
    // Move to ready to claim state
    setAppState(AppState.READY_TO_CLAIM);
  };
  
  // Handle claim token action
  const handleClaim = async () => {
    if (!address) return;
    
    try {
      setAppState(AppState.CLAIMING);
      
      const success = await claimTokens(address, claimStatus.claimableAmount);
      
      if (success) {
        setAppState(AppState.CLAIM_SUCCESS);
      } else {
        setAppState(AppState.CLAIM_ERROR);
      }
    } catch (error) {
      console.error('Error claiming tokens:', error);
      setAppState(AppState.CLAIM_ERROR);
    }
  };
  
  // Check eligibility when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      handleConnect();
    } else {
      setAppState(AppState.DISCONNECTED);
    }
  }, [isConnected, address]);
  
  // Render the appropriate UI based on app state
  const renderContent = () => {
    if (!isConnected || appState === AppState.DISCONNECTED) {
      return <ConnectWallet onConnect={handleConnect} />;
    }
    
    if (appState === AppState.KYC_IN_PROGRESS) {
      return (
        <KYCProcess 
          userId={address || ''}
          onBack={() => setAppState(AppState.ELIGIBLE_NEEDS_KYC)}
          onKycSuccess={handleKycSuccess}
        />
      );
    }
    
    return (
      <EligibilityCheck 
        status={claimStatus}
        appState={appState}
        onStartKyc={handleStartKyc}
        onClaim={handleClaim}
        onDisconnect={handleDisconnect}
      />
    );
  };
  
  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}

export default App;