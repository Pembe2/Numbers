const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = Array.from({ length: 10 }, (_, index) => String(index + 1));
const STORAGE_KEY = "letter-lab-progress-v1";
const VOICE_STORAGE_KEY = "letter-lab-voice-v1";
const GUIDE_STORAGE_KEY = "letter-lab-guide-v1";
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
const STROKE_GUIDES = {
  A: [[[30, 88], [50, 12], [70, 88]], [[39, 55], [61, 55]]],
  B: [[[33, 12], [33, 88]], [[33, 12], [66, 20], [62, 48], [33, 48]], [[33, 48], [68, 58], [62, 88], [33, 88]]],
  C: [[[72, 22], [55, 12], [30, 28], [24, 55], [34, 80], [68, 82]]],
  D: [[[32, 12], [32, 88]], [[32, 12], [70, 26], [72, 72], [32, 88]]],
  E: [[[68, 14], [32, 14], [32, 88], [70, 88]], [[32, 50], [62, 50]]],
  F: [[[32, 88], [32, 14], [70, 14]], [[32, 50], [62, 50]]],
  G: [[[72, 24], [55, 12], [29, 28], [24, 56], [36, 82], [70, 78], [70, 58], [52, 58]]],
  H: [[[30, 12], [30, 88]], [[70, 12], [70, 88]], [[30, 50], [70, 50]]],
  I: [[[50, 14], [50, 86]], [[34, 14], [66, 14]], [[34, 86], [66, 86]]],
  J: [[[70, 14], [70, 68], [58, 86], [36, 80]]],
  K: [[[30, 12], [30, 88]], [[70, 14], [30, 52], [72, 88]]],
  L: [[[32, 12], [32, 88], [70, 88]]],
  M: [[[24, 88], [24, 14], [50, 58], [76, 14], [76, 88]]],
  N: [[[28, 88], [28, 14], [72, 88], [72, 14]]],
  O: [[[50, 12], [72, 24], [78, 52], [66, 82], [36, 86], [22, 58], [30, 24], [50, 12]]],
  P: [[[32, 88], [32, 14]], [[32, 14], [68, 22], [62, 52], [32, 52]]],
  Q: [[[50, 12], [72, 24], [78, 52], [66, 82], [36, 86], [22, 58], [30, 24], [50, 12]], [[58, 70], [76, 90]]],
  R: [[[32, 88], [32, 14]], [[32, 14], [68, 22], [62, 52], [32, 52]], [[44, 52], [72, 88]]],
  S: [[[70, 20], [42, 12], [25, 32], [45, 50], [70, 62], [58, 86], [28, 78]]],
  T: [[[28, 14], [72, 14]], [[50, 14], [50, 88]]],
  U: [[[28, 14], [28, 68], [42, 88], [58, 88], [72, 68], [72, 14]]],
  V: [[[26, 14], [50, 88], [74, 14]]],
  W: [[[20, 14], [34, 88], [50, 48], [66, 88], [80, 14]]],
  X: [[[28, 14], [72, 88]], [[72, 14], [28, 88]]],
  Y: [[[26, 14], [50, 50], [74, 14]], [[50, 50], [50, 88]]],
  Z: [[[28, 14], [72, 14], [28, 88], [74, 88]]],
  a: [[[66, 48], [52, 38], [32, 48], [30, 72], [48, 84], [66, 68], [66, 42], [66, 84]]],
  b: [[[34, 14], [34, 84]], [[34, 50], [54, 38], [72, 54], [66, 80], [42, 82], [34, 68]]],
  c: [[[68, 48], [52, 36], [30, 48], [28, 70], [48, 84], [70, 74]]],
  d: [[[66, 14], [66, 84]], [[66, 52], [48, 38], [30, 52], [34, 78], [58, 82], [66, 66]]],
  e: [[[70, 52], [52, 38], [30, 52], [70, 58], [58, 82], [32, 76]]],
  f: [[[62, 16], [46, 16], [42, 40], [42, 86]], [[30, 42], [62, 42]]],
  g: [[[66, 48], [50, 38], [30, 52], [34, 78], [58, 82], [66, 66], [66, 92], [42, 96]]],
  h: [[[34, 14], [34, 84]], [[34, 52], [52, 38], [68, 52], [68, 84]]],
  i: [[[50, 42], [50, 84]], [[50, 24], [50, 24]]],
  j: [[[58, 42], [58, 88], [42, 98], [30, 88]], [[58, 24], [58, 24]]],
  k: [[[34, 14], [34, 84]], [[66, 42], [34, 62], [68, 84]]],
  l: [[[50, 14], [50, 84]]],
  m: [[[24, 84], [24, 42], [40, 38], [50, 54], [50, 84]], [[50, 54], [66, 38], [78, 54], [78, 84]]],
  n: [[[30, 84], [30, 42], [50, 38], [68, 54], [68, 84]]],
  o: [[[50, 38], [70, 52], [64, 78], [40, 84], [28, 62], [36, 44], [50, 38]]],
  p: [[[34, 98], [34, 42]], [[34, 50], [54, 38], [72, 54], [66, 80], [42, 82], [34, 68]]],
  q: [[[66, 50], [48, 38], [30, 52], [34, 78], [58, 82], [66, 66]], [[66, 42], [66, 98]]],
  r: [[[34, 84], [34, 42], [52, 38], [66, 46]]],
  s: [[[66, 44], [42, 38], [30, 54], [58, 64], [66, 80], [36, 82]]],
  t: [[[50, 20], [50, 78], [64, 84]], [[36, 42], [66, 42]]],
  u: [[[30, 42], [30, 70], [44, 84], [64, 78], [64, 42], [64, 84]]],
  v: [[[28, 42], [50, 84], [72, 42]]],
  w: [[[20, 42], [34, 84], [50, 58], [66, 84], [80, 42]]],
  x: [[[30, 42], [70, 84]], [[70, 42], [30, 84]]],
  y: [[[28, 42], [50, 82], [72, 42]], [[50, 82], [40, 98], [26, 94]]],
  z: [[[30, 42], [70, 42], [30, 84], [72, 84]]],
  0: [[[50, 12], [72, 26], [76, 56], [62, 86], [38, 86], [24, 56], [28, 26], [50, 12]]],
  1: [[[48, 24], [60, 14], [60, 88]], [[44, 88], [74, 88]]],
  2: [[[30, 30], [48, 14], [72, 28], [66, 50], [30, 88], [74, 88]]],
  3: [[[32, 20], [70, 20], [52, 50], [70, 50], [64, 84], [30, 76]]],
  4: [[[70, 88], [70, 14], [28, 62], [78, 62]]],
  5: [[[72, 16], [34, 16], [30, 48], [62, 48], [74, 70], [58, 88], [28, 78]]],
  6: [[[68, 18], [42, 18], [26, 48], [32, 82], [62, 86], [76, 62], [54, 48], [30, 54]]],
  7: [[[28, 16], [76, 16], [44, 88]]],
  8: [[[50, 12], [70, 28], [50, 50], [30, 28], [50, 12]], [[50, 50], [76, 68], [58, 88], [30, 76], [50, 50]]],
  9: [[[72, 48], [50, 86], [28, 70], [34, 34], [62, 18], [76, 42], [72, 88]]]
};

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
  strokeGuide: document.querySelector("#strokeGuide"),
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
  toggleGuide: document.querySelector("#toggleGuide"),
  voiceSelect: document.querySelector("#voiceSelect"),
  clearCanvas: document.querySelector("#clearCanvas"),
  canvas: document.querySelector("#traceCanvas")
};

const ctx = els.canvas.getContext("2d");
let drawing = false;
let voices = [];
let showGuide = localStorage.getItem(GUIDE_STORAGE_KEY) !== "hidden";

loadProgress();
bindControls();
setupVoices();
  setupCanvas();
updateGuideVisibility();
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
  renderStrokeGuide(state.target);
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
  els.toggleGuide.addEventListener("click", toggleStrokeGuide);
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

function toggleStrokeGuide() {
  showGuide = !showGuide;
  localStorage.setItem(GUIDE_STORAGE_KEY, showGuide ? "shown" : "hidden");
  updateGuideVisibility();
}

function updateGuideVisibility() {
  els.strokeGuide.classList.toggle("is-hidden", !showGuide);
  els.strokeGuide.style.display = showGuide ? "" : "none";
  els.toggleGuide.setAttribute("aria-pressed", String(showGuide));
  els.toggleGuide.textContent = showGuide ? "Hide guide" : "Show guide";
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

function renderStrokeGuide(symbol) {
  els.strokeGuide.replaceChildren();

  const characters = String(symbol).split("");
  const width = 100;
  const digitWidth = width / characters.length;
  const marker = svgElement("marker", {
    id: "arrowHead",
    viewBox: "0 0 10 10",
    refX: "9",
    refY: "5",
    markerWidth: "5",
    markerHeight: "5",
    orient: "auto-start-reverse"
  });
  marker.append(
    svgElement("path", {
      d: "M 0 0 L 10 5 L 0 10 z",
      class: "stroke-arrow-head"
    })
  );
  const defs = svgElement("defs");
  defs.append(marker);
  els.strokeGuide.append(defs);

  characters.forEach((character, charIndex) => {
    const strokes = STROKE_GUIDES[character] || STROKE_GUIDES[character.toUpperCase()] || STROKE_GUIDES.O;
    const group = svgElement("g", {
      transform: `translate(${charIndex * digitWidth} 0) scale(${digitWidth / 100} 1)`
    });

    strokes.forEach((points, strokeIndex) => {
      const path = svgElement("path", {
        d: pathFromPoints(points),
        class: "stroke-path",
        "marker-end": "url(#arrowHead)"
      });
      const start = points[0];
      const badge = svgElement("circle", {
        cx: start[0],
        cy: start[1],
        r: "5.4",
        class: "stroke-start"
      });
      const label = svgElement("text", {
        x: start[0],
        y: start[1] + 2.1,
        class: "stroke-number"
      });
      label.textContent = String(strokeIndex + 1);
      group.append(path, badge, label);
    });

    els.strokeGuide.append(group);
  });
}

function pathFromPoints(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`).join(" ");
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
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
  const prompt = state.roundType === "numbers" ? numberWord(state.target) : state.target;
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
  return typeof value === "number" ? numberWord(String(value)) : value;
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
