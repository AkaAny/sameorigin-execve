import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

function tryAccessParentWindow(){
    if(!window.parent){
        return;
    }
    console.log("[index] parent window:",window.parent);
    window.parent.document.title="change title from framed window";
}
tryAccessParentWindow();

createApp(App).mount('#app')
