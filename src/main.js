import "./style.css";
import { questions, computeVerdict } from "./questions.js";
import { renderQuestion, renderResult } from "./render.js";

const root = document.getElementById("app");

let currentIndex = 0;
const answers = {};

function showQuestion() {
  renderQuestion(root, {
    question: questions[currentIndex],
    index: currentIndex,
    total: questions.length,
    canGoBack: currentIndex > 0,
    onAnswer: handleAnswer,
    onBack: handleBack,
  });
}

function handleAnswer(key, value) {
  answers[key] = value;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
}

function handleBack() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
}

function showResult() {
  const verdict = computeVerdict(answers);
  renderResult(root, verdict, {
    onRestart: restart,
    onSubmitEmail: submitEmail,
  });
}

function restart() {
  currentIndex = 0;
  for (const key of Object.keys(answers)) delete answers[key];
  showQuestion();
}

async function submitEmail(formData, formEl) {
  try {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    });
    formEl.innerHTML = '<p class="confirm ok">C\'est noté, merci.</p>';
  } catch {
    formEl.innerHTML = '<p class="confirm error">Oups, réessaie dans un instant.</p>';
  }
}

showQuestion();
