let day = 0;
let hour = 0;
let minute = 0;
let second = 0;
let endTime = new Date("Jul 31, 2024 12:00:00"); //current time + 30 dni
if (localStorage.getItem("end-time-value")) {
  endTime = new Date(localStorage.getItem("end-time-value"));
}

const timeInput = document.getElementById("time-input");
document.getElementById("time-input").min = new Date()
  .toISOString()
  .slice(0, 16);
document.getElementById("time-input").value = new Date()
  .toISOString()
  .slice(0, 16);

setInterval(() => {
  const time = new Date();
  const remaining = endTime - time;
  day = Math.floor(remaining / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, "0");
  hour = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  minute = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  second = Math.floor((remaining % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");

  document.getElementById("days-top").innerHTML = day;
  document.getElementById("hours-top").innerHTML = hour;
  document.getElementById("minutes-top").innerHTML = minute;
  document.getElementById("seconds-top").innerHTML = second;
  flipCard("days", day);
  flipCard("hours", hour);
  flipCard("minutes", minute);
  flipCard("seconds", second);
}, 1000);

setTimeout(() => {
  setInterval(() => {
    document.getElementById("days-bottom").innerHTML = day;
    document.getElementById("hours-bottom").innerHTML = hour;
    document.getElementById("minutes-bottom").innerHTML = minute;
    document.getElementById("seconds-bottom").innerHTML = second;
  }, 1000);
}, 800);

setTimeout(() => {
  setInterval(() => {
    document.getElementById("days-flip-top").innerHTML = day;
    document.getElementById("days-flip-bottom").innerHTML = day;
    document.getElementById("hours-flip-top").innerHTML = hour;
    document.getElementById("hours-flip-bottom").innerHTML = hour;
    document.getElementById("minutes-flip-top").innerHTML = minute;
    document.getElementById("minutes-flip-bottom").innerHTML = minute;
    document.getElementById("seconds-flip-top").innerHTML = second;
    document.getElementById("seconds-flip-bottom").innerHTML = second;
  }, 1000);
}, 450);

function flipCard(name, value) {
  if (value != document.getElementById(name + "-flip-top").innerText) {
    const elementFlipTop = document.getElementById(name + "-flip-top");
    const elementFlipBottom = document.getElementById(name + "-flip-bottom");
    elementFlipTop.classList.add("flip-card-animate");
    elementFlipBottom.classList.add("flip-card-animate");

    function finishFlip() {
      elementFlipTop.classList.remove("flip-card-animate");
      elementFlipBottom.classList.remove("flip-card-animate");
      this.removeEventListener("animationend", finishFlip);
    }

    elementFlipTop.addEventListener("animationend", finishFlip);
  }
}

const editButton = document.getElementById("edit-button");
editButton.addEventListener("click", () => {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("overlay").classList.remove("hidden");
});

const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", () => {
  const timeInputValue = document.getElementById("time-input").value;
  localStorage.setItem("end-time-value", timeInputValue);
  endTime = new Date(timeInputValue);
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
});
