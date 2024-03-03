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
