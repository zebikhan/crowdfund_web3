<template>
  <section class="max-w-7xl mx-auto px-6 py-14 font-inter">

    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
        Explore Campaigns
      </h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Discover active and completed fundraising campaigns and support ideas that matter.
      </p>
    </div>

    <!-- Filters -->
    <div
      class="flex flex-col md:flex-row gap-4 items-center justify-between
             bg-white border rounded-2xl p-4 mb-10 shadow-sm"
    >
      <!-- Search -->
      <input
        v-model="search"
        type="text"
        placeholder="Search campaigns..."
        class="w-full md:w-1/2 border rounded-xl px-4 py-2.5
               focus:ring-2 focus:ring-emerald-400 outline-none"
      />

      <!-- Status Filter -->
      <select
        v-model="filter"
        class="w-full md:w-1/4 border rounded-xl px-4 py-2.5
               focus:ring-2 focus:ring-emerald-400 outline-none cursor-pointer"
      >
        <option value="">All Campaigns</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16 text-gray-500">
      ⏳ Loading campaigns...
    </div>

    <!-- Campaign Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <CampaignCard
        v-for="c in filteredCampaigns"
        :key="c.id"
        :campaign="c"
        class="transition hover:-translate-y-1 hover:shadow-lg"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !filteredCampaigns.length"
      class="mt-20 text-center text-gray-500"
    >
      <div class="text-6xl mb-4">📭</div>
      <p class="text-lg font-medium">No campaigns found</p>
      <p class="text-sm">Try changing your search or filter</p>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import CampaignCard from "../components/CampaignCard.vue"
import { getAllCampaigns } from "../services/campaignService"

/* ---------------- STATE ---------------- */
const campaigns = ref([])
const loading = ref(true)

const search = ref("")
const filter = ref("")

/* ---------------- COMPUTED ---------------- */
const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.value.toLowerCase()) ||
      c.description.toLowerCase().includes(search.value.toLowerCase())

    const matchesFilter =
      filter.value === ""
        ? true
        : filter.value === "active"
        ? c.active
        : !c.active

    return matchesSearch && matchesFilter
  })
})

/* ---------------- LOAD ---------------- */
async function loadCampaigns() {
  try {
    loading.value = true
    campaigns.value = await getAllCampaigns()
  } catch (err) {
    console.error("❌ Failed to load campaigns:", err)
  } finally {
    loading.value = false
  }
}

onMounted(loadCampaigns)
</script>
