import axios from "axios";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first"); 
export const getUserGeoIp = async () => {
  try {
    //? free geolocation api: https://freegeoip.app/json/ for 15000 per hours request
    const response = await axios.get(`https://freegeoip.app/json/`);
    const geoData = response.data;
    console.log("Current user IP info:", geoData);
    console.log("IP:", geoData.ip);
    console.log("Country:", geoData.country_name);
    console.log("City:", geoData.city);
    console.log("longitude: ", geoData.longitude);
    console.log("latitude: ", geoData.latitude);

    return {
      ip: geoData.ip || "unknown Ip address",
      country: geoData.country_name || "unknown country",
      regionName: geoData.region_name || "unknown region",
      city: geoData.city || "unknown city",
      longitude: geoData.longitude || "unknown longitude",
      latitude: geoData.latitude || "unknown latitude",
    };
  } catch (error) {
    console.log("Error in getUserGeoIp: ", error.message);
    return null;
  }
};
