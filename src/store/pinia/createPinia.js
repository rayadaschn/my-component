import { effectScope, ref } from "vue";
import { piniaSymbol } from "./constant";

export default function createPinia() {
  const store = new Map();
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  const plugins = [];

  /** 注册插件, 即保存插件回调, 后续依次执行 */
  function use(cb) {
    plugins.push(cb);
    return this;
  }

  // 返回一个 pinia 对象
  return {
    store,
    scope,
    state,
    plugins,
    install,
    use,
  };
}

function install(app) {
  app.provide(piniaSymbol, this);
  console.log(app);
}
