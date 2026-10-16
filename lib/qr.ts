import QRCode from "qrcode";

const NAVY = "#0A192F";
const WHITE = "#ffffff";

export async function qrPngDataUrl(url: string, width = 2048) {
  return QRCode.toDataURL(url, {
    width,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: NAVY, light: WHITE },
  });
}

export async function qrPngBuffer(url: string, width = 1400) {
  return QRCode.toBuffer(url, {
    type: "png",
    width,
    margin: 1,
    errorCorrectionLevel: "H",
    color: { dark: NAVY, light: WHITE },
  });
}
