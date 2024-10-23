<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

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
    <p class="khula-light">Post your own music to the community! Follow the instructions below to create your post.</p>
    <div class="remixHeader">
      <img v-if="originalPost" src="@/assets/images/remix-icon.png" width="30px;" height="30px;" />
      <p v-if="originalPostName">Remixing the post: {{ originalPostName }}</p>
    </div>
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

.remixHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
