<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold mb-4">Campaign — quick inspect</h1>

    <!-- Steps -->
    <div class="space-y-3 mb-6">
      <div class="p-3 rounded border" :class="step >= 1 ? 'border-emerald-400 bg-emerald-50' : ''">
        <strong>Step 1 — Read contract</strong>
        <div class="text-sm text-gray-700 mt-1">Call <code>getCampaign(id)</code> to fetch the on-chain stored values.</div>
      </div>

      <div class="p-3 rounded border" :class="step >= 2 ? 'border-emerald-400 bg-emerald-50' : ''">
        <strong>Step 2 — Parse response</strong>
        <div class="text-sm text-gray-700 mt-1">Map return array into named fields (id, owner, metadataCid, goal, ...).</div>
      </div>

      <div class="p-3 rounded border" :class="step >= 3 ? 'border-emerald-400 bg-emerald-50' : ''">
        <strong>Step 3 — Fetch IPFS metadata</strong>
        <div class="text-sm text-gray-700 mt-1">If metadataCid exists, fetch JSON from IPFS gateway and show it.</div>
      </div>
    </div>

    <!-- Basic info -->
    <section class="mb-6">
      <h2 class="font-semibold mb-2">Parsed campaign fields</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Campaign ID</div>
          <div class="font-medium">{{ campaign.id ?? '-' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Owner</div>
          <div class="font-medium">{{ campaign.owner ?? '-' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Metadata CID (raw)</div>
          <div class="font-medium break-all">{{ campaign.metadataCid ?? '-' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Contribution Type</div>
          <div class="font-medium">{{ contributionTypeName }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Accepted Token</div>
          <div class="font-medium">{{ campaign.acceptedToken ?? '0x000...000' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Goal (raw uint)</div>
          <div class="font-medium">{{ campaign.goal ?? '-' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Total Raised (raw uint)</div>
          <div class="font-medium">{{ campaign.totalRaisedNative ?? '-' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Deadline (unix)</div>
          <div class="font-medium">{{ campaign.deadline ?? '-' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Active</div>
          <div class="font-medium">{{ campaign.active ? 'true' : 'false' }}</div>
        </div>
        <div class="p-3 border rounded bg-gray-50">
          <div class="text-xs text-gray-500">Contributors (count)</div>
          <div class="font-medium">{{ campaign.contributors ?? 0 }}</div>
        </div>
      </div>
    </section>

    <!-- IPFS Metadata parsed (human fields) -->
    <section class="mb-6">
      <h2 class="font-semibold mb-2">IPFS metadata (parsed)</h2>
      <div v-if="metadataLoaded" class="p-4 border rounded bg-gray-50 space-y-2 text-sm">
        <div><strong>Title:</strong> {{ metadata.title ?? '-' }}</div>
        <div><strong>Short description:</strong> <span class="whitespace-pre-line">{{ metadata.shortDescription ?? metadata.description ?? '-' }}</span></div>
        <div><strong>Category:</strong> {{ metadata.category ?? '-' }}</div>
        <div><strong>BeneficiaryType:</strong> {{ metadata.beneficiaryType ?? '-' }}</div>
        <div><strong>BeneficiaryInfo:</strong> {{ metadata.beneficiaryInfo ?? '-' }}</div>
        <div v-if="metadata.image"><strong>Image (IPFS):</strong> <a :href="metadata.image" target="_blank" class="text-blue-600 underline break-all">{{ metadata.image }}</a></div>
      </div>
      <div v-else class="text-sm text-gray-500 p-3 border rounded bg-white">No metadata loaded yet or metadata is empty.</div>
    </section>

    <!-- RAW displays for learning -->
    <section class="mb-6">
      <h2 class="font-semibold mb-2">Raw contract response (for learning)</h2>
      <pre class="p-3 text-xs bg-black text-green-200 rounded overflow-auto" style="max-height:240px;">{{ safeSerialize(contractResponse) }}</pre>
    </section>

    <section>
      <h2 class="font-semibold mb-2">Raw IPFS JSON (for learning)</h2>
      <pre class="p-3 text-xs bg-black text-green-200 rounded overflow-auto" style="max-height:240px;">{{ safeSerialize(metadataRaw) }}</pre>
    </section>

    <!-- Controls -->
    <div class="mt-6 flex items-center gap-3">
      <input v-model.number="inputId" type="number" min="1" class="px-3 py-2 border rounded" />
      <button @click="loadCampaign" class="px-4 py-2 bg-emerald-500 text-white rounded">Load campaign by ID</button>
      <button @click="clear" class="px-4 py-2 bg-gray-300 rounded">Clear</button>
      <div v-if="loading" class="text-sm text-gray-600 ml-4">Loading…</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getReadContract } from "../utils/contract";
import { ethers } from "ethers";

const inputId = ref(1);
const loading = ref(false);
const step = ref(0);

const contractResponse = ref(null);
const campaign = ref({
  id: null,
  owner: null,
  metadataCid: null,
  goal: null,
  totalRaisedNative: null,
  deadline: null,
  active: null,
  contributionType: null,
  acceptedToken: null,
  contributors: null
});

const metadata = ref({});
const metadataRaw = ref({});
const metadataLoaded = computed(() => Object.keys(metadataRaw.value || {}).length > 0);

// SAFELY stringify BigInt/BigNumber
function safeSerialize(obj) {
  return JSON.stringify(
    obj,
    (_, val) => {
      if (typeof val === "bigint") return val.toString();
      if (val && typeof val === "object" && val._isBigNumber) return val.toString();
      return val;
    },
    2
  );
}

// helper → convert enum to name
function mapContributionType(n) {
  if (n === 0 || n === "0") return "NATIVE / MATIC";
  if (n === 1 || n === "1") return "ERC20 Token";
  return String(n);
}

// computed property exposes readable type name
const contributionTypeName = computed(() =>
  mapContributionType(campaign.value.contributionType)
);

// main loader
async function loadCampaign() {
  const id = Number(inputId.value);
  if (!id || id <= 0) return;

  loading.value = true;
  step.value = 0;

  try {
    step.value = 1;
    const contract = getReadContract();
    const c = await contract.getCampaign(id);

    contractResponse.value = c;

    const [
      cid,
      owner,
      metadataCid,
      goal,
      totalRaisedNative,
      deadline,
      active,
      contributionType,
      acceptedToken,
      contributors
    ] = c;

    campaign.value = {
      id: Number(cid),
      owner,
      metadataCid,
      goal: goal.toString(),
      totalRaisedNative: totalRaisedNative.toString(),
      deadline: Number(deadline),
      active: Boolean(active),
      contributionType,
      acceptedToken,
      contributors: Number(contributors)
    };

    step.value = 2;

    metadataRaw.value = {};
    metadata.value = {};

    if (campaign.value.metadataCid) {
      step.value = 3;

      let rawCid = campaign.value.metadataCid;
      if (rawCid.startsWith("ipfs://")) {
        rawCid = rawCid.replace("ipfs://", "");
      }

      try {
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${rawCid}`);
        metadataRaw.value = await res.json();

        metadata.value = {
          title: metadataRaw.value.title,
          shortDescription:
            metadataRaw.value.shortDescription ?? metadataRaw.value.description,
          category: metadataRaw.value.category,
          beneficiaryType: metadataRaw.value.beneficiaryType,
          beneficiaryInfo: metadataRaw.value.beneficiaryInfo,
          image: metadataRaw.value.image
            ? metadataRaw.value.image.replace(
                "ipfs://",
                "https://gateway.pinata.cloud/ipfs/"
              )
            : null
        };
      } catch (err) {
        console.warn("Metadata load failed", err);
      }
    }

    step.value = 3;
  } catch (err) {
    console.error("Load error", err);
    alert("Failed to load campaign — check console");
  } finally {
    loading.value = false;
  }
}

function clear() {
  contractResponse.value = null;
  campaign.value = {
    id: null,
    owner: null,
    metadataCid: null,
    goal: null,
    totalRaisedNative: null,
    deadline: null,
    active: null,
    contributionType: null,
    acceptedToken: null,
    contributors: null
  };
  metadataRaw.value = {};
  metadata.value = {};
  step.value = 0;
}
</script>

<style scoped>
/* tiny niceties */
pre { white-space: pre-wrap; word-break: break-word; }
</style>
