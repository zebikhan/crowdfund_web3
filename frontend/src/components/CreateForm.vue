<template>
  <form @submit.prevent="$emit('submit')" class="p-8 space-y-6 bg-white rounded-2xl shadow-md">

    <!-- Campaign Title -->
    <div>
      <label class="block font-semibold mb-1">Campaign Title</label>
      <input v-model="form.title" class="input" placeholder="Your campaign title" />
      <!-- {{ form.title }} -->
      <p v-if="errors?.title" class="error">{{ errors.title }}</p>
    </div>

    <!-- Campaign Description (CKEditor) -->
    <div>
      <label class="block font-semibold mb-1">Campaign Description</label>

      <ckeditor :editor="ClassicEditor" :model-value="localDescription" @update:model-value="updateDescription"
        :config="editorConfig" />

      <!-- Description -->
       <!-- <div> <label class="block font-semibold mb-1">Campaign Description</label> <textarea v-model="form.description"
          rows="3" class="input" placeholder="Describe your campaign" />
        <p v-if="errors?.description" class="error">{{ errors.description }}</p>
      </div> -->

      <!-- {{ form.description }}  -->

      <p v-if="errors?.description" class="error">{{ errors.description }}</p>
    </div>

    <!-- Category -->
    <div>
      <label class="block font-semibold mb-1">Category</label>
      <select v-model="form.category" class="input">
        <option value="" disabled>Select category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <p v-if="errors?.category" class="error">{{ errors.category }}</p>
    </div>

    <!-- Goal + Currency -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block font-semibold mb-1">Goal Amount</label>
        <div class="flex gap-2">
          <input v-model="form.goalAmount" type="number" min="0" step="0.01" class="input" placeholder="0.00" />
          <select v-model="form.goalCurrency" class="input w-28">
            <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
          </select>
        </div>
        <p v-if="errors?.goalAmount" class="error">{{ errors.goalAmount }}</p>
      </div>

      <div>
        <label class="block font-semibold mb-1">End Date</label>
        <input v-model="form.endDate" type="date" :min="minDate" class="input" />
        <p v-if="errors?.endDate" class="error">{{ errors.endDate }}</p>
      </div>
    </div>

    <!-- Campaign Image -->
    <div>
      <label class="block font-semibold mb-1">Campaign Image</label>
      <div @click="$refs.fileInput.click()" class="upload-box">Click to select image</div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFile" />
      <p v-if="errors?.image" class="error">{{ errors.image }}</p>

      <div v-if="imagePreview" class="mt-3 relative h-48 rounded-xl overflow-hidden border">
        <img :src="imagePreview" class="w-full h-full object-cover" />
        <button type="button" @click="removeFile"
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2">✕</button>
      </div>
    </div>

    <button type="submit" :disabled="isLoading"
      class="w-full py-3 rounded-lg bg-emerald-400 font-bold hover:bg-emerald-500 disabled:opacity-60">
      {{ isLoading ? "⏳ Creating..." : "Create Campaign" }}
    </button>
  </form>

</template>

<script setup>
import { ref, watch } from "vue"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

defineProps({
  form: Object,
  errors: Object,
  isLoading: Boolean,
  imagePreview: String,
  minDate: String
})

const emit = defineEmits(["submit", "fileChanged"])

const categories = [
  "Medical & Health",
  "Education",
  "Emergency Relief",
  "Small Business / Startup",
  "Technology",
  "Community Projects",
  "Environment",
  "Art & Culture",
  "Charity / Non-Profit"
]

const currencies = ["MATIC", "USDC"]

const editorConfig = {
  placeholder: "Write full campaign details here...",
  toolbar: [
    "heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|",
    "blockQuote", "undo", "redo"
  ]
}

// Update CKEditor value
function updateDescription(value) {
  localDescription.value = value
  console.log("CKEditor value:", value)
  form.description = value || ""
}

// File handlers
function onFile(e) {
  console.log("File selected:", e.target.files[0])
  emit("fileChanged", e.target.files[0] || null)
}
function removeFile() {
  console.log("File removed")
  emit("fileChanged", null)
}

</script>


<style>
.ck-editor__editable_inline {
  min-height: 200px;
  max-height: 200px;
  font-size: 1rem;
  line-height: 1.5;
}

.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

.upload-box {
  border: 2px dashed #ccc;
  height: 8rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-box:hover {
  border-color: #10B981;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
}
</style>
