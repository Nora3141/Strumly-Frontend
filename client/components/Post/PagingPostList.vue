<script setup lang="ts">
import PostThumbnail from "@/components/Home/PostThumbnail.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

let myPostsPageNum = ref(1);
const postsPerPage = ref(4); // Initialize postsPerPage as a reactive variable

// Define props with types
const props = defineProps<{
  myPosts: Array<Record<string, string>>;
}>();

// Function to calculate posts per page based on the window width
function updatePostsPerPage() {
  const maxPostsPerPage = 4; // Max posts per page for larger screens
  const windowWidth = window.innerWidth;

  if (windowWidth < 900) {
    postsPerPage.value = 1; // For small screens
  } else if (windowWidth < 1300) {
    postsPerPage.value = 2; // For medium screens
  } else if (windowWidth < 1600) {
    postsPerPage.value = 3; // For medium screens
  } else {
    postsPerPage.value = maxPostsPerPage; // For large screens
  }
}

// Run the update function on mount and add resize event listener
onMounted(() => {
  updatePostsPerPage(); // Set initial posts per page
  window.addEventListener("resize", updatePostsPerPage);
});

// Clean up event listener on unmount
onBeforeUnmount(() => {
  window.removeEventListener("resize", updatePostsPerPage);
});

// Pagination logic
const paginatedPosts = computed(() => {
  if (!props.myPosts || props.myPosts.length === 0) {
    return [];
  }
  const start = (myPostsPageNum.value - 1) * postsPerPage.value;
  return props.myPosts.slice(start, start + postsPerPage.value);
});

const hasNextPage = computed(() => {
  return props.myPosts && myPostsPageNum.value * postsPerPage.value < props.myPosts.length;
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
      <button v-if="hasPreviousPage" @click="previousPage" class="move-button">
        <img class="move-button-image" src="@/assets/images/leftArrow.png" />
      </button>
      <ul class="my-posts-section">
        <li v-for="post in paginatedPosts" :key="post._id" class="my-posts-section">
          <PostThumbnail :post="post" />
        </li>
      </ul>
      <button v-if="hasNextPage" @click="nextPage" class="move-button">
        <img class="move-button-image" src="@/assets/images/rightArrow.png" />
      </button>
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
  flex-wrap: nowrap; /* Prevent wrapping */
}

.my-posts-section li {
  list-style-type: none; /* Remove the bullet point */
  flex: 0 0 calc(100% / 4); /* Adjust width based on postsPerPage */
}

.posts-section-wrapper {
  width: 60vw;
  height: fit-content; /* Keeps height consistent */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
</style>
