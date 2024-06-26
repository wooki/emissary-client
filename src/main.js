import '@shoelace-style/shoelace/dist/themes/dark.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
setBasePath(
  'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/',
);

import './assets/main.css';

import { createApp } from 'vue';

import App from './App.vue';

const app = createApp(App);

app.mount('#app');
