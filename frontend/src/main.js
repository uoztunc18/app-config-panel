import { createApp } from "vue";
import App from "./App.vue";
import { initializeFirebase } from "./firebase/config";

import router from "./router/router";

initializeFirebase();

const app = createApp(App);

app.use(router);

app.mount("#app");
