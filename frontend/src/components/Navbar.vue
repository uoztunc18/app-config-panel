<template>
  <nav>
    <router-link to="/">
      <img
        class="logo-btn"
        src="/src/assets/ku-logo.svg"
        alt="KU Logo"
      />
    </router-link>
    <router-link to="/signin">
      <i class="pi pi-user signin-btn" v-if="!userLoggedIn"></i>
    </router-link>
    <button class="signout-btn" v-if="userLoggedIn" @click="handleLogout">
      Logout
    </button>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import "primeicons/primeicons.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signout } from "../services/authService";
import router from "@/router/router";

const userLoggedIn = ref(null);

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    userLoggedIn.value = true;
  } else {
    userLoggedIn.value = false;
  }
});

const handleLogout = async () => {
  const response = await signout();
  if (response.signedOut) {
    router.push("/signin");
    console.log(response.message);
  }
};
</script>

<style scoped>
nav {
  height: 4rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar a:last-child {
  margin-left: auto;
}

.logo-btn {
  height: 3rem;
}

.signin-btn {
  font-size: 2rem;
  color: aliceblue;
}

.signout-btn {
  background: linear-gradient(#4d61de, #3d4dbb);
}
</style>
