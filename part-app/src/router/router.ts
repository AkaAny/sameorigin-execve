import {createRouter, createWebHashHistory} from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";

const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/hw",
            component:HelloWorld,
            props: {
                msg: "Vite + Vue",
            },
        }
    ]
});

export default router;