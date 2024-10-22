<script setup lang="ts">
import FavoriteComponent from "@/components/Post/FavoriteComponent.vue";
import TagComponent from "@/components/Post/TagComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let numFavorites = ref(0);
let numRemixes = ref(0);
let tagNames = ref([]);
const tagStringToAdd = ref("");

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

const getRemixesOnPost = async () => {
  try {
    numRemixes.value = await fetchy(`/api/remixing/getNumRemixed/${props.post._id}`, "GET");
  } catch (error) {
    console.log("An error occurred fetching the number of remixes on a post: ", error);
  }
};

const getTagsOnPost = async () => {
  console.log("getting tag names...");
  try {
    tagNames.value = await fetchy(`/api/filtering/getTags/${props.post._id}`, "GET");
  } catch (error) {
    console.log("An error occurred fetching the tags on a post: ", error);
  }
  console.log("tag names found were: ", tagNames.value);
};

const addTagToPost = async () => {
  try {
    await fetchy(`/api/filtering/addTag/${props.post._id}`, "POST", {
      body: { postID: props.post._id, tagName: tagStringToAdd.value },
    });
  } catch (error) {
    console.log("An error occurred adding tags to a post: ", error);
  }
  await getTagsOnPost();
};

const removeTagOnPost = async (tagToDeleteName: string) => {
  try {
    await fetchy(`/api/filtering/removeTag/${props.post._id}`, "POST", {
      body: { postID: props.post._id, tagName: tagToDeleteName },
    });
  } catch (error) {
    console.log("An error occurred adding tags to a post: ", error);
  }
  await getTagsOnPost();
};

function remixPost() {
  void router.push({ name: "Create", query: { originalPost: String(props.post._id) } });
}

onBeforeMount(async () => {
  await getFavoritesOnPost();
  await getRemixesOnPost();
  await getTagsOnPost();
});
</script>

<template>
  <article class="content">
    <p class="title">{{ props.post.videoTitle }}</p>
    <div class="authorSection">
      <img src="@/assets/images/profile-icon.png" />
      <p class="author">{{ props.post.author }}</p>
    </div>
    <iframe :src="props.post.videoURL" width="750" height="500"></iframe>
    <p>Description: {{ props.post.videoDescription }}</p>
    <p v-if="props.post.originalArtist !== null">Original Artist: {{ props.post.originalArtist }}</p>
  </article>

  <div class="base">
    <FavoriteComponent v-if="isLoggedIn" :post="post" @refreshFavCount="getFavoritesOnPost" />
    <p class="author">(x {{ numFavorites }} )</p>
    <button @click="remixPost">Remix</button>
    <p class="author">(x {{ numRemixes }} )</p>
    <menu v-if="props.post.author == currentUsername">
      <!-- <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li> -->
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>

  <div class="tagsList">
    <article v-for="tagName in tagNames" :key="tagName">
      <TagComponent :tagName="tagName" @removeTagFromPost="removeTagOnPost(tagName)" />
    </article>
  </div>

  <form @submit.prevent="addTagToPost()">
    <p>Add tags:</p>
    <textarea id="tags" v-model="tagStringToAdd" class="form-control mt-2 required-field" placeholder="tag1" required></textarea>
    <button type="submit" class="btn btn-primary w-100">Add to Post</button>
  </form>
</template>

<style scoped>
img {
  width: 20px;
  height: 20px;
}

.author {
  font-family: "Khula", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.2em;
  margin: 5px;
}

.title {
  font-family: "Khula", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 1.5em;
  margin: 0;
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
  flex-direction: column;
  max-width: 750px;
  margin: 0 auto;
}

.authorSection {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: -10px;
}

.tagsList {
  display: flex;
  flex-direction: row;
}
</style>
