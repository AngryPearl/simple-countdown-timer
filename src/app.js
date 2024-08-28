// init time
let timeLeft = {
  day: 0,
  hour: 0,
  minute: 0,
  second: 0,
  deadline: getDeadline(),
};

function getDeadline() {
  let deafaultDate = new Date();
  deafaultDate.setDate(deafaultDate.getDate() + 10);

  return deafaultDate || localStorage.getItem("deadline-value");
}
// custom deadline
const timeInput = document.getElementById("deadline-input");

// deadline current date or later
document.getElementById("deadline-input").min = new Date()
  .toISOString()
  .slice(0, 16);

// deadline set default as current date
document.getElementById("deadline-input").value = new Date()
  .toISOString()
  .slice(0, 16);

function getDataFromLocalStorge() {
  // deadline from cookies
  if (localStorage.getItem("deadline-value")) {
    document.getElementById("deadline-input").value =
      localStorage.getItem("deadline-value");
  }

  // header from cookies
  if (localStorage.getItem("text-value")) {
    document.getElementById("heading-primary").innerText =
      localStorage.getItem("text-value");
  }
}
getDataFromLocalStorge();

// updating countdown values
function updateCardValues(timeRemaining) {
  setInterval(() => {
    const currentTime = new Date();
    const remaining = timeLeft.deadline - currentTime;
    timeLeft.day = Math.floor(remaining / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, "0");
    timeLeft.hour = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
      .toString()
      .padStart(2, "0");
    timeLeft.minute = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, "0");
    timeLeft.second = Math.floor((remaining % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0");

    // check if countdown is ended
    if (remaining < 0) {
      document.getElementById("deadline-fireworks-container").style.display =
        "block";
      timeLeft.day = "fi";
      timeLeft.hour = "ni";
      timeLeft.minute = "sh";
      timeLeft.second = "🎉";
    } else {
      // update top cards and flip
      document.getElementById("deadline-fireworks-container").style.display =
        "none";
      document.querySelector(".card-top.days").innerHTML = timeLeft.day;
      document.querySelector(".card-top.hours").innerHTML = timeLeft.hour;
      document.querySelector(".card-top.minutes").innerHTML = timeLeft.minute;
      document.querySelector(".card-top.seconds").innerHTML = timeLeft.second;
      flipCard("days", timeLeft.day);
      flipCard("hours", timeLeft.hour);
      flipCard("minutes", timeLeft.minute);
      flipCard("seconds", timeLeft.second);
    }
  }, 1000);

  // update bottom cards
  setTimeout(() => {
    setInterval(() => {
      document.querySelector(".card-bottom.days").innerHTML = timeLeft.day;
      document.querySelector(".card-bottom.hours").innerHTML = timeLeft.hour;
      document.querySelector(".card-bottom.minutes").innerHTML =
        timeLeft.minute;
      document.querySelector(".card-bottom.seconds").innerHTML =
        timeLeft.second;
    }, 1000);
  }, 800);

  // update both flip cards
  setTimeout(() => {
    setInterval(() => {
      document.querySelector(".flip-card-top.days").innerHTML = timeLeft.day;
      document.querySelector(".flip-card-bottom.days").innerHTML = timeLeft.day;
      document.querySelector(".flip-card-top.hours").innerHTML = timeLeft.hour;
      document.querySelector(".flip-card-bottom.hours").innerHTML =
        timeLeft.hour;
      document.querySelector(".flip-card-top.minutes").innerHTML =
        timeLeft.minute;
      document.querySelector(".flip-card-bottom.minutes").innerHTML =
        timeLeft.minute;
      document.querySelector(".flip-card-top.seconds").innerHTML =
        timeLeft.second;
      document.querySelector(".flip-card-bottom.seconds").innerHTML =
        timeLeft.second;
    }, 1000);
  }, 450);
}

updateCardValues(1);

// if given value if different than html value, execute flip animation once
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
      // this reffers to element that event listener is called (elementFlipTop)
      this.removeEventListener("animationend", finishFlip);
    }

    elementFlipTop.addEventListener("animationend", finishFlip);
  }
}

function initModal() {
  // show edit modal on click
  const editButton = document.getElementById("edit-button");
  editButton.addEventListener("click", () => {
    document.getElementById("edit-modal").classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
  });

  // update values and cookies on click save button
  const saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", () => {
    const timeInputValue = document.getElementById("deadline-input").value;
    localStorage.setItem("deadline-value", timeInputValue);
    timeLeft.deadline = new Date(timeInputValue);

    const textInputValue = document.getElementById("heading-text-input").value;
    localStorage.setItem("text-value", textInputValue);
    document.getElementById("heading-primary").innerText = textInputValue;

    document.getElementById("edit-modal").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
  });
}

initModal();
