<template>
  <tr>
    <td>
      <div class="value-cell">
        <h4>Parameter Key:</h4>
        <p v-show="!editing">
          {{ props.configParameter.parameterKey }}
        </p>
        <input v-show="editing" v-model="editingConfigParameter.parameterKey" />
      </div>
    </td>

    <td>
      <div class="value-cell">
        <h4>Value:</h4>
        <div class="param-val">
          <p v-show="!editing">
            {{ parameterValue }}
          </p>
          <input v-show="editing" v-model="editingParameterValue" />
        </div>

        <button
          class="add-country-btn"
          :disabled="editing"
          @click="handleAddCountryValue">
          <i class="pi pi-plus"></i>
        </button>

        <select
          v-model="currentCountryCode"
          :disabled="countryOptions.length == 0 || editing">
          <option value="*">*</option>
          <option v-for="code in countryOptions" :key="code" :value="code">
            {{ code }}
          </option>
        </select>

        <button
          class="remove-country-btn"
          :disabled="currentCountryCode == '*' || countryOptions.length == 0 || editing"
          @click="handleDeleteCountryValue">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </td>

    <td>
      <div class="value-cell">
        <h4>Description:</h4>
        <p v-show="!editing">
          {{ props.configParameter.description }}
        </p>
        <input
          class="desc-input"
          v-show="editing"
          v-model="editingConfigParameter.description"/>
      </div>
    </td>

    <td>
      <div class="value-cell">
        <h4>Created Date:</h4>
        <p>
          {{ createdDateValue }}
        </p>
      </div>
    </td>

    <td class="row-btns">
      <button class="edit-btn" @click="handleEditClick">
        {{ editButtonText }}
      </button>
      <button
        class="delete-btn"
        @click="handleDeleteParameter"
        v-show="!editing">
        Delete
      </button>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed, defineEmits, watch } from "vue";

const editing = ref(false);
const editButtonText = computed(() => (editing.value ? "Save" : "Edit"));

const props = defineProps(["configParameter"]);
const emits = defineEmits([
  "edit-parameter",
  "delete-parameter",
  "open-country-modal",
  "delete-country-value",
]);

const editingConfigParameter = ref({});

const countryOptions = computed(() => {
  const overrides = props.configParameter.overrides || {};
  return Object.keys(overrides);
});
watch(countryOptions, (newCountryOptions) => {
  if (!newCountryOptions.includes(currentCountryCode.value)) {
    currentCountryCode.value = "*";
  }
});
const parameterValue = computed(() => {
  const overrides = props.configParameter.overrides;
  const country = currentCountryCode.value;
  return overrides?.[country] ?? props.configParameter.defaultValue;
});
const currentCountryCode = ref("*");
const editingParameterValue = ref("");
const createdDateValue = computed(() => {
  const createdAt = props.configParameter.createdAt;

  if (!createdAt || !createdAt._seconds) return "-";

  const date = new Date(createdAt._seconds * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
});

const handleEditClick = () => {
  if (!editing.value) {
    editingConfigParameter.value = JSON.parse(
      JSON.stringify(props.configParameter),
    );
    editingParameterValue.value = parameterValue.value;
    editing.value = true;
  } else {
    if (currentCountryCode.value === "*") {
      editingConfigParameter.value.defaultValue = editingParameterValue.value;
    } else {
      editingConfigParameter.value.overrides[currentCountryCode.value] =
        editingParameterValue.value;
    }
    emits("edit-parameter", editingConfigParameter.value);
    editing.value = false;
  }
};

const handleDeleteParameter = () => {
  emits("delete-parameter", props.configParameter.id);
};

const handleAddCountryValue = () => {
  emits("open-country-modal", props.configParameter.id);
};

const handleDeleteCountryValue = () => {
  emits(
    "delete-country-value",
    props.configParameter.id,
    currentCountryCode.value,
  );
};
</script>

<style scoped>
.value-cell {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.value-cell h4 {
  display: none;
}
.value-cell select {
  max-width: 4rem;
  min-width: 4rem;
  height: 60%;
  background: linear-gradient(to top right, #c75bb6, #bc8eb7);
  border: none;
  color: white;
}
.value-cell select:hover {
  background: linear-gradient(to top right, #bc8eb7, #c75bb6);
}
.value-cell select:disabled {
  background: #707070;
}
.value-cell button {
  padding: 0;
  font-size: 12px;
  background-color: transparent;
}
.value-cell button:disabled {
  color: gray;
}
.add-country-btn {
  color: #b466ab;
}
.remove-country-btn {
  color: #ed5078;
}

.param-val {
  flex: 1;
  min-width: 0;
}

.edit-btn {
  background: linear-gradient(to top right, #375af0, #377df0);
}
.edit-btn:hover {
  background: linear-gradient(to top right, #377df0, #375af0);
}

@media (max-width: 1024px) {
  .row-btns {
    display: flex;
    align-items: center;
  }

  .value-cell h4 {
    display: table-header-group;
    margin: 0;
    color: #ddd;
  }
}
</style>
