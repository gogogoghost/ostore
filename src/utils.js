export function addFileInternal(storage,blob,name){
    return new Promise((resolve,reject)=>{
        const req=storage.addNamed(blob,name)
        req.onsuccess=function(){
            resolve(this.result)
        }
        req.onerror=function(){
            reject(this.error)
        }
    })
}

export async function addFile(storage,blob,name){
    const i=name.lastIndexOf('.')
    const prefix=name.substring(0,i)
    const suffix=name.substring(i+1)
    let counter=0
    while(true){
        const realName=counter==0?name:`${prefix}_${counter}.${suffix}`
        try{
            return await addFileInternal(storage,blob,realName)
        }catch(e){
            if(e.message=="NoModificationAllowedError"){
                counter++;
                continue
            }else{
                throw e
            }
        }
    }
}

export function path2fileName(path){
    const i=path.lastIndexOf('/')
    if(i<0){
        return path
    }
    return path.substring(i+1)
}