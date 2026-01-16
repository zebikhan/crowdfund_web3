<template>
  <footer class="bg-slate-800 border-t border-slate-700 mt-10">
    <div class="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-slate-300">
      
      <!-- Brand -->
      <div>
        <h2 class="text-2xl font-bold text-emerald-400">CrowdFund</h2>
        <p class="mt-3 text-slate-400">
          A decentralized crowdfunding platform where great ideas get funded by the community.
        </p>
      </div>

      <!-- Links -->
      <div class="text-center">
        <h3 class="text-lg font-semibold text-white mb-3">Quick Links</h3>
        <ul class="space-y-2">
          <li><router-link to="/" class="hover:text-emerald-400">Explore Campaigns</router-link></li>
          <li><router-link to="/create" class="hover:text-emerald-400">Start a Campaign</router-link></li>
          <li><router-link to="/profile" class="hover:text-emerald-400">My Campaigns</router-link></li>
        </ul>
      </div>

      <!-- Social -->
      <div class="text-center">
        <h3 class="text-lg font-semibold text-white mb-3">Connect</h3>
        <ul class="space-y-2">
          <li><a href="#" target="_blank" class="hover:text-emerald-400">Twitter</a></li>
          <li><a href="#" target="_blank" class="hover:text-emerald-400">Discord</a></li>
          <li><a href="#" target="_blank" class="hover:text-emerald-400">GitHub</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
      © {{ new Date().getFullYear() }} CrowdFund. All rights reserved.
    </div>
  </footer>
</template>
