<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

async function getRandomPost() {
  let query: Record<string, string> = {}; // todo: put filters here later
  let postResults;
  try {
    postResults = await fetchy("/api/filtering/getRandomPostFiltered", "GET", { query });
  } catch (error) {
    console.log("An error occurred fetching a random post for the feed: ", error);
    return;
  }
  posts.value = postResults;
}

onBeforeMount(async () => {
  await getRandomPost();
  loaded.value = true;
});
</script>

<template>
  <div class="feedBlock">
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent :post="post" @refreshPosts="getRandomPost" />
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
    <button class="nextPostButton" @click="getRandomPost">+</button>
  </div>
</template>

<style scoped>
article {
  background-color: var(--base-bg);
  border-radius: 1em;
  gap: 0.5em;
  padding: 1em;
  width: fit-content;
}
.feedBlock {
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  align-items: center;
  padding: 5px;
}
.nextPostButton {
  border-radius: 100%;
  margin: 5px;
}

.posts {
  width: fit-content;
  display: flex;
  flex-direction: column;
}
</style>
