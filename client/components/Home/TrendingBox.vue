<script setup lang="ts">
import PagingPostList from "@/components/Post/PagingPostList.vue";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

const props = defineProps(["sectionTitle", "posts"]);
</script>

<template>
  <div class="box-wrapper container row">
    <h1 class="sectionTitle">{{ props.sectionTitle }}</h1>
    <div class="posts-box-section">
      <PagingPostList class="paging-list" :myPosts="props.posts" />
    </div>
  </div>
</template>

<style scoped>
.paging-list {
  margin-top: 20px;
}
.box-wrapper {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  margin-left: 5vw;
  width: fit-content;
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
