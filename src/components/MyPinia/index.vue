<template>
  <div>
    <div>
      <input type="text" v-model="todoText" />
      <button @click="addTodo">ADD</button>
      <p>共{{ store.count }}条</p>
    </div>

    <ul>
      <li v-for="todo of store.todoList" :key="todo.id">
        <input
          type="checkbox"
          :checked="todo.completed"
          @click="store.toggleTodo(todo.id)"
        />
        <span
          :style="{ textDecoration: todo.completed ? 'line-through' : '' }"
          >{{ todo.content }}</span
        >
        <button @click="store.removeTodo(todo.id)">REMOVE</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useTodoListStore from "../../store/todolist1";
// import useTodoListStore from "../../store/todolist2";

const store = useTodoListStore();

const todoText = ref("");
const addTodo = () => {
  if (!todoText.value.length) return;

  const todo = {
    id: new Date().getTime(),
    content: todoText.value,
    completed: false,
  };

  store.addTodo(todo);
  todoText.value = "";
};
</script>
