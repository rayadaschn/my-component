<template>
  <div class="icon">
    <svg
      viewBox="0 0 1724 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="11105"
      width="20"
      height="20"
      @click="toggleShow"
    >
      <path
        d="M0 1024v-215.578947h1724.631579v215.578947H0zM0 485.052632h1724.631579v161.68421H0V485.052632z m0-269.473685h1724.631579v107.789474H0V215.578947z m0-215.578947h1724.631579v53.894737H0V0z"
        fill="#484D55"
        p-id="11106"
      ></path>
    </svg>
    <span class="icon-text" @click="toggleShow">粗细</span>

    <div class="pen-size" v-show="show">
      <span class="pen-size-tips">粗细 {{ currentTools.size }}</span>
      <span class="pen-size-text">{{ min }}</span>
      <input type="range" v-model="currentTools.size" :min="min" :max="max" />
      <span class="pen-size-text">{{ max }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive, ref } from "vue";

const props = defineProps({
  currentTools: {
    type: Object,
    required: true,
  },
});

const min = ref(1);
const max = ref(10);

const show = ref(false);
const toggleShow = () => (show.value = !show.value);
</script>

<style scoped>
.icon {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px auto;
}
.icon-text {
  font-size: 12px;
  color: rgb(59, 59, 59);
  text-align: center;
}
.pen-size {
  width: 230px;
  height: 30px;
  padding: 0 10px;
  position: absolute;
  right: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid rgb(162, 148, 148);
  background: rgb(225, 236, 225);
  border-radius: 6px;

  z-index: 3;
}
.pen-size-tips,
.pen-size-text {
  font-size: 14px;
  line-height: 14px;
  color: var(--theme-right-bar-function-color);
}
.pen-size-tips {
  margin-right: 5px;
  color: var(--theme-right-bar-function-tips-color);
}
</style>
