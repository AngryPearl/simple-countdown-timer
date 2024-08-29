class CountdownTimer {
  constructor(deadline = null) {
    this.deadline = deadline ? new Date(deadline) : this.getDefaultDeadline();
  }

  getDefaultDeadline() {
    let defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 10);
    return defaultDate;
  }

  setDeadline(newDeadline) {
    this.deadline = new Date(newDeadline);
  }

  getTimeRemaining() {
    const currentTime = new Date();
    const remaining = this.deadline - currentTime;

    return {
      days: Math.floor(remaining / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, "0"),
      hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0"),
      minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0"),
      seconds: Math.floor((remaining % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0"),
      isTimeUp: remaining < 0,
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
        this.updateFlipCards("days", "fi");
        this.updateFlipCards("hours", "ni");
        this.updateFlipCards("minutes", "sh");
        this.updateFlipCards("seconds", "🎉");
        this.stopInterval();

        this.confettiContainer.style.display = "block";
      } else {
        this.updateCard("days", timeLeft.days);
        this.updateCard("hours", timeLeft.hours);
        this.updateCard("minutes", timeLeft.minutes);
        this.updateCard("seconds", timeLeft.seconds);

        this.confettiContainer.style.display = "none"; //move to modal
        setTimeout(() => {
          this.updateFlipCards("days", timeLeft.days);
          this.updateFlipCards("hours", timeLeft.hours);
          this.updateFlipCards("minutes", timeLeft.minutes);
          this.updateFlipCards("seconds", timeLeft.seconds);
        }, 400);

        setTimeout(() => {
          this.updateCardBottom("days", timeLeft.days);
          this.updateCardBottom("hours", timeLeft.hours);
          this.updateCardBottom("minutes", timeLeft.minutes);
          this.updateCardBottom("seconds", timeLeft.seconds);
        }, 800);
      }
    }, 1000);
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

    if (topElement.innerText !== value) {
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
      this.saveChanges();
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

  saveChanges() {
    const timeInputValue = document.getElementById("deadline-input").value;
    localStorage.setItem("deadline-value", timeInputValue);
    this.timer.setDeadline(timeInputValue);

    const textInputValue = document.getElementById("heading-text-input").value;
    localStorage.setItem("text-value", textInputValue);
    document.getElementById("heading-primary").innerText = textInputValue;
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

startCountdown();
