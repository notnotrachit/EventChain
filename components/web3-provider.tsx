"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode} from 'react';
import { ethers, providers } from "ethers";
import Web3Modal from 'web3modal';

interface Web3ContextType {
  provider: providers.Web3Provider | null;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const web3ModalInstance = new Web3Modal({
      network: "base",
      cacheProvider: true,
    });
    setWeb3Modal(web3ModalInstance);
  }, []);

  const connectWallet = async () => {
    try {
      if (!web3Modal) return;
      const instance = await web3Modal.connect();
      const providerInstance = new ethers.providers.Web3Provider(instance);
      const signer = providerInstance.getSigner();
      const userAddress = await signer.getAddress();
      setProvider(providerInstance);
      setAddress(userAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      setProvider(null);
      setAddress(null);
    }
  };

  const value = {
    provider,
    address,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
