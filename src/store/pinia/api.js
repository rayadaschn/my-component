import { watch } from "vue";
import { mergeObject, subscription } from "./utils";

export function createPatch(pinia, id) {
  return function $patch(stateOrFn) {
    if (typeof stateOrFn === "function") {
      stateOrFn(pinia.state.value[id]);
    } else {
      /**
       * $patch{
       *  count: 10
       * }
       */
      mergeObject(pinia.state.value[id], stateOrFn);
    }
  };
}

export function createReset(store, stateFn) {
  return function $patch() {
    const initialState = stateFn ? stateFn() : {};

    store.$patch((state) => {
      Object.assign(state, initialState);
    });
  };
}

/**
 * store.subscribe(({storeId}, state) => {})
 */
export function createSubscribe(pinia, id, scope) {
  return function $subscribe(callback, options = {}) {
    scope.run(() => {
      watch(
        pinia.state.value[id],
        (state) => {
          callback({ storeId: id }, state);
        },
        options
      );
    });
  };
}

export const actionList = [];

export function createOnAction() {
  return function $onAction(cb) {
    subscription.add(actionList, cb);
  };
}

/**
 * 停止收集依赖, 并从注册表中删除
 * [$dispose](https://pinia.vuejs.org/api/interfaces/pinia._StoreWithState.html#-dispose)
 */
export function createDispose(pinia, id, scope) {
  // 由 pinia 获取 store
  return function $dispose() {
    // 清空 action 监控数组
    actionList.length = 0;
    pinia.store.delete(id); // 清空, map 删除
    scope.stop();
  };
}

export function createState(pinia, id) {
  const store = pinia.store.get(id); // map 查找

  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[id],
    // Object.assign 这样不会丢失响应性
    set: (newState) => store.$patch((state) => Object.assign(state, newState)),
  });
}
