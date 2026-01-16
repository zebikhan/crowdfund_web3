<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1 p-6 max-w-7xl mx-auto w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<style>
/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
