<template>
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

            <!-- Logo -->
            <router-link to="/" class="text-xl font-bold text-gray-900">
                CrowdFund
            </router-link>

            <!-- Desktop Links -->
            <div class="hidden md:flex items-center gap-6">
                <router-link to="/" class="nav-link">Explore</router-link>
                <router-link to="/create" class="nav-link">Create Campaign</router-link>

                <!-- Wallet -->
                <div v-if="!account">
                    <button class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
                        @click="connectWallet">
                        Connect Wallet
                    </button>
                </div>
                <!-- Connected Wallet -->
                <div v-else class="flex items-center gap-3">
                    <span class="text-gray-900 font-medium">{{ shortAddress(account) }}</span>

                    <!-- Dropdown wrapper -->
                    <div class="relative">
                        <button @click="toggleDropdown"
                            class="w-8 h-8 bg-emerald-500 rounded-full text-white font-bold focus:outline-none">
                            P
                        </button>

                        <!-- Dropdown menu -->
                        <div v-if="openDropdown"
                            class="absolute right-0 mt-2 top-full w-40 bg-white border border-gray-200 rounded shadow z-50">
                            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                                @click="closeDropdown">
                                My Campaigns
                            </router-link>
                            <button @click="logout"
                                class="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Mobile Hamburger -->
            <button @click="mobileOpen = !mobileOpen" class="md:hidden text-gray-700 text-2xl">
                ☰
            </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileOpen" class="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
            <router-link to="/" class="nav-link block" @click="mobileOpen = false">Explore</router-link>
            <router-link to="/create" class="nav-link block" @click="mobileOpen = false">Create Campaign</router-link>

            <div v-if="!account">
                <button class="w-full bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
                    @click="connectWallet">
                    Connect Wallet
                </button>
            </div>
            <div v-else class="space-y-2">
                <div class="text-center font-medium text-gray-900">{{ shortAddress(account) }}</div>
                <router-link to="/profile"
                    class="w-full block text-center bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition">
                    My Campaigns
                </router-link>
                <button @click="disconnect"
                    class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
                    Logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { account, connectWallet, disconnectWallet, initWallet } from "../composables/wallet";

const mobileOpen = ref(false);
const openDropdown = ref(false);

function toggleDropdown() { openDropdown.value = !openDropdown.value; }
function closeDropdown() { openDropdown.value = false; }
function logout() { disconnectWallet(); openDropdown.value = false; }
function shortAddress(addr) { return addr.slice(0, 6) + "..." + addr.slice(-4); }

function handleClickOutside(e) {
    const dropdown = document.querySelector(".relative");
    if (dropdown && !dropdown.contains(e.target)) openDropdown.value = false;
}

onMounted(() => {
    initWallet();
    document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>

<style scoped>
.nav-link {
    @apply text-gray-900 hover:text-emerald-500 font-medium;
}

.router-link-active {
    @apply text-emerald-500 font-semibold;
}
</style>
