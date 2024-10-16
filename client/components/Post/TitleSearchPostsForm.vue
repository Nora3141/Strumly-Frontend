<script setup lang="ts">
import { ref } from "vue";

const title = ref("");
const emit = defineEmits(["getPostsByTitle"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByTitle', title)" class="pure-form">
    <fieldset>
      <legend>Search by Title</legend>
      <input id="title" type="text" v-model="title" placeholder="Post Title Here" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
