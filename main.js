import "./style.css";
import { questions, computeVerdict } from "./questions.js";
import { examples } from "./examples.js";
import { sources } from "./sources.js";
import {
  renderNav,
  renderHome,
  renderQuestion,
  renderResult,
  renderExamplesList,
  renderSources,
} from "./render.js";

const app = document.getElementById("app");

let view = "home"; // 'home' | 'quiz' | 'result' | 'examples' | 'sources'
let questionIndex = 0;
const answers = {};

function mount() {
  app.innerHTML = "";
  renderNav(app, { active: navKeyFor(view), onNavigate: goTo });

  if (view === "home") {
    renderHome(app, { onStart: startQuiz });
  } else if (view === "quiz") {
    const q = questions[questionIndex];
    renderQuestion(app, {
      question: q,
      index: questionIndex,
      total: questions.length,
      selected: answers[q.key],
      onToggleMulti: toggleMulti,
      onSelectSingle: selectSingle,
      onNext: nextQuestion,
      onBack: prevQuestion,
      canGoBack: questionIndex > 0,
    });
  } else if (view === "result") {
    const verdict = computeVerdict(answers);
    renderResult(app, verdict, {
      onRestart: startQuiz,
      onSubmitEmail: submitEmail,
      onGoExamples: () => goTo("examples"),
    });
  } else if (view === "examples") {
    renderExamplesList(app, examples);
  } else if (view === "sources") {
    renderSources(app, sources);
  }
}

function navKeyFor(v) {
  if (v === "quiz" || v === "result") return "home";
  return v;
}

function goTo(key) {
  view = key;
  if (key === "home") {
    // Revenir sur l'onglet Diagnostic remet la page d'accueil, pas le quiz en cours.
    questionIndex = 0;
  }
  mount();
}

function startQuiz() {
  view = "quiz";
  questionIndex = 0;
  for (const key of Object.keys(answers)) delete answers[key];
  mount();
}

function toggleMulti(key, value) {
  const current = new Set(answers[key] || []);
  if (current.has(value)) current.delete(value);
  else current.add(value);
  answers[key] = Array.from(current);
  mount();
}

function selectSingle(key, value) {
  answers[key] = value;
  if (questionIndex < questions.length - 1) {
    questionIndex++;
  } else {
    view = "result";
  }
  mount();
}

function nextQuestion() {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
  } else {
    view = "result";
  }
  mount();
}

function prevQuestion() {
  if (questionIndex > 0) {
    questionIndex--;
    mount();
  }
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

mount();
