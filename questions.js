// Toute la logique métier vit ici, séparée du rendu (render.js) et de
// l'orchestration (main.js). Si une règle change, c'est le seul fichier
// à toucher.

export const clientTypes = [
  {
    value: "pro_fr",
    label: "Des professionnels en France",
    note: "Déclenche l'émission de factures électroniques (e-invoicing).",
  },
  {
    value: "particuliers_fr",
    label: "Des particuliers en France",
    note: "Déclenche l'e-reporting, pas l'e-invoicing.",
  },
  {
    value: "ue",
    label: "Des clients dans l'Union européenne",
    note: "Déclenche l'e-reporting, pas l'e-invoicing.",
  },
  {
    value: "hors_ue",
    label: "Des clients hors Union européenne",
    note: "Déclenche l'e-reporting, pas l'e-invoicing.",
  },
];

export const questions = [
  {
    key: "clients",
    type: "multi",
    eyebrow: "Question 1 sur 3",
    text: "Qui sont tes clients ?",
    hint: "Plusieurs réponses possibles.",
    options: clientTypes,
  },
  {
    key: "tva",
    type: "single",
    eyebrow: "Question 2 sur 3",
    text: "Quel est ton régime de TVA ?",
    options: [
      { value: "franchise", label: "Franchise en base — je ne facture pas de TVA" },
      { value: "redevable", label: "Redevable — je facture de la TVA" },
      { value: "transition", label: "Mon régime a changé ou va changer cette année" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
  },
  {
    key: "recep",
    type: "single",
    eyebrow: "Question 3 sur 3",
    text: "As-tu déjà une plateforme agréée pour recevoir des factures électroniques ?",
    options: [
      { value: "oui", label: "Oui, c'est en place" },
      { value: "non", label: "Non, pas encore" },
      { value: "sais_pas", label: "Je ne sais pas ce que c'est" },
    ],
  },
];

/**
 * Calcule le verdict complet à partir des réponses.
 * answers.clients est un tableau (sélection multiple).
 */
export function computeVerdict(answers) {
  const clients = answers.clients || [];
  const dejaEquipe = answers.recep === "oui";

  const hasProFr = clients.includes("pro_fr");
  const hasParticuliersFr = clients.includes("particuliers_fr");
  const hasUe = clients.includes("ue");
  const hasHorsUe = clients.includes("hors_ue");
  const hasReportingFlow = hasParticuliersFr || hasUe || hasHorsUe;

  const stamp = {
    className: dejaEquipe ? "ok" : "urgent",
    text: dejaEquipe ? "Réception en règle" : "Action requise",
  };

  const headline = dejaEquipe
    ? "Pour la réception, tu es prêt. Il reste l'échéance de 2027 à préparer."
    : "Tu dois mettre en place une plateforme agréée pour recevoir tes factures.";

  // Bloc émission (e-invoicing)
  let emission;
  if (hasProFr) {
    emission = {
      applicable: true,
      text: "Tu factures des professionnels en France : à partir de cette date, tu devras émettre tes propres factures au format structuré (Factur-X, UBL ou CII) via une plateforme agréée.",
    };
  } else {
    emission = {
      applicable: false,
      text: "Aucun de tes clients ne déclenche l'obligation d'émission via plateforme agréée — cette partie de la réforme ne te concerne pas directement.",
    };
  }

  // Bloc e-reporting
  let reporting;
  if (hasReportingFlow) {
    const sources = [];
    if (hasParticuliersFr) sources.push("tes ventes à des particuliers en France");
    if (hasUe) sources.push("tes ventes à des clients dans l'UE");
    if (hasHorsUe) sources.push("tes ventes à des clients hors UE");
    reporting = {
      applicable: true,
      text: `Tu devras transmettre à l'administration les données de ${sources.join(", ")} — pas de facture structurée à envoyer au client, juste un résumé transmis via ta plateforme agréée.`,
    };
  } else {
    reporting = {
      applicable: false,
      text: "Tous tes clients étant des professionnels en France, tes ventes passent entièrement par l'e-invoicing : pas d'e-reporting supplémentaire à prévoir pour toi.",
    };
  }

  // Note régime de TVA
  let tvaNote = "";
  if (answers.tva === "franchise") {
    tvaNote = "Être en franchise en base ne dispense de rien : la réforme s'applique à toutes les entreprises assujetties à la TVA, y compris en franchise.";
  } else if (answers.tva === "transition") {
    tvaNote = "Un changement de régime en cours d'année peut déplacer certaines dates ou obligations déclaratives précises. C'est le cas où vérifier avec ton expert-comptable ou impots.gouv.fr vaut vraiment le coup.";
  } else if (answers.tva === "inconnu") {
    tvaNote = "Si tu n'es pas sûr de ton régime, vérifie-le avant de choisir ta plateforme : ça peut changer certains réglages pratiques.";
  }

  const receptionRisk = dejaEquipe
    ? "Aucun risque ici : tu es déjà équipé pour la réception."
    : "Pas de plateforme agréée pour recevoir tes factures : mise en demeure de 3 mois pour régulariser, puis 500 €, renouvelable tous les 3 mois si ça persiste.";

  return {
    stamp,
    headline,
    emission,
    reporting,
    tvaNote,
    receptionRisk,
    dejaEquipe,
    flags: { hasProFr, hasParticuliersFr, hasUe, hasHorsUe },
  };
}
