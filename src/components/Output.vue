<template>
  <div class="icon" @click="output">
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3363"
      width="20"
      height="20"
    >
      <path
        d="M469.333333 597.333333a42.666667 42.666667 0 0 1 42.666667-42.666666h193.322667l-52.693334-52.693334a44.330667 44.330667 0 0 1 62.677334-62.677333l125.397333 125.397333a44.117333 44.117333 0 0 1 8.874667 49.322667 43.648 43.648 0 0 1-10.112 16.810667l-124.629334 124.629333a44.032 44.032 0 0 1-62.293333-62.293333L705.706667 640H512a42.666667 42.666667 0 0 1-42.666667-42.666667z m-256 341.333334h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-85.333333a42.666667 42.666667 0 0 0-85.333333 0v42.666667a42.666667 42.666667 0 0 1-42.666667 42.666666H256a42.666667 42.666667 0 0 1-42.666667-42.666666V213.333333a42.666667 42.666667 0 0 1 42.666667-42.666666h512a42.666667 42.666667 0 0 1 42.666667 42.666666v213.333334a42.666667 42.666667 0 0 0 85.333333 0V170.666667a85.333333 85.333333 0 0 0-85.333333-85.333334H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333334v682.666666a85.333333 85.333333 0 0 0 85.333333 85.333334z"
        p-id="3364"
        fill="#515151"
      ></path>
    </svg>
    <span class="icon-text">导出</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  currentTools: {
    type: Object,
    required: true,
  },
});

const output = () => props.currentTools.output("png");
</script>

<style scoped>
.box {
  position: relative;
}
.icon {
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

.output {
  width: 175px;
  padding: 0;
  position: fixed;
  border: 3px solid rgb(80, 80, 80);
  background: var(--theme-right-bar-function-background);
  top: 260px;
  right: 54px;
  z-index: 3;
}
</style>
