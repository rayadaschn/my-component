<template>
  <div class="right-bar">
    <PenSize :currentTools="state.currentTools" />
    <Color :currentTools="state.currentTools" />
    <RubberMode v-model:isRubber="isRubber" />
    <Clear :currentTools="state.currentTools" />
    <Output :currentTools="state.currentTools" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import PenSize from "./Pensize.vue";
import Color from "./Color.vue";
import Clear from "./Clear.vue";
import Output from "./Output.vue";
import RubberMode from "./RubberMode.vue";

import Graffiti from "../tools/Graffiti";
import Rubber from "../tools/Rubber";
import DND from "../tools/DND";

const props = defineProps({
  canvas: {
    type: HTMLCanvasElement,
    require: true,
  },
  canvasBackup: {
    type: HTMLCanvasElement,
    require: true,
  },
});

const graffiti = new Graffiti(props.canvas, props.canvasBackup);
const rubber = new Rubber(props.canvas, props.canvasBackup);

new DND(props.canvas, props.canvasBackup);

const isRubber = ref(false);

const state = reactive({
  currentTools: graffiti,
  tools: [graffiti, rubber],
});
state.currentTools?.clearContext(true);
state.currentTools.enable();

/** 手动添加绘制图片 */
const addImg = (src) => {
  const image = new Image();
  image.src = "src";

  image.onerror = (err) => {
    console.log(err);
  };

  image.onload = function () {
    const ctx = props.canvas.getContext("2d");
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      props.canvas.width,
      props.canvas.height
    );
  };
};

const enable = (currentTools) => {
  // 关闭其它模式
  state.tools.forEach((item) => {
    item.disable();
  });
  state.currentTools = currentTools;
  state.currentTools.enable();
};

watch(isRubber, (val) => {
  const currentTools = val ? rubber : graffiti;
  enable(currentTools);
});
</script>

<style scoped>
.right-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
}
</style>
