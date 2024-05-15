const regDate = /^\d{4,}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const currentDate = new Date();
const dayOfWeek = currentDate.getDay();
const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббтоа",
];
const months = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
];
let month = months[currentDate.getMonth()];

const dayName = document.querySelector("#dayName");
const day = document.querySelector("#dayPar");
dayName.textContent = days[dayOfWeek];
day.textContent = currentDate.getDate() + " " + month;

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

function initTasks(objArray) {
  todoListContainer.innerHTML = "";
  objArray.forEach((el) => {
    createTaskCard(el);
  })
}
initTasks(allTasks);

todoTypes.forEach((el, id) => {
  el.addEventListener("change", () => {
    containers.forEach((el, i) => {
      el.children[1].classList.remove("selected");
    });
    todoTypes.forEach((otherInput) => {});
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



const taskDeskInput = document.querySelector("#caseDesc");
const taskDateInput = document.querySelector("#caseDate");
const newTaskForm = document.querySelector("#newCase");

const tasksCheckboxes = document.querySelectorAll(".taskCheckbox");
let id = allTasks.length !== 0 ? allTasks[allTasks.length - 1].taskId + 1 : 0;

const createTask = (desc, date) => {
  if (desc === "" || date === "") {
    // console.log(date);
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

newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // console.log(taskDateInput.value);
  const newTask = createTask(taskDeskInput.value, taskDateInput.value);
  if (newTask !== null) {
    allTasks.push(newTask);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    createTaskCard(newTask);
  }



})

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
  if (obj.isComplete) {
    checkBox.checked = true;
    datePar.style.opacity = obj.isComplete ? 0.5 : 1;
    descPar.style.opacity = obj.isComplete ? 0.5 : 1;
    descPar.style.textDecoration = obj.isComplete
        ? "line-through"
        : "none";
  }
  const taskInfoContainer = document.createElement("div");
  taskInfoContainer.classList.add("taskInfo");
  datePar.textContent = date;
  descPar.textContent = obj.taskDesc;
  datePar.classList.add("text_400", "taskDate");
  descPar.classList.add("text_400", "taskDesc");
  taskInfoContainer.append(datePar, descPar);
  taskContainer.append(checkBox, taskInfoContainer);
  todoListContainer.append(taskContainer);
  console.log("test");
}

tasksCheckboxes.forEach((el, index) => {
  el.addEventListener("change", (event) => {
    const parDate = event.target.parentNode.children[1].children[0];
    const parDesc = event.target.parentNode.children[1].children[1];
    console.log("125215");
    allTasks.forEach((taskObj, objId) => {

      console.log(index, objId);
      if (index === objId) {

        taskObj.isComplete = event.target.checked;
        console.log(taskObj);
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        // initTasks(allTasks);
        parDate.style.opacity = event.target.checked ? 0.5 : 1;
        parDesc.style.opacity = event.target.checked ? 0.5 : 1;
        parDesc.style.textDecoration = event.target.checked
            ? "line-through"
            : "none";
      }
    })
  })
})


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

  // console.log(newDate);
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



