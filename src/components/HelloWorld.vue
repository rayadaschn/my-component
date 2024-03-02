<script setup>
import { computed, effect, effectScope, ref } from "vue";

const scope = effectScope();

const count = ref(0);
// const doubleCount = computed(() => count.value * 2);
const tripleCount = computed(() => count.value * 3);

let doubleCount;
scope.run(() => {
  effect(() => {
    doubleCount = computed(() => count.value * 2);
  });
});

const add = () => (count.value = count.value + 1);
const stop = () => scope.stop();
</script>

<template>
  <div>
    <h1>Count: {{ count }}</h1>
    <h1>doubleCount: {{ doubleCount }}</h1>
    <h1>tripleCount: {{ tripleCount }}</h1>
    <button @click="add">+</button>
    <button @click="stop">停止</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
