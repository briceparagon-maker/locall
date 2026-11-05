import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { TrialEndingEmail } from "../app/emails/TrialEndingEmail.tsx";
import { trialEndingEmailHtml } from "../lib/trial-ending-email.ts";

const samples = [
  {
    clientName: "Brice & <fils>",
    establishmentName: 'Le "Comptoir"',
    daysLeft: 2,
    subscribeUrl: "http://127.0.0.1:3456/dashboard?x=1&y=2#tarif",
  },
  {
    clientName: "commerçant",
    establishmentName: "Etablissement A",
    subscribeUrl: "http://127.0.0.1:3456/dashboard#tarif",
  },
];

test("l'e-mail d'essai reste identique au composant actuel", () => {
  for (const sample of samples) {
    assert.equal(
      trialEndingEmailHtml(sample),
      renderToStaticMarkup(TrialEndingEmail(sample)),
    );
  }
});

test("l'objet du rappel d'essai ne change pas", async () => {
  const { TRIAL_REMINDER_SUBJECT } = await import("../lib/trial-reminder.ts");
  assert.equal(
    TRIAL_REMINDER_SUBJECT("Etablissement A"),
    "⏳ Plus que 2 jours d'essai gratuit pour Etablissement A",
  );
});

test.after(async () => {
  const { db } = await import("../src/prisma/db.ts");
  await db.close();
});
