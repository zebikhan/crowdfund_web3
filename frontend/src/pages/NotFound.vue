<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-center px-6">
    <!-- 404 Number -->
    <h1 class="text-9xl font-extrabold text-emerald-500 drop-shadow-lg">404</h1>

    <!-- Message -->
    <p class="mt-4 text-2xl font-semibold text-white">Oops! Page not found</p>
    <p class="mt-2 text-gray-400 max-w-md">
      The page you’re looking for doesn’t exist or has been moved.
    </p>

    <!-- Button -->
    <router-link
      to="/"
      class="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition"
    >
      Go Back Home
    </router-link>
  </div>
</template>

<script setup>
</script>
