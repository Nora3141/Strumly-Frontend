<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["specificPostID"]);

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let tagsActivationStatus = ref<boolean[]>([false, false, false, false, false, false, false]);
let ALL_TAGS = ["Guitar", "Piano", "Voice", "Drums", "Easy", "Medium", "Hard"];
let includedTags = ref<string[]>([]);

async function getRandomPost() {
  const filters = includedTags.value.join(",");
  let query: Record<string, string> = {}; // Initialize as an empty object
  let postResults;
  console.log("about to call get random post on filters: ", filters);
  console.log("filters is empty string", !filters);

  // Only add tagNames to the query if filters is not empty
  if (filters) {
    console.log("yes filters");
    query.tagNames = filters; // Set tagNames only if filters are defined
    try {
      // postResults = await fetchy("/api/filtering/getRandomPostFiltered", "GET", { query }); // pass query object
      let query: Record<string, string> = {};
      postResults = await fetchy(`/api/filtering/getRandomPostFiltered/${filters}`, "GET", { query });
    } catch (error) {
      console.log("An error occurred fetching a random post for the feed: ", error);
      return;
    }
  } else {
    try {
      let query: Record<string, string> = {};
      postResults = await fetchy("/api/posts", "GET", { query });
      const randomIdx = Math.floor(Math.random() * postResults.length);
      postResults = [postResults[randomIdx]];
    } catch (error) {
      console.log("An error occurred fetching a random post for the feed: ", error);
      return;
    }
  }
  console.log("got post results value: ", postResults);
  posts.value = postResults;
}

async function getSpecificPost(id: string) {
  let postResults;
  try {
    let query: Record<string, string> = {};
    postResults = await fetchy(`/api/posts/getByID/${id}`, "GET", { query });
  } catch (error) {
    console.log("An error occurred fetching a specific post for the feed: ", error);
    return;
  }
  posts.value = postResults;
}

function clickTagButton(idx: number) {
  tagsActivationStatus.value[idx] = !tagsActivationStatus.value[idx];
  const tagName = ALL_TAGS[idx];
  if (tagsActivationStatus.value[idx] && !includedTags.value.includes(tagName)) {
    // just turned on, add to the current filters
    includedTags.value.push(tagName);
  } else if (!tagsActivationStatus.value[idx] && includedTags.value.includes(tagName)) {
    // just turned off, need to remove
    includedTags.value = includedTags.value.filter((tag) => tag !== tagName);
  }
}

onBeforeMount(async () => {
  if (props.specificPostID == "") {
    await getRandomPost();
  } else {
    await getSpecificPost(props.specificPostID);
  }
  loaded.value = true;
});
</script>

<template>
  <div class="filters-bar">
    <div class="tagButtons khula-light">
      <button :class="tagsActivationStatus[0] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(0)">Guitar</button>
      <button :class="tagsActivationStatus[1] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(1)">Piano</button>
      <button :class="tagsActivationStatus[2] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(2)">Voice</button>
      <button :class="tagsActivationStatus[3] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(3)">Drums</button>
      <button :class="tagsActivationStatus[4] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(4)">Easy</button>
      <button :class="tagsActivationStatus[5] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(5)">Medium</button>
      <button :class="tagsActivationStatus[6] ? 'tagButtonPressed' : 'tagButtonUnpressed'" @click="clickTagButton(6)">Hard</button>
    </div>
  </div>
  <div class="feedBlock">
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent :post="post" @refreshPosts="getRandomPost" />
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
    <button class="nextPostButton" @click="getRandomPost">Next ▼</button>
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
  border-radius: 20px;
  margin: 5px;
  background-color: rgb(81, 184, 81);
  border: none;
  padding: 10px;
}

.nextPostButton:hover {
  background-color: rgb(52, 116, 52);
}

.posts {
  width: fit-content;
  display: flex;
  flex-direction: column;
}

h3 {
  text-align: center;
}

.tagButtons {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.tagButtonUnpressed {
  background-color: rgb(196, 196, 196);
  padding: 5px;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: 5px;
  margin-left: 5px;
  border: none;
  border-radius: 20px;
}

.tagButtonPressed {
  background-color: rgb(81, 81, 81);
  color: rgb(177, 177, 177);
  padding: 5px;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: 5px;
  margin-left: 5px;
  border: none;
  border-radius: 20px;
}

.filters-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.filter-text {
  font-size: 1.25em;
}
</style>
