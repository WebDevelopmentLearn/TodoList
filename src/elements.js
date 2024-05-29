console.log("Elements module init");
export const searchInput = document.querySelector("#searchInput");
export const todoType1 = document.querySelector("#allTasks");
export const todoType2 = document.querySelector("#notCompleted");
export const todoType3 = document.querySelector("#completed");
export const todoTypes = [todoType1, todoType2, todoType3];

export const containers = document.querySelectorAll(".todoType");
export const dateInput = document.querySelector("#taskDate");
export const createBtn = document.querySelector("#createTask");
export const createContainer = document.querySelector(".todoCreate");
export const allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
export const todoListContainer = document.querySelector(".tasksList");
export const taskDeskInput = document.querySelector("#taskDesc");
export const taskDateInput = document.querySelector("#taskDate");
export const newTaskForm = document.querySelector("#newCase");

export const overlay = document.querySelector(".overlay");
export const editTaskContainer = document.querySelector(".editTaskContainer");
export const editTaskForm = document.querySelector("#editTaskForm");
export const editTaskDesc = document.querySelector("#taskDescEdit");
export const editTaskDate = document.querySelector("#taskDateEdit");
export const deleteTodoBtn = document.querySelector("#deleteTodoBtn");
