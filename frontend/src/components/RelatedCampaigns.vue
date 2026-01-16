<template>
  <section class="mt-16">
    <!-- Heading -->
    <h2 class="text-2xl font-bold text-slate-900 mb-6">
      Related Campaigns
    </h2>

    <!-- Loading -->
    <div
      v-if="loading"
      class="text-center py-12 text-slate-400"
    >
      Loading related campaigns...
    </div>

    <!-- Empty -->
    <div
      v-else-if="!related.length"
      class="text-center py-12 border rounded-xl text-slate-500"
    >
      No related campaigns found.
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid gap-5"
      style="grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));"
    >
      <CampaignCard
        v-for="c in related"
        :key="c.id"
        :campaign="c"
        compact
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import CampaignCard from "./CampaignCard.vue"
import { getCampaignsByCategory } from "../services/campaignService"

const props = defineProps({
  category: String,
  excludeId: Number
})

const related = ref([])
const loading = ref(false)

async function loadRelated() {
  if (!props.category) return

  try {
    loading.value = true
    const campaigns = await getCampaignsByCategory(props.category)

    related.value = campaigns
      .filter(c => c.id !== props.excludeId)
      .slice(0, 8)

  } catch (e) {
    console.error("❌ Related campaigns error:", e)
  } finally {
    loading.value = false
  }
}

onMounted(loadRelated)
watch(() => props.category, loadRelated)
</script>
