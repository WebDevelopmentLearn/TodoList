const regDate = /^\d{4,}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const currentDate = new Date();
const dayOfWeek = currentDate.getDay();
const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
const dayName = document.querySelector("#dayName");
const day = document.querySelector("#dayPar");
let month = months[currentDate.getMonth()];
dayName.textContent = days[dayOfWeek];


const SHOW_TIME = false;
function updateTime() {
  const now = new Date()
  currentHour = now.getHours();
  currentMin = String(now.getMinutes()).padStart(2, '0');
  day.textContent = `${now.getDate()} ${month} ${currentHour}:${currentMin}`;
}

if (SHOW_TIME) {
  let currentHour = currentDate.getHours();
  let currentMin = String(currentDate.getMinutes()).padStart(2, '0');
  day.textContent = `${currentDate.getDate()} ${month} ${currentHour}:${currentMin}`;
  window.onload = () => {
    updateTime();
    setInterval(updateTime, 60000);
  };
} else {
  day.textContent = `${currentDate.getDate()} ${month}`;
}


const todoType1 = document.querySelector("#radio-1");
const todoType2 = document.querySelector("#radio-2");
const todoType3 = document.querySelector("#radio-3");
const todoTypes = [todoType1, todoType2, todoType3];

const containers = document.querySelectorAll(".todo_type");
const dateInput = document.querySelector("#caseDate");
const createBtn = document.querySelector("#createTask");
const createContainer = document.querySelector(".todoCreate");
const allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
const todoListContainer = document.querySelector(".tasksList");
const taskDeskInput = document.querySelector("#caseDesc");
const taskDateInput = document.querySelector("#caseDate");
const newTaskForm = document.querySelector("#newCase");
let id = allTasks.length !== 0 ? allTasks[allTasks.length - 1].taskId + 1 : 0;

const tasksCheckboxes = document.querySelectorAll(".taskCheckbox");
initTasks(allTasks);


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

dateInput.addEventListener("focus", () => {
  dateInput.setAttribute("type", "datetime-local");
});

dateInput.addEventListener("blur", () => {
  dateInput.setAttribute("type", "text");
});

createBtn.addEventListener("click", () => {
  createContainer.classList.toggle("hidden");
});

newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTask = createTask(taskDeskInput.value, taskDateInput.value);
  if (newTask !== null) {
    allTasks.push(newTask);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    createTaskCard(newTask);
  }
})

const createTask = (desc, date) => {
  if (desc === "" || date === "") {
    alert("Поля Описание и Дата не должны быть пустыми!");
    return null;
  } else {
    return {
      taskId: id++,
      taskDesc: desc,
      taskDate: date,
      isComplete: false
    }
  }
}

function createTaskCard(obj) {
  const taskContainer = document.createElement("div");
  taskContainer.id = "task_" + obj.taskId;
  taskContainer.classList.add("taskContainer");
  const datePar = document.createElement("p");
  const descPar = document.createElement("p");
  const date = formatDate(obj.taskDate);
  if (date === "") return;
  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.classList.add("taskCheckbox");
  checkBox.checked = obj.isComplete;
  checkPars(datePar, descPar, checkBox.checked);
  checkBox.addEventListener("change", (event) => {
    updateTaskCard(obj, allTasks, event.target.checked);
    checkPars(getPar("date",event.target), getPar("desc",event.target), event.target.checked);
  });
  const taskInfoContainer = document.createElement("div");
  taskInfoContainer.classList.add("taskInfo");
  datePar.textContent = date;
  descPar.textContent = obj.taskDesc;
  datePar.classList.add("text_400", "taskDate");
  descPar.classList.add("text_400", "taskDesc");
  taskInfoContainer.append(datePar, descPar);
  taskContainer.append(checkBox, taskInfoContainer);
  todoListContainer.append(taskContainer);
}


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
  todoListContainer.innerHTML = "";
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


/**
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
 * Здесь мы разделяем массивоподобный 'объект'(в данном случае String) на 2 элемента в месте, где находится символ ':'
 * @param {string} dateTimeStr - строка даты и времени в формате: "2024-02-10T16:33" -> "10 Февраля, 16:33"
 * @returns {Array} новый массив с 2 элементами даты и минут
 */
function getDateAndMin(dateTimeStr) {
  return dateTimeStr.split(":");
}

/**
 * Здесь разделяем 1 элемент прошлого массива на 3 элемента, что соответствуют году, месяцу и дню
 * @param {Array} array - массив, в котором нам нужно провести раскол
 * @returns {Array} новый массив с 3 элементами года, месяца и дня
 */
function getYearMonthAndDay(array) {
  return array[0].split("-");
}


/**
 * Здесь разделяем 3 элемент прошлого массива на 2 элемента, что соответствуют дню и часу
 * @param {Array} array - массив, в котором нам нужно провести раскол
 * @returns {Array} новый массив с 2 элементами дня и часа
 */
function getDayAndHour(array) {
  return array[2].split("T");
}



