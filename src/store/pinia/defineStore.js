import { effectScope, inject, isReactive, isRef, reactive } from "vue";
import { formatArgs, isComputed, isFunction } from "./utils";
import { piniaSymbol } from "./constant";

export default function defineStore(...args) {
  const { id, options, setup } = formatArgs(args);
  const isSetup = isFunction(setup);

  const useStore = () => {
    const pinia = inject(piniaSymbol); // 获取 createPinia 所创建的 pinia 对象

    if (!pinia.store.has(id)) {
      if (isSetup) {
        createSetupStore(pinia, id, setup);
      } else {
        createOptions(pinia, id, options);
      }
    }

    return pinia.store.get(id);
  };

  // 必须返回一个函数, 因为 provide/inject 只能在 Vue 组件中使用
  return useStore;
}

function createSetupStore(pinia, id, setup) {
  const setupStore = setup();
  const store = reactive({});

  let storeScope;

  const result = pinia.scope.run(() => {
    storeScope = effectScope();
    return storeScope.run(() => compliedSetup(pinia, id, setupStore));
  });

  return setStore(pinia, store, id, result);
}

function createOptions(pinia, id, options) {
  /**
   * options: state getters, actions
   */
  const store = reactive({});
  let storeScope;
  const result = pinia.scope.run(() => {
    storeScope = effectScope();
    return storeScope.run(() => compileOptions(pinia, store, id, options));
  });

  return setStore(pinia, store, id, result);
}

function setStore(pinia, store, id, result) {
  pinia.store.set(id, store);
  Object.assign(store, result);

  return store;
}

function compliedSetup(pinia, id, setupStore) {
  /**
   * state 是一个 ref 对象
   */
  // 若没有, 则初始化为空
  !pinia.state.value[id] && (pinia.state.value[id] = {});

  for (let key in setupStore) {
    const el = setupStore[key];

    if ((isRef(el) && !isComputed(el)) || isReactive(el)) {
      pinia.state.value[id][key] = el;
    }
  }

  return { ...setupStore };
}

function compileOptions(pinia, store, id, options) {
  const { state, getters, actions } = options;

  const storeState = createStoreState(pinia, id, state);
  const storeGetters = createStoreGetters(store, getters);
  const storeActions = createStoreActions(store, actions);
  return {
    ...storeState,
    ...storeGetters,
    ...storeActions,
  };
}

function createStoreState(pinia, id, state) {}
function createStoreGetters(store, getters) {}
function createStoreActions(store, actions) {}
