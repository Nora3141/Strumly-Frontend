<script setup lang="ts">
import FeedComponent from "@/components/Feed/FeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

let specificPost = ref("");
const currentRoute = useRoute();

onBeforeMount(async () => {
  specificPost.value = currentRoute.query.specificPost ? String(currentRoute.query.specificPost) : "";
  console.log("got specific post value (in feedview): ", specificPost.value);
});
</script>

<template>
  <main>
    <h1 class="mclaren-regular">Feed</h1>
    <FeedComponent :specificPostID="specificPost" />
  </main>
</template>

<style scoped>
h1,
h2,
h3,
p {
  text-align: center;
}

h1 {
  padding-top: 80px;
}
</style>
