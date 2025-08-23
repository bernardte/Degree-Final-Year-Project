export const sanitizeSensitiveData = (data, ignoredField = ["password", "token", "confirmPassword", "otp", "rewardCode"]) => {
    if (data === null) return null;
    
    if(!data || typeof data !== "object"){
        return data; // Return as is if data is not an object
    }

    if(Array.isArray(data)){
        return data.map((item) => sanitizeSensitiveData(item)); //Recursively sanitize each data item in the array
    }
    const sanitizedData = {};
    const ignored = new Set(ignoredField);

    for(const key in data){
        if (ignored.has(key)) {
          sanitizedData[key] = "******"; // Mask sensitive fields data
        } else if (typeof data[key] === "object") {
          sanitizedData[key] = sanitizeSensitiveData(data[key], ignoredField); // Recursively sanitized nested objects
        } else {
          sanitizedData[key] = data[key]; // keep other field as is original data
        }
    }

    return sanitizedData; // Return the sanitized data object
}