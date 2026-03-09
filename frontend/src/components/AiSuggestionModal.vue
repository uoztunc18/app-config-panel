<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h4>Suggestions for {{ requestedParameter.parameterKey }}</h4>
      </div>
      <div v-if="loading" class="spinner"></div>
      <div class="suggestion-list" v-if="!loading">
        <div
        class="suggested-config"
        v-for="mod in modifications"
        >
          <input type="text" id="suggestedCountry" v-model="mod.country" :disabled="!mod.apply"></input>
          <input type="text" id="suggestedValue" v-model="mod.value" :disabled="!mod.apply"></input>
          <input type="checkbox" id="applySuggestion" name="applySuggestion" v-model="mod.apply">
        </div>
        
        <div class="form-actions">
          <button class="add-btn" type="submit" @click="handleApply">Apply</button>
          <button class="delete-btn" type="button" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSuggestion } from "@/services/aiService";
import { ref, watch } from "vue";

const emit = defineEmits(["close", "update-country-values"]);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  requestedParameter: {
    type: Object,
    default: {},
  },
  defaultValue: {
    type: String,
    default: "",
  },
});

const loading = ref(false);
const modifications = ref([]);

const closeModal = () => {
  emit("close");
};

watch(
  () => props.requestedParameter,
  (newVal) => {
    if (newVal) {
        modifications.value = []
    } 
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) askSuggestions();
    else {
      modifications.value = []
    }
  },
);

const askSuggestions = async () => {
  try {
    if (!props.requestedParameter) return;
    
    loading.value = true;
    
    const inputData = {
      parameterKey: props.requestedParameter,
      defaultValue: props.requestedParameter.defaultValue,
    };

    const answer = await getSuggestion(inputData);

    for (let p in answer.data) {
      modifications.value.push({ country: p, 
        value: answer.data[p],
        apply: true
      })
    }
  } catch (error) {
    return error.message;
  } finally {
    loading.value = false;
  }
};

const handleApply = async () => {
  try {
    const updates = modifications.value.filter(mod => mod.apply)
    emit("update-country-values", updates);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>

<style scoped>
.modal-container {
  background: linear-gradient(to bottom left, #7913b5, #faca1d);
}

.modal-header {
  display: flex;
  justify-content: center;
}
.modal-header h4 {
  margin: 0;
  color: #f3e981;
  font-size: 15px;
  font-weight: 500;
  text-shadow: 0 0 10px #f3e981, 0 0 2px #f3e981;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.suggested-config {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px
}
.suggested-config input:first-child {
  border-radius: 100px 10px 0 0;
  text-align: center;
}
.suggested-config input[type="text"] {
  height: 2.5rem;
  color: #2d2d2d;
  background: linear-gradient(to top right, #faca1d, #ffffff);
  border-color: #faca1d;
  border-width: 1px;;
  border-radius: 4px;
  font-size: 15px;
}
.suggested-config input:disabled {
  opacity: 0.5;
} 
.suggested-config input[type="checkbox"] {
  appearance: none;
  display: grid;
  margin-left: auto;
  width: 1rem;
  height: 1rem;
  border: 1px solid;
  border-color: #ffe175;
  border-radius: 10px;
  cursor: pointer;
  place-content: center;
  transition: all 0.2s ease;
}
.suggested-config input[type="checkbox"]::before {
  content: "";
  width: 0.8rem;
  height: 0.8rem;
  transform: scale(0);
  transition: 0.15s ease-in-out;
  box-shadow: inset 1em 1em #ffe175;
  border-radius: 10px;
}
.suggested-config input[type="checkbox"]:checked::before {
  transform: scale(1);
}
.suggested-config input:first-of-type {
  width: 5rem
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>
