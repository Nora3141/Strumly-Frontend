<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const dropdownVisibile = ref(false);

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

function toggleUserDropdown() {
  dropdownVisibile.value = !dropdownVisibile.value;
}
</script>

<template>
  <main class="background-blank-full">
    <header>
      <nav class="navbar navbar-expand-lg orange-background">
        <RouterLink class="navbar-brand" :to="{ name: 'Home' }">
          <p class="mclaren-regular strumly-text">strumly</p>
        </RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <RouterLink class="nav-link d-flex align-items-center" :to="{ name: 'Home' }" :class="{ active: currentRouteName === 'Home' }">
                <img class="navbar-icon" src="@/assets/images/home.png" /> Home
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link d-flex align-items-center" :to="{ name: 'Create' }" :class="{ active: currentRouteName === 'Create' }">
                <img class="navbar-icon" src="@/assets/images/plus.png" /> Create
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link d-flex align-items-center" :to="{ name: 'Feed' }" :class="{ active: currentRouteName === 'Feed' }">
                <img class="navbar-icon" src="@/assets/images/video.png" /> Feed
              </RouterLink>
            </li>
            <li v-if="isLoggedIn" class="nav-item dropdown">
              <span class="nav-link dropdown-toggle" @click="toggleUserDropdown" aria-haspopup="true" aria-expanded="false"> <img class="navbar-icon" src="@/assets/images/user.png" /> User </span>
              <div v-if="dropdownVisibile" class="dropdown-menu show">
                <RouterLink class="dropdown-item" :to="{ name: 'Settings' }">Settings</RouterLink>
                <RouterLink class="dropdown-item" :to="{ name: 'Profile' }">Profile</RouterLink>
              </div>
            </li>
            <li v-else class="nav-item">
              <RouterLink class="nav-link d-flex align-items-center" :to="{ name: 'Login' }" :class="{ active: currentRouteName === 'Login' }"> Login </RouterLink>
            </li>
          </ul>
          <!--
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      -->
        </div>
      </nav>
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
    </header>
    <RouterView />
  </main>
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: #f4bc73;
  display: flex;
  align-items: center;
  height: 60px;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  width: 20px;
}

.navbar-links {
  height: 100%;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
  height: 100%;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.strumly-text {
  font-size: 24px;
}

.underline {
  text-decoration: underline;
}

.navbar-icon {
  width: 20px; /* Adjust size as needed */
  margin-right: 5px; /* Space between icon and text */
}

.nav-link {
  display: flex; /* Make the link a flex container */
  align-items: center; /* Center items vertically */
  height: 100%; /* Make the link take the full height of the navbar */
  transition: background-color 0.3s ease; /* Smooth transition for hover */
}

.nav-link:hover {
  background-color: #f7d2a1; /* Change to a darker background color on hover */
}

.nav-link.active {
  background-color: #c99b5f; /* Highlight active link */
}

.dropdown-menu {
  position: absolute; /* Position dropdown absolutely */
  background-color: white;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  padding: 10px;
  list-style: none;
  top: 100%; /* Position below the toggle */
  right: 0; /* Align left to the toggle button */
  z-index: 1000; /* Ensure it appears above other elements */
  display: none; /* Initially hidden */
  max-width: 200px; /* Set a max width to prevent overflow */
  /* Optional: Add responsive design */
  width: auto; /* Let it adapt to content width */
  box-sizing: border-box; /* Include padding in width */
}

.dropdown-menu.show {
  display: block; /* Show the dropdown when the flag is set */
}
</style>
