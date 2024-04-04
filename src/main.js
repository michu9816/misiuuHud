import { createApp } from "vue";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from 'vue-router'
import App from "./App.vue";

import HudView from './views/HudView.vue'
import HudSettings from './views/HudView.vue'

import "./assets/main.css";

const routes = [
    { path: '/', component: HudView },
    { path: '/settings', component: HudSettings }
  ]

const pinia = createPinia();
const app = createApp(App);

const router = createRouter({
history: createMemoryHistory(),
routes,
})

app.use(pinia).use(router);
app.mount("#app");
