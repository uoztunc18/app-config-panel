<template>
  <div class="overlay">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup>
import "primeicons/primeicons.css";
import Navbar from "./components/Navbar.vue";
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

button {
  cursor: pointer;
}
button:disabled {
  background: #707070;
  cursor: auto;
}

.overlay {
  background: linear-gradient(#1c1c2a, #1c1c20);
  min-height: 100vh;
  width: 100%;
}

.modal-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  width: 80%;
  max-width: 45rem;
  min-width: 20rem;
  padding: 2.5rem;
  background: linear-gradient(to top right, #241a2a, #3d1a56);
  border-radius: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.2);
  border-top: 4px solid #56318d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  to { transform: rotate(360deg) }
}
</style>
