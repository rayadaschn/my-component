import { defineStore } from "./pinia";

export default defineStore("todolist1", {
  state: () => {
    return {
      todoList: [],
    };
  },
  getters: {
    count() {
      return this.todoList.length;
    },
  },
  actions: {
    addTodo(todo) {
      this.todoList.unshift(todo);
    },
    toggleTodo(id) {
      this.todoList = this.todoList.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      });
    },
    removeTodo(id) {
      this.todoList = this.todoList.filter((todo) => todo.id !== id);
    },
  },
});
