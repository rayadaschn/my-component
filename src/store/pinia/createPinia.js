import { effectScope, ref } from "vue";
import { piniaSymbol } from "./constant";

export default function createPinia() {
  const store = new Map();
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));

  // 返回一个 pinia 对象
  return {
    store,
    scope,
    state,
    install,
  };
}

function install(app) {
  app.provide(piniaSymbol, this);
  console.log(app);
}
