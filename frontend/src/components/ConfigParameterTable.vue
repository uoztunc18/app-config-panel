<template>
  <table>
    <colgroup>
      <col class="col-1" />
      <col class="col-1" />
      <col class="col-2" />
      <col class="col-1" />
      <col class="col-1" />
    </colgroup>
    <thead>
      <tr>
        <th>Parameter Key</th>
        <th>
          <div class="value-header">
            <span>Value</span>
          </div>
        </th>
        <th>Description</th>
        <th>
          Create Date
          <button class="sort-icon-btn" @click="toggleCreatedDataSorted">
            <i :class="sortButtonIcon"></i>
          </button>
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <ConfigParameter
        v-bind:configParameter="item"
        @open-country-modal="openAddCountryModal"
        @delete-country-value="handleDeleteCountryValue"
        @edit-parameter="handleEditParameter"
        @delete-parameter="handleDeleteParameter"
        v-for="item in sortedConfigParameters"
        :key="item.id"
      />
      <tr class="new-item-row">
        <td>
          <input placeholder="New Parameter" v-model="newParameterKey" />
        </td>
        <td>
          <input placeholder="New Value" v-model="newValue" />
        </td>
        <td colspan="2">
          <input placeholder="New Description" v-model="newDescription" />
        </td>
        <td>
          <button class="add-btn" @click="handleAddParameter">ADD</button>
        </td>
      </tr>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </tbody>
  </table>

  <AddCountryModal
    :is-open="isAddCountryModalOpen"
    :is-waiting="isAddCountryModalWaiting"
    :modal-config="addModalConfig"
    @close="closeAddCountryModal"
    @add-country-value="handleAddCountryValue"
    @get-ai-suggestion="openAISuggestionModal"
  />
  <AiSuggestionModal
    :requested-parameter="requestedParameter"
    :is-open="isAiSuggestionOpen"
    @close="closeAISuggestionModal"
    @update-country-values="handleUpdateCountryValues"
  />
</template>

<script setup>
import AddCountryModal from "./AddCountryModal.vue";
import AiSuggestionModal from "./AiSuggestionModal.vue";
import { ref, computed, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import router from "@/router/router";
import {
  createConfig,
  getAllConfigs,
  updateConfig,
  deleteConfig,
  createCountrySpecificValue,
  deleteCountrySpecificValue,
} from "../services/configService";
import ConfigParameter from "@/components/ConfigParameter.vue";
const configParameters = ref([]);

const isAiSuggestionOpen = ref(false);
const requestedParameter = ref({});
const openAISuggestionModal = (config) => {
  if (isAddCountryModalOpen.value) {
    isAddCountryModalOpen.value = false;
  }

  requestedParameter.value = config;
  isAiSuggestionOpen.value = true;
};
const closeAISuggestionModal = () => {
  requestedParameter.value = {};
  isAiSuggestionOpen.value = false;
};

const isAddCountryModalOpen = ref(false);
const isAddCountryModalWaiting = ref(false);
const addModalConfig = ref({});
const openAddCountryModal = (parameterId) => {
  const index = configParameters.value.findIndex((p) => p.id === parameterId);
  if (index !== -1) {
    addModalConfig.value = configParameters.value[index];
    isAddCountryModalOpen.value = true;
  }
};
const closeAddCountryModal = () => {
  addModalConfig.value = {};
  isAddCountryModalOpen.value = false;
};
const newParameterKey = ref("");
const newDescription = ref("");
const newValue = ref("");

const errorMessage = ref("");

const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
  NONE: "none",
};

const createdDateSortOrder = ref(SORT_ORDER.NONE);
const sortButtonIcon = computed(() => {
  return createdDateSortOrder.value === SORT_ORDER.NONE
    ? "pi pi-sort-alt-slash"
    : createdDateSortOrder.value === SORT_ORDER.DESC
      ? "pi pi-arrow-up"
      : "pi pi-arrow-down";
});
const sortedConfigParameters = computed(() => {
  const params = configParameters.value;

  // switch (createdDateSortOrder.value) {
  //   case SORT_ORDER.NONE:
  //     return params;
  //   case SORT_ORDER.DESC:
  //     return params.sort((a, b) => {
  //       return a.createdDate < b.createdDate;
  //     });
  //   case SORT_ORDER.ASC:
  //     return params.sort((a, b) => {
  //       return a.createdDate > b.createdDate;
  //     });
  //   default:
  //     console.log("Unknown sort order!");
  return params;
  // }
});

function toggleCreatedDataSorted() {
  createdDateSortOrder.value =
    createdDateSortOrder.value === SORT_ORDER.NONE
      ? SORT_ORDER.ASC
      : createdDateSortOrder.value === SORT_ORDER.ASC
        ? SORT_ORDER.DESC
        : SORT_ORDER.NONE;
}

onMounted(async () => {
  try {
    const result = await getAllConfigs();

    if (result.success) {
      configParameters.value = result.data;
      errorMessage.value = "";
      console.log("Fetched all configs", result.data);
    } else {
      errorMessage.value = result.error;
    }
  } catch (err) {
    errorMessage.value = err;
  }
});

async function handleAddParameter() {
  try {
    const user = getAuth().currentUser;

    if (!user) {
      router.push("/signin");
      return;
    }

    const newConfig = {
      userId: await user.getIdToken(),
      parameterKey: newParameterKey.value,
      defaultValue: newValue.value,
      description: newDescription.value,
    };
    const result = await createConfig(newConfig);

    if (result.success) {
      configParameters.value.push(result.data);
      resetFields();
      errorMessage.value = "";
      console.log("Created config with ID:", result.data.id);
    } else {
      errorMessage.value = result.error;
    }
  } catch (err) {
    errorMessage.value = err;
  }
}

async function handleEditParameter(updatedConfigParameter) {
  try {
    const result = await updateConfig(updatedConfigParameter);

    if (result.success) {
      const updatedItem = result.data;

      const index = configParameters.value.findIndex(
        (config) => config.id === updatedItem.id,
      );
      if (index !== -1) {
        configParameters.value[index] = updatedItem;
      }
      errorMessage.value = "";
      console.log("Updated config:", configParameters.value[index]);
    } else {
      errorMessage.value = result.error;
    }
  } catch (err) {
    errorMessage.value = err;
  }
}

async function handleDeleteParameter(deletedId) {
  try {
    const result = await deleteConfig(deletedId);

    if (!result.success) {
      console.log("Error: ", result.message);
      return;
    }

    configParameters.value = configParameters.value.filter(
      (parameter) => parameter.id !== deletedId,
    );
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

async function handleAddCountryValue(configId, addedData, configLastUpdatedAt) {
  try {
    isAddCountryModalWaiting.value = true;
    const result = await createCountrySpecificValue(
      configId,
      addedData.code,
      addedData.value,
      configLastUpdatedAt,
    );

    if (!result.success) {
      console.log("Error: ", result.message);
      return;
    }

    const index = configParameters.value.findIndex(
      (config) => config.id === configId,
    );

    if (index !== -1) {
      const updatedConfig = { ...configParameters.value[index] };

      updatedConfig.overrides = {
        ...updatedConfig.overrides,
        [addedData.code]: addedData.value,
      };
      updatedConfig.updatedAt = result.data;
      configParameters.value[index] = updatedConfig;

      isAddCountryModalOpen.value = false;
    }
  } catch (err) {
    console.log("Error: ", err.message);
  } finally {
    isAddCountryModalWaiting.value = false;
  }
}

async function handleDeleteCountryValue(configId, currentCountryCode) {
  try {
    if (!currentCountryCode) {
      return;
    }

    const result = await deleteCountrySpecificValue(
      configId,
      currentCountryCode,
    );

    if (!result.success) {
      console.log("Error: ", result.message);
      return;
    }

    const index = configParameters.value.findIndex(
      (config) => config.id === configId,
    );

    if (index !== -1) {
      const updatedConfig = { ...configParameters.value[index] };
      const newOverrides = { ...updatedConfig.overrides };
      delete newOverrides[currentCountryCode];
      updatedConfig.overrides = newOverrides;
      configParameters.value[index] = updatedConfig;
    }
  } catch (err) {
    console.log("Error: ", err.message);
  }
}

const handleUpdateCountryValues = async (updates) => {
  try {
    const config = requestedParameter.value;

    if (!config.overrides) config.overrides = {};
    updates.forEach((upd) => {
      config.overrides[upd.country] = upd.value;
    });

    handleEditParameter(config);
    isAiSuggestionOpen.value = false;
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

function resetFields() {
  newParameterKey.value = "";
  newDescription.value = "";
  newValue.value = "";
}
</script>

<style>
table {
  width: 100%;
  border-spacing: 2em 0.2em;
  table-layout: fixed;
}
table p {
  margin: 0;
}
table td,
table th,
table p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
table th {
  font-size: 25px;
  font-weight: 200;
  color: #595b5d;
  text-align: left;
}
table td {
  height: 3.5rem;
}
.col-1 {
  width: calc(100% / 6);
}
.col-2 {
  width: calc(100% * 2 / 6);
}

.sort-icon-btn {
  padding: 0;
  font-size: 1rem;
  color: #595b5d;
  background-color: transparent;
}

input {
  width: 100%;
  height: 3rem;
  padding: 0.8em 0.75em;
  color: rgb(144, 144, 144);
  background-color: transparent;
  box-sizing: border-box;
  border: 1px solid;
  border-color: #373737;
  border-radius: 4px;
  font-size: 15px;
}
input::placeholder {
  color: #4b4b4b;
}
input:focus-visible {
  outline: 1px solid #c75bb6;
}

button {
  padding: 0.3rem 1rem;
  color: #cdcdcd;
  font-family: -apple-system;
  font-size: 1rem;
  border: none;
  border-radius: 0.4rem;
}

.add-btn {
  background: linear-gradient(to top right, #327de3, #3bdfc4);
}
.add-btn:not(:disabled):hover {
  background: linear-gradient(to top right, #3bdfc4, #327de3);
}
.delete-btn {
  margin-left: 1rem;
  background: linear-gradient(to top right, #de3129, #ed5078);
}
.delete-btn:hover {
  background: linear-gradient(to top right, #ed5078, #de3129);
}

.value-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 1024px) {
  table thead {
    display: none;
  }

  table {
    padding: 2rem;
  }

  table,
  table tbody,
  table tr,
  table td {
    display: block;
  }

  table tr {
    height: auto;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 1rem;
    box-sizing: border-box;
  }
  table td {
    height: 2.5rem;
    justify-content: center;
  }
  table input {
    height: 2rem;
  }

  .new-item-row {
    display: flex;
    flex-direction: column;
  }
  .new-item-row td {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>
