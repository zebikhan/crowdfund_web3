<template>
  <section class="max-w-7xl mx-auto px-6 py-16 space-y-8">
    <!-- Heading -->
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Helping Hands Gallery</h2>
      <p class="text-slate-400 text-lg">Explore moments and campaigns from our community.</p>
    </div>

    <!-- Collage Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <img
          :src="img"
          class="w-full h-48 object-cover"
          :alt="'Gallery image ' + (index + 1)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const images = Array.from({ length: 12 }, (_, i) =>
  `https://picsum.photos/seed/charity${i}/400/300`
)
</script>

<style scoped>
/* Optional: subtle hover effect for the entire gallery */
</style>
