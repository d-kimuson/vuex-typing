import { createApp } from "vue"
import App from "./App.vue"
import { store } from "./store"
import { key } from "./store/util"

createApp(App).use(store, key).mount("#app")
