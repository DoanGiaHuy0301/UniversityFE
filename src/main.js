import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./routers/index.js";
import store from "./stores/myStore";
import { initializeApp } from "firebase/app";
import { fetchFirebaseConfig } from "./services/firebase.js";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import i18n from './i18n/i18n';

import axios from "axios";
window.axios = axios;

import { Menu, List, Drawer, Button, message } from "ant-design-vue";
import "@/assets/css/style.css";

import "./static/fontawesome-free-6.4.2-web/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-utilities.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'vue-multiselect/dist/vue-multiselect.css';

const firebaseConfig = await fetchFirebaseConfig();
const appFirebase = initializeApp(firebaseConfig);

export const auth = getAuth(appFirebase);
export const db = getFirestore(appFirebase);

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(store);
app.use(Menu);
app.use(List);
app.use(Button);
app.use(Drawer);
app.use(i18n);
app.mount("#app");
