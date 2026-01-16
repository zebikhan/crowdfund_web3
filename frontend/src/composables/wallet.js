// composables/wallet.js
import { ref, readonly } from "vue";
import { ethers } from "ethers";

export const account = ref(null);
export const isConnecting = ref(false);
export const isManuallyDisconnected = ref(false);

let provider = null;
let signer = null;

/**
 * Connect wallet
 * @param {boolean} forcePopup - Force MetaMask popup even if already connected
 */
export async function connectWallet(forcePopup = false) {
  if (isConnecting.value) return;

  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  isConnecting.value = true;

  try {
    // Force permission popup if requested
    if (forcePopup) {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
    }

    // Request accounts normally
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) throw new Error("No accounts found");

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    account.value = await signer.getAddress();


    // Reset manual disconnect
    isManuallyDisconnected.value = false;
    localStorage.removeItem("walletDisconnected");

    // Listen for account or chain changes
    window.ethereum.on("accountsChanged", (accs) => {
      account.value = accs[0] || null;
      if (!accs || accs.length === 0) {
        disconnectWallet();
      }
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  } catch (err) {
    console.error("Wallet connect error:", err);
    throw err;
  } finally {
    isConnecting.value = false;
  }
}

/**
 * Restore wallet if previously connected
 */
export async function initWallet() {
  if (!window.ethereum) {
    account.value = null;
    return;
  }

  if (localStorage.getItem("walletDisconnected")) {
    account.value = null;
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      account.value = accounts[0];
      console.log("Wallet connected:", account.value);
    } else {
      account.value = null;
    }
  } catch (err) {
    console.error("Failed to restore wallet:", err);
    account.value = null;
  }
}

/**
 * Disconnect wallet
 */
export function disconnectWallet() {
  account.value = null;
  provider = null;
  signer = null;
  isManuallyDisconnected.value = true;
  localStorage.setItem("walletDisconnected", "1");
  console.log("Wallet disconnected");
}

/**
 * Get provider instance
 * @returns {ethers.BrowserProvider|null}
 */
export function getProvider() {
  return provider;
}

/**
 * Get signer instance
 * @returns {ethers.JsonRpcSigner|null}
 */
export function getSigner() {
  return signer;
}

/**
 * Ensure wallet is connected; if not, trigger popup
 */
export async function ensureWalletConnected() {
  if (!account.value) {
    try {
      await connectWallet(true);
    } catch (err) {
      throw new Error("Wallet connection required");
    }
  }
}

// Expose readonly account for safe usage in components
export const reactiveAccount = readonly(account);
