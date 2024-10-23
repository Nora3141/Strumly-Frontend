<script setup lang="ts">
import router from "@/router";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
const props = defineProps(["post"]);

function goToPost() {
  void router.push({ name: "Feed", query: { specificPost: String(props.post._id) } });
}
</script>

<template>
  <div @click="goToPost" class="clickable-div">
    <article class="container-fluid row">
      <img class="thumbnail-image img-fluid" src="@/assets/images/placeholder-thumbnail.jpg" />
      <p class="subtext-title khula-bold">{{ props.post.videoTitle }}</p>
      <p class="subtext-author khula-light">by {{ props.post.author }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.subtext-title {
  font-size: 1.2em;
  margin-top: 10px;
  margin-left: 10px;
}
.subtext-author {
  margin-top: -5px;
  margin-left: 10px;
}

.thumbnail-image {
  border-radius: 10px;
  width: 230px;
  height: 150px;
  object-fit: cover;
}
.content {
  width: fit-content;
}

.clickable-div {
  cursor: pointer; /* Changes the cursor to a pointer */
  width: fit-content;
}
</style>
