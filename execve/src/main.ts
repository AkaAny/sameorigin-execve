import "./proxy.ts";
import magic from "../../babel-plugin-execve/src/magic.ts";

async function execve(url:string,newBaseUrl:string){
    if(!url){
        console.warn("url cannot be null");
        return;
    }
    const htmlData= await fetch(url).then((resp)=>{
        return resp.text();
    });
    const domParser=new DOMParser();
    const realDocument= domParser.parseFromString(htmlData,"text/html");
    console.log("[execve] real document:",realDocument);
    const realHtml=realDocument.getElementsByTagName("html")[0];
    //const currentHtml=realDocument.getElementsByTagName("html")[0];
    const baseElement= document.createElement("base");
    baseElement.href=newBaseUrl;
    document.head.innerHTML=
        baseElement.outerHTML
        +"\n"+
        realDocument.head.innerHTML;
    //document.head.innerHTML=realHtml.getElementsByTagName("head")[0].innerHTML;
    document.body.innerHTML=realHtml.getElementsByTagName("body")[0].innerHTML;
    console.log("[execve] after replace");
    //单独处理script标签
    await realiveScriptElements(document.head);
    await realiveScriptElements(document.body);
}

async function realiveScriptElements(parentNode:HTMLElement){
    const scriptElements= parentNode.getElementsByTagName("script");
    //debugger;
    const aliveScriptElements:HTMLScriptElement[]=[];
    for (let i = 0; i < scriptElements.length; i++) {
        const element=scriptElements[i];
        console.log("[execve] realive element:",element);
        const aliveElement= document.createElement("script");
        //注意aliveElement.ownerDocument
        for(const pk in element){
            const desc= Object.getOwnPropertyDescriptor(element,pk);
            //@ts-ignore
            if(!element[pk]){ //跳过本身就没有设置的属性
                continue;
            }
            if(desc && (!desc.writable || !desc.configurable)){
                console.warn("skip property:",pk,"as desc:",desc);
                continue;
            }
            //跳过设置src
            if(pk==="src"){
                continue;
            }
            try {
                //@ts-ignore
                aliveElement[pk] = element[pk];
            }catch (e){
                //console.warn("skip property:",pk,"for reason:",e);
                continue;
            }
        }
        if(element.src && !element.text){ //src script block
            console.info("[execve] element src:",element.src);
            const hookedCode= await fetch(element.src).then((resp)=>{
                return resp.text();
            }).then((code)=>{
                if(code.indexOf(magic)>-1){
                    console.log("code has been transformed");
                    //debugger;
                    return code;
                }
                //@ts-ignore
                return window.hookWindowForCode(code);
            })
            console.info(hookedCode);
            aliveElement.text=hookedCode;
        }
        aliveScriptElements.push(aliveElement);
    }
    for (let i = 0; i < scriptElements.length; i++) {
        parentNode.removeChild(scriptElements[i]);
    }
    aliveScriptElements.forEach((aliveElement)=>{
        parentNode.appendChild(aliveElement);
    })
}
const queryStr= window.location.search;
console.log("[execve] query str:",queryStr);
const queryObj= new URLSearchParams(queryStr);
console.log("[execve] query obj:",queryObj);
execve(queryObj.get("targetUrl") as any,"http://localhost:7005");