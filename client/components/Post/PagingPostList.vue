<script setup lang="ts">
import PostThumbnail from "@/components/Home/PostThumbnail.vue";
import { computed, ref } from "vue";

const postsPerPage = 4;
let myPostsPageNum = ref(1);

// Define props with types
const props = defineProps<{
  myPosts: Array<Record<string, string>>;
}>();

// Pagination logic
const paginatedPosts = computed(() => {
  if (!props.myPosts || props.myPosts.length === 0) {
    return [];
  }
  const start = (myPostsPageNum.value - 1) * postsPerPage;
  return props.myPosts.slice(start, start + postsPerPage);
});

const hasNextPage = computed(() => {
  return props.myPosts && myPostsPageNum.value * postsPerPage < props.myPosts.length;
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
  if (hasPreviousPage.value) {
    myPostsPageNum.value--;
  }
}
</script>

<template>
  <main>
    <section v-if="props.myPosts.length !== 0" class="posts-section-wrapper">
      <button v-if="hasPreviousPage" @click="previousPage" class="move-button"><img class="move-button-image" src="@/assets/images/leftArrow.png" /></button>
      <ul class="my-posts-section">
        <li v-for="post in paginatedPosts" :key="post._id" class="my-posts-section">
          <PostThumbnail :post="post" />
        </li>
      </ul>
      <button v-if="hasNextPage" @click="nextPage" class="move-button"><img class="move-button-image" src="@/assets/images/rightArrow.png" /></button>
    </section>
  </main>
</template>

<style scoped>
.move-button {
  border: none;
  background-color: transparent;
  height: fit-content;
  position: relative;
  margin-top: 50px;
}

.move-button-image {
  width: 50px;
  height: 50px;
}
.my-posts-section {
  display: flex;
  flex-direction: row;
}

.my-posts-section li {
  list-style-type: none; /* Remove the bullet point */
}

.posts-section-wrapper {
  width: 60vw;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: top;
}
</style>
