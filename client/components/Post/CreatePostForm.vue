<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const videoURL = ref("");
const videoTitle = ref("");
const videoDescription = ref("");
const originalArtist = ref("");

const emit = defineEmits(["refreshPosts"]);

const props = defineProps(["originalPost"]);

// Helper function to format Google Drive URLs (created using ChatGPT)
const formatGoogleDriveURLForIframe = (url: string): string => {
  const googleDriveFileRegex = /https:\/\/drive\.google\.com\/file\/d\/([^/]+)\//;
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
    if (props.originalPost === "") {
      await fetchy("/api/posts", "POST", {
        body: { videoURL: url, videoTitle: videoTitle.value, videoDescription: videoDescription.value, originalArtist: originalArtist.value },
        alert: true,
      });
    } else {
      console.log("in the else statement creating a remix");
      await fetchy("/api/remixing/createRemix", "POST", {
        body: { originalPostID: props.originalPost, videoURL: url, videoTitle: videoTitle.value, videoDescription: videoDescription.value },
        alert: true,
      });
    }
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
  <form @submit.prevent="createPost()" class="p-4">
    <div class="row">
      <!-- Left Column -->
      <div class="col-md-6">
        <!-- Step 1 -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h4>
              <i class="bi bi-camera-video me-2"></i>
              Record Video
            </h4>
            <p>Record a video of your music and upload it to Google Drive.</p>
            <div class="d-flex align-items-center text-muted mb-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <p class="mb-0">Note: Make sure your link is publicly accessible!</p>
            </div>
            <textarea id="videoURL" v-model="videoURL" class="form-control mt-2 required-field" placeholder="Google Drive URL Here" required></textarea>
            <small class="text-muted">This field is required.</small>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h4>
              <i class="bi bi-pencil me-2"></i>
              Title Your Post
            </h4>
            <textarea id="videoTitle" v-model="videoTitle" class="form-control mt-2 required-field" placeholder="My Cool Song" required></textarea>
            <small class="text-muted">This field is required.</small>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-md-6">
        <!-- Step 3 -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h4>
              <i class="bi bi-file-earmark-text me-2"></i>
              Add Description
            </h4>
            <textarea id="videoDescription" v-model="videoDescription" class="form-control mt-2 required-field" placeholder="How I made this, learning resources" required></textarea>
            <small class="text-muted">This field is required.</small>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h4>
              <i class="bi bi-person me-2"></i>
              Credit Others
            </h4>
            <textarea id="originalArtist" v-model="originalArtist" class="form-control mt-2" placeholder="Original artist of song here"></textarea>
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary w-100">Create Post</button>
  </form>
</template>

<style scoped>
textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  resize: none;
}

.required-field {
  border-left: 4px solid #007bff;
}

.text-muted {
  background-color: transparent !important;
}

.card {
  border-radius: 1em;
}

form {
  font-family: "Khula", sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>
