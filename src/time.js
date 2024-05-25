// ================ ВЫВОД ТЕКУЩЕГО ВРЕМЕНИ В РЕАЛТАЙМЕ [НАЧАЛО] ====================
import { currentDate, days, months, dayOfWeek } from "./utils.js";
import { day, month } from "../scripts/index.js";

console.log("Time module init");
function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
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
