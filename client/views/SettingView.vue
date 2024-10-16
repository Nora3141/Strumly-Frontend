<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import ProfilePostListComponent from "../components/Post/ProfilePostListComponent.vue";
import { ref, onBeforeMount } from "vue";
import { fetchy } from "@/utils/fetchy";

const { currentUsername, currentUserID } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
let myPosts = ref<Array<Record<string, string>>>([]);
let favoritedPosts = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}

// moving functions over from ProfilePostListComponent
async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (error) {
    console.log("an error occurred fetching user's posts: ", error);
    return;
  }
  myPosts.value = postResults;

  let favoritedPostResults;
  try {
    console.log("current user id is: ", currentUserID.value);
    favoritedPostResults = await fetchy(`/api/favoriting/getFavorites/${currentUserID.value}`, "GET");
  } catch (error) {
    console.log("an error occurred fetching user's favorited posts: ", error);
    return;
  }
  favoritedPosts.value = favoritedPostResults;

  console.log("my results: ", postResults);
  console.log("favorited results: ", favoritedPostResults);
}

async function refreshPosts() {
  await getPosts(currentUsername.value);
}

onBeforeMount(async () => {
  await getPosts(currentUsername.value);
  loaded.value = true;
});
</script>

<template>
  <main class="column">
    <h1>Profile</h1>
    <h2>{{ currentUsername.toUpperCase() }}</h2>
    <h2>MY POSTS:</h2>
    <ProfilePostListComponent :posts="myPosts" :loaded="loaded" />
    <h2>MY FAVORITED POSTS:</h2>
    <ProfilePostListComponent :posts="favoritedPosts" :loaded="loaded" />
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>
