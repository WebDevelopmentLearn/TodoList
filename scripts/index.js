/** TODO-LIST
 *  1. Сделать обновление формата времени при редактировании тасков
 *  2. Придумать что-то с кнопкой создания таска. Если тасков много, то кнопка перекрывает последний таск
 */

/**
 * Sources: https://github.com/WebDevelopmentLearn/TodoList
 * Website: https://webdevelopmentlearn.github.io/TodoList/
 */


const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const newRegDate = /^\d{2}\.\d{2}\.\d{4}( \d{2}:\d{2})?$/;
const currentDate = new Date();
const dayOfWeek = currentDate.getDay();
const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
const dayName = document.querySelector("#dayName");
const day = document.querySelector("#dayPar");
let month = months[currentDate.getMonth()];
dayName.textContent = days[dayOfWeek];



const searchInput = document.querySelector("#searchInput");
const todoType1 = document.querySelector("#allTasks");
const todoType2 = document.querySelector("#notCompleted");
const todoType3 = document.querySelector("#completed");
const todoTypes = [todoType1, todoType2, todoType3];

const containers = document.querySelectorAll(".todoType");
const dateInput = document.querySelector("#taskDate");
const createBtn = document.querySelector("#createTask");
const createContainer = document.querySelector(".todoCreate");
const allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
const todoListContainer = document.querySelector(".tasksList");
const taskDeskInput = document.querySelector("#taskDesc");
const taskDateInput = document.querySelector("#taskDate");
const newTaskForm = document.querySelector("#newCase");

const overlay = document.querySelector('.overlay');
const editTaskContainer = document.querySelector(".editTaskContainer");
const editTaskForm = document.querySelector("#editTaskForm");
const editTaskDesc = document.querySelector("#taskDescEdit");
const editTaskDate = document.querySelector("#taskDateEdit");
let editTaskBtn = document.querySelector("#editTodoBtn");
const deleteTodoBtn = document.querySelector("#deleteTodoBtn");

let id = allTasks.length !== 0 ? allTasks[allTasks.length - 1].taskId + 1 : 0;

const tasksCheckboxes = document.querySelectorAll(".taskCheckbox");
initTasks(allTasks);
// renderHoverAndRemoveTasks();


// ================ ВЫВОД ТЕКУЩЕГО ВРЕМЕНИ В РЕАЛТАЙМЕ [НАЧАЛО] ====================

function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return { hours, minutes };
}

window.onload = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

function updateClock() {
  const { hours, minutes } = updateTime();
  day.textContent = `${currentDate.getDate()} ${month} ${hours}:${minutes}`;
}

// ================ ВЫВОД ТЕКУЩЕГО ВРЕМЕНИ В РЕАЛТАЙМЕ [КОНЕЦ] ====================

// ================ ПОИСК [НАЧАЛО] ====================
searchInput.addEventListener("input", (event) => {
    const searchValue = event.target.value;
    const filteredTasks = allTasks.filter((el) => {
        return el.taskDesc.includes(searchValue);
    });
    initTasks(filteredTasks);
  // renderHoverAndRemoveTasks();
});
// ================ ПОИСК [КОНЕЦ] ====================


// ================ ОБНОВЛЕНИЕ СОСТОЯНИЯ ТАСКОВ [КОНЕЦ] ====================
tasksCheckboxes.forEach((el, index) => {
  el.addEventListener("change", (event) => {
    allTasks.forEach((taskObj, objId) => {
      if (index === objId) {
        updateTaskCard(taskObj, allTasks, event.target.checked);
        checkPars(getPar("date",event.target), getPar("desc",event.target), event.target.checked);
      }
    })
  })
})


todoTypes.forEach((el, id) => {
  el.addEventListener("change", () => {
    containers.forEach((el, i) => {
      el.children[1].classList.remove("selected");
    });
    if (el.checked) {
      containers[id].children[1].classList.add("selected");
    }
    switch (id) {
      case 0:
        switchTaskVisibleType();
        break;
      case 1:
        switchTaskVisibleType("notCompleted");
        break;
      case 2:
        switchTaskVisibleType("completed");
        break;
    }
  });
});
// ================ ОБНОВЛЕНИЕ СОСТОЯНИЯ ТАСКОВ [КОНЕЦ] ====================

// ================ ИЗМЕНЕНИЕ ТИПА ПОЛЯ С УКАЗАНИЕМ ДАТЫ [НАЧАЛО] ====================
dateInput.addEventListener("input", (event) => {
    const value = event.target.value;
  // console.log(value);
    if (newRegDate.test(value)) {
      dateInput.style.backgroundColor = "#A1FF993D";
    } else {
      dateInput.style.backgroundColor = "#FC75753D";
    }
});

editTaskDate.addEventListener("input", (event) => {
  const value = event.target.value;
  // console.log(value);
  if (newRegDate.test(value)) {
    editTaskDate.style.backgroundColor = "#A1FF993D";
  } else {
    editTaskDate.style.backgroundColor = "#FC75753D";
  }
});

// ================ ИЗМЕНЕНИЕ ТИПА ПОЛЯ С УКАЗАНИЕМ ДАТЫ [КОНЕЦ] ====================

// ================ СКРЫТИЕ/ОТКРЫТИЯ БЛОКА СОЗДАНИЯ ТАСКА [НАЧАЛО] ====================
createBtn.addEventListener("click", () => {
  createContainer.classList.toggle("hidden");
});
// ================ СКРЫТИЕ/ОТКРЫТИЯ БЛОКА СОЗДАНИЯ ТАСКА [КОНЕЦ] ====================



// ================ СОЗДАНИЕ ТАСКА [НАЧАЛО] ====================
newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTask = createTask(taskDeskInput.value, taskDateInput.value);
  if (newTask !== null) {
    allTasks.push(newTask);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    createTaskCard(newTask);
    alert(`Задача "${newTask.taskDesc}" успешно добавлена!`);
  }
})

const createTask = (desc, date) => {
  if (desc === "" || date === "") {
    alert("Поля Описание и Дата не должны быть пустыми!");
    return null;
  } else if (!newRegDate.test(date)) {
    alert("Неверный формат даты");
  } else {
    return {
      taskId: id++,
      taskDesc: desc,
      taskDate: date,
      isComplete: false
    }
  }
}

function replaceMonth(date) {
  const month = date.split(".")[1];
  date = date.replace(month, months[month - 1]);
  date = date.replace(".", " ");
  date = date.replace(".", " ");

  if (date.split(" ")[2] === String(currentDate.getFullYear())) {
    date = date.split(" ").slice(0, 2).join(" ");
  }
  return date;
}

function createTaskCard(obj) {
  let date = replaceMonth(obj.taskDate);
  if (date === "") return;
  const taskContainer = document.createElement("div");
  const taskInfoContainer = document.createElement("div");
  const datePar = document.createElement("p");
  const descPar = document.createElement("p");

  const checkBox = document.createElement("input");
  const list = [
    {name: "type", value: "checkbox"},
    {name: "name", value: "taskCheckBox"},
    {name: "class", value: "taskCheckbox"}
  ]
  list.forEach((element) => {
    checkBox.setAttribute(element.name, element.value);
  })
  checkBox.checked = obj.isComplete;
  checkPars(datePar, descPar, checkBox.checked);
  checkBox.addEventListener("change", (event) => {
    updateTaskCard(obj, allTasks, event.target.checked);
    checkPars(getPar("date",event.target), getPar("desc",event.target), event.target.checked);
  });
  taskContainer.id = "task_" + obj.taskId;
  taskContainer.classList.add("taskContainer");
  taskInfoContainer.classList.add("taskInfo");
  datePar.textContent = date;
  descPar.textContent = obj.taskDesc;
  datePar.classList.add("text400");
  descPar.classList.add("text400");
  taskInfoContainer.append(datePar, descPar);
  taskContainer.append(checkBox, taskInfoContainer);
  const defaultBcgColor = taskContainer.style.backgroundColor;
  const trashIcon = addTrashIcon();
  const editIcon = addEditIcon();
  taskContainer.appendChild(trashIcon);
  taskContainer.appendChild(editIcon);
  if (!isMobileDevice) {
    handlePointerEvents(taskContainer, trashIcon, editIcon, defaultBcgColor);
  } else {
    handleModal(taskContainer, obj);
  }
  todoListContainer.append(taskContainer);
}

// ================ СОЗДАНИЕ ТАСКА [КОНЕЦ] ====================

// ================ СОБЫТИЯ, СВЯЗАННЫЕ С РЕДАКТИРОВАНИЕМ/УДАЛЕНИЕМ ТАСКОВ [НАЧАЛО] ====================
function handlePointerEvents(taskContainer, trashIcon, editIcon, defaultBcgColor) {
  taskContainer.addEventListener("pointerover", (ev) => {
    taskContainer.style.backgroundColor = "#e0d6e3";
    trashIcon.classList.remove("hidden");
    editIcon.classList.remove("hidden");
  });

  taskContainer.addEventListener("pointerout", () => {
    taskContainer.style.backgroundColor = defaultBcgColor;
    trashIcon.classList.add("hidden");
    editIcon.classList.add("hidden");
  });
}

function handleModal(targetContainer, obj) {
  targetContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("taskCheckbox")) {
      event.stopPropagation();
    } else if (event.currentTarget === targetContainer) {
      editTaskContainer.classList.toggle("hiddenModal");
      overlay.classList.toggle("hiddenModal");
      if (!editTaskContainer.classList.contains("hiddenModal")) {
        handleOverlay();
        // editTaskDesc.value = obj.taskDesc;
        // editTaskDate.value = obj.taskDate;
        editTask(obj.taskDesc, obj.taskDate, targetContainer);
        handleDeleteTodoBtn(targetContainer, obj);

      }
    }
  });
}

function handleOverlay() {
  overlay.addEventListener("click", (event) => {
    // console.log(event.target);
    if (event.currentTarget === overlay) {
      if (!(editTaskContainer.classList.contains("hiddenModal")) || (!overlay.classList.contains("hiddenModal"))) {
        editTaskContainer.classList.toggle("hiddenModal");
        overlay.classList.toggle("hiddenModal");
      }
    }
  });
}

/**
 * Функция обрабатывает нажатие на кнопку удаления таска
 * @param targetContainer - контейнер, в котором находится таск
 * @param obj - объект таска
 */
function handleDeleteTodoBtn(targetContainer, obj) {
  deleteTodoBtn.addEventListener("click", () => {
    removeTask(obj.taskId);
    updateTaskCard(obj, allTasks, obj.isComplete);
    targetContainer.remove();
    editTaskContainer.classList.toggle("hiddenModal");
    overlay.classList.toggle("hiddenModal");
  });
}

// ================ СОБЫТИЯ, СВЯЗАННЫЕ С РЕДАКТИРОВАНИЕМ/УДАЛЕНИЕМ ТАСКОВ [КОНЕЦ] ====================


// ================ УДАЛЕНИЕ ТАСКА [WIP] [НАЧАЛО] ====================

function addTrashIcon() {
  const trashIcon = document.createElement("img");
  trashIcon.setAttribute("class", "trashIcon hidden");
  trashIcon.setAttribute("src", "./assets/icons/trash_icon.svg");
  trashIcon.addEventListener("click", (event) => {
    const taskId = event.target.parentNode.id.split("_")[1];
    removeTask(taskId);
    updateTaskCard(taskId, allTasks, false);
    event.target.parentNode.remove();
  });
  return trashIcon;
}

/**
 * Функция заменяет тип элемента на новый
 * @param element - элемент, который нужно заменить
 * @param newType - новый тип элемента
 * @returns {HTMLElement} - новый элемент
 */
function changeElementType(element, newType) {
    const newElement = document.createElement(newType);
    newElement.innerHTML = element.innerHTML;
    element.parentNode.replaceChild(newElement, element);
    return newElement;
}

function getTaskById(taskId) {
  return allTasks.find((el) => el.taskId === taskId);
}
/**
 * Функция удаляет таск из массива объектов
 */
function removeTask(taskId) {
  taskId = Number(taskId);
  const taskIndex = allTasks.findIndex(el => el.taskId === taskId);

  if (taskIndex !== -1) {
    allTasks.splice(taskIndex, 1);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  }
}

// ================ УДАЛЕНИЕ ТАСКА [WIP] [КОНЕЦ] ====================



// ================ РЕДАКТИРОВАНИЕ ТАСКА [WIP] [НАЧАЛО] ====================


// ======== MOBILE [НАЧАЛО] ============
function editTask(desc, date, obj) {
  editTaskDesc.value = desc;
  editTaskDate.value = date;
  const newEditTaskBtn = editTaskBtn.cloneNode(true);
  editTaskBtn.parentNode.replaceChild(newEditTaskBtn, editTaskBtn);

  newEditTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (newRegDate.test(editTaskDate.value)) {
      obj.children[1].children[0].textContent = editTaskDate.value;
      obj.children[1].children[1].textContent = editTaskDesc.value;
      const taskId = obj.id.split("_")[1];
      const taskObj = getTaskById(Number(taskId));
      taskObj.taskDesc = editTaskDesc.value;
      taskObj.taskDate = editTaskDate.value;
      localStorage.setItem("allTasks", JSON.stringify(allTasks));
      updateTaskCard(taskObj, allTasks, taskObj.isComplete);
      editTaskContainer.classList.toggle("hiddenModal");
      overlay.classList.toggle("hiddenModal");
    } else {
        alert("Неверный формат даты");
    }
  });
  editTaskBtn = newEditTaskBtn;
}

// ======== MOBILE [КОНЕЦ] ============

// ======== DESKTOP [НАЧАЛО] ============
function addEditIcon() {
  const editIcon = document.createElement("img");
  editIcon.setAttribute("class", "editIcon hidden");
  editIcon.setAttribute("src", "./assets/icons/edit_icon.svg");
  editIcon.addEventListener("click", (event) => {
    editDate(event);
    editDesc(event);
  });
  return editIcon;
}

function editDate(ev) {
  const taskId = ev.target.parentNode.id.split("_")[1];
  const date = ev.target.parentNode.children[1].children[0];
  const taskObj = getTaskById(Number(taskId));
  const content = taskObj.taskDate;//date.textContent;
  const newParagraphElement = changeElementType(date, "input");
  newParagraphElement.classList.add("dynamicInput");
  newParagraphElement.value = content;
  newParagraphElement.focus();
  newParagraphElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const oldPar = changeElementType(newParagraphElement, "p");
      if (newRegDate.test(event.target.value)) {
        taskObj.taskDate = event.target.value;
        oldPar.textContent = event.target.value;
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        ev.target.parentNode.children[1].children[1].focus();
      } else {
        alert("Неверный формат даты");
        oldPar.textContent = content;
      }
    }
  });
}

function editDesc(ev) {
  const taskId = ev.target.parentNode.id.split("_")[1];
  const desc = ev.target.parentNode.children[1].children[1];
  const content = desc.textContent;
  const newParagraphElement = changeElementType(desc, "input");
  newParagraphElement.classList.add("dynamicInput");
  newParagraphElement.value = content;
  newParagraphElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const taskObj = getTaskById(Number(taskId));
      taskObj.taskDesc = event.target.value;
      const oldPar = changeElementType(newParagraphElement, "p");
      const isChecked = getTaskById(Number(taskId)).isComplete;
      oldPar.textContent = event.target.value;
      updateTaskCard(taskObj, allTasks, isChecked);
      checkPars(ev.target.parentNode.children[1].children[0], ev.target.parentNode.children[1].children[1], isChecked);
      localStorage.setItem("allTasks", JSON.stringify(allTasks));
    }
  });
}
// ======== DESKTOP [КОНЕЦ] ============

// ================ РЕДАКТИРОВАНИЕ ТАСКА [WIP] [КОНЕЦ] ====================



// ================ УТИЛИТАРНЫЕ ФУНКЦИИ [НАЧАЛО] ====================
function checkPars(parDate, parDesc, isChecked) {
  parDate.style.opacity = isChecked ? 0.5 : 1;
  parDesc.style.opacity = isChecked ? 0.5 : 1;
  parDesc.style.textDecoration = isChecked ? "line-through" : "none";
}

function updateTaskCard(obj, tasksObjList, checked) {
  obj.isComplete = checked;
  localStorage.setItem("allTasks", JSON.stringify(tasksObjList));
}


/**
 * Функция возвращает родительский элемент по типу и объекту
 * @param type - тип элемента, где: 'date' - дата, 'desc' - описание
 * @param obj - объект, для которого нужно найти родителя
 * @returns {Element} - родительский элемент
 */
function getPar(type, obj) {
  if (type === "date") {
    return  obj.parentNode.children[1].children[0];
  } else if (type === "desc") {
    return obj.parentNode.children[1].children[1];
  }
}


/**
 * Функция инициализирует таски в зависимости от переданного массива объектов
 * @param objArray - массив объектов, которые нужно отобразить
 */
function initTasks(objArray) {
  todoListContainer.textContent = "";
  objArray.forEach((el) => {
    createTaskCard(el);
  })
}

/**
 * Данная функция переключает видимость тасков
 * @param type - тип отображения, где:
 *  'all' - отображать все таски
 *  'notCompleted' - отображать незавершенные таски
 *  'completed' - отображать завершенные таски
 */
function switchTaskVisibleType(type = "all") {
  let newArray = [];
  switch (type) {
    case "notCompleted":
      newArray = allTasks.filter((el) => {
        return !el.isComplete;
      })
      break;
    case "completed":
      newArray = allTasks.filter((el) => {
        return el.isComplete;
      })
      break;
    default:
      newArray = allTasks;
      break;
  }
  initTasks(newArray);
}


// ================ УТИЛИТАРНЫЕ ФУНКЦИИ [КОНЕЦ] ====================
