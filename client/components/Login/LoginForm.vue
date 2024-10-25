<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  console.log("about to send to home...");
  void router.push({ name: "Home" });
  console.log("sent to home");
}
</script>

<template>
  <div class="">
    <form class="login-wrapper pure-form pure-form-aligned" @submit.prevent="login">
      <h3>Log In</h3>
      <div class="form-entry-field">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="form-entry-field second-field">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="submit-button">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
h3 {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.form-entry-field {
  display: flex;
  flex-direction: column;
}

.second-field {
  margin-top: 20px;
}

.login-wrapper {
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-button {
  margin-top: 50px;
}
</style>
