<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

let originalPost = ref("");
let originalPostName = ref("");
const currentRoute = useRoute();

function redirectToProfile() {
  void router.push({ name: "Profile" });
}

onBeforeMount(async () => {
  originalPost.value = currentRoute.query.originalPost ? String(currentRoute.query.originalPost) : "";
  originalPostName.value = currentRoute.query.originalPostName ? String(currentRoute.query.originalPostName) : "";
});
</script>

<template>
  <main class="pageContainer">
    <h1 class="mclaren-regular">Create</h1>
    <div v-if="isLoggedIn">
      <p class="khula-light">Post your own music to the community! Follow the instructions below to create your post.</p>
      <div class="remixHeader">
        <img v-if="originalPost" src="@/assets/images/remix-icon.png" width="30px;" height="30px;" />
        <p v-if="originalPostName">Remixing the post: {{ originalPostName }}</p>
      </div>
      <CreatePostForm class="createPostContainer" @refresh-posts="redirectToProfile" :originalPost="originalPost" />
    </div>
    <div v-else class="alert alert-warning d-flex align-items-top" role="alert">
      <i class="bi bi-exclamation-triangle-fill" style="font-size: 1.25rem; margin-right: 10px"></i>
      <div>
        <h4>You must be logged in to create posts! You can log in using the button on the navigation bar.</h4>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1,
h2,
h3,
p {
  text-align: center;
  margin: 10px;
}

h1 {
  padding-top: 80px;
}

.createPostContainer {
  width: 50vw;
  margin-top: 20px;
}

.pageContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
}

.remixHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
