export function renderQuestion(root, { question, index, total, onAnswer, onBack, canGoBack }) {
  root.innerHTML = `
    <header class="top">
      <div class="brand">Suis-je <span>concerné</span> ?</div>
      <div class="ref">FACTURATION ÉLEC. — 2026</div>
    </header>

    <div class="progress">
      <span>${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
      <div class="track"><b style="width:${(index / total) * 100}%"></b></div>
    </div>

    <div class="q-eyebrow">${question.eyebrow}</div>
    <h1 class="question">${question.text}</h1>
    <div class="options">
      ${question.options
        .map(
          (opt, i) => `
        <button class="opt" data-value="${opt.value}">
          <span>${opt.label}</span>
          <span class="mark">${String(i + 1).padStart(2, "0")}</span>
        </button>`
        )
        .join("")}
    </div>
    ${canGoBack ? `<button class="nav-back" id="back-btn">&larr; question précédente</button>` : ""}
  `;

  root.querySelectorAll(".opt").forEach((btn) => {
    btn.addEventListener("click", () => onAnswer(question.key, btn.dataset.value));
  });

  const backBtn = root.querySelector("#back-btn");
  if (backBtn) backBtn.addEventListener("click", onBack);
}

export function renderResult(root, verdict, { onRestart, onSubmitEmail }) {
  const { stamp, verdictText, emissionDate, emissionText, tvaNote, receptionRisk } = verdict;

  root.innerHTML = `
    <header class="top">
      <div class="brand">Suis-je <span>concerné</span> ?</div>
      <div class="ref">FACTURATION ÉLEC. — 2026</div>
    </header>

    <div class="stamp ${stamp.className}">${stamp.text}</div>
    <h2 class="verdict">${verdictText}</h2>

    <div class="block">
      <div class="block-label">OBLIGATION DE RÉCEPTION</div>
      <div class="block-date">En vigueur depuis le 1er septembre 2026</div>
      <p>Tu dois être en mesure de recevoir les factures électroniques envoyées par tes fournisseurs professionnels, quel que soit ton régime de TVA.</p>
    </div>

    <div class="block">
      <div class="block-label">OBLIGATION D'ÉMISSION</div>
      <div class="block-date">${emissionDate}</div>
      <p>${emissionText}</p>
    </div>

    ${tvaNote ? `<div class="block"><div class="block-label">RÉGIME DE TVA</div><p>${tvaNote}</p></div>` : ""}

    <div class="block risk">
      <div class="block-label">RISQUE — RÉCEPTION (dès maintenant)</div>
      <p>${receptionRisk}</p>
    </div>

    <div class="block risk" style="margin-top:14px;">
      <div class="block-label">RISQUE — ÉMISSION (à partir de 2027)</div>
      <p>Facture émise non conforme (papier, PDF, ou hors format Factur-X/UBL/CII) : 50 € par facture, plafonné à 15 000 € par an. Un droit à l'erreur existe pour une première infraction régularisée rapidement.</p>
    </div>

    <div class="actions">
      <a class="btn primary" href="https://www.impots.gouv.fr" target="_blank" rel="noopener">Vérifier sur impots.gouv.fr</a>
      <button class="btn" id="restart-btn">Recommencer</button>
    </div>

    <div class="block" style="margin-top:20px;">
      <div class="block-label">RESTE AU COURANT</div>
      <p style="margin-bottom:14px;">La date d'émission (2027) approche et les règles peuvent encore bouger. Laisse ton email pour être prévenu des changements importants.</p>
      <form name="alerte-facturation" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="email-form">
        <input type="hidden" name="form-name" value="alerte-facturation" />
        <p class="hidden"><label>Ne pas remplir : <input name="bot-field" /></label></p>
        <input type="email" name="email" required placeholder="ton@email.fr" />
        <button type="submit" class="btn primary">Me prévenir</button>
      </form>
    </div>

    <p class="disclaimer">
      Ce diagnostic donne une orientation générale à partir des règles connues à ce jour. Il ne remplace pas l'avis de ton expert-comptable ou les informations officielles sur impots.gouv.fr, notamment si ta situation est particulière (TVA intracommunautaire, régimes spécifiques, etc.).
    </p>
  `;

  root.querySelector("#restart-btn").addEventListener("click", onRestart);

  const form = root.querySelector("#email-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmitEmail(new FormData(form), form);
  });
}
