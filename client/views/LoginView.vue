<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="login-wrapper khula-regular">
    <h1 class="mclaren-regular">Strumly Sign In</h1>
    <div class="forms-wrapper">
      <LoginForm class="login-section" />
      <RegisterForm class="login-section" />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  padding-top: 80px;
  margin-bottom: 50px;
}
.login-section {
  background-color: white;
  padding: 10px;
  margin: 10px;
  border-radius: 20px;
  border: 1px solid gray;
}

.forms-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
