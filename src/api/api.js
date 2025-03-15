export const baseUrl=import.meta.env.VITE_APPSCMD_BASEURL

export const serverUrl=import.meta.env.VITE_SERVER_BASEURL

export const resourceUrl=import.meta.env.VITE_SERVER_DL

export async function getList(){
    return await (await fetch(baseUrl+"list")).json()
}

export async function getAllList(){
    return await (await fetch(serverUrl+"all.json")).json()
}

export async function getPopularList(){
    return await (await fetch(serverUrl+"popular.json")).json()
}

export const proxyBaseUrl=baseUrl+"proxy/"