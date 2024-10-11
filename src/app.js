class CountdownTimer {
  constructor(deadline = null) {
    this.deadline = deadline ? new Date(deadline) : this.getDefaultDeadline();
  }

  getDefaultDeadline() {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 10);
    return defaultDate;
  }

  setDeadline(newDeadline) {
    this.deadline = new Date(newDeadline);
  }

  saveChanges() {
    const timeInputValue = document.getElementById("deadline-input").value;
    localStorage.setItem("deadline-value", timeInputValue);
    this.setDeadline(timeInputValue);

    const textInputValue = document.getElementById("heading-text-input").value;
    localStorage.setItem("text-value", textInputValue);
    document.getElementById("heading-primary").innerText = textInputValue;
  }

  getTimeRemaining() {
    const currentTime = new Date();
    const remaining = this.deadline - currentTime;
    const isTimeUp = remaining < 0;

    return {
      days: isTimeUp ? "fi" : Math.floor(remaining / 86400000), // 1000ms * 60s * 60s * 24s
      hours: isTimeUp ? "ni" : Math.floor((remaining % 86400000) / 3600000), // 1000ms * 60s * 60s
      minutes: isTimeUp ? "sh" : Math.floor((remaining % 3600000) / 60000), // 1000ms * 60s
      seconds: isTimeUp ? "🎉" : Math.floor((remaining % 60000) / 1000), // 1000ms
      isTimeUp,
    };
  }
}

class CountdownUIUpdater {
  constructor(
    daysCard,
    hoursCard,
    minutesCard,
    secondsCard,
    confettiContainer,
  ) {
    Object.assign(this, {
      daysCard,
      hoursCard,
      minutesCard,
      secondsCard,
      confettiContainer,
    });
    this.timerIntervalId = null;
  }

  startUpdating(timer) {
    this.timerIntervalId = setInterval(() => {
      const timeLeft = timer.getTimeRemaining();

      if (timeLeft.isTimeUp) {
        // flip cards are on the top
        this.updateAllUnits(timeLeft, this.updateFlipCards.bind(this)); // 'this' context is lost outside of func

        this.stopInterval();
        this.confettiContainer.style.display = "block";
      } else {
        this.updateAllUnits(timeLeft, this.updateCard.bind(this));
        this.confettiContainer.style.display = "none";

        setTimeout(() => {
          this.updateAllUnits(timeLeft, this.updateFlipCards.bind(this));
        }, 400);

        setTimeout(() => {
          this.updateAllUnits(timeLeft, this.updateCardBottom.bind(this));
        }, 800);
      }
    }, 1000);
  }

  updateAllUnits(timeLeft, updater) {
    ["days", "hours", "minutes", "seconds"].forEach((unit) => {
      updater(unit, timeLeft[unit]);
    });
  }

  stopInterval() {
    clearInterval(this.timerIntervalId);
  }

  updateFlipCards(unit, value) {
    const flipElementTop = this[`${unit}Card`].querySelector(
      `.flip-card-top.${unit}`,
    );
    const flipCardBottom = this[`${unit}Card`].querySelector(
      `.flip-card-bottom.${unit}`,
    );
    if (flipElementTop.innerText !== value) {
      flipElementTop.innerText = value;
      flipCardBottom.innerText = value;
    }
  }

  updateCardBottom(unit, value) {
    const bottomElement = this[`${unit}Card`].querySelector(".card-bottom");
    if (bottomElement.innerText !== value) {
      bottomElement.innerText = value;
    }
  }

  updateCard(unit, value) {
    const topElement = this[`${unit}Card`].querySelector(".card-top");

    if (topElement.innerText != value) {
      topElement.innerText = value;
      this.flipCard(unit, value);
    }
  }

  flipCard(unit, newValue) {
    const flipCardTop = this[`${unit}Card`].querySelector(
      `.flip-card-top.${unit}`,
    );
    const flipCardBottom = this[`${unit}Card`].querySelector(
      `.flip-card-bottom.${unit}`,
    );
    if (flipCardTop.innerText !== newValue) {
      flipCardTop.classList.add("flip-card-animate");
      flipCardBottom.classList.add("flip-card-animate");
      const finishFlip = () => {
        flipCardTop.classList.remove("flip-card-animate");
        flipCardBottom.classList.remove("flip-card-animate");
        flipCardTop.removeEventListener("animationend", finishFlip);
      };
      flipCardTop.addEventListener("animationend", finishFlip);
    }
  }
}

class ModalManager {
  constructor(
    editButton,
    saveButton,
    modalElement,
    overlayElement,
    timer,
    uiUpdater,
  ) {
    Object.assign(this, {
      editButton,
      saveButton,
      modalElement,
      overlayElement,
      timer,
      uiUpdater,
    });

    this.initModal();
  }

  initModal() {
    const formattedDateTime = new Date().toISOString().slice(0, 16);
    const datetimeInput = document.getElementById("deadline-input");
    datetimeInput.value = formattedDateTime;
    datetimeInput.min = formattedDateTime;

    this.editButton.addEventListener("click", () => {
      this.showModal();
    });
    this.saveButton.addEventListener("click", () => {
      this.timer.saveChanges();
      this.uiUpdater.stopInterval();
      this.uiUpdater.startUpdating(this.timer);
      this.hideModal();
    });
  }

  showModal() {
    this.modalElement.classList.remove("hidden");
    this.overlayElement.classList.remove("hidden");
  }

  hideModal() {
    this.modalElement.classList.add("hidden");
    this.overlayElement.classList.add("hidden");
  }
}

function loadFromLocalStorage(timer) {
  if (localStorage.getItem("deadline-value")) {
    timer.setDeadline(localStorage.getItem("deadline-value"));
    timer.setDeadline(localStorage.getItem("deadline-value"));
  }

  if (localStorage.getItem("text-value")) {
    document.getElementById("heading-primary").innerText =
      localStorage.getItem("text-value");
  }
}

function startCountdown() {
  const timer = new CountdownTimer();
  loadFromLocalStorage(timer);

  const uiUpdater = new CountdownUIUpdater(
    document.querySelector(".timer-card.days"),
    document.querySelector(".timer-card.hours"),
    document.querySelector(".timer-card.minutes"),
    document.querySelector(".timer-card.seconds"),
    document.getElementById("deadline-confetti-container"),
  );

  const editButton = document.getElementById("edit-button");
  const saveButton = document.getElementById("save-button");
  const modalElement = document.getElementById("edit-modal");
  const overlayElement = document.getElementById("overlay");

  new ModalManager(
    editButton,
    saveButton,
    modalElement,
    overlayElement,
    timer,
    uiUpdater,
  );

  uiUpdater.startUpdating(timer);
}

export {
  CountdownTimer,
  ModalManager,
  CountdownUIUpdater,
  loadFromLocalStorage,
  startCountdown,
};
