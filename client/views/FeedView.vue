<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FeedComponent from "@/components/Feed/FeedComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Feed</h1>
    <FeedComponent />
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
</style>
