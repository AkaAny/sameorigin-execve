import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/router.ts";

window.addEventListener("popstate",function (e){
    console.log("pop state:",document.location,"state:",e.state);
    debugger;
})

window.addEventListener("beforeunload",function (_){
    console.log("[top window] before unload with cur href:",document.location);
    //debugger;
})

// const originPushState= window.history.pushState;
// window.history.pushState=function(data, unused, url){
//     console.log("[top window] push state:",data,unused,url);
//     //return originPushState(data,unused,url);
// }

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
