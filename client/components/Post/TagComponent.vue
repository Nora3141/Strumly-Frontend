<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const emit = defineEmits(["removeTagFromPost"]);
const props = defineProps(["tagName", "postAuthor"]);
const { currentUsername } = storeToRefs(useUserStore());

function removeTag() {
  emit("removeTagFromPost");
}
</script>

<template>
  <div class="tag-container">
    <p class="tagName">{{ props.tagName }}</p>
    <button v-if="props.postAuthor == currentUsername" class="close-btn" @click="removeTag">×</button>
  </div>
</template>

<style scoped>
.tag-container {
  display: inline-flex;
  align-items: center;
  position: relative;
}

.tagName {
  background-color: lightgray;
  padding: 5px;
  border-radius: 10px;
  width: fit-content;
  margin: 5px;
  position: relative;
}

.close-btn {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  background-color: transparent;
  border: none;
  color: red;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
}

.tag-container:hover .close-btn {
  display: inline-block;
}
</style>
