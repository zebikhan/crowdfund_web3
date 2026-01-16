<template>
  <section class="text-center py-16">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Fund the Future with Web3
    </h1>
    <p class="text-gray-700 text-lg md:text-xl mb-8">
      Support campaigns, contribute, and create your own fundraising projects on blockchain.
    </p>
    <div class="flex justify-center gap-4">
      <router-link
        to="/create"
        class="bg-emerald-500 text-white px-6 py-3 rounded hover:bg-emerald-600 transition"
      >
        Start a Campaign
      </router-link>
      <router-link
        to="/"
        class="bg-gray-100 text-gray-900 px-6 py-3 rounded hover:bg-gray-200 transition"
      >
        Explore Campaigns
      </router-link>
    </div>
  </section>
</template>

<script setup>
// Purely visual, no extra logic for now
</script>
