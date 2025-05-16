export interface ClaimStatus {
  isEligible: boolean;
  hasTokens: boolean;
  isKycApproved: boolean;
  claimableAmount: string;
}

export enum AppState {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  CHECKING_ELIGIBILITY = 'checking_eligibility',
  NOT_ELIGIBLE = 'not_eligible',
  ELIGIBLE_NEEDS_KYC = 'eligible_needs_kyc',
  KYC_IN_PROGRESS = 'kyc_in_progress',
  READY_TO_CLAIM = 'ready_to_claim',
  CLAIMING = 'claiming',
  CLAIM_SUCCESS = 'claim_success',
  CLAIM_ERROR = 'claim_error',
}

export interface ForteKYCSuccessEvent extends CustomEvent {
  detail: {
    userId: string;
    level: number;
    timestamp: number;
  };
}

// Mock response for eligibility check
export interface EligibilityResponse {
  isEligible: boolean;
  hasTokens: boolean;
  isKycApproved: boolean;
  claimableAmount: string;
}