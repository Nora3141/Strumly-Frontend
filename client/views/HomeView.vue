<script setup lang="ts">
import TrendingBox from "@/components/Home/TrendingBox.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let trendingPosts = ref<Array<Record<string, string>>>([]);
let trendingRemixedPosts = ref<Array<Record<string, string>>>([]);

async function getTrendingPosts(numToGet: number) {
  let query: Record<string, string> = {};
  let postResults;
  try {
    postResults = await fetchy(`/api/favoriting/getTrendingFavorited/${numToGet}`, "GET", { query });
  } catch (error) {
    console.log("an error occurred fetching the trending posts: ", error);
    return;
  }
  trendingPosts.value = postResults;
}

async function getTrendingRemixedPosts(numToGet: number) {
  let query: Record<string, string> = {};
  let postResults;
  try {
    postResults = await fetchy(`/api/remixing/getTrendingRemixed/${numToGet}`, "GET", { query });
  } catch (error) {
    console.log("an error occurred fetching the trending remixed posts: ", error);
    return;
  }
  trendingRemixedPosts.value = postResults;
}

onBeforeMount(async () => {
  await getTrendingPosts(3);
  await getTrendingRemixedPosts(3);
});
</script>

<template>
  <main class="background-blank whole-page">
    <div class="container column">
      <h1 class="pageHeader">HOME PAGE</h1>
      <TrendingBox class="trending-box" :sectionTitle="'Trending Posts'" :posts="trendingPosts" />
      <TrendingBox class="trending-box" :sectionTitle="'Getting Remixed in the Community'" :posts="trendingRemixedPosts" />
    </div>
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
.trending-box {
  margin-top: 20px;
}

.whole-page {
  height: 100vh;
}
</style>
