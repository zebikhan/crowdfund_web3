<template>
  <router-link
    :to="`/campaign/${campaign.id}`"
    class="group relative bg-slate-900 rounded-2xl overflow-hidden
           border border-slate-800 hover:border-emerald-500/40
           transition-all duration-300 shadow-md hover:shadow-xl block"
  >
    <!-- IMAGE -->
    <div class="relative h-48 w-full overflow-hidden">
      <img
        :src="campaign.image || fallbackImage"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>

      <!-- Status -->
      <span
        class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur bg-black/50"
        :class="campaign.active ? 'text-emerald-400' : 'text-red-400'"
      >
        {{ campaign.active ? "Active" : "Ended" }}
      </span>
    </div>

    <!-- CONTENT -->
    <div class="p-5 space-y-3">
      <!-- Title -->
      <h3
        class="text-white font-semibold text-base leading-snug line-clamp-2
               group-hover:text-emerald-400 transition"
      >
        {{ campaign.title || "Untitled Campaign" }}
      </h3>

      <!-- Description -->
      <p
        v-if="campaign.description"
        class="text-slate-400 text-sm leading-relaxed line-clamp-2"
      >
        {{ campaign.description }}
      </p>

      <!-- Progress -->
      <div class="pt-2 space-y-2">
        <div class="flex justify-between text-xs">
          <span class="text-slate-400">Raised</span>
          <span class="text-white font-medium">
            {{ raised }} / {{ goal }} {{ currency }}
          </span>
        </div>

        <div class="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all"
            :style="{ width: progress + '%' }"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="pt-3 flex justify-between items-center text-xs text-slate-400">
        <span>📍 {{ campaign.location || "Pakistan" }}</span>
        <span>⏱ {{ deadlineDate }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue"
import { ethers } from "ethers"

/* ---------------- PROPS ---------------- */
const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
})

const fallbackImage =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"

/* ---------------- CURRENCY ---------------- */
const currency = computed(() =>
  props.campaign.contributionType === 1 ? "USDC" : "MATIC"
)

/* ---------------- AMOUNTS ---------------- */
const raised = computed(() => {
  try {
    if (props.campaign.contributionType === 1) {
      return ethers.formatUnits(
        props.campaign.totalRaised?.[props.campaign.acceptedToken] || "0",
        6
      )
    }
    return ethers.formatEther(props.campaign.totalRaised|| "0")
  } catch {
    return "0"
  }
})

const goal = computed(() => {
  try {
    return props.campaign.contributionType === 1
      ? ethers.formatUnits(props.campaign.goal || "0", 6)
      : ethers.formatEther(props.campaign.goal || "0")
  } catch {
    return "0"
  }
})

/* ---------------- PROGRESS ---------------- */
const progress = computed(() => {
  const g = Number(goal.value)
  const r = Number(raised.value)
  return g > 0 ? Math.min((r / g) * 100, 100) : 0
})

/* ---------------- DATE ---------------- */
const deadlineDate = computed(() => {
  try {
    return new Date(Number(props.campaign.deadline) * 1000).toLocaleDateString("en-GB")
  } catch {
    return ""
  }
})
</script>
