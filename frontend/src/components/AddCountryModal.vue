<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h4>{{ modalConfig.parameterKey }}</h4>
        <button type="button" @click="getAiSuggestion">
          <span>Get AI suggestion!</span>
          <i class="pi pi-sparkles"></i>
        </button>
      </div>

      <div v-if="isWaiting" class="spinner"></div>

      <div v-if="!isWaiting">
        <form @submit.prevent="handleSubmit">
          <div class="country-label-row">
            <label for="countryName">Country Code</label>
            <span v-if="countryError" class="country-error">{{ countryErrorText }}</span>
          </div>
          <input
            id="countryName"
            type="text"
            placeholder="TUR"
            v-model="formData.code"
            required
          />

          <label for="countryCode">Value</label>
          <input
            id="countryValue"
            type="text"
            placeholder="Enter some value..."
            v-model="formData.value"
            required
          />

          <div class="form-actions">
            <button class="add-btn" :disabled="countryError" type="submit">Add</button>
            <button class="delete-btn" type="button" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["close", "add-country-value", "get-ai-suggestion"]);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isWaiting: {
    type: Boolean,
    default: false,
  },
  modalConfig: {
    type: Object,
    default: () => ({}),
  },
});

const formData = ref({
  code: "",
  value: "",
});

const countryError = ref(false);
const countryErrorText = ref("Country already exists!");
watch(
  () => formData.value.code,
  (newCode) => {
    if (props.modalConfig.overrides && newCode in props.modalConfig.overrides) {
      countryError.value = true;
    } else {
      countryError.value = false;
    }
  },
);

const getAiSuggestion = () => {
  closeModal();
  emit("get-ai-suggestion", props.modalConfig);
};

const closeModal = () => {
  emit("close");
};

const resetForm = () => {
  formData.value = {
    code: "",
    value: "",
  };
};

watch(
  () => props.modalConfig.country,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal };
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  },
);

const handleSubmit = async () => {
  try {
    emit(
      "add-country-value",
      props.modalConfig.id,
      formData.value,
      props.modalConfig.updatedAt,
    );
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>

<style scoped>
.modal-container {
  width: 60%;
  max-width: 30rem;
  background: linear-gradient(to top right, #241a2a, #3d1a56);
}
.modal-container input {
  margin-top: 0.8rem;
  margin-bottom: 1rem;
}
.modal-container label {
  font-size: 14px;
  font-weight: 50;
}

.modal-header {
  display: flex;
  flex-direction: row;
}
.modal-header h4 {
  margin: 0;
  color: #70486b;
  font-family: -apple-system;
  font-size: 20px;
  font-weight: 200;
}
.modal-header button {
  display: flex;
  align-items: center;
  padding: 0;
  margin-left: auto;
  font-size: 1.3rem;
  color: #f3e981;
  background-color: transparent;
  border: 0;
  text-shadow: 0 0 0px #f3e981, 0 0 5px #f3e981 ;
}
.modal-header button:hover {
  animation: none;
  text-shadow:
    0 0 12px #f3e981,
    0 0 20px #f3e981;
}
.modal-header span {
  font-size: 10px;
  font-weight: 100;
  margin-right: 0.5rem;
}

.country-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.country-label-row span {
  color: #ed5078;
  font-size: 10px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

input::-webkit-contacts-auto-fill-button {
  visibility: hidden;
  display: none !important;
}
</style>
