import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './assets/all.scss'

import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

app.use(router)

// axios套件必須使用vue3版本。使用插件方式
app.use(VueAxios, axios)

app.mount('#app')
