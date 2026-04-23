const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = Array.from({ length: 10 }, (_, index) => String(index + 1));
const STORAGE_KEY = "letter-lab-progress-v1";
const VOICE_STORAGE_KEY = "letter-lab-voice-v1";
const QUANTITY_SHAPES = ["apple", "star", "leaf", "berry"];
const FEMALE_VOICE_HINTS = [
  "siri",
  "samantha",
  "ava",
  "allison",
  "joelle",
  "nicky",
  "karen",
  "susan",
  "victoria",
  "moira",
  "tessa",
  "zira",
  "hazel",
  "serena",
  "aria",
  "jenny",
  "female"
];
const MALE_VOICE_HINTS = [
  "siri",
  "aaron",
  "daniel",
  "alex",
  "oliver",
  "arthur",
  "liam",
  "david",
  "mark",
  "guy",
  "fred",
  "tom",
  "george",
  "male"
];
const state = {
  mode: "letters",
  target: "A",
  answer: "a",
  roundType: "letters",
  correct: 0,
  missed: 0,
  streak: 0,
  stars: 0,
  selectedNumberChoice: null
};
const ROUND_ADVANCE_FALLBACK_MS = 1400;
const WRONG_ANSWER_PAUSE_MS = 25;

const els = {
  scoreValue: document.querySelector("#scoreValue"),
  correctCount: document.querySelector("#correctCount"),
  missCount: document.querySelector("#missCount"),
  streakCount: document.querySelector("#streakCount"),
  targetSymbol: document.querySelector("#targetSymbol"),
  traceGuide: document.querySelector("#traceGuide"),
  feedback: document.querySelector("#feedback"),
  choices: document.querySelector("#choices"),
  confirmNumber: document.querySelector("#confirmNumber"),
  matchScreen: document.querySelector("#matchScreen"),
  traceScreen: document.querySelector("#traceScreen"),
  statsScreen: document.querySelector("#statsScreen"),
  speakButton: document.querySelector("#speakButton"),
  openTrace: document.querySelector("#openTrace"),
  closeTrace: document.querySelector("#closeTrace"),
  openStats: document.querySelector("#openStats"),
  closeStats: document.querySelector("#closeStats"),
  voiceSelect: document.querySelector("#voiceSelect"),
  clearCanvas: document.querySelector("#clearCanvas"),
  canvas: document.querySelector("#traceCanvas")
};

const ctx = els.canvas.getContext("2d");
let drawing = false;
let voices = [];

loadProgress();
bindControls();
setupVoices();
setupCanvas();
newRound();
updateStats();
registerServiceWorker();

function newRound() {
  state.roundType = state.mode === "mixed" ? sample(["letters", "numbers"]) : state.mode;
  state.selectedNumberChoice = null;
  const round = state.roundType === "numbers" ? numberRound() : letterRound();
  state.target = round.target;
  state.answer = round.answer;

  els.targetSymbol.textContent = state.target;
  els.traceGuide.textContent = state.target;
  els.traceGuide.dataset.length = String(state.target.length);
  els.feedback.textContent = round.instructions;
  els.feedback.className = "feedback";
  els.choices.replaceChildren(...round.choices.map(choiceButton));
  updateConfirmButton();
  clearDrawing();
}

function letterRound() {
  const upper = sample(LETTERS);
  const showUpper = Math.random() > 0.5;
  const target = showUpper ? upper : upper.toLowerCase();
  const answer = showUpper ? upper.toLowerCase() : upper;
  const pool = showUpper ? LETTERS.map((letter) => letter.toLowerCase()) : LETTERS;

  return {
    target,
    answer,
    instructions: showUpper ? "Tap the lowercase match." : "Tap the uppercase match.",
    choices: buildTextChoices(pool, answer, 4).map((symbol) => ({
      type: "letter",
      value: symbol,
      label: `Choose ${spokenLabel(symbol)}`
    }))
  };
}

function numberRound() {
  const target = sample(NUMBERS);
  const answer = Number(target);
  const shape = sample(QUANTITY_SHAPES);
  return {
    target,
    answer,
    instructions: "Tap the card with that many objects.",
    choices: buildTextChoices(NUMBERS, target, 4).map((symbol) => ({
      type: "quantity",
      value: Number(symbol),
      shape,
      label: `Choose ${symbol} ${shape}${symbol === "1" ? "" : "s"}`
    }))
  };
}

function buildTextChoices(pool, target, count) {
  const options = new Set([String(target)]);
  while (options.size < Math.min(count, pool.length)) {
    options.add(String(sample(pool)));
  }
  return shuffle([...options]);
}

function choiceButton(choice) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `choice ${choice.type === "quantity" ? "quantity-choice" : ""}`;
  button.setAttribute("aria-label", choice.label);

  if (choice.type === "quantity") {
    button.append(quantityDots(choice.value, choice.shape));
    button.addEventListener("click", () => selectNumberChoice(button, choice.value));
  } else {
    button.textContent = choice.value;
    button.addEventListener("click", () => checkAnswer(button, choice.value));
  }
  return button;
}

function clearIncorrectHighlights() {
  document.querySelectorAll(".choice.wrong").forEach((choice) => choice.classList.remove("wrong"));
}

function selectNumberChoice(button, value) {
  clearIncorrectHighlights();
  document.querySelectorAll(".quantity-choice").forEach((choice) => {
    choice.classList.toggle("is-selected", choice === button);
  });
  state.selectedNumberChoice = { button, value };
  els.feedback.textContent = "Now tap Confirm to choose this card.";
  els.feedback.className = "feedback";
  updateConfirmButton();
}

function quantityDots(count, shape) {
  const dots = document.createElement("span");
  dots.className = `dot-grid ${shape}`;
  dots.dataset.count = count;

  if (count === 0) {
    dots.textContent = "none";
    dots.classList.add("zero");
    return dots;
  }

  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.setAttribute("aria-hidden", "true");
    dots.append(dot);
  }

  return dots;
}

function checkAnswer(button, value) {
  clearIncorrectHighlights();
  const isCorrect = value === state.answer;
  button.classList.add(isCorrect ? "correct" : "wrong");
  state.selectedNumberChoice = null;
  updateConfirmButton();

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    state.stars += state.streak > 2 ? 2 : 1;
    els.feedback.textContent = praise();
    els.feedback.className = "feedback good";
    updateStats();
    saveProgress();
    speakTarget(newRound);
    return;
  }

  state.missed += 1;
  state.streak = 0;
  els.feedback.textContent = retryMessage();
  els.feedback.className = "feedback retry";
  updateStats();
  saveProgress();
  speakWrongAnswer(value);
}

function retryMessage() {
  if (state.roundType === "numbers") {
    return `Try again. Find ${state.target} objects.`;
  }

  return `Try again. Match ${state.target} to ${state.answer}.`;
}

function bindControls() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setActive("[data-mode]", button);
      state.mode = button.dataset.mode;
      newRound();
    });
  });

  els.speakButton.addEventListener("click", speakTarget);
  els.confirmNumber.addEventListener("click", confirmNumberChoice);
  els.openTrace.addEventListener("click", () => showScreen("trace"));
  els.closeTrace.addEventListener("click", () => showScreen("match"));
  els.openStats.addEventListener("click", () => showScreen("stats"));
  els.closeStats.addEventListener("click", () => showScreen("match"));
  els.voiceSelect.addEventListener("change", () => {
    localStorage.setItem(VOICE_STORAGE_KEY, els.voiceSelect.value);
    speakTarget();
  });
  els.clearCanvas.addEventListener("click", clearDrawing);
}

function confirmNumberChoice() {
  if (!state.selectedNumberChoice) {
    els.feedback.textContent = "Tap a card first, then Confirm.";
    els.feedback.className = "feedback retry";
    return;
  }

  checkAnswer(state.selectedNumberChoice.button, state.selectedNumberChoice.value);
}

function updateConfirmButton() {
  const isNumberRound = state.roundType === "numbers";
  els.confirmNumber.hidden = !isNumberRound;
  els.confirmNumber.disabled = isNumberRound && !state.selectedNumberChoice;
}

function showScreen(screen) {
  const showTrace = screen === "trace";
  const showStats = screen === "stats";
  els.matchScreen.hidden = showTrace || showStats;
  els.traceScreen.hidden = !showTrace;
  els.statsScreen.hidden = !showStats;
  els.matchScreen.classList.toggle("is-active", !showTrace && !showStats);
  els.traceScreen.classList.toggle("is-active", showTrace);
  els.statsScreen.classList.toggle("is-active", showStats);
  clearDrawing();
}

function setActive(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

function updateStats() {
  els.scoreValue.textContent = state.stars;
  els.correctCount.textContent = state.correct;
  els.missCount.textContent = state.missed;
  els.streakCount.textContent = state.streak;
}

function speakTarget(onDone) {
  if (!("speechSynthesis" in window)) {
    if (onDone) window.setTimeout(onDone, 650);
    return;
  }

  window.speechSynthesis.cancel();
  const prompt = state.roundType === "numbers" ? numberWord(state.target) : spokenLetter(state.target);
  const utterance = new SpeechSynthesisUtterance(prompt);
  const voice = selectedVoice(els.voiceSelect.value);
  if (voice) utterance.voice = voice;
  utterance.rate = 0.78;
  utterance.pitch = 1.08;
  if (onDone) {
    let advanced = false;
    const finish = () => {
      if (advanced) return;
      advanced = true;
      onDone();
    };
    utterance.addEventListener("end", finish);
    utterance.addEventListener("error", finish);
    window.setTimeout(finish, ROUND_ADVANCE_FALLBACK_MS);
  }
  window.speechSynthesis.speak(utterance);
}

function speakWrongAnswer(value) {
  speakText(spokenValue(value), () => {
    window.setTimeout(() => speakText("Try again."), WRONG_ANSWER_PAUSE_MS);
  });
}

function speakText(text, onDone) {
  if (!("speechSynthesis" in window)) {
    if (onDone) window.setTimeout(onDone, 650);
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = selectedVoice(els.voiceSelect.value);
  if (voice) utterance.voice = voice;
  utterance.rate = 0.78;
  utterance.pitch = 1.08;
  if (onDone) {
    let advanced = false;
    const finish = () => {
      if (advanced) return;
      advanced = true;
      onDone();
    };
    utterance.addEventListener("end", finish);
    utterance.addEventListener("error", finish);
    window.setTimeout(finish, ROUND_ADVANCE_FALLBACK_MS);
  }
  window.speechSynthesis.speak(utterance);
}

function spokenValue(value) {
  return typeof value === "number" ? numberWord(String(value)) : spokenLetter(value);
}

function spokenLetter(value) {
  return String(value).toLowerCase();
}

function setupVoices() {
  if (!("speechSynthesis" in window)) {
    els.voiceSelect.disabled = true;
    return;
  }

  els.voiceSelect.value = localStorage.getItem(VOICE_STORAGE_KEY) || "female";
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

function loadVoices() {
  voices = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .sort((a, b) => voiceScore(b, FEMALE_VOICE_HINTS) - voiceScore(a, FEMALE_VOICE_HINTS));

  els.voiceSelect.disabled = voices.length === 0;
}

function selectedVoice(type) {
  if (!voices.length) return null;
  const hints = type === "male" ? MALE_VOICE_HINTS : FEMALE_VOICE_HINTS;
  return [...voices].sort((a, b) => voiceScore(b, hints) - voiceScore(a, hints))[0];
}

function voiceScore(voice, hints) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const lang = voice.lang.toLowerCase();
  const preferredLocale = lang === "en-us" ? 5 : lang.startsWith("en-") ? 2 : 0;
  const localBonus = voice.localService ? 2 : 0;
  const appleBonus = /(apple|siri|com\.apple)/.test(name) ? 10 : 0;
  const enhancedBonus = /(premium|enhanced|neural)/.test(name) ? 4 : 0;
  const hintBonus = hints.reduce((score, hint, index) => {
    return name.includes(hint) ? score + 20 - index : score;
  }, 0);
  return preferredLocale + localBonus + appleBonus + enhancedBonus + hintBonus;
}

function numberWord(symbol) {
  const words = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty"
  ];
  return words[Number(symbol)];
}

function spokenLabel(symbol) {
  return /\d/.test(symbol) ? `number ${symbol}` : `letter ${symbol}`;
}

function praise() {
  return sample(["Correct!", "You found it!", "Nice match!", "Great looking!"]);
}

function setupCanvas() {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#17212b";
  ctx.lineWidth = 18;

  els.canvas.addEventListener("pointerdown", startDrawing);
  els.canvas.addEventListener("pointermove", draw);
  els.canvas.addEventListener("pointerup", stopDrawing);
  els.canvas.addEventListener("pointercancel", stopDrawing);
  window.addEventListener("resize", clearDrawing);
}

function startDrawing(event) {
  drawing = true;
  els.canvas.setPointerCapture(event.pointerId);
  const point = canvasPoint(event);
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
}

function draw(event) {
  if (!drawing) return;
  const point = canvasPoint(event);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
  ctx.closePath();
}

function canvasPoint(event) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * els.canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * els.canvas.height
  };
}

function clearDrawing() {
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
}

function saveProgress() {
  const payload = {
    date: new Date().toDateString(),
    correct: state.correct,
    missed: state.missed,
    streak: state.streak,
    stars: state.stars
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.date !== new Date().toDateString()) return;
    state.correct = saved.correct || 0;
    state.missed = saved.missed || 0;
    state.streak = saved.streak || 0;
    state.stars = saved.stars || 0;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}
