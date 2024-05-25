console.log("Utils module init");

export const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const newRegDate = /^\d{2}\.\d{2}\.\d{4}( \d{2}:\d{2})?$/;
export const currentDate = new Date();
export const dayOfWeek = currentDate.getDay();
export const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
export const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
// ================ УТИЛИТАРНЫЕ ФУНКЦИИ [НАЧАЛО] ====================
export function checkPars(parDate, parDesc, isChecked) {
  parDate.style.opacity = isChecked ? 0.5 : 1;
  parDesc.style.opacity = isChecked ? 0.5 : 1;
  parDesc.style.textDecoration = isChecked ? "line-through" : "none";
}

export function updateTaskCard(obj, tasksObjList, checked) {
  obj.isComplete = checked;
  localStorage.setItem("allTasks", JSON.stringify(tasksObjList));
}

/**
 * Функция возвращает родительский элемент по типу и объекту
 * @param type - тип элемента, где: 'date' - дата, 'desc' - описание
 * @param obj - объект, для которого нужно найти родителя
 * @returns {Element} - родительский элемент
 */
export function getPar(type, obj) {
  if (type === "date") {
    return obj.parentNode.children[1].children[0];
  } else if (type === "desc") {
    return obj.parentNode.children[1].children[1];
  }
}


export function createImgHidden(iconType, iconSrc) {
  const icon = document.createElement("img");
  icon.setAttribute("class", iconType + " hidden");
  icon.setAttribute("src", iconSrc);
  return icon;
}

// ================ УТИЛИТАРНЫЕ ФУНКЦИИ [КОНЕЦ] ====================
