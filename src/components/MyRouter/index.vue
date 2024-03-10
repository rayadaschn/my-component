<template>
  <div>我的路由</div>
  <button @click="changePage('home')">to Home</button>
  <button @click="changePage('list')">to List</button>
  <button @click="changePage('info')">to Info</button>
  <button @click="changePage('other')">to Other</button>
</template>

<script setup lang="ts">
import { createBrowserHistory } from "./src/index";

const browserRouter = createBrowserHistory();

const changePage = (page) => {
  if (page === "info") {
    browserRouter.replace(`/${page}`, { data: "replaceValue" });
  } else {
    browserRouter.push(`/${page}`, { data: "pushValue" });
  }
};

browserRouter.listen(handlePopState);

function handlePopState(toPath, fromPath, data) {
  console.log("toPath, fromPath, data", toPath, fromPath, data);
}
</script>

<style scoped></style>
