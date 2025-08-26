import axios from "axios";

export const getUserGeoIp = async () => {
  try {
    const response = axios.get("https://ipapi.co/json/");
    const geoData = response.data;
    console.log("Current user IP info:", geoData);
    console.log("IP:", geoData.ip);
    console.log("Country:", geoData.country_name);
    console.log("City:", geoData.city);
    console.log("longitude: ", geoData.longitude);
    console.log("latitude: ", geoData.latitude);

    return {
        ip: geoData.ip,
        country: geoData.country_name,
        city: geoData.city,
        longitude: geoData.longitude,
        latitude: geoData.latitude,
    }

  } catch (error) {
    console.log("Error in getUserGeoIp: ", error.message);
    return null;
  }
};
