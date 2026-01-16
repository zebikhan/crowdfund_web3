<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 py-10 font-inter">

    <!-- LEFT -->
    <div class="lg:col-span-2 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">

      <!-- Banner -->
      <div class="rounded-xl overflow-hidden border bg-slate-100">
        <img v-if="campaign.image" :src="campaign.image" class="w-full h-72 object-cover" />
        <div v-else class="h-72 flex items-center justify-center bg-gray-200 text-gray-500">
          No Image
        </div>
      </div>

      <!-- Category -->
      <span class="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold
        bg-emerald-50 text-emerald-700 border border-emerald-200">
        {{ campaign.category || "Uncategorized" }}
      </span>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-gray-900">
        {{ campaign.title || "Untitled Campaign" }}
      </h1>

      <!-- Description -->
      <p class="text-gray-700 whitespace-pre-line">
        {{ campaign.description || "No description provided." }}
      </p>
    </div>

    <!-- RIGHT -->
    <div class="lg:col-span-1">
      <div class="sticky top-24 border rounded-xl p-6 space-y-4 bg-white">

        <!-- STATS (same UI as before) -->
        <div class="flex justify-between">
          <span class="text-gray-500">Raised</span>
          <span class="font-semibold">
            {{ raised }} {{ currency }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Goal</span>
          <span class="font-semibold">
            {{ goal }} {{ currency }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Backers</span>
          <span class="font-semibold">{{ contributors }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Days Left</span>
          <span class="font-semibold">{{ daysLeft }}</span>
        </div>

        <!-- Progress -->
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="bg-emerald-500 h-2 rounded-full" :style="{ width: progressPercent + '%' }" />
        </div>

        <p class="text-sm text-center text-gray-500">
          {{ progressPercent.toFixed(0) }}% funded
        </p>

        <!-- Contribute -->
        <input v-model="amount" @input="amount > goal && (amount = goal)" type="number" min="0" :max="goal" :placeholder="`Amount (${currency})`"
          class="w-full border rounded-lg px-3 py-2" :disabled="!campaign.active" />

        <button @click="contribute" :disabled="!campaign.active"
          class="w-full py-2 rounded-lg bg-emerald-500 text-white font-semibold disabled:opacity-50">
          Contribute
        </button>

        <!-- Owner -->
        <button v-if="isOwner && campaign.active" @click="closeCampaign"
          class="w-full py-2 rounded-lg bg-red-500 text-white font-semibold">
          Close Campaign
        </button>

      </div>
    </div>

    <!-- RELATED CAMPAIGNS -->
    <RelatedCampaigns v-if="campaign.category" :category="campaign.category" :excludeId="campaign.id" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { ethers } from "ethers"

import { account, getSigner } from "../composables/wallet"
import { getCampaignById } from "../services/campaignService"
import { getWriteContract } from "../utils/contract"
import RelatedCampaigns from "../components/RelatedCampaigns.vue"


/* ---------------- STATE ---------------- */
const route = useRoute()
const id = Number(route.params.id)

const campaign = ref({})
const amount = ref("")
const userUSDCBalance = ref("0")


watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return

    campaign.value = {}      // reset
    amount.value = ""
    await loadCampaign(Number(newId))
  },
  { immediate: true }
)


/* ---------------- LOAD ---------------- */
async function loadCampaign(campaignId) {
  try {
    campaign.value = await getCampaignById(campaignId)

    console.log("✅ Loaded campaign:", campaign.value)

    if (campaign.value.contributionType === 1 && account.value) {
      await loadUSDCBalance()
    }
  } catch (err) {
    console.error("❌ Load campaign error:", err)
  }
}


/* ---------------- ERC20 BALANCE ---------------- */
async function loadUSDCBalance() {
  try {
    const signer = getSigner()
    if (!signer) return

    const erc20 = new ethers.Contract(
      campaign.value.acceptedToken,
      ["function balanceOf(address) view returns (uint256)"],
      signer
    )

    const bal = await erc20.balanceOf(account.value)
    userUSDCBalance.value = ethers.formatUnits(bal, 6)
  } catch (e) {
    console.error("❌ USDC balance error:", e)
    userUSDCBalance.value = "0"
  }
}

/* ---------------- COMPUTED ---------------- */
const currency = computed(() =>
  campaign.value.contributionType === 1 ? "USDC" : "MATIC"
)

const raised = computed(() => {
  if (!campaign.value) return "0"
  return campaign.value.contributionType === 1
    ? ethers.formatUnits(
      campaign.value.totalRaised?.[campaign.value.acceptedToken] || "0",
      6
    )
    : ethers.formatEther(campaign.value.totalRaised || "0")
})

const goal = computed(() => {
  if (!campaign.value) return "0"
  return campaign.value.contributionType === 1
    ? ethers.formatUnits(campaign.value.goal || "0", 6)
    : ethers.formatEther(campaign.value.goal || "0")
})


const contributors = computed(() => campaign.value.contributors || 0)

const daysLeft = computed(() => {
  if (!campaign.value.deadline) return 0
  const diff = campaign.value.deadline - Math.floor(Date.now() / 1000)
  return diff > 0 ? Math.ceil(diff / 86400) : 0
})

const progressPercent = computed(() => {
  const g = Number(goal.value)
  const r = Number(raised.value)
  return g ? Math.min(100, (r / g) * 100) : 0
})

const isOwner = computed(() =>
  account.value &&
  campaign.value.owner &&
  account.value.toLowerCase() === campaign.value.owner.toLowerCase()
)

const insufficientUSDC = computed(() => {
  if (campaign.value.contributionType !== 1) return false
  if (!amount.value) return false
  return Number(amount.value) > Number(userUSDCBalance.value)
})

/* ---------------- ACTIONS ---------------- */
async function contribute() {
  if (!account.value) return alert("Connect wallet first")
  if (!amount.value || Number(amount.value) <= 0)
    return alert("Invalid amount")

  try {
    const signer = getSigner()
    if (!signer) throw new Error("Signer not found")

    const contract = await getWriteContract()

    /* ---------- MATIC ---------- */
    if (campaign.value.contributionType === 0) {
      const tx = await contract.contributeNative(
        campaign.value.id,
        { value: ethers.parseEther(amount.value.toString()) }
      )
      await tx.wait()
    }

    /* ---------- USDC ---------- */
    if (campaign.value.contributionType === 1) {
      if (insufficientUSDC.value) {
        alert("❌ Not enough USDC in your wallet")
        return
      }

      const parsedAmount = ethers.parseUnits(amount.value.toString(), 6)

      const usdc = new ethers.Contract(
        campaign.value.acceptedToken,
        [
          "function approve(address,uint256) external returns (bool)",
          "function allowance(address,address) view returns (uint256)"
        ],
        signer
      )

      const allowance = await usdc.allowance(
        account.value,
        contract.target
      )

      if (allowance < parsedAmount) {
        const approveTx = await usdc.approve(
          contract.target,
          parsedAmount
        )
        await approveTx.wait()
      }

      const tx = await contract.contributeERC20(
        campaign.value.id,
        parsedAmount
      )
      await tx.wait()
    }

    amount.value = ""
    await loadCampaign()

  } catch (err) {
    console.error("❌ Contribution failed:", err)
    alert(err?.reason || "Transaction failed")
  }
}

async function closeCampaign() {
  try {
    const contract = await getWriteContract()
    const tx = await contract.closeCampaign(campaign.value.id)
    await tx.wait()
    await loadCampaign()
  } catch (err) {
    console.error("❌ Close campaign error:", err)
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
