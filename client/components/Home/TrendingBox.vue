<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import PostThumbnail from "@/components/Home/PostThumbnail.vue";

const props = defineProps(["sectionTitle", "posts"]);
</script>

<template>
  <div class="box-wrapper container row col-8">
    <h1 class="sectionTitle">{{ props.sectionTitle }}</h1>
    <div class="posts-box-section">
      <img src="@/assets/images/leftArrow.png" class="moveArrow" />
      <div class="postsList">
        <article v-for="post in posts" :key="post._id">
          <PostThumbnail :post="post" />
        </article>
      </div>

      <img src="@/assets/images/rightArrow.png" class="moveArrow" />
    </div>
  </div>
</template>

<style scoped>
.box-wrapper {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  margin-left: 5vw;
}
.posts-box-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-top: 1px solid black;
  padding-top: 5px;
  padding-bottom: 5px;
  align-items: center;
}

.postsList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.sectionTitle {
  font-family: "McLaren", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  margin-left: 5vw;
  padding-top: 20px;
  padding-bottom: 10px;
}

.moveArrow {
  margin: 50px;
  width: 50px;
  height: auto;
}
</style>
