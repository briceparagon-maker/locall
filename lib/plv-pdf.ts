import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import { qrPngBuffer } from "@/lib/qr";

export const PLV_TEMPLATES = [
  "chevalet-a6",
  "chevalet-a5",
  "sticker-carre",
  "sticker-rond",
  "affiche-a4",
] as const;

export type PlvTemplate = (typeof PLV_TEMPLATES)[number];

export function isPlvTemplate(value: string): value is PlvTemplate {
  return (PLV_TEMPLATES as readonly string[]).includes(value);
}

const NAVY = rgb(10 / 255, 25 / 255, 47 / 255);
const ORANGE = rgb(1, 85 / 255, 0);
const WHITE = rgb(1, 1, 1);
const SLATE = rgb(51 / 255, 65 / 255, 85 / 255);
const RULE = rgb(0.75, 0.78, 0.82);

function mm(value: number) {
  return (value * 72) / 25.4;
}

function fitName(name: string, max = 42) {
  const trimmed = name.trim() || "Votre etablissement";
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}...` : trimmed;
}

function drawPanel(
  page: PDFPage,
  input: {
    x: number;
    y: number;
    width: number;
    height: number;
    qr: PDFImage;
    font: PDFFont;
    fontBold: PDFFont;
    name: string;
  },
) {
  const { x, y, width, height } = input;
  const pad = Math.min(width, height) * 0.08;
  const qrSize = Math.min(width, height) * 0.46;
  const titleSize = Math.max(9, pad * 0.7);
  const captionSize = Math.max(7, pad * 0.42);

  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: WHITE,
    borderColor: RULE,
    borderWidth: 0.4,
  });
  page.drawRectangle({
    x,
    y,
    width,
    height: pad * 1.55,
    color: NAVY,
  });
  page.drawText("FILTRAVIS", {
    x: x + pad,
    y: y + pad * 0.5,
    size: Math.max(8, pad * 0.5),
    font: input.fontBold,
    color: ORANGE,
  });
  page.drawText(fitName(input.name, 26), {
    x: x + pad,
    y: y + height - pad * 1.15,
    size: titleSize,
    font: input.fontBold,
    color: NAVY,
  });
  page.drawText("Scannez pour donner votre avis", {
    x: x + pad,
    y: y + height - pad * 1.75,
    size: captionSize,
    font: input.font,
    color: SLATE,
  });
  page.drawImage(input.qr, {
    x: x + (width - qrSize) / 2,
    y: y + pad * 2.1,
    width: qrSize,
    height: qrSize,
  });
}

export async function buildPlvPdf(input: {
  template: PlvTemplate;
  restaurantName: string;
  reviewUrl: string;
}) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const qr = await pdf.embedPng(await qrPngBuffer(input.reviewUrl, 1400));
  const name = input.restaurantName;

  if (input.template === "chevalet-a6" || input.template === "chevalet-a5") {
    const panelW = input.template === "chevalet-a6" ? mm(105) : mm(148);
    const panelH = input.template === "chevalet-a6" ? mm(148) : mm(210);
    const page = pdf.addPage([panelW * 2, panelH]);
    drawPanel(page, { x: 0, y: 0, width: panelW, height: panelH, qr, font, fontBold, name });
    drawPanel(page, {
      x: panelW,
      y: 0,
      width: panelW,
      height: panelH,
      qr,
      font,
      fontBold,
      name,
    });
    page.drawLine({
      start: { x: panelW, y: mm(6) },
      end: { x: panelW, y: panelH - mm(6) },
      thickness: 0.7,
      color: RULE,
      dashArray: [4, 3],
    });
  }

  if (input.template === "sticker-carre" || input.template === "sticker-rond") {
    const size = mm(90);
    const page = pdf.addPage([size, size]);
    if (input.template === "sticker-rond") {
      page.drawCircle({
        x: size / 2,
        y: size / 2,
        size: size / 2 - mm(2),
        color: WHITE,
        borderColor: ORANGE,
        borderWidth: 2.2,
      });
    } else {
      page.drawRectangle({
        x: mm(5),
        y: mm(5),
        width: size - mm(10),
        height: size - mm(10),
        color: WHITE,
        borderColor: ORANGE,
        borderWidth: 2.2,
      });
    }
    const qrSize = mm(50);
    page.drawImage(qr, {
      x: (size - qrSize) / 2,
      y: (size - qrSize) / 2 + mm(3),
      width: qrSize,
      height: qrSize,
    });
    const label = fitName(name, 22);
    page.drawText(label, {
      x: (size - fontBold.widthOfTextAtSize(label, 9)) / 2,
      y: mm(11),
      size: 9,
      font: fontBold,
      color: NAVY,
    });
    page.drawText("FILTRAVIS", {
      x: (size - fontBold.widthOfTextAtSize("FILTRAVIS", 8)) / 2,
      y: size - mm(13),
      size: 8,
      font: fontBold,
      color: ORANGE,
    });
  }

  if (input.template === "affiche-a4") {
    const page = pdf.addPage([mm(210), mm(297)]);
    const { width, height } = page.getSize();
    page.drawRectangle({ x: 0, y: 0, width, height, color: WHITE });
    page.drawRectangle({
      x: 0,
      y: height - mm(28),
      width,
      height: mm(28),
      color: NAVY,
    });
    page.drawText("FILTRAVIS", {
      x: mm(18),
      y: height - mm(18),
      size: 16,
      font: fontBold,
      color: ORANGE,
    });
    page.drawText("Votre reputation entre de bonnes mains.", {
      x: mm(18),
      y: height - mm(24),
      size: 9,
      font,
      color: WHITE,
    });
    page.drawText("Votre avis compte", {
      x: mm(18),
      y: height - mm(52),
      size: 28,
      font: fontBold,
      color: NAVY,
    });
    page.drawText(fitName(name, 48), {
      x: mm(18),
      y: height - mm(66),
      size: 16,
      font,
      color: SLATE,
    });
    page.drawText("Scannez ce QR code pour laisser votre avis en 20 secondes.", {
      x: mm(18),
      y: height - mm(78),
      size: 12,
      font,
      color: SLATE,
    });
    const qrSize = mm(110);
    page.drawImage(qr, {
      x: (width - qrSize) / 2,
      y: mm(70),
      width: qrSize,
      height: qrSize,
    });
    page.drawRectangle({ x: 0, y: 0, width, height: mm(22), color: ORANGE });
    page.drawText("Supports et QR code actifs a vie — sans frais supplementaires.", {
      x: mm(18),
      y: mm(9),
      size: 10,
      font: fontBold,
      color: WHITE,
    });
  }

  return pdf.save();
}

export function plvFilename(template: PlvTemplate, slug: string) {
  return `locall-${template}-${slug}.pdf`;
}
