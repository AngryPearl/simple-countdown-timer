import "jest-localstorage-mock";
import {
  CountdownTimer,
  CountdownUIUpdater,
  ModalManager,
} from "../../src/app.js";

// Mocking DOM-related elements for testing
const setupDOM = () => {
  document.body.innerHTML = `
    <div id="edit-button"></div>
    <div id="save-button"></div>
    <div id="edit-modal" class="hidden"></div>
    <div id="overlay" class="hidden"></div>
    <div id="heading-primary"></div>
    <input id="deadline-input" type="datetime-local" value="">
    <input id="heading-text-input" type="text" value="We're launching soon">
    <div class="timer-card days"></div>
    <div class="timer-card hours"></div>
    <div class="timer-card minutes"></div>
    <div class="timer-card seconds"></div>
    <div id="deadline-confetti-container" style="display:none;"></div>
  `;
};

describe("CountdownTimer", () => {
  let timer;

  beforeEach(() => {
    setupDOM();
    timer = new CountdownTimer();
  });

  test("Initialize with default deadline", () => {
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 10);

    expect(timer.deadline.toISOString()).toBe(defaultDeadline.toISOString());
  });

  test("Return correct time remaining", () => {
    timer.setDeadline(new Date(Date.now() + 6444 * 122000)); // 9 days, 2 hours, 22 minutes, 48 seconds
    const timeRemaining = timer.getTimeRemaining();

    expect(timeRemaining.days).toBe(9);
    expect(timeRemaining.hours).toBe(2);
    expect(timeRemaining.minutes).toBe(22);
    expect(timeRemaining.seconds).toBeGreaterThanOrEqual(47); // time variation during test execution
    expect(timeRemaining.isTimeUp).toBe(false);
  });

  test("Save changes to local storage", () => {
    const deadlineInput = document.getElementById("deadline-input");
    const textInput = document.getElementById("heading-text-input");
    const currentYear = new Date().getFullYear();

    deadlineInput.value = `${currentYear}-12-31T23:59`;
    textInput.value = "New Year's Eve";

    timer.saveChanges();

    expect(localStorage.getItem("deadline-value")).toBe(
      `${currentYear}-12-31T23:59`,
    );
    expect(localStorage.getItem("text-value")).toBe("New Year's Eve");
  });

  test("Return deadline correctly set by modal", () => {
    const currentYear = new Date().getFullYear();
    const newDeadline = `${currentYear}-12-30T13:37`;

    timer.setDeadline(newDeadline);

    expect(timer.deadline.toISOString()).toBe(
      new Date(newDeadline).toISOString(),
    );
  });
});

describe("ModalManager", () => {
  let modalManager, editButton;

  beforeEach(() => {
    setupDOM();
    editButton = document.getElementById("edit-button");
    const modalElement = document.getElementById("edit-modal");
    const overlayElement = document.getElementById("overlay");
    const uiUpdater = new CountdownUIUpdater(
      document.querySelector(".timer-card.days"),
      document.querySelector(".timer-card.hours"),
      document.querySelector(".timer-card.minutes"),
      document.querySelector(".timer-card.seconds"),
      document.getElementById("deadline-confetti-container"),
    );

    modalManager = new ModalManager(
      editButton,
      document.getElementById("save-button"),
      modalElement,
      overlayElement,
      new CountdownTimer(),
      uiUpdater,
    );
  });

  test("show modal on edit button click", () => {
    const modalElement = document.getElementById("edit-modal");
    const overlayElement = document.getElementById("overlay");

    editButton.click();

    expect(modalElement.classList.contains("hidden")).toBe(false);
    expect(overlayElement.classList.contains("hidden")).toBe(false);
  });
});
