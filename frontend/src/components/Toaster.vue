<template>
  <div class="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white backdrop-blur"
        :class="toast.type === 'error'
          ? 'bg-red-600/90'
          : toast.type === 'warning'
          ? 'bg-amber-500/90'
          : 'bg-emerald-600/90'"
      >
        <!-- Icon -->
        <span class="text-lg">
          {{ iconMap[toast.type] }}
        </span>

        <!-- Message -->
        <span class="font-medium text-sm">
          {{ toast.message }}
        </span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from "vue"

const toasts = ref([])

const iconMap = {
  success: "✅",
  error: "❌",
  warning: "⚠️"
}

function showToast(message, type = "success", duration = 3000) {
  const id = Date.now() + Math.random()

  toasts.value.push({
    id,
    message,
    type
  })

  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

defineExpose({ showToast })
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
</style>
