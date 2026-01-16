<template>
  <div class="max-w-6xl px-4 mx-auto md:px-8 space-y-20">
    <!-- Hero Section -->
    <div v-fade-in>
      <HeroSection />
    </div>

    <!-- Categories / Filters Section -->
    <div v-fade-in>
      <Categories />
    </div>

    <!-- Our Mission Section -->
    <div v-fade-in>
      <OurMission />
    </div>

    <!-- Featured Campaigns Carousel -->
    <div v-fade-in>
      <FeaturedCampaigns />
    </div>

    <!-- Stats Section -->
    <div v-fade-in>
      <StatsSection />
    </div>

    <!-- Gallery Section -->
    <div v-fade-in>
      <Gallery />
    </div>

  </div>
</template>


<script setup>
import HeroSection from "../components/HeroSection.vue"
import Categories from "../components/Categories.vue"
import FeaturedCampaigns from "../components/FeaturedCampaigns.vue"
import StatsSection from "../components/StatsSection.vue"
import OurMission  from "../components/OurMission.vue"
import Gallery from "../components/Gallery.vue"

</script>
