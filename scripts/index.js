/** TODO-LIST
 *  1. Сделать адаптив под мобильные устройства
 *  2. Исправить работу указания даты на мобильных устройствах
 */

const newRegDate = /^\d{2}\.\d{2}\.\d{4}( \d{2}:\d{2})?$/;
const currentDate = new Date();
const dayOfWeek = currentDate.getDay();
const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
const dayName = document.querySelector("#dayName");
const day = document.querySelector("#dayPar");
let month = months[currentDate.getMonth()];
dayName.textContent = days[dayOfWeek];

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
let id = allTasks.length !== 0 ? allTasks[allTasks.length - 1].taskId + 1 : 0;

const tasksCheckboxes = document.querySelectorAll(".taskCheckbox");
initTasks(allTasks);
renderHoverAndRemoveTasks();

// ================ ПОИСК [НАЧАЛО] ====================
searchInput.addEventListener("input", (event) => {
    const searchValue = event.target.value;
    const filteredTasks = allTasks.filter((el) => {
        return el.taskDesc.includes(searchValue);
    });
    initTasks(filteredTasks);
  renderHoverAndRemoveTasks();
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
// dateInput.addEventListener("focus", () => {
//   dateInput.setAttribute("type", "datetime-local");
// });
//
// dateInput.addEventListener("blur", () => {
//   dateInput.setAttribute("type", "text");
// });

dateInput.addEventListener("input", (event) => {
    const value = event.target.value;
  console.log(value);
    if (newRegDate.test(value)) {
      dateInput.style.backgroundColor = "rgba(161,255,153,0.24)";
    } else {
      dateInput.style.backgroundColor = "rgba(252,117,117,0.24)";
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
  taskContainer.append(checkBox, taskInfoContainer,  addTrashIcon(), addEditIcon());
  todoListContainer.append(taskContainer);
  renderHoverAndRemoveTasks();
}

// ================ СОЗДАНИЕ ТАСКА [КОНЕЦ] ====================


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
 * TODO: Дописать функционал удаления тасков и не забыть про вызов функции
 * Функция отвечает за отрисовку hover-эффекта на тасках и их удаления
 */
function renderHoverAndRemoveTasks() {
  // console.log(todoListContainer.children);
  const taskContainers = todoListContainer.children;

  for (let i = 0; i < taskContainers.length; i++) {
    const taskContainer = taskContainers[i];
    const defaultBcgColor = taskContainer.style.backgroundColor;
    addTrashIcon();
    addEditIcon();

    taskContainer.addEventListener("pointerover", () => {
      taskContainer.style.backgroundColor = "#e0d6e3";
      const trashIcon = taskContainer.querySelector(".trashIcon");
      const editIcon = taskContainer.querySelector(".editIcon");
      if (trashIcon) {
        trashIcon.classList.remove("hidden");
      }
      if (editIcon) {
        editIcon.classList.remove("hidden");
      }
    });

    taskContainer.addEventListener("pointerout", () => {
      taskContainer.style.backgroundColor = defaultBcgColor;
      const trashIcon = taskContainer.querySelector(".trashIcon");
      const editIcon = taskContainer.querySelector(".editIcon");
      if (trashIcon) {
        trashIcon.classList.add("hidden");
      }
      if (editIcon) {
        editIcon.classList.add("hidden");
      }
    });


    taskContainer.addEventListener("touchstart", () => {
      taskContainer.style.backgroundColor = "#e0d6e3";
      const trashIcon = taskContainer.querySelector(".trashIcon");
      const editIcon = taskContainer.querySelector(".editIcon");
      if (trashIcon) {
        trashIcon.classList.remove("hidden");
      }
      if (editIcon) {
        editIcon.classList.remove("hidden");
      }
    });

    taskContainer.addEventListener("touchend", () => {
      setTimeout(() => {
        taskContainer.style.backgroundColor = defaultBcgColor;
        const trashIcon = taskContainer.querySelector(".trashIcon");
        const editIcon = taskContainer.querySelector(".editIcon");
        if (trashIcon) {
          trashIcon.classList.add("hidden");
        }
        if (editIcon) {
          editIcon.classList.add("hidden");
        }
      }, 3000); // Hide the icon after 3 seconds
    });
  }
}


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
  renderHoverAndRemoveTasks();
}


/**
 * @deprecated
 * TODO: Переписать код
 * Форматрирует передаваемую в него дату и время(в формате string) в читаемый вид.
 * Пример: "2024-02-10T16:33" -> "10 Февраля, 16:33"
 * @param {string} dateTimeStr - дата и время
 * @returns {string} - отформатированное дата и время
 */
function formatDate(dateTimeStr) {
  if (!regDate.test(dateTimeStr)) {
    alert("Неверно указан формат времени");
    return "";
  }
  const dateAndMin = getDateAndMin(dateTimeStr);
  const min = dateAndMin[1];
  const yearMonthAndDay = getYearMonthAndDay(dateAndMin);
  const dayAndHour = getDayAndHour(yearMonthAndDay);
  const monthNum = Number(yearMonthAndDay[1] -1);
  const monthStrn = months[monthNum];
  const currentYear = String(currentDate.getFullYear());
  const year = yearMonthAndDay[0];
  let newDate;
  if (currentYear === year) {
    newDate = `${dayAndHour[0]} ${monthStrn}, ${dayAndHour[1]}:${min}`;
  } else {
    newDate = `${dayAndHour[0]} ${monthStrn} ${year}, ${dayAndHour[1]}:${min}`;
  }
  return newDate;
}

/**
 * @deprecated
 * Здесь мы разделяем массивоподобный 'объект'(в данном случае String) на 2 элемента в месте, где находится символ ':'
 * @param {string} dateTimeStr - строка даты и времени в формате: "2024-02-10T16:33" -> "10 Февраля, 16:33"
 * @returns {Array} новый массив с 2 элементами даты и минут
 */
function getDateAndMin(dateTimeStr) {
  return dateTimeStr.split(":");
}

/**
 * @deprecated
 * Здесь разделяем 1 элемент прошлого массива на 3 элемента, что соответствуют году, месяцу и дню
 * @param {Array} array - массив, в котором нам нужно провести раскол
 * @returns {Array} новый массив с 3 элементами года, месяца и дня
 */
function getYearMonthAndDay(array) {
  return array[0].split("-");
}


/**
 * @deprecated 
 * Здесь разделяем 3 элемент прошлого массива на 2 элемента, что соответствуют дню и часу
 * @param {Array} array - массив, в котором нам нужно провести раскол
 * @returns {Array} новый массив с 2 элементами дня и часа
 
 */
function getDayAndHour(array) {
  return array[2].split("T");
}
// ================ УТИЛИТАРНЫЕ ФУНКЦИИ [КОНЕЦ] ====================
