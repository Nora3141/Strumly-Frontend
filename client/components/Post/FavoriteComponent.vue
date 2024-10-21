<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
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
  try {
    favorited.value = (await fetchy(`/api/favoriting/checkFavorited/${props.post._id}`, "GET")).result;
  } catch (error) {
    console.log("an error occurred setting the initial favorited status: ", error);
    return;
  }
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

<style scoped>
img {
  border: none;
  width: 30px;
  height: 30px;
}
</style>
