export const questions = [
  {
    eyebrow: "Question 1",
    text: "Qui sont, principalement, tes clients ?",
    key: "clients",
    options: [
      { label: "Des professionnels / entreprises en France", value: "pro_fr" },
      { label: "Des particuliers", value: "particuliers" },
      { label: "Un mélange des deux", value: "mixte" },
      { label: "Des clients à l'étranger", value: "etranger" },
    ],
  },
  {
    eyebrow: "Question 2",
    text: "Es-tu en franchise en base de TVA ?",
    key: "tva",
    options: [
      { label: "Oui, je ne facture pas de TVA", value: "franchise" },
      { label: "Non, je facture de la TVA", value: "redevable" },
      { label: "Je ne sais pas", value: "inconnu" },
    ],
  },
  {
    eyebrow: "Question 3",
    text: "As-tu déjà une solution pour recevoir des factures électroniques (plateforme agréée) ?",
    key: "recep",
    options: [
      { label: "Oui, c'est en place", value: "oui" },
      { label: "Non, pas encore", value: "non" },
      { label: "Je ne sais pas ce que c'est", value: "sais_pas" },
    ],
  },
];

/**
 * Calcule le verdict à partir des réponses.
 * Toute la logique métier vit ici, séparée du rendu (render.js) et
 * de l'orchestration (main.js), pour rester facile à corriger si
 * les règles changent.
 */
export function computeVerdict(answers) {
  const concerneEmission = answers.clients === "pro_fr" || answers.clients === "mixte";
  const dejaEquipe = answers.recep === "oui";

  const stamp = {
    className: dejaEquipe ? "ok" : "urgent",
    text: dejaEquipe ? "EN RÈGLE — RÉCEPTION" : "ACTION REQUISE",
  };

  const verdictText = dejaEquipe
    ? "Pour la réception, tu es déjà équipé. Reste à préparer l'émission si tu factures des pros."
    : "Tu dois mettre en place une plateforme agréée pour recevoir tes factures électroniques.";

  let emissionText;
  if (concerneEmission) {
    emissionText =
      "Tu factures des professionnels en France : à partir de cette date, tu devras émettre tes propres factures au format électronique via une plateforme agréée, et transmettre certaines données à l'administration (e-reporting).";
  } else if (answers.clients === "etranger") {
    emissionText =
      "Tes ventes à l'étranger ne passent pas par l'e-invoicing classique, mais elles resteront concernées par l'e-reporting à partir de cette date. À vérifier selon les pays de tes clients.";
  } else {
    emissionText =
      "Tu factures des particuliers : pas d'obligation d'émission via plateforme pour ces ventes, mais l'e-reporting de ton chiffre d'affaires sera à prévoir à cette date.";
  }

  let tvaNote = "";
  if (answers.tva === "franchise") {
    tvaNote =
      "Être en franchise en base de TVA ne te dispense pas : la réforme s'applique à toutes les entreprises assujetties, y compris en franchise.";
  } else if (answers.tva === "inconnu") {
    tvaNote =
      "Si tu n'es pas sûr de ton régime de TVA, vérifie-le avant de choisir ta plateforme : ça peut changer certains détails pratiques.";
  }

  const receptionRisk = dejaEquipe
    ? "Aucun risque ici : tu es déjà équipé pour la réception."
    : "Pas de plateforme agréée pour recevoir tes factures : l'administration envoie d'abord une mise en demeure (3 mois pour régulariser), puis une amende de 500 €, renouvelable tous les 3 mois si ça persiste.";

  return {
    stamp,
    verdictText,
    emissionDate: "1er septembre 2027",
    emissionText,
    tvaNote,
    receptionRisk,
    dejaEquipe,
  };
}
