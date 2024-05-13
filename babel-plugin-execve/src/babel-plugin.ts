//import * as babelTypes from "babel-types"
//import {PluginObj,TransformOptions} from "babel-core";

console.log("[execve babel plugin] load window proxy babel plugin");

export function WindowProxyBabelPlugin(
    babelTypes

)
    //:PluginObj
{
    const windowIdentifier=
        babelTypes.identifier("window");
    const windowProxyIdentifier=
        babelTypes.identifier("windowProxy");
    const windowProxyMemberNode=babelTypes.memberExpression(
        windowIdentifier,windowProxyIdentifier
    );
    return {
        name: "window-proxy-babel-plugin",

        visitor: {
            VariableDeclaration(path){
                const decs= path.node.declarations;
                //console.log("[babel] node declarations:",decs);
                decs.forEach((declarator)=>{
                    switch(declarator.init?.type){
                        case "Identifier":{
                            if(declarator.init.name==="window"){
                                declarator.init=windowProxyMemberNode;
                            }
                            break;
                        }
                    }
                })
            },
            MemberExpression(path){
                if(path.node===windowProxyMemberNode){
                    return;
                }
                 const objNode= path.node.object;
                 switch (objNode.type){
                     case "Identifier":{
                         if(objNode.name==="window"){
                             path.node.object=windowProxyMemberNode
                             break;
                         }
                         if(objNode.name==="location" && path.parentPath.node.type!=="MemberExpression"){
                             const locationIdentifier=babelTypes.identifier("location");
                            path.node.object=babelTypes.memberExpression(windowProxyMemberNode,locationIdentifier);
                         }
                         if(objNode.name==="history" && path.parentPath.node.type!=="MemberExpression"){
                             const historyIdentifier=babelTypes.identifier("history");
                             path.node.object=babelTypes.memberExpression(windowProxyMemberNode,historyIdentifier);
                         }
                     }
                 }
            },
        },
        post(state){
            console.log("[execve babel plugin] state:",state);
        }
    };
}

