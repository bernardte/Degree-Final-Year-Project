export const sanitizeSensitiveData = (data, ignoredField = ["password", "token", "confirmPassword", "otp"]) => {
    if(!data || typeof data !== "object"){
        return data; // Return as is if data is not an object
    }

    if(Array.isArray(data)){
        return data.map((item) => sanitizeSensitiveData(item)); //Recursively sanitize each data item in the array
    }
    const sanitizedData = {};
    for(const key in data){
        if(ignoredField.includes(key)){
            sanitizedData[key] = "******"; // Mask sensitive fields data
        }else if(typeof data[key] === "object"){
            sanitizedData[key] = sanitizeSensitiveData(data[key], ignoredField); // Recursively sanitized nested objects
        }else{
            sanitizedData[key] = data[key]; // keep other field as is original data
        }
    }

    return sanitizedData; // Return the sanitized data object
}