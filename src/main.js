import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createPinia } from "./store/pinia";
const pinia = createPinia();

// pinia 注册插件: 是结果本地化
pinia.use(function ({ store }) {
  const localState = JSON.parse(
    localStorage.getItem("PINIA_STATE_" + store.$id) ||
      `{
          "count": 0,
          "todoList": []
        }`
  );

  store.$state = localState;

  console.log("localState", localState);

  store.$subscribe(({ storeId }, state) => {
    localStorage.setItem("PINIA_STATE_" + storeId, JSON.stringify(state));
  });

  store.$onAction(() => {
    console.log("已调用 Action, 数据同步服务器ing");
  });

  return {
    pluginReturn: "插件最后返回值",
  };
});

const app = createApp(App);

app.use(pinia);

app.mount("#app");
