<script setup lang="ts">
import TrendingBox from "@/components/Home/TrendingBox.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let trendingPosts = ref<Array<Record<string, string>>>([]);
let trendingRemixedPosts = ref<Array<Record<string, string>>>([]);
let searchQuery = ref("");

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

function enterSearch() {
  void router.push({ name: "Search", query: { searchQuery: String(searchQuery.value) } });
}

onBeforeMount(async () => {
  document.body.classList.add("no-scroll");
  await getTrendingPosts(3);
  await getTrendingRemixedPosts(3);
});
</script>

<template>
  <main class="background-blank-whole whole-page no-scroll">
    <div class="container column">
      <h1 class="page-title mclaren-regular">Welcome to Strumly!</h1>
      <p class="khula-light">Get started by searching for a song or checking out some of the trending posts</p>
      <div class="search-container">
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input v-model="searchQuery" type="text" placeholder="Cool Song" class="form-control search-bar" @keydown.enter="enterSearch" />
        </div>
      </div>
      <TrendingBox class="trending-box" :sectionTitle="'Trending Posts'" :posts="trendingPosts" />
      <TrendingBox class="trending-box" :sectionTitle="'Getting Remixed in the Community'" :posts="trendingRemixedPosts" />
    </div>
  </main>
</template>

<style scoped>
.page-title {
  margin-top: 40px;
}
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

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
}

.search-results {
  list-style-type: none;
  padding: 0;
  width: 100%;
  margin-top: 10px;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.search-results li:hover {
  background-color: #f0f0f0;
}
</style>
