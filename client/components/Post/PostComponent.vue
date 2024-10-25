<script setup lang="ts">
import FavoriteComponent from "@/components/Post/FavoriteComponent.vue";
import TagComponent from "@/components/Post/TagComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let numFavorites = ref(0);
let numRemixes = ref(0);
let tagNames = ref<string[]>([]);
let infoShowing = ref(false);
const tagStringToAdd = ref("");

const deletePost = async () => {
  const confirmed = confirm("Are you sure you want to delete this post? This action cannot be undone.");
  if (!confirmed) {
    return;
  }
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

const addTagToPost = async (tagNameString: string) => {
  try {
    await fetchy(`/api/filtering/addTag/${props.post._id}`, "POST", {
      body: { postID: props.post._id, tagName: tagNameString },
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
  void router.push({ name: "Create", query: { originalPost: String(props.post._id), originalPostName: String(props.post.videoTitle) } });
}

function toggleInfoShowing() {
  infoShowing.value = !infoShowing.value;
}

onBeforeMount(async () => {
  await getFavoritesOnPost();
  await getRemixesOnPost();
  await getTagsOnPost();
});
</script>

<template>
  <main>
    <div v-if="props.post.author == currentUsername" class="d-flex align-items-center text-muted mb-2">
      <i class="bi bi-exclamation-circle me-2"></i>
      <p class="mb-0">As the creator of this post, you can choose to delete it or edit the tags</p>
    </div>
    <div class="post-and-info-wrapper">
      <div :class="['post-component-wrapper', infoShowing ? 'post-square' : 'post-rounded']">
        <article class="content khula-regular">
          <menu v-if="props.post.author == currentUsername">
            <li><button class="button-error btn-small pure-button delete-button" @click="deletePost">delete</button></li>
          </menu>
          <div class="post-header">
            <h4 class="title khula-bold">{{ props.post.videoTitle }}</h4>
            <div class="authorSection">
              <img src="@/assets/images/profile-icon.png" width="20px" height="20px" />
              <p class="author">{{ props.post.author }}</p>
            </div>
            <button @click="toggleInfoShowing" class="btn"><i class="bi bi-info-circle"></i></button>
          </div>
          <div class="video-container">
            <iframe :src="props.post.videoURL" width="315" height="560" allowfullscreen frameborder="0"></iframe>
          </div>
        </article>

        <div class="base">
          <div class="action-part">
            <FavoriteComponent v-if="isLoggedIn" :post="post" @refreshFavCount="getFavoritesOnPost" />
            <p class="khula-regular">(x {{ numFavorites }} )</p>
          </div>
          <div class="action-part">
            <button class="action-button" @click="remixPost"><img src="@/assets/images/remix-icon.png" width="30px;" height="30px;" /></button>
            <p class="khula-regular">(x {{ numRemixes }} )</p>
          </div>
        </div>
      </div>
      <div v-if="infoShowing" class="info-wrapper">
        <h4 class="info-section-header khula-bold">About this post:</h4>
        <p class="khula-regular">{{ props.post.videoDescription }}</p>
        <hr />
        <h4 v-if="props.post.originalArtist" class="info-section-header khula-bold">Original Artist:</h4>
        <p v-if="props.post.originalArtist" class="khula-regular">{{ props.post.originalArtist }}</p>
        <hr v-if="props.post.originalArtist" />
        <h4 class="info-section-header khula-bold">Tags:</h4>
        <div class="tagsList tags-grid">
          <article v-for="tagName in tagNames" :key="tagName">
            <TagComponent :tagName="tagName" @removeTagFromPost="removeTagOnPost(tagName)" />
          </article>
        </div>
        <div v-if="props.post.author == currentUsername" class="add-tags-grid khula-regular">
          <button v-if="!tagNames.includes('Guitar')" @click="addTagToPost('Guitar')" class="add-tag">+ Guitar</button>
          <button v-if="!tagNames.includes('Piano')" @click="addTagToPost('Piano')" class="add-tag">+ Piano</button>
          <button v-if="!tagNames.includes('Voice')" @click="addTagToPost('Voice')" class="add-tag">+ Voice</button>
          <button v-if="!tagNames.includes('Drums')" @click="addTagToPost('Drums')" class="add-tag">+ Drums</button>
          <button v-if="!tagNames.includes('Easy')" @click="addTagToPost('Easy')" class="add-tag">+ Easy</button>
          <button v-if="!tagNames.includes('Medium')" @click="addTagToPost('Medium')" class="add-tag">+ Medium</button>
          <button v-if="!tagNames.includes('Hard')" @click="addTagToPost('Hard')" class="add-tag">+ Hard</button>
          <!--
          <form @submit.prevent="addTagToPost()">
            <p>Add tags:</p>
            <textarea id="tags" v-model="tagStringToAdd" class="form-control mt-2 required-field" placeholder="tag1" required></textarea>
            <button type="submit" class="btn btn-primary w-100">Add to Post</button>
          </form>
        --></div>
        <article class="timestamp">
          <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
          <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.video-container {
  /* Set the dimensions for the cropped video */
  width: 500px; /* or a specific width, e.g., 500px */
  height: 600px; /* Custom height you want for cropping */

  position: relative;
  overflow: hidden;
}

.video-container iframe {
  /* Maintain the aspect ratio of the video, but stretch it to fill the container */
  position: absolute;
  width: 500px;
  height: 600px; /* Increase the height to zoom in and crop */
}
.post-component-wrapper {
  border: 1px solid black;
  overflow: hidden;
  background-color: white;
}
.post-rounded {
  border-radius: 20px;
}

.post-square {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.post-header {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.action-button {
  border: none;
  box-shadow: none;
  background: transparent; /* In case there's a background color */
}

.author {
  margin: 5px;
}

.title {
  padding: 10px;
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
  flex-direction: row;
  justify-items: center;
  z-index: 10;
  margin-top: auto;
  padding: 5px;
}

.base article:only-child {
  margin-left: auto;
}

.content {
  display: flex;
  flex-direction: column;
  width: fit-content;
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

.post-and-info-wrapper {
  display: flex;
  flex-direction: row;
}

.info-wrapper {
  background-color: white;
  border: 1px solid gray;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.info-section-header {
  margin: 10px;
  padding: 10px;
}

.action-part {
  display: flex;
  flex-direction: row;
}

p {
  text-align: center;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 70px);
}

.add-tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
}

.add-tag {
  background-color: rgb(59, 206, 66);
  padding: 5px;
  border-radius: 10px;
  width: fit-content;
  margin: 5px;
  position: relative;
  border: none;
}
</style>
