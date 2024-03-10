/**
 * state { backward: path, current: path, forward: path, isReplace: boolean }
 */
export function createBrowserHistory(hashSign = "") {
  const stateNavigation = createStateNavigation(hashSign);
  const historyListener = bindHistoryListener(
    stateNavigation.location,
    stateNavigation.state,
    hashSign
  );

  // 单独拎出来, 增加代理监听
  const router = {
    ...stateNavigation,
    ...historyListener,
  };

  Object.defineProperties(router, {
    location: {
      get: () => stateNavigation.location.value,
    },
    state: () => {
      get: () => stateNavigation.state.value;
    },
  });

  return router;
}

function createStateNavigation(hashSign) {
  const { state } = window.history;

  // 路由地址
  const locationInfo = {
    value: createLocation(hashSign),
  };

  // stateInfo 存放信息
  const stateInfo = {
    value: state,
  };

  // 对 state 是否为空进行判断
  if (!state) {
    const newState = createState({
      backward: null,
      current: locationInfo.value,
      forward: null,
      isReplace: true,
    });
    setLocation(locationInfo.value, newState, true);
  }

  /** 修改 state 信息, 【注】只有 replaceState 和 pushState 可以将 state 修改与 window.history.state 中去  */
  function setLocation(path, state, isReplace = true) {
    // if (hashSign.indexOf("#") !== -1) {
    //   path = hashSign + path; // 由 /list => #/list
    // }

    window.history[isReplace ? "replaceState" : "pushState"](state, null, path);
    stateInfo.value = state;
  }

  function push(path, data) {
    const currentState = {
      ...stateInfo.value,
      forward: path,
    };

    // 先修改当前路由地址的 state 信息(增加 forward 路径)
    setLocation(currentState.current, currentState, true);

    // 下一即将调整路由
    const newState = {
      ...createState({
        backward: locationInfo.value,
        current: path,
        forward: null,
        isReplace: false,
      }),
      data,
      length: currentState.length + 1,
    };

    setLocation(path, newState, false);
    location.value = path;
  }

  function replace(path, data) {
    const state = {
      ...createState({
        backward: null,
        current: path,
        forward: null,
        isReplace: true,
      }),
      data,
    };

    setLocation(path, state, true);
    locationInfo.value = path;
  }

  return {
    location: locationInfo,
    state: stateInfo,
    push,
    replace,
  };
}

/**
 * /list?params=someValue#hashValue
 */
function createLocation(hasSign) {
  const { pathname, search, hash } = window.location;

  if (hasSign.indexOf("#")) {
    return hash.slice(1) || "/";
  }

  return pathname + search + hash;
}

function createState({ backward, current, forward, isReplace }) {
  return {
    backward,
    current,
    forward,
    isReplace,
    length: window.history.length - 1,
  };
}

function bindHistoryListener(locationInfo, stateInfo, hashSign) {
  const handlers = []; // 保存当前操作

  window.addEventListener("popstate", handlePopState, false);

  function handlePopState({ state }) {
    const toPath = createLocation(hashSign);
    const fromPath = locationInfo.value;
    const fromState = stateInfo.value;

    // 触发后, 同步修改
    locationInfo.value = toPath; // 目标 path
    stateInfo.value = state; // 当前新的 state
    const isBackward = state.length - fromState.length < 0;

    // 每次触发 'popState' 将所有回调执行
    handlers.forEach((handler) => {
      handler(toPath, fromPath, { isBackward, ...state.data });
    });
  }

  /**
   * router.listen((toPath, fromPath, {isBackward, data}) => {})
   */
  function listen(cb) {
    handlers.push(cb);
  }

  return {
    listen,
  };
}
