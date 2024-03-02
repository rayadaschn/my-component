<template>
  <div class="icon" :class="{ border: isRubber }" @click="changeMode">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="-1.5 -2.5 24 24"
    >
      <path
        fill="currentColor"
        d="M12.728 12.728L8.485 8.485l-5.657 5.657l2.122 2.121a3 3 0 0 0 4.242 0zM11.284 17H14a1 1 0 0 1 0 2H3a1 1 0 0 1-.133-1.991l-1.453-1.453a2 2 0 0 1 0-2.828L12.728 1.414a2 2 0 0 1 2.828 0L19.8 5.657a2 2 0 0 1 0 2.828z"
      />
    </svg>
    <span class="icon-text">橡皮</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isRubber: Boolean,
});

const emits = defineEmits(["update:isRubber"]);

const changeMode = () => {
  emits("update:isRubber", !props.isRubber);
};
</script>

<style scoped>
.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px auto;
  border: 1px solid white;
  border-radius: 4px;
}
.icon-text {
  font-size: 12px;
  color: rgb(59, 59, 59);
  text-align: center;
}

.border {
  border: 1px dashed black;
  background-color: rgba(0, 1, 2, 0.2);
}
</style>
