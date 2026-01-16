<template>
  <nav class="bg-slate-800/90 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <div class="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent">
        <router-link to="/">CrowdFund</router-link>
      </div>

      <!-- Desktop Links -->
      <div class="hidden md:flex items-center gap-6">
        <router-link to="/" class="nav-link">Explore</router-link>
        <router-link to="/create" class="nav-link">Create Campaign</router-link>

        <div v-if="!account">
          <button
            class="bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-lg shadow hover:bg-emerald-500 transition"
            @click="connectWalletHandler"
          >
            Connect Wallet
          </button>
        </div>

        <div v-else class="flex items-center gap-3">
          <span class="text-white font-semibold">{{ shortAddress(account) }}</span>
          <button
            class="ml-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            @click="disconnect"
          >
            Disconnect
          </button>
        </div>
      </div>

      <!-- Mobile Hamburger -->
      <button @click="mobileOpen = !mobileOpen" class="md:hidden text-slate-300 hover:text-white">
        ☰
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileOpen" class="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-3">
      <router-link to="/" class="nav-link block" @click="mobileOpen = false">Explore</router-link>
      <router-link to="/create" class="nav-link block" @click="mobileOpen = false">Create Campaign</router-link>
      <div v-if="!account">
        <button
          class="w-full bg-emerald-400 text-slate-900 font-semibold px-4 py-3 rounded-lg hover:bg-emerald-500 transition"
          @click="connectWalletHandler"
        >
          Connect Wallet
        </button>
      </div>
      <div v-else>
        <div class="text-center font-medium text-emerald-400">{{ shortAddress(account) }}</div>
        <button
          class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-lg transition"
          @click="disconnect"
        >
          Disconnect
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { account, connectWallet, disconnectWallet, initWallet } from "../composables/wallet";

const mobileOpen = ref(false);

async function connectWalletHandler() {
  try {
    await connectWallet();
  } catch (err) {
    console.error(err);
  }
}

function disconnect() {
  disconnectWallet();
}

function shortAddress(a) {
  return a ? a.slice(0, 6) + "..." + a.slice(-4) : "";
}

onMounted(async () => {
  await initWallet();
});
</script>

<style scoped>
.nav-link {
  color: white;
  font-weight: 500;
}
</style>
