let day = 0;
let hour = 0;
let minute = 0;
let second = 0;
let endTime = new Date("Jul 31, 2024 12:00:00"); //current time + 30 dni
const timeInput = document.getElementById("deadline-input");
document.getElementById("deadline-input").min = new Date()
  .toISOString()
  .slice(0, 16);
document.getElementById("deadline-input").value = new Date()
  .toISOString()
  .slice(0, 16);

if (localStorage.getItem("end-time-value")) {
  endTime = new Date(localStorage.getItem("end-time-value"));
  document.getElementById("deadline-input").value =
    localStorage.getItem("end-time-value");
}
if (localStorage.getItem("text-value")) {
  document.getElementById("heading-primary").innerText =
    localStorage.getItem("text-value");
  document
    .getElementById("heading-text-input")
    .setAttribute("value", localStorage.getItem("text-value"));
}

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

  if (remaining < 0) {
    document.getElementById("deadline-fireworks-container").style.display =
      "block";
    day = "ko";
    hour = "ni";
    minute = "ec";
    second = "😄";
  } else {
    document.getElementById("deadline-fireworks-container").style.display =
      "none";
    document.querySelector(".card-top.days").innerHTML = day;
    document.querySelector(".card-top.hours").innerHTML = hour;
    document.querySelector(".card-top.minutes").innerHTML = minute;
    document.querySelector(".card-top.seconds").innerHTML = second;
    flipCard("days", day);
    flipCard("hours", hour);
    flipCard("minutes", minute);
    flipCard("seconds", second);
  }
}, 1000);

setTimeout(() => {
  setInterval(() => {
    document.querySelector(".card-bottom.days").innerHTML = day;
    document.querySelector(".card-bottom.hours").innerHTML = hour;
    document.querySelector(".card-bottom.minutes").innerHTML = minute;
    document.querySelector(".card-bottom.seconds").innerHTML = second;
  }, 1000);
}, 800);

setTimeout(() => {
  setInterval(() => {
    document.querySelector(".flip-card-top.days").innerHTML = day;
    document.querySelector(".flip-card-bottom.days").innerHTML = day;
    document.querySelector(".flip-card-top.hours").innerHTML = hour;
    document.querySelector(".flip-card-bottom.hours").innerHTML = hour;
    document.querySelector(".flip-card-top.minutes").innerHTML = minute;
    document.querySelector(".flip-card-bottom.minutes").innerHTML = minute;
    document.querySelector(".flip-card-top.seconds").innerHTML = second;
    document.querySelector(".flip-card-bottom.seconds").innerHTML = second;
  }, 1000);
}, 450);

function flipCard(name, value) {
  if (value != document.querySelector(".flip-card-top." + name).innerText) {
    const elementFlipTop = document.querySelector(".flip-card-top." + name);
    const elementFlipBottom = document.querySelector(
      ".flip-card-bottom." + name,
    );
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
  document.getElementById("edit-modal").classList.remove("hidden");
  document.getElementById("overlay").classList.remove("hidden");
});

const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", () => {
  const timeInputValue = document.getElementById("deadline-input").value;
  localStorage.setItem("end-time-value", timeInputValue);
  endTime = new Date(timeInputValue);

  const textInputValue = document.getElementById("heading-text-input").value;
  localStorage.setItem("text-value", textInputValue);
  document.getElementById("heading-primary").innerText = textInputValue;

  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
});
