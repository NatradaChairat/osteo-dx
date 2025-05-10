// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import "@/assets/theme.css";

// Create your custom theme
const osteodxTheme = {
  dark: false,
  colors: {
    primary: "#E0006D",
    secondary: "#C80061",
    black: "#000000",
    white: "#FFFFFF",
    grayLight: "#F2EEEE",
    grayDark: "#837D7D",
    blue: "#00BFFF",
    amber: "#FFC107",
    purple: "#6A0DAD",
    green: "#00C853",
  },
};

// Register Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "osteodxTheme",
    themes: {
      osteodxTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

createApp(App).use(router).use(vuetify).mount("#app");
