<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

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
    favoritedPostResults = await fetchy(`/api/favoriting/getFavorites/${currentUserID.value}`, "GET");
  } catch (error) {
    console.log("an error occurred fetching user's favorited posts: ", error);
    return;
  }
  favoritedPosts.value = favoritedPostResults;
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
    <h1>Settings for {{ currentUsername }}</h1>
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
h1 {
  padding-top: 80px;
}
</style>
