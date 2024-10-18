<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
const props = defineProps(["post"]);
</script>

<template>
  <article class="container-fluid row">
    <img class="thumbnail-image img-fluid" src="@/assets/images/placeholder-thumbnail.jpg" />
    <p class="subtext-title khula-bold">{{ props.post.videoTitle }}</p>
    <p class="subtext-author khula-light">by {{ props.post.author }}</p>
  </article>
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
  width: 200px;
  height: auto;
  object-fit: cover;
}
.content {
  max-width: 200px;
  margin: 10px;
}
</style>
