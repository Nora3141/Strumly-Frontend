<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";

let searchQuery = ref("");

function enterSearch() {
  console.log("entering search!!");
  void router.push({ name: "Search", query: { searchQuery: String(searchQuery.value) } });
}
</script>

<template>
  <div class="search-container">
    <div class="input-group">
      <span class="input-group-text">
        <i class="bi bi-search"></i>
      </span>
      <input v-model="searchQuery" type="text" placeholder="Cool Song" class="form-control search-bar" @keydown.enter="enterSearch" />
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}
</style>
