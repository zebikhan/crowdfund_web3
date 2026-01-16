// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./assets/tailwind.css"
import fadeIn from "./directives/fadeIn"

// Vite compatible CKEditor import
import CKEditor from '@ckeditor/ckeditor5-vue';


const app = createApp(App);
app.use(CKEditor)
app.directive("fade-in", fadeIn)
app.use(router);
app.use(createPinia());
app.mount("#app");
