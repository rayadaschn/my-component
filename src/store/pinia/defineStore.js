import {
  computed,
  effectScope,
  inject,
  isReactive,
  isRef,
  reactive,
} from "vue";
import { formatArgs, isComputed, isFunction } from "./utils";
import { piniaSymbol } from "./constant";

export default function defineStore(...args) {
  const { id, options, setup } = formatArgs(args);
  const isSetup = isFunction(setup);

  const useStore = () => {
    const pinia = inject(piniaSymbol); // 获取 createPinia 所创建的 pinia 对象

    // 查看是否已经注册该 store
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
  store.$id = id; // 给 store 增加一个 $id 属性, 为后续方法做铺垫
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

function createStoreState(pinia, id, state) {
  // state : () => {}
  return (pinia.state.value[id] = state ? state() : {});
}

function createStoreGetters(store, getters) {
  /**
   * getters: {
   *  count: () => {
   *    return this.todoList.length
   *  }
   * }
   *
   * 最终需要结果为 { count: computed(() => count.call(store)) }
   */

  // keys 遍历出来的是数组 ['count', 'others']
  return Object.keys(getters || {}).reduce((wrapper, getterName) => {
    wrapper[getterName] = computed(() => getters[getterName].call(store));
    return wrapper;
  }, {});
}

function createStoreActions(store, actions) {
  /**
   * action: {
      addTodo(todo) {
        this.todoList.unshift(todo);
      },
      toggleTodo(id) {...},
      removeTodo(id) {...},
    },
   */
  const storeActions = {};
  for (const actionName in actions) {
    storeActions[actionName] = function () {
      // apply(context, [...])
      actions[actionName].apply(store, arguments);
    };
  }
  return storeActions;
}
