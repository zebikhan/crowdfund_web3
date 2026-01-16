# Full Crowdfunding DApp (Hardhat + Vue3 + Tailwind + Ethers)

## What is included
- smart-contracts/: Hardhat project with Solidity contract `CrowdFundDirect.sol`
- frontend/: Vue3 + Vite frontend with TailwindCSS and ethers v6 integration
- Create campaign, list campaigns, campaign detail and contribute flow (direct-send to creator)
- README and env examples

## Quick local run

### 1) Smart contracts (local)
Terminal A:
  cd smart-contracts
  npm install
  npx hardhat node

Terminal B:
  cd smart-contracts
  npx hardhat run scripts/deploy.js --network localhost

Copy deployed address from Terminal B.

### 2) Frontend
  cd frontend
  npm install
  # add frontend/.env with VITE_CONTRACT_ADDRESS and VITE_RPC_READ (optional)
  npm run dev
  open http://localhost:5173

## Notes
- This project uses direct-forwarding of funds to campaign owner (no refunds).
- After deployment copy ABI from hardhat artifacts to frontend/src/utils/CrowdFundDirectABI.json
