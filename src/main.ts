import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/router.ts";

function tryAccessParentWindow(){
    if(!window.parent){
        return;
    }
    console.log("[index] parent window:",window.parent);
    window.parent.document.title="change title from framed window";
}
tryAccessParentWindow();

const app=createApp(App);
app.use(router);
app.mount('#app')
