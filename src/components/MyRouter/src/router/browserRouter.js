/**
 * state { backward: path, current: path, forward: path, isReplace: boolean }
 */
export function createBrowserHistory() {
  const stateNavigation = createStateNavigation();

  return {
    ...stateNavigation,
  };
}

function createStateNavigation() {
  const { state } = window.history;

  const locationInfo = {
    value: createLocation(),
  };

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

  function setLocation(path, state, isReplace) {
    window.history[isReplace ? "replaceState" : "pushState"](state, null, path);
    stateInfo.value = state;
  }
}

/**
 * /list?params=someValue#hashValue
 */
function createLocation() {
  const { pathname, search, hash } = window.location;
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
