<script setup lang="ts">
import SearchBar from "@/components/Home/SearchBar.vue";
import router from "@/router";
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
let searchQuery = ref("");

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

function enterSearch() {
  console.log("entering search!!");
  void router.push({ name: "Search", query: { searchQuery: String(searchQuery.value) } });
}

async function logout() {
  await userStore.logoutUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="background-blank-full">
    <header>
      <nav class="navbar navbar-expand-lg orange-background">
        <div class="navbar-content">
          <!-- Left: Brand -->
          <RouterLink class="navbar-brand" :to="{ name: 'Home' }">
            <p class="mclaren-regular strumly-text">strumly</p>
          </RouterLink>

          <!-- Center: Search Bar -->
          <div class="navbar-center">
            <SearchBar />
          </div>

          <!-- Right: Links and Dropdown -->
          <div class="navbar-right">
            <ul class="navbar-nav">
              <li class="nav-item">
                <RouterLink class="nav-link d-flex align-items-center khula-regular" :to="{ name: 'Home' }" :class="{ active: currentRouteName === 'Home' }">
                  <img class="navbar-icon" src="@/assets/images/home.png" /> Home
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link d-flex align-items-center khula-regular" :to="{ name: 'Create' }" :class="{ active: currentRouteName === 'Create' }">
                  <img class="navbar-icon" src="@/assets/images/plus.png" /> Create
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link d-flex align-items-center khula-regular" :to="{ name: 'Feed' }" :class="{ active: currentRouteName === 'Feed' }">
                  <img class="navbar-icon" src="@/assets/images/video.png" /> Feed
                </RouterLink>
              </li>
              <li v-if="isLoggedIn" class="nav-item dropdown khula-regular">
                <span class="nav-link dropdown-toggle" @click="toggleUserDropdown" aria-haspopup="true" aria-expanded="false"> <img class="navbar-icon" src="@/assets/images/user.png" /> User </span>
                <div v-if="dropdownVisibile" class="dropdown-menu show">
                  <RouterLink class="dropdown-item" :to="{ name: 'Settings' }">Settings</RouterLink>
                  <RouterLink class="dropdown-item" :to="{ name: 'Profile' }">Profile</RouterLink>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" @click="logout">Logout</button>
                </div>
              </li>
              <li v-else class="nav-item">
                <RouterLink class="nav-link d-flex align-items-center khula-regular" :to="{ name: 'Login' }" :class="{ active: currentRouteName === 'Login' }"> Login </RouterLink>
              </li>
            </ul>
          </div>
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
  justify-items: space-between;
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

.dropdown-item {
  font-size: 16px; /* Set the font size to match all items */
}

.navbar-right-content {
  width: fit-content;
}

.navbar {
  padding: 1em 2em;
  background-color: #f4bc73;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center; /* This centers items vertically */
  width: 100%;
  height: 60px; /* Make sure this matches the navbar height */
}

.navbar-center {
  flex: 1; /* Allows the search bar to center horizontally */
  display: flex;
  justify-content: center;
  align-items: center; /* This centers the search bar vertically */
  height: 100%; /* Ensure the search bar takes full height */
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1em; /* Space between items in the right section */
}

.navbar-brand {
  display: flex;
  align-items: center; /* Centers the "strumly" logo vertically */
  height: 100%; /* Ensure it takes the full height of the navbar */
}

/* Additional styles for links, icons, etc., remain as is */
</style>
