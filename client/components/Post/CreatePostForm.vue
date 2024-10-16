<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const videoURL = ref("");
const videoTitle = ref("");
const videoDescription = ref("");
const originalArtist = ref("");

const emit = defineEmits(["refreshPosts"]);

// Helper function to format Google Drive URLs (created using ChatGPT)
const formatGoogleDriveURLForIframe = (url: string): string => {
  const googleDriveFileRegex = /https:\/\/drive\.google\.com\/file\/d\/([^\/]+)\//;
  const googleDriveOpenRegex = /https:\/\/drive\.google\.com\/open\?id=([^&]+)/;

  let fileId: string | null = null;

  // Match the Google Drive file URL pattern
  const fileMatch = url.match(googleDriveFileRegex);
  if (fileMatch && fileMatch[1]) {
    fileId = fileMatch[1];
  }

  // Match the Google Drive open URL pattern
  const openMatch = url.match(googleDriveOpenRegex);
  if (openMatch && openMatch[1]) {
    fileId = openMatch[1];
  }

  // If a valid Google Drive file ID is found, return the embed URL
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Return the original URL if it's not a Google Drive link
  return url;
};

const createPost = async () => {
  const url = formatGoogleDriveURLForIframe(videoURL.value);
  try {
    await fetchy("/api/posts", "POST", {
      body: { videoURL: url, videoTitle: videoTitle.value, videoDescription: videoDescription.value, originalArtist: originalArtist.value },
    });
  } catch (error) {
    console.log("An error occured submitting the create post form: ", error);
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  videoURL.value = "";
  videoTitle.value = "";
  videoDescription.value = "";
  originalArtist.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost()">
    <label for="videoURL">URL of Video</label>
    <textarea id="videoURL" v-model="videoURL" placeholder="Paste your publically accessable google drive link here" required> </textarea>
    <label for="videoTitle">Title of Video</label>
    <textarea id="videoTitle" v-model="videoTitle" placeholder="My Cool Song" required> </textarea>
    <label for="videoDescription">Video Description</label>
    <textarea id="videoDescription" v-model="videoDescription" placeholder="How I made this, learning resources" required> </textarea>
    <label for="originalArtist">Original Artist</label>
    <textarea id="originalArtist" v-model="originalArtist" placeholder="Credit the original artist of song here" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
