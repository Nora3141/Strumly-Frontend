<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

let originalPost = ref("");
const currentRoute = useRoute();

function redirectToProfile() {
  void router.push({ name: "Profile" });
}

onBeforeMount(async () => {
  originalPost.value = currentRoute.query.originalPost ? String(currentRoute.query.originalPost) : "";
});
</script>

<template>
  <main class="pageContainer">
    <h1 class="khula-bold">Create!</h1>
    <h3>Is a remix of... {{ originalPost }}</h3>
    <p class="khula-regular">Post your own music to the community! Follow the instructions below to create your post.</p>
    <CreatePostForm class="createPostContainer" @refresh-posts="redirectToProfile" :originalPost="originalPost" />
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
</style>
