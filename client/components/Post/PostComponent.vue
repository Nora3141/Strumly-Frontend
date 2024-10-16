<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";
import FavoriteComponent from "@/components/Post/FavoriteComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
let numFavorites = ref(0);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const getFavoritesOnPost = async () => {
  try {
    numFavorites.value = (await fetchy(`/api/favoriting/favoriteCount/${props.post._id}`, "GET")).result;
  } catch (error) {
    console.log("An error occurred fetching the number of favorites on a post: ", error);
  }
};

onBeforeMount(async () => {
  await getFavoritesOnPost();
});
</script>

<template>
  <article class="content">
    <p class="author">{{ props.post.videoTitle }}</p>
    <p class="author">by {{ props.post.author }}</p>
    <iframe :src="props.post.videoURL" width="600" height="400"></iframe>
    <p>Description: {{ props.post.videoDescription }}</p>
    <p v-if="props.post.originalArtist !== null">Original Artist: {{ props.post.originalArtist }}</p>
    <p class="author">Num favorites:{{ numFavorites }}</p>
  </article>
  <div class="base">
    <FavoriteComponent :post="post" @refreshFavCount="getFavoritesOnPost" />
    <menu v-if="props.post.author == currentUsername">
      <!-- <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li> -->
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}

.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}
</style>
