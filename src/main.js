import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import getApi from "./api";
import "@/assets/css/normalize.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.config.productionTip = false;

// 将api请求注入原型对象中（全局化）
Vue.prototype.$api = getApi;

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
