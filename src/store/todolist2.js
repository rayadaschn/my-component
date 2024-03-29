import { defineStore } from "./pinia";

import { computed, ref } from "vue";

export default defineStore("todolist2", () => {
  const todoList = ref([]);
  const number = ref(0);
  const count = computed(() => todoList.value.length);

  function addTodo(todo) {
    todoList.value.unshift(todo);
  }
  function toggleTodo(id) {
    todoList.value = todoList.value.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
  }
  function removeTodo(id) {
    todoList.value = todoList.value.filter((todo) => todo.id !== id);
  }
  function addNumber() {
    number.value = number.value + 1;
  }

  return {
    count,
    number,
    todoList,
    addTodo,
    toggleTodo,
    removeTodo,
    addNumber,
  };
});
