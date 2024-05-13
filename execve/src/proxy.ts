const locationProxy=new Proxy(window.location,{
    get(target, p, receiver) {
        console.log("[proxy location] get property:",p);
        const originVal=Reflect.get(target,p);
        // if(p=="replace"){
        //     return (function (){
        //
        //     }).bind(target)
        // }
        if (typeof originVal === 'function') {
            return originVal.bind(target); // 绑定this到原始的window.location对象
        }
        return originVal;
    },
});


const baseUrl=`${window.location.origin}/execve?targetUrl=`;
const windowProxyAssign=Object.assign({},window.location);
windowProxyAssign.replace=function (url){
    console.log("[proxy location] before replace to url:",url);
    const newUri=new URL(url,baseUrl);
    console.log("[proxy location] actual replace to url:",newUri.toString());
    debugger;
    const originReplaceFunc=window.location.replace.bind(window.location);
    return originReplaceFunc(newUri);
}

//@ts-ignore
const historyAssign:History=[];

historyAssign.back=function (){
    const backFunc=window.history.back.bind(window.history);
    backFunc();
}

historyAssign.pushState=function (data: any, unused: string, url?: string | URL | null){
    console.log("[proxy history] before push state:",data,unused,url);
    const newUri=new URL(url!!,baseUrl);
    console.log("[proxy history] actual push state url:",url);
    const originReplaceStateFunc=window.history.pushState.bind(window.history);
    return originReplaceStateFunc(data,unused,newUri);
}

historyAssign.replaceState=function (data: any, unused: string, url?: string | URL | null){
    console.log("[proxy history] before replace state:",data,unused,url);
    const newUri=new URL(url!!,baseUrl);
    console.log("[proxy history] actual replace state url:",url);
    const originReplaceStateFunc=window.history.replaceState.bind(window.history);
    return originReplaceStateFunc(data,unused,newUri);
}



const customWindow={
    history:historyAssign,
    location:windowProxyAssign,
};
debugger;

const windowProxy= new Proxy(window, {
    get(target, prop, _) {
        //@ts-ignore
        if(customWindow[prop]){
            //@ts-ignore
            return customWindow[prop];
        }
        //console.log("receiver:",receiver); //一般来说就是代理对象本身
        const value = Reflect.get(target, prop);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
});
//@ts-ignore
window.windowProxy=windowProxy;
