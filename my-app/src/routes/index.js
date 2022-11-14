import { createRouter, createWebHistory } from "vue-router";
import mainView from "../views/mainView";
import homeView from "../views/homeView";
import learnView from "../views/learnView";
import newWords from "../views/newWords";

const routes = [
  {
    path: "/",
    name: "main",
    component: mainView,
    children: [
      { path: "/home", name: "home", component: homeView },
      {
        path: "/learn",
        name: "learn",
        component: learnView,
        children: [
          { path: "known", name: "known", component: newWords },
          { path: "newWords", name: "newWords", component: newWords },
          { path: "repeat", name: "repeat", component: newWords },
        ],
      },
      { path: "/actual", name: "actual", component: homeView },
      { path: "/docs", name: "documentation", component: homeView },
      { path: "/contacts", name: "contacts", component: homeView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
