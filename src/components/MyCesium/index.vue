<template>
  <div id="cesiumContainer" ref="cesiumRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { TOKEN } from "./const";

// 设置 CESIUM_BASE_URL
const CESIUM_BASE_URL = "/";
Cesium.buildModuleUrl.setBaseUrl(CESIUM_BASE_URL);
Cesium.Ion.defaultAccessToken = TOKEN;

const cesiumRef = ref();

onMounted(() => {
  const viewer = new Cesium.Viewer(cesiumRef.value.id);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
