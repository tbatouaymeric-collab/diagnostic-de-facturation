import { lastVerified } from "./sources.js";

export function renderNav(root, { active, onNavigate }) {
  const tabs = [
    { key: "home", label: "Diagnostic" },
    { key: "examples", label: "Exemples" },
    { key: "sources", label: "Sources" },
  ];
  const nav = document.createElement("header");
  nav.className = "top";
  nav.innerHTML = `
    <div class="brand">Suis-je <span>concerné</span> ?</div>
    <nav class="tabs">
      ${tabs
        .map(
          (t) =>
            `<button class="tab ${t.key === active ? "active" : ""}" data-key="${t.key}">${t.label}</button>`
        )
        .join("")}
    </nav>
  `;
  nav.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => onNavigate(btn.dataset.key));
  });
  root.appendChild(nav);
}

export function renderHome(root, { onStart }) {
  const section = document.createElement("section");
  section.className = "hero";
  section.innerHTML = `
    <div class="hero-kicker">Réforme facturation électronique — en vigueur depuis le 1ᵉʳ septembre 2026</div>
    <h1>Sais-tu vraiment ce que la réforme change pour toi ?</h1>
    <p class="hero-lead">
      Trois questions, une réponse claire : ce que tu dois faire, pour quand,
      et ce que tu risques si tu ignores tout ça. Avec des exemples de profils
      proches du tien.
    </p>
    <button class="btn primary large" id="start-btn">Commencer le diagnostic — 2 min</button>

    <div class="stat-row">
      <div class="stat"><span class="stat-num">50 €</span><span class="stat-label">par facture non conforme émise, dès 2027</span></div>
      <div class="stat"><span class="stat-num">500 €</span><span class="stat-label">si aucune plateforme agréée n'est en place</span></div>
      <div class="stat"><span class="stat-num">2</span><span class="stat-label">échéances : réception (2026) et émission (2027)</span></div>
    </div>
  `;
  root.appendChild(section);
  section.querySelector("#start-btn").addEventListener("click", onStart);
}

export function renderQuestion(root, { question, index, total, selected, onToggleMulti, onSelectSingle, onNext, onBack, canGoBack }) {
  const section = document.createElement("section");
  section.className = "quiz";

  const isMulti = question.type === "multi";
  const selectedSet = new Set(Array.isArray(selected) ? selected : selected ? [selected] : []);

  section.innerHTML = `
    <div class="progress">
      <span>${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
      <div class="track"><b style="width:${(index / total) * 100}%"></b></div>
    </div>
    <div class="q-eyebrow">${question.eyebrow}</div>
    <h1 class="question">${question.text}</h1>
    ${question.hint ? `<p class="q-hint">${question.hint}</p>` : ""}
    <div class="options">
      ${question.options
        .map(
          (opt) => `
        <button class="opt ${selectedSet.has(opt.value) ? "selected" : ""}" data-value="${opt.value}">
          <span class="opt-check">${isMulti ? (selectedSet.has(opt.value) ? "✓" : "") : ""}</span>
          <span class="opt-text">
            <span class="opt-label">${opt.label}</span>
            ${opt.note ? `<span class="opt-note">${opt.note}</span>` : ""}
          </span>
        </button>`
        )
        .join("")}
    </div>
    <div class="quiz-actions">
      ${canGoBack ? `<button class="btn ghost" id="back-btn">&larr; retour</button>` : "<span></span>"}
      ${isMulti ? `<button class="btn primary" id="next-btn" ${selectedSet.size === 0 ? "disabled" : ""}>Continuer</button>` : ""}
    </div>
  `;

  section.querySelectorAll(".opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isMulti) {
        onToggleMulti(question.key, btn.dataset.value);
      } else {
        onSelectSingle(question.key, btn.dataset.value);
      }
    });
  });

  const backBtn = section.querySelector("#back-btn");
  if (backBtn) backBtn.addEventListener("click", onBack);

  const nextBtn = section.querySelector("#next-btn");
  if (nextBtn) nextBtn.addEventListener("click", onNext);

  root.appendChild(section);
}

export function renderResult(root, verdict, { onRestart, onSubmitEmail, onGoExamples }) {
  const { stamp, headline, emission, reporting, tvaNote, receptionRisk } = verdict;

  const section = document.createElement("section");
  section.className = "result";
  section.innerHTML = `
    <div class="stamp ${stamp.className}">${stamp.text}</div>
    <h2 class="verdict">${headline}</h2>

    <div class="block">
      <div class="block-label">Obligation de réception</div>
      <div class="block-date">En vigueur depuis le 1er septembre 2026</div>
      <p>Tu dois être en mesure de recevoir les factures électroniques de tes fournisseurs professionnels, quel que soit ton régime de TVA.</p>
    </div>

    <div class="block ${emission.applicable ? "" : "muted"}">
      <div class="block-label">Émission de factures (e-invoicing)</div>
      <div class="block-date">1er septembre 2027</div>
      <p>${emission.text}</p>
    </div>

    <div class="block ${reporting.applicable ? "" : "muted"}">
      <div class="block-label">Transmission de données (e-reporting)</div>
      <div class="block-date">1er septembre 2027</div>
      <p>${reporting.text}</p>
    </div>

    ${tvaNote ? `<div class="block"><div class="block-label">Régime de TVA</div><p>${tvaNote}</p></div>` : ""}

    <div class="risk-grid">
      <div class="block risk">
        <div class="block-label">Risque — réception, dès maintenant</div>
        <p>${receptionRisk}</p>
      </div>
      <div class="block risk">
        <div class="block-label">Risque — émission, à partir de 2027</div>
        <p>50 € par facture non conforme, plafonné à 15 000 € par an. Droit à l'erreur pour une première infraction régularisée rapidement.</p>
      </div>
    </div>

    <div class="actions">
      <a class="btn primary" href="https://www.impots.gouv.fr" target="_blank" rel="noopener">Vérifier sur impots.gouv.fr</a>
      <button class="btn ghost" id="examples-btn">Voir des exemples proches du mien</button>
      <button class="btn ghost" id="restart-btn">Recommencer</button>
    </div>

    <div class="block signup">
      <div class="block-label">Reste au courant</div>
      <p>La date d'émission (2027) approche et les règles peuvent encore bouger. Laisse ton email pour être prévenu des changements importants.</p>
      <form name="alerte-facturation" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="email-form">
        <input type="hidden" name="form-name" value="alerte-facturation" />
        <p class="hidden"><label>Ne pas remplir : <input name="bot-field" /></label></p>
        <input type="email" name="email" required placeholder="ton@email.fr" />
        <button type="submit" class="btn primary">Me prévenir</button>
      </form>
    </div>

    <p class="disclaimer">
      Ce diagnostic donne une orientation générale à partir des règles connues au ${lastVerified}.
      Il ne remplace pas l'avis de ton expert-comptable ni les informations officielles sur impots.gouv.fr,
      notamment si ta situation est particulière.
    </p>
  `;

  root.appendChild(section);

  section.querySelector("#restart-btn").addEventListener("click", onRestart);
  section.querySelector("#examples-btn").addEventListener("click", onGoExamples);

  const form = section.querySelector("#email-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmitEmail(new FormData(form), form);
  });
}

export function renderExamplesList(root, examplesData) {
  const section = document.createElement("section");
  section.className = "examples";
  section.innerHTML = `
    <div class="hero-kicker">Cas concrets</div>
    <h1>Des profils, pas juste des règles</h1>
    <p class="hero-lead">Six situations réelles pour voir comment les obligations s'appliquent selon le type de clientèle.</p>
    <div class="example-grid">
      ${examplesData
        .map(
          (ex) => `
        <article class="example-card">
          <div class="example-name">${ex.name} <span class="example-role">— ${ex.role}</span></div>
          <div class="example-profile">${ex.profile}</div>
          <p>${ex.story}</p>
        </article>`
        )
        .join("")}
    </div>
  `;
  root.appendChild(section);
}

export function renderSources(root, sourcesData) {
  const section = document.createElement("section");
  section.className = "sources";
  section.innerHTML = `
    <div class="hero-kicker">Fiabilité</div>
    <h1>D'où vient ce contenu</h1>
    <p class="hero-lead">Dernière vérification du contenu face aux sources officielles : <strong>${lastVerified}</strong>.</p>
    <div class="source-list">
      ${sourcesData
        .map(
          (s) => `
        <a class="source-item" href="${s.url}" target="_blank" rel="noopener">
          <div class="source-label">${s.label}</div>
          <div class="source-note">${s.note}</div>
        </a>`
        )
        .join("")}
    </div>
    <p class="disclaimer">
      Ce site est un outil d'orientation indépendant, pas un service officiel de l'administration.
      En cas de doute sur ta situation, vérifie toujours directement sur impots.gouv.fr ou avec ton expert-comptable.
    </p>
  `;
  root.appendChild(section);
}
