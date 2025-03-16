export const baseUrl=import.meta.env.VITE_APPSCMD_BASEURL

export const serverUrl=import.meta.env.VITE_SERVER_BASEURL

export const resourceUrl=import.meta.env.VITE_SERVER_DL

export async function getList(){
    const res= await (await fetch(baseUrl+"list")).json()
    if(res.code!=0){
        throw new Error(res.msg)
    }
    return res.data
}

export async function getAllList(){
    return await (await fetch(serverUrl+"all.json")).json()
}

export async function getPopularList(){
    return await (await fetch(serverUrl+"popular.json")).json()
}

export const proxyBaseUrl=baseUrl+"proxy/"

export async function install(path) {
    const res= await(await fetch(baseUrl+"install",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: path }) 
    })).json()
    if(res.code!=0){
        throw new Error(res.msg)
    }
    return res.data
}

export async function uninstall(manifestUrl) {
    const res= await(await fetch(baseUrl+"uninstall",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: manifestUrl }) 
    })).json()
    if(res.code!=0){
        throw new Error(res.msg)
    }
    return res.data
}