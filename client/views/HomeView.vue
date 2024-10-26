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

function goToLogin() {
  void router.push({ name: "Login" });
}

onBeforeMount(async () => {
  await getTrendingPosts(6);
  await getTrendingRemixedPosts(6);
});
</script>

<template>
  <main class="background-blank-whole whole-page">
    <div class="container column">
      <h1 class="page-title mclaren-regular">Welcome to Strumly!</h1>
      <div v-if="!isLoggedIn" class="top-section">
        <div class="lower-z alert alert-warning d-flex align-items-top khula-light" role="alert">
          <i class="bi bi-exclamation-triangle-fill" style="font-size: 1.25rem; margin-right: 10px"></i>
          <div>
            <p>We noticed you're not logged in! Log in to be able to create and act on posts.</p>
          </div>
        </div>
        <button class="khula-regular login-button" @click="goToLogin">Login or Register</button>
      </div>
      <p v-else class="khula-light">Get started by searching for a song or checking out some of the trending posts</p>
      <TrendingBox class="trending-box" :sectionTitle="'Trending Posts'" :posts="trendingPosts" />
      <TrendingBox class="trending-box" :sectionTitle="'Getting Remixed in the Community'" :posts="trendingRemixedPosts" />
    </div>
  </main>
</template>

<style scoped>
.lower-z {
  z-index: 1;
}
.page-title {
  margin-top: 80px;
}
h1,
h2 {
  text-align: center;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
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

.login-button {
  border-radius: 20px;
  background-color: #4fa037;
  color: white;
  padding: 10px;
  font-size: 1.3em;
  width: fit-content;
}

.login-button:hover {
  background-color: #408b29;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
