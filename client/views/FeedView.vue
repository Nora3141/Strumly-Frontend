<script setup lang="ts">
import FeedComponent from "@/components/Feed/FeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Feed</h1>
    <p>(Gives you a random post when you press +)</p>

    <FeedComponent />
  </main>
</template>

<style scoped>
h1,
h2,
h3,
p {
  text-align: center;
}
</style>
