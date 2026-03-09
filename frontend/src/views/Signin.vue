<template>
  <div class="wrapper">
      <img
        class="logo-btn"
        src="/src/assets/ku-logo.svg"
        alt="KU Logo"
      />
    <div class="top-txt">Please sign in</div>
    <form class="input-form" @submit.prevent="handleSignin">
      <div class="input-block">
        <input
          class="text-input"
          placeholder="E-mail address"
          v-model="email"
        />
        <input
          class="text-input"
          type="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <button class="signin-btn" type="submit">Sign in</button>
    </form>
    <div class="signin-error">
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
    <h5 class="copyright-txt">KU © 1993</h5>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { signin } from "../services/authService";
import router from "@/router/router";

const email = ref("");
const password = ref("");

const errorMessage = ref("");

async function handleSignin() {
  let credentials = {
    email: email.value,
    password: password.value,
  };

  const response = await signin(credentials);

  if (response.user) {
    console.log("Signed in successfully as ", response.user.email);
    router.push("/");
  } else {
    errorMessage.value = response.error;
  }
}
</script>

<style scoped>
.logo {
  width: 10rem;
}
.top-txt {
  margin-top: 1em;
  margin-bottom: 2rem;
  color: #2f2f49;
  font-size: 30px;
  font-weight: 200;
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
}

.input-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20rem;
  gap: 1rem;
}

.input-block {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.text-input {
  border-color: #2b2b35;
  font-size: 15px;
  font-weight: 200;
}
.text-input::placeholder {
  color: #4b4b4b;
}
.text-input:first-child {
  border-radius: 10px 10px 0 0;
}
.text-input:last-child {
  border-radius: 0 0 10px 10px;
}
.text-input:not(:first-child) {
  border-top: none;
}

.signin-btn {
  width: 100%;
  height: 3rem;
  background: linear-gradient(#4d61de, #3d4dbb);
}

.copyright-txt {
  color: #6b6b6b;
  font-weight: 200;
}

.signin-error {
  height: 3rem;
  color: #a31313;
  font-weight: 200;
}
</style>
