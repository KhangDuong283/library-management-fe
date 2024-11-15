import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Tailwind Css
import './assets/style.css'

// Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Router
import router from "./router";

// Vue Toastification
import 'vue-toastification/dist/index.css';
import Toast, { POSITION } from 'vue-toastification';


const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(Toast, {
    position: POSITION.TOP_CENTER,
    timeout: 3000,
    closeOnClick: true,
});

app.mount('#app');
