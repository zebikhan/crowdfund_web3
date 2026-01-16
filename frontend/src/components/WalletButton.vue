<template>
  <div>
    <button 
      @click="handleClick" 
      :disabled="isConnecting"
      class="px-4 py-2 rounded font-semibold transition
             bg-emerald-400 text-slate-900
             disabled:opacity-50 hover:shadow-md"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { connectWallet, disconnectWallet, account, isConnecting } from '../composables/wallet'

// label dynamically based on wallet state
const label = computed(() => {
  if (isConnecting.value) return 'Connecting...'
  return account.value 
         ? account.value.slice(0,6) + '...' + account.value.slice(-4) 
         : 'Connect Wallet'
})

// handle click dynamically
async function handleClick() {
  if (account.value) {
    // wallet connected → disconnect
    disconnectWallet()
  } else {
    // wallet not connected → connect
    try {
      await connectWallet()
    } catch (e) {
      alert(e.message || e)
    }
  }
}
</script>
