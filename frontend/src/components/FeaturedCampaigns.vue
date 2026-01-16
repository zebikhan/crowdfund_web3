<template>
  <section class="py-10">
        <!-- Heading -->
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Featured Campaigns</h2>
      <p class="text-slate-400 text-lg">Handpicked campaigns making real impact right now.</p>
    </div>

    <!-- ================= EMPTY STATE ================= -->
    <div
      v-if="!displayCampaigns.length && !isLoading"
      class="flex flex-col items-center justify-center
             bg-gray-50 border border-dashed border-gray-300
             rounded-2xl py-20 px-6 text-center"
    >
      <div class="text-5xl mb-4">🌱</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">
        No Featured Campaigns Yet
      </h3>
      <p class="text-gray-500 max-w-md">
        Be the first to launch a campaign and get featured here.
      </p>

      <router-link
        to="/create"
        class="mt-6 inline-block px-6 py-3 rounded-full
               bg-emerald-500 text-white font-semibold
               hover:bg-emerald-600 transition"
      >
        Create Campaign
      </router-link>
    </div>

    <!-- ================= CAROUSEL ================= -->
    <div v-else class="relative overflow-hidden">
      <!-- Prev / Next -->
      <button
        class="absolute left-2 top-1/2 -translate-y-1/2 z-20
               p-2 rounded-full shadow-md bg-white/90 hover:scale-105"
        @click="prevPage"
        aria-label="Previous"
      >
        ‹
      </button>

      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 z-20
               p-2 rounded-full shadow-md bg-white/90 hover:scale-105"
        @click="nextPage"
        aria-label="Next"
      >
        ›
      </button>

      <!-- Carousel -->
      <div
        ref="carousel"
        class="carousel flex gap-6 overflow-x-hidden scroll-smooth px-4 py-2"
        @scroll.passive="onScroll"
      >
        <div
          v-for="(campaign, index) in displayCampaigns"
          :key="`featured-${index}`"
          class="flex-shrink-0 snap-start"
          :style="cardStyle"
        >
          <CampaignCard :campaign="campaign" />
        </div>
      </div>

      <!-- Dots -->
      <div class="flex justify-center mt-4 mb-2 space-x-2">
        <button
          v-for="(_, pIndex) in pages"
          :key="'dot-' + pIndex"
          class="w-3 h-3 rounded-full transition-transform"
          :class="currentPage === pIndex
            ? 'scale-125 bg-emerald-500'
            : 'bg-gray-300'"
          @click="goToPage(pIndex)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue"
import CampaignCard from "./CampaignCard.vue"
import { getFeaturedCampaigns } from "../services/campaignService"

/* ---------------- STATE ---------------- */
const campaigns = ref([])
const displayCampaigns = ref([])
const carousel = ref(null)

const currentPage = ref(0)
const cardsPerView = ref(3)
const autoSlideInterval = ref(null)
const isLoading = ref(false)

/* ---------------- COMPUTED ---------------- */
const pages = computed(() =>
  displayCampaigns.value.length
    ? Math.ceil(displayCampaigns.value.length / cardsPerView.value)
    : 1
)

const cardStyle = computed(() => {
  const gap = 24
  const n = cardsPerView.value
  return {
    flex: `0 0 calc((100% - ${gap * (n - 1)}px) / ${n})`,
    maxWidth: `calc((100% - ${gap * (n - 1)}px) / ${n})`
  }
})

/* ---------------- DATA LOAD ---------------- */
async function loadCampaigns() {
  try {
    isLoading.value = true
    campaigns.value = await getFeaturedCampaigns()
    fillDisplayCampaigns()
    currentPage.value = 0

    if (displayCampaigns.value.length) startAutoSlide()
  } catch (err) {
    console.error("❌ Failed to load featured campaigns", err)
    displayCampaigns.value = []
  } finally {
    isLoading.value = false
  }
}

function fillDisplayCampaigns() {
  if (!campaigns.value.length) {
    displayCampaigns.value = []
    return
  }

  const max = Math.min(10, campaigns.value.length)
  const selected = []

  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * campaigns.value.length)
    selected.push(campaigns.value[idx])
  }

  displayCampaigns.value = selected
}

/* ---------------- RESPONSIVE ---------------- */
function calcCardsPerView() {
  const w = window.innerWidth
  cardsPerView.value =
    w >= 1024 ? 3 : w >= 768 ? 2 : 1

  nextTick(() => scrollToPage(currentPage.value, "auto"))
}

/* ---------------- SCROLL ---------------- */
function scrollToPage(page, behavior = "smooth") {
  if (!carousel.value) return
  carousel.value.scrollTo({
    left: page * carousel.value.clientWidth,
    behavior
  })
  currentPage.value = page
}

function onScroll() {
  if (!carousel.value) return
  currentPage.value = Math.round(
    carousel.value.scrollLeft / carousel.value.clientWidth
  )
}

function goToPage(p) {
  scrollToPage(Math.max(0, Math.min(p, pages.value - 1)))
}

function prevPage() {
  goToPage((currentPage.value - 1 + pages.value) % pages.value)
}

function nextPage() {
  goToPage((currentPage.value + 1) % pages.value)
}

/* ---------------- AUTO SLIDE ---------------- */
function startAutoSlide() {
  if (!displayCampaigns.value.length) return
  stopAutoSlide()
  autoSlideInterval.value = setInterval(nextPage, 3000)
}

function stopAutoSlide() {
  if (autoSlideInterval.value) clearInterval(autoSlideInterval.value)
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(() => {
  loadCampaigns()
  calcCardsPerView()

  window.addEventListener("resize", calcCardsPerView, { passive: true })

  carousel.value?.addEventListener("mouseenter", stopAutoSlide)
  carousel.value?.addEventListener("mouseleave", startAutoSlide)
})

onBeforeUnmount(() => {
  stopAutoSlide()
  window.removeEventListener("resize", calcCardsPerView)

  carousel.value?.removeEventListener("mouseenter", stopAutoSlide)
  carousel.value?.removeEventListener("mouseleave", startAutoSlide)
})
</script>

<style scoped>
.carousel::-webkit-scrollbar {
  display: none;
}
.carousel {
  scrollbar-width: none;
}
</style>
