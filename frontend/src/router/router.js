import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../views/Homepage.vue";
import Signin from "../views/Signin.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
  {
    path: "/",
    component: Homepage,
  },
  {
    path: "/signin",
    component: Signin,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

let router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
  
  if (requiresGuest && user) {
    next({ path: "/" });
    return;
  }
  next();
});

export default router;
