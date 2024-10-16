<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "@/utils/fetchy";
const props = defineProps(["post"]);
const emit = defineEmits(["refreshFavCount"]);

let favorited = ref(false);

const toggleFavorite = async () => {
  try {
    await fetchy(`/api/favoriting/toggleFavorite/${props.post._id}`, "POST");
  } catch {
    return;
  }
  favorited.value = !favorited.value;
  emit("refreshFavCount");
};

const setFavoritedStatus = async () => {
  console.log("setting initial favorited status...");
  try {
    favorited.value = (await fetchy(`/api/favoriting/checkFavorited/${props.post._id}`, "GET")).result;
  } catch (error) {
    console.log("an error occurred setting the initial favorited status: ", error);
    return;
  }
  console.log("initial favorited status set successfully", favorited.value);
};

onBeforeMount(async () => {
  await setFavoritedStatus();
});

// TODO: on start up load the correct value for favorited (note: will need to create new route in backend)
// 2nd TODO: assign post id to this post in PostComponent.vue
</script>

<template>
  <button type="button" @click="toggleFavorite" v-if="favorited == true"><img src="@/assets/images/favorited-star.png" /></button>
  <button type="button" @click="toggleFavorite" v-else><img src="@/assets/images/unfavorited-star.png" /></button>
</template>

<style scoped></style>
