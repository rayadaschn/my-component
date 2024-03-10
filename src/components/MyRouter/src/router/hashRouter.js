import { createBrowserHistory } from "./browserRouter";

export function createHashHistory() {
  return createBrowserHistory("#");
}
