<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["posts", "loaded"]);
const emit = defineEmits(["refreshPosts"]);

let editing = ref("");

function refreshPosts() {
  emit("refreshPosts");
}
</script>

<template>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in props.posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="refreshPosts" />
    </article>
  </section>
  <p v-else-if="props.loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  margin: 2px;
}

.posts {
  padding: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  overflow-x: auto;
  overflow-y: hidden;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
