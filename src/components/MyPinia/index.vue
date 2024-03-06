<template>
  <div>
    <div>
      <div>number: {{ store.number }}</div>
      <button @click="changeNumber">ADD</button>
      <button @click="resetState">reset</button>
    </div>
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

    <button @click="dispose">$dispose</button>
    <button @click="changeState">$state</button>
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

const changeNumber = () => {
  // store.$patch({
  //   number: 500,
  // });

  store.$patch((state) => {
    state.number = 600;
  });
};

const resetState = () => {
  store.$reset();
};

store.$subscribe((info, state) => {
  console.log("info", info);
  console.log("state", state);
});

store.$onAction(({ after, onError }) => {
  console.log("before", store.todoList);

  after(() => {
    console.log("after", store.todoList);
  });

  onError((err) => {
    console.log("error", err);
  });
});

const dispose = () => {
  store.$dispose();
};

const changeState = () => {
  store.$state = {
    todoList: [
      {
        id: 5173,
        content: "state demo",
        completed: true,
      },
    ],
    number: 999,
  };
};
</script>
