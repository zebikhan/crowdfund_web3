<template>
  <div class="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">

    <!-- Hero Section -->
    <section class="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-md rounded-3xl py-10 px-8 shadow-lg mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-3 animate-fade-in">🎯 My Campaigns</h1>
      <p class="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
        All campaigns you have launched appear here.
      </p>
    </section>

    <!-- No Wallet -->
    <div v-if="!account" class="text-center text-slate-400 text-lg mt-8 animate-pulse">
      ⚠️ Please connect your wallet to see your campaigns.
    </div>

    <!-- My Campaigns Grid -->
    <section v-else class="space-y-6">

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-slate-400 text-lg animate-pulse">
        ⏳ Loading your campaigns...
      </div>

      <!-- Empty State -->
      <div v-else-if="myCampaigns.length === 0"
        class="text-center text-slate-400 text-lg flex flex-col items-center justify-center space-y-2">
        <span class="text-6xl animate-bounce">😕</span>
        <p>You haven’t created any campaigns yet.</p>
      </div>

      <!-- Campaign Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <CampaignCard v-for="c in myCampaigns" :key="c.id" :campaign="c"
          class="transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-lg" />
      </div>

    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { account } from '../composables/wallet'
import CampaignCard from '../components/CampaignCard.vue'
import { getCampaignsByOwner } from '../services/campaignService'

const myCampaigns = ref([])
const loading = ref(true)

async function loadCampaigns() {
  if (!account.value) {
    loading.value = false
    return
  }
  try {
   myCampaigns.value = await getCampaignsByOwner(account.value)
  } catch (err) {
    console.error("❌ Error loading campaigns:", err);
  }
  finally {
    loading.value = false
  }
}

onMounted(loadCampaigns)
</script>

<style scoped>
/* Hero fade-in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
}
</style>
