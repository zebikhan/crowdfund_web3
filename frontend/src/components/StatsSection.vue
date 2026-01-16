<template>

  <section class="py-12 bg-gray-50">

    <!-- Heading -->
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Live Platform Statistics</h2>
      <p class="text-slate-400 text-lg">Transparent, real-time insights powered by blockchain.</p>
    </div>

    <div class="max-w-6xl mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">

        <!-- Campaigns -->
        <div class="stat-card">
          <div class="icon">📢</div>
          <h3>{{ totalCampaigns }}</h3>
          <p>Campaigns</p>
        </div>

        <!-- MATIC -->
        <div class="stat-card">
          <div class="icon">💵</div>
          <h3>{{ totalRaisedMatic }}</h3>
          <p>Total Raised (MATIC)</p>
        </div>

        <!-- USDC -->
        <div class="stat-card">
          <div class="icon">💰</div>
          <h3>{{ totalRaisedUSDC }}</h3>
          <p>Total Raised (USDC)</p>
        </div>

        <!-- Contributors -->
        <div class="stat-card">
          <div class="icon">👥</div>
          <h3>{{ totalContributors }}</h3>
          <p>Contributors</p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { ethers } from "ethers"
import { getAllCampaigns } from "../services/campaignService"

const campaigns = ref([])

/* ---------------- COMPUTED ---------------- */

const totalCampaigns = computed(() => campaigns.value.length)

const totalRaisedMatic = computed(() => {
  let total = 0n

  for (const c of campaigns.value) {
    if (c.contributionType === 0) {
      total += BigInt(c.totalRaised || "0")
    }
  }

  return Number(ethers.formatEther(total)).toFixed(2)
})

const totalRaisedUSDC = computed(() => {
  let total = 0n

  for (const c of campaigns.value) {
    if (c.contributionType === 1) {
      total += BigInt(c.totalRaised?.[c.acceptedToken] || "0")
    }
  }

  return Number(ethers.formatUnits(total, 6)).toFixed(2)
})

const totalContributors = computed(() => {
  return campaigns.value.reduce(
    (acc, c) => acc + Number(c.contributors || 0),
    0
  )
})

/* ---------------- LOAD ---------------- */

async function loadStats() {
  try {
    campaigns.value = await getAllCampaigns()
  } catch (err) {
    console.error("❌ Failed to load stats:", err)
  }
}

onMounted(loadStats)
</script>

<style scoped>
.stat-card {
  @apply bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col items-center;
}

.icon {
  @apply w-14 h-14 flex items-center justify-center bg-emerald-500 rounded-full text-white text-2xl mb-3;
}

h3 {
  @apply text-2xl font-bold text-gray-900;
}

p {
  @apply text-gray-600 mt-1;
}
</style>
