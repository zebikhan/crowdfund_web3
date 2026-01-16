<template>
  <div class="min-h-screen bg-gray-50 px-6 py-12">

    <!-- Hero -->
    <section
      class="max-w-4xl mx-auto text-center bg-white rounded-3xl py-10 px-8 shadow mb-12"
    >
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
        🚀 Launch Your Campaign
      </h1>
      <p class="text-gray-600 text-lg">
        Share your idea and raise funds with transparency.
      </p>
    </section>

    <!-- Form -->
    <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow p-10">
      <CreateForm
        :form="form"
        :errors="errors"
        :isLoading="isLoading"
        :imagePreview="imagePreview"
        :minDate="minDate"
        @fileChanged="onFileChange"
        @submit="createCampaign"
      />
    </div>

    <!-- Toaster -->
    <Toaster ref="toasterRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { ethers } from "ethers"

import CreateForm from "../components/CreateForm.vue"
import Toaster from "../components/Toaster.vue"

import { getWriteContract } from "../utils/contract"
import { uploadFileToIPFS, uploadJSONToIPFS } from "../utils/pinata"
import { initWallet, ensureWalletConnected } from "../composables/wallet"

/* ------------------ INIT ------------------ */
onMounted(initWallet)

const toasterRef = ref(null)

function toast(msg, type = "success") {
  toasterRef.value?.showToast(msg, type)
}

/* ------------------ DATE ------------------ */
const tomorrow = new Date(Date.now() + 86400000)
const minDate = tomorrow.toISOString().split("T")[0]

/* ------------------ CONST ------------------ */
const POLYGON_USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
const STABLE_DECIMALS = 6

/* ------------------ STATE ------------------ */
const form = ref({
  title: "",
  description: "",
  category: "",
  goalAmount: "",
  goalCurrency: "MATIC",
  endDate: ""
})

const errors = ref({})
const isLoading = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)

/* ------------------ HANDLERS ------------------ */
function onFileChange(file) {
  imageFile.value = file
  imagePreview.value = file ? URL.createObjectURL(file) : null
}

/* ------------------ CREATE CAMPAIGN ------------------ */
async function createCampaign() {
  errors.value = {}

  if (!form.value.title.trim()) errors.value.title = "Title required"
  if (!form.value.description.trim()) errors.value.description = "Description required"
  if (!form.value.category) errors.value.category = "Select category"
  if (!form.value.goalAmount || Number(form.value.goalAmount) <= 0)
    errors.value.goalAmount = "Invalid goal amount"
  if (!form.value.endDate) errors.value.endDate = "Select end date"
  if (!imageFile.value) errors.value.image = "Image required"

  if (Object.keys(errors.value).length) return

  try {
    isLoading.value = true

    await ensureWalletConnected()

    toast("Uploading image…")

    const imageCid = await uploadFileToIPFS(imageFile.value)

    const metadataCid = await uploadJSONToIPFS({
      title: form.value.title,
      description: form.value.description,
      category: form.value.category,
      image: imageCid,
      createdAt: new Date().toISOString()
    })

    let contributionType
    let tokenAddress = ethers.ZeroAddress
    let goalValue

    if (form.value.goalCurrency === "MATIC") {
      contributionType = 0
      goalValue = ethers.parseEther(form.value.goalAmount.toString()) 
    } else {
      contributionType = 1
      tokenAddress = POLYGON_USDC_ADDRESS
      goalValue = ethers.parseUnits(
        form.value.goalAmount.toString(), 
        STABLE_DECIMALS
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const end = Math.floor(new Date(form.value.endDate).getTime() / 1000)
    const duration = end - now

    toast("Confirm transaction in wallet…", "warning")

    const contract = await getWriteContract()
    const tx = await contract.createCampaign(
      metadataCid.replace("ipfs://", ""),
      goalValue,
      duration,
      contributionType,
      tokenAddress
    )

    await tx.wait()

    toast("🎉 Campaign created successfully!")

    // reset
    form.value = {
      title: "",
      description: "",
      category: "",
      goalAmount: "",
      goalCurrency: "MATIC",
      endDate: ""
    }
    imageFile.value = null
    imagePreview.value = null

  } catch (err) {
    console.error(err)
    toast(err?.reason || "Transaction failed", "error")
  } finally {
    isLoading.value = false
  }
}
</script>
