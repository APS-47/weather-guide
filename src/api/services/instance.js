import axios from "axios";
import router from "@/router";
import { Message, Loading } from "element-ui";
const api_base_url = "https://bird.ioliu.cn";

// 创建axios实例
let instance = axios.create({
  time: 1000 * 60,
  baseURL: api_base_url,
});
let loadingInstance; //加载中。。。
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    loadingInstance = Loading.service({
      text: "拼命加载中~",
    });
    return config;
  },
  (error) => {
    loadingInstance.close();
    Message.error({ message: "请求超时!" });
    return Promise.reject(error);
  }
);

// 响应拦截器即异常处理
instance.interceptors.response.use(
  (response) => {
    loadingInstance.close();
    let data = response.data;
    let status = response.status;
    if (status === 200) {
      return Promise.resolve(data);
    } else {
      Message.error({ message: "服务器好像出了些问题~" });
      return Promise.reject(response);
    }
  },
  (error) => {}
);

export default instance;
