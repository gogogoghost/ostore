export const baseUrl=import.meta.env.VITE_BASE_URL

export async function getList(){
    return await (await fetch(baseUrl+"list")).json()
}

export const proxyBaseUrl=baseUrl+"proxy/"