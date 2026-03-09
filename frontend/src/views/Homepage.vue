<template>
  <div class="table-wrapper">
    <ConfigParameterTable />
  </div>
</template>

<script setup>
import ConfigParameterTable from "@/components/ConfigParameterTable.vue";
</script>

<style>
html {
  font-size: 14px;
  letter-spacing: 0.04em;
  font-family: -apple-system;
  font-weight: 200;
  color: rgb(163, 163, 163);
}

.table-wrapper {
  display: flex;
  justify-content: center;
}
</style>
