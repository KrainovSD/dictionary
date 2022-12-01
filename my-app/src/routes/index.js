import { createRouter, createWebHistory } from "vue-router";
import mainView from "../views/mainView";
import homeView from "../views/homeView";
import learnView from "../views/learnView";
import newWords from "../views/newWords";
import knownWords from "../views/knownWords";
import repeatWords from "../views/repeatWords";
import docsView from "../views/docsView";
import contactView from "../views/contactView";
import relevanceView from "../views/relevanceView";
import newPassword from "../views/newPassword";
import notFoundPage from "../views/notFoundPage";
import confirmView from "../views/confirmView";
import newEmail from "../views/newEmail";

const routes = [
  {
    path: "/",
    name: "main",
    component: mainView,
    children: [
      { path: "/", name: "home", component: homeView },
      {
        path: "/learn",
        name: "learn",
        component: learnView,
        children: [
          { path: "known", name: "known", component: knownWords },
          { path: "newWords", name: "newWords", component: newWords },
          { path: "repeat", name: "repeat", component: repeatWords },
        ],
      },
      { path: "/actual", name: "actual", component: relevanceView },
      { path: "/docs", name: "documentation", component: docsView },
      { path: "/contacts", name: "contacts", component: contactView },
      { path: "/pass/:key", name: "password", component: newPassword },
      { path: "/confirm/:key", name: "confirm", component: confirmView },
      { path: "/email/:key", name: "email", component: newEmail },
      { path: "/:catchAll(.*)", name: "notFound", component: notFoundPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
