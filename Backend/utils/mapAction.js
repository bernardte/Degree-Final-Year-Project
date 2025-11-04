import { actionMap } from "./constant/ActivityMap.js";

export const getActionFromMap = (reqMethod, reqPath) => {
    const requestKey = `${reqMethod} ${reqPath}`;

    if(actionMap[requestKey]){
        return actionMap[requestKey];
    }

    for(const [key, value] of Object.entries(actionMap)){
        const regexKey = key.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${regexKey}$`);
        if (regex.test(requestKey)){
            return value;
        };
    }

    return requestKey;
}