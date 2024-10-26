<script setup lang="ts">
import PostThumbnail from "@/components/Home/PostThumbnail.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

let searchQuery = ref("");
let loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
const currentRoute = useRoute();

async function getSearchResults() {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/${searchQuery.value}`, "GET");
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

onBeforeMount(async () => {
  searchQuery.value = currentRoute.query.searchQuery ? String(currentRoute.query.searchQuery) : "";
  await getSearchResults();
  loaded.value = true;
});
</script>

<template>
  <main class="background-blank-whole">
    <h1 class="khula-bold page-title">Search Results For: "{{ searchQuery }}"</h1>
    <p v-if="!loaded">Loading...</p>
    <p v-if="posts.length == 0">No posts found.</p>
    <section class="posts row justify-content-center mx-auto posts-section" v-if="loaded && posts.length !== 0" style="max-width: 50%">
      <article class="col-12 col-sm-6 col-md-4" v-for="post in posts" :key="post._id" style="padding: 10px">
        <PostThumbnail :post="post" />
      </article>
    </section>
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

.page-title {
  margin-top: 40px;
  margin-bottom: 40px;
}

.posts-section {
  background-color: white;
  padding: 20px;
}
</style>
