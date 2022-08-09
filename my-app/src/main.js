import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index'
import store from './store/index'
import apiPlugin from './plugins/apiPlugin'

createApp(App).use(router).use(store).use(apiPlugin).mount('#app')
