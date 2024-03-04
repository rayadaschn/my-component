<template>
  <div class="wrap" :style="{ width: sizePx }" ref="wrapRef">
    <img ref="imgRef" src="../assets/img.jpg" />
    <canvas canvas ref="canvas" :style="state.style"></canvas>
    <canvas canvasBackup ref="canvasBackup" :style="state.style"></canvas>
    <ToolsBar
      v-if="ready && state.canvas && state.canvasBackup"
      :canvas="state.canvas"
      :canvasBackup="state.canvasBackup"
      class="toolsBar"
    />
  </div>
  <div>
    <button @click="changeSize">改变大小</button>
    <button @click="getImg">获取蒙版</button>
  </div>
</template>

<script setup lang="ts">
import {
  CSSProperties,
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import ToolsBar from "./ToolsBar.vue";

const size = ref(500);
const changeSize = () => {
  size.value = size.value + 100;
};
const sizePx = computed(() => size.value + "px");

watch(size, () => {
  nextTick(() => handleResize());
});

/** 获取蒙版 */
const getImg = () => {};

const ready = ref<boolean>(false);
const state = reactive<any>({
  canvas: null,
  canvasBackup: null,
  style: { cursor: "auto", opacity: 0.5 },
});

const wrapRef = ref();
const imgRef = ref();

const setSzie = <T extends { width: number; height: number }>(
  wrapper: T,
  size: { width: number; height: number }
) => {
  const { width, height } = size;
  wrapper.width = width;
  wrapper.height = height;
  return wrapper;
};

const handleResize: () => Promise<boolean> = () => {
  return new Promise((resolve, reject) => {
    if (state.canvas && state.canvasBackup) {
      const size = {
        width: wrapRef.value.clientWidth,
        height: wrapRef.value.clientHeight,
      };
      state.canvas = setSzie(state.canvas, size);
      state.canvasBackup = setSzie(state.canvasBackup, size);
      resolve(true);
    } else {
      reject("canvas is not ready");
    }
  });
};

const canvasReady = () =>
  handleResize()
    .then((isReady) => (ready.value = isReady))
    .catch(console.log);

const init = () => {
  state.canvas = document.querySelector(`canvas[canvas]`);
  state.canvasBackup = document.querySelector(`canvas[canvasBackup]`);
  // canvasReady();
  imgRef.value.addEventListener("load", () => {
    canvasReady();
    // const context = state.canvas.getContext("2d");
    // context.drawImage("../assets/drawing.png", 0, 0);
  });
};

onMounted(init);
</script>

<style scoped>
.wrap {
  position: relative;
  z-index: 2;

  /* width: 700px;
  height: 400px; */
  margin: 10px auto 0 auto;
  opacity: 0.6;
  border-radius: 10px;
  border: 2px dashed black;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.toolsBar {
  position: absolute;
  top: 0px;
  right: -30px;
}
</style>
