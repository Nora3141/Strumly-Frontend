<script setup lang="ts">
import router from "@/router";
import { nextTick, ref } from "vue";
import { useRoute } from "vue-router";
const currentRoute = useRoute(); // Access the current route

let searchQuery = ref("");

async function enterSearch() {
  console.log("entering search!!");
  const toSearch = searchQuery.value.trim(); // Trim to remove unnecessary whitespace
  if (!toSearch) return; // Return if the search is empty

  // Check if we're on the Search page
  if (currentRoute.name === "Search") {
    // Replace the current route with the new query
    await router.replace({ name: "Search", query: { searchQuery: toSearch } });
    window.location.reload();
  } else {
    // Navigate to the Search page with the new query
    await router.push({ name: "Search", query: { searchQuery: toSearch } });
  }

  // Clear the search query after navigation
  await nextTick(); // Ensure the DOM updates first
  searchQuery.value = ""; // Clear the input field
}
</script>

<template>
  <div class="search-container">
    <div class="input-group">
      <span class="input-group-text">
        <i class="bi bi-search"></i>
      </span>
      <input v-model="searchQuery" type="text" placeholder="title or prefix" class="form-control search-bar" @keydown.enter="enterSearch" />
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
