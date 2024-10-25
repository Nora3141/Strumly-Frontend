<script setup lang="ts">
import PagingPostList from "@/components/Post/PagingPostList.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const { currentUsername, currentUserID } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
let myPosts = ref<Array<Record<string, string>>>([]);
const postsPerPage = 4;
let myPostsPageNum = ref(1);
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

// Pagination logic
const paginatedPosts = computed(() => {
  const start = (myPostsPageNum.value - 1) * postsPerPage;
  return myPosts.value.slice(start, start + postsPerPage);
});

const hasNextPage = computed(() => {
  return myPostsPageNum.value * postsPerPage < myPosts.value.length;
});

function nextPage() {
  if (hasNextPage.value) {
    myPostsPageNum.value++;
  }
}

const hasPreviousPage = computed(() => {
  return myPostsPageNum.value > 1;
});

function previousPage() {
  if (myPostsPageNum.value > 1) {
    myPostsPageNum.value--;
  }
}
</script>

<template>
  <main class="column">
    <img src="@/assets/images/profile-icon.png" width="100px" />
    <h2>{{ currentUsername.toUpperCase() }}</h2>
    <div class="profile-section">
      <h4 class="khula-regular">My Posts:</h4>
      <PagingPostList :myPosts="myPosts" />
    </div>
    <div class="profile-section">
      <h4 class="khula-regular">My Favorited Posts:</h4>
      <PagingPostList :myPosts="favoritedPosts" />
    </div>
  </main>
</template>

<style scoped>
.my-posts-section {
  display: flex;
  flex-direction: row;
}

.my-posts-section li {
  list-style-type: none; /* Remove the bullet point */
}

.posts-section-wrapper {
  width: 60vw;
}

.profile-section {
  background: white;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid gray;
}

h4 {
  margin: 5px;
}
</style>
