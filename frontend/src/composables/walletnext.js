// import { ref } from "vue";
// import { createAppKit } from "@reown/appkit/vue";
// import { polygon, mainnet } from "@reown/appkit/networks";
// import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// import { ethers } from "ethers";

// export const account = ref(null);
// export let provider = null;
// export let signer = null;

// // ---- CONFIGURE APPKIT ----
// const projectId = "c547c712dad4bf09577f87d563325201";

// const metadata = {
//   name: "CrowdFund",
//   description: "Crowdfunding Dapp",
//   url: "http://localhost:5173", // change to your domain in production
//   icons: ["https://avatars.githubusercontent.com/u/179229932"],
// };

// const networks = [mainnet, polygon];

// const wagmiAdapter = new WagmiAdapter({ projectId, networks });

// // AppKit Modal
// export const modal = createAppKit({
//   adapters: [wagmiAdapter],
//   networks,
//   projectId,
//   metadata,
//   features: { analytics: false },
// });

// // ---- WALLET FUNCTIONS ----
// export async function connectWallet() {
//   try {
//     const wallet = await modal.connect(); // returns ethers provider
//     provider = new ethers.BrowserProvider(wallet);
//     signer = await provider.getSigner();
//     account.value = await signer.getAddress();

//     // React to account/network changes
//     wallet.on("accountsChanged", (accounts) => {
//       account.value = accounts[0] || null;
//       signer = account.value ? provider.getSigner() : null;
//     });
//     wallet.on("chainChanged", () => window.location.reload());
//   } catch (err) {
//     console.error("Wallet connection error:", err);
//     provider = null;
//     signer = null;
//     account.value = null;
//   }
// }

// export function disconnectWallet() {
//   account.value = null;
//   provider = null;
//   signer = null;
//   modal.disconnect();
// }

// export async function initWallet() {
//   // only initialize if connected
//   try {
//     if (modal.client) {
//       const connected = await modal.client.isConnected();
//       if (connected) await connectWallet();
//     }
//   } catch (err) {
//     console.warn("No wallet connected yet", err);
//   }
// }

// export function getSigner() {
//   if (!signer) throw new Error("No signer available. Connect your wallet first.");
//   return signer;
// }
