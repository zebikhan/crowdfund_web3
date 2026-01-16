<template>
  <section class="space-y-6">

    <!-- Category Buttons -->
    <div class="flex flex-wrap justify-center gap-3 py-6 bg-white rounded-lg shadow-sm">
      <!-- All -->
      <button
        @click="selectCategory(null)"
        :class="[baseBtn, selectedCategory === null ? activeBtn : inactiveBtn]"
      >
        All
      </button>

      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectCategory(cat)"
        :class="[baseBtn, selectedCategory === cat ? activeBtn : inactiveBtn]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Campaigns Wrapper (stable height) -->
    <div class="relative">

      <!-- Grid (always rendered) -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
               min-h-[340px]"
      >
        <CampaignCard
          v-for="campaign in campaigns"
          :key="campaign.id"
          :campaign="campaign"
        />
      </div>

      <!-- Empty State (overlay, no layout shift) -->
      <div
        v-if="!campaigns.length"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div
          class="text-center bg-white/80 backdrop-blur-md
                 border border-gray-200 rounded-2xl px-8 py-6 shadow-md"
        >
          <!-- <div class="text-4xl mb-2">📂</div> -->
          <p class="text-gray-700 font-medium">
            No featured campaigns in this category
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Please select another category
          </p>
        </div>
      </div>

    </div>

    <!-- View All -->
    <div class="text-center !mt-12">
      <router-link
        to="/campaigns"
        class="inline-block px-8 py-3 rounded-full
               bg-gradient-to-r from-emerald-500 to-sky-500
               text-white font-semibold shadow-lg
               hover:shadow-xl transform hover:-translate-y-1 transition"
      >
        View All Campaigns
      </router-link>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getCampaignsByCategory } from "../services/campaignService"
import CampaignCard from "./CampaignCard.vue"

// Categories
const categories = [
  "Medical & Health",
  "Education",
  "Emergency Relief",
  "Small Business / Startup",
  "Technology",
  "Community Projects",
  "Environment",
  "Art & Culture",
  "Charity / Non-Profit"
]

const selectedCategory = ref(null)
const campaigns = ref([])

// Button styles
const baseBtn =
  "px-4 py-2 rounded-full text-sm font-medium border transition-colors"
const activeBtn =
  "bg-emerald-500 text-white border-emerald-500"
const inactiveBtn =
  "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"

const selectCategory = (cat) => {
  selectedCategory.value = cat
  loadCampaigns()
}

async function loadCampaigns() {
  try {
    campaigns.value = await getCampaignsByCategory(selectedCategory.value)
  } catch (e) {
    console.error("❌ Error loading campaigns:", e)
    campaigns.value = []
  }
}

onMounted(loadCampaigns)
</script>
