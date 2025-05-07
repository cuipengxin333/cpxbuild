import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

import Toast from './plugins/toast.ts'

const app = createApp(App)
app.use(router)
app.mount('#app')

app.use(Toast)
