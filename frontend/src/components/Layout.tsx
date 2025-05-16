import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Coins className="h-8 w-8 text-primary-500 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                TokenDrop
              </span>
            </motion.div>
            
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              href="https://docs.base.org/tools/network-faucets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Get Test ETH
            </motion.a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </main>
      
      <footer className="w-full py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 TokenDrop. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;