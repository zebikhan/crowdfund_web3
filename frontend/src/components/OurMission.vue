<template>
  <section class="bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4 md:px-8">

      <!-- Heading -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Our Mission</h2>
        <p class="text-slate-400 text-lg">Empowering ideas through transparent, decentralized fundraising.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="(item, idx) in items" :key="idx"
          class="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition">
          <div class="text-4xl mb-4">{{ item.icon }}</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
          <p class="text-gray-600 text-sm">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    icon: "💡",
    title: "Transparent Projects",
    description: "All campaigns verified on blockchain.",
  },
  {
    icon: "🤝",
    title: "Easy Donations",
    description: "Send MATIC directly to campaigns.",
  },
  {
    icon: "📈",
    title: "Track Impact",
    description: "View progress & contributions in real-time.",
  },
  {
    icon: "🌱",
    title: "Make a Difference",
    description: "Support causes that matter.",
  },
];
</script>

<style scoped>
/* Optional: Add subtle hover scale */
</style>
