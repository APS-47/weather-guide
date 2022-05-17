import api from "./instance";
/* 
    获取城市天气信息
*/
export const getCityWeather = (city) => api.get(`/weather?city=${city}`);
