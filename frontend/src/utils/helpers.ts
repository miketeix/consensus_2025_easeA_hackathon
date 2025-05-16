import { EligibilityResponse } from '../types';

// This would typically be an API call to your backend
export const checkEligibility = async (address: string): Promise<EligibilityResponse> => {
  // For demo purposes, we're using a deterministic approach based on the address
  // In a real implementation, this would be a call to your backend or smart contract
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get last 4 chars of address to create deterministic conditions
  const lastFourChars = address.slice(-4).toLowerCase();
  const hasEvenHexChars = lastFourChars.split('').some(char => {
    const hexValue = parseInt(char, 16);
    return hexValue !== NaN && hexValue % 2 === 0;
  });
  
  // Address with any even hex digits in last 4 chars are eligible
  const isEligible = hasEvenHexChars;
  
  // KYC status - this would come from your backend in real implementation
  // For demo: addresses ending with 'a' through 'f' need KYC, others are pre-approved
  const lastChar = address.slice(-1).toLowerCase();
  const needsKyc = lastChar >= 'a' && lastChar <= 'f';
  
  return {
    isEligible,
    hasTokens: isEligible, // If eligible, they have tokens
    isKycApproved: isEligible && !needsKyc,
    claimableAmount: isEligible ? '1000.00' : '0',
  };
};

// Load the Forte KYC script
export const loadForteScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.getElementById('forte-kyc-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'forte-kyc-script';
    script.src = 'https://cdn.forte.io/js/kyc-widget.js'; // This is a placeholder URL
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Forte KYC script'));
    
    document.head.appendChild(script);
  });
};

// Initialize Forte KYC widget
export const initForteKYC = (userId: string, containerId: string): void => {
  // This is a mock implementation, as we don't have the actual Forte API
  // In a real implementation, you would use the Forte SDK here
  
  // Mock the Forte SDK
  if (typeof window.forte === 'undefined') {
    window.forte = {
      initKYC: (config: any) => {
        console.log('Initializing Forte KYC with config:', config);
        
        // Create mock KYC UI
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = `
            <div class="forte-mock p-6 rounded-lg bg-dark-200 border border-gray-700">
              <h3 class="text-lg font-semibold mb-4">KYC Verification (Mock)</h3>
              <p class="mb-4">This is a mock KYC verification process for demonstration purposes.</p>
              <form id="mock-kyc-form" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" class="w-full px-3 py-2 bg-dark-100 border border-gray-700 rounded-md" placeholder="John Doe" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Email</label>
                  <input type="email" class="w-full px-3 py-2 bg-dark-100 border border-gray-700 rounded-md" placeholder="john@example.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Date of Birth</label>
                  <input type="date" class="w-full px-3 py-2 bg-dark-100 border border-gray-700 rounded-md" />
                </div>
                <button 
                  type="button" 
                  id="mock-kyc-submit"
                  class="w-full btn-primary"
                >
                  Submit KYC Information
                </button>
              </form>
            </div>
          `;
          
          // Add event listener to mock submit button
          setTimeout(() => {
            const submitBtn = document.getElementById('mock-kyc-submit');
            if (submitBtn) {
              submitBtn.addEventListener('click', () => {
                // Simulate KYC processing
                submitBtn.textContent = 'Processing...';
                submitBtn.classList.add('opacity-70');
                
                // Simulate KYC success after 2 seconds
                setTimeout(() => {
                  // Dispatch mock ForteKYCSuccess event
                  const kycSuccessEvent = new CustomEvent('ForteKYCSuccess', {
                    detail: {
                      userId,
                      level: 1,
                      timestamp: Date.now(),
                    }
                  });
                  
                  window.dispatchEvent(kycSuccessEvent);
                }, 2000);
              });
            }
          }, 0);
        }
      }
    };
  }
  
  // Initialize the KYC widget
  window.forte.initKYC({
    containerId,
    userId,
    level: 1,
    onSuccess: (data: any) => {
      console.log('KYC Success:', data);
      
      // Dispatch ForteKYCSuccess event
      const kycSuccessEvent = new CustomEvent('ForteKYCSuccess', {
        detail: {
          userId,
          level: 1,
          timestamp: Date.now(),
        }
      });
      
      window.dispatchEvent(kycSuccessEvent);
    },
    onError: (error: any) => {
      console.error('KYC Error:', error);
    }
  });
};

// Mock function to simulate claiming tokens
export const claimTokens = async (address: string, amount: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would call your smart contract
  console.log(`Claiming ${amount} tokens for ${address}`);
  
  // 95% success rate for the demo
  return Math.random() > 0.05;
};