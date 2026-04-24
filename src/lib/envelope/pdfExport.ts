import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { AddressRow } from "./validation";

export interface EnvelopeSpec {
  widthMm: number;
  heightMm: number;
  type: "naga" | "kaku" | "yo";
}

export interface PdfExportOptions {
  envelopes: EnvelopeSpec[];
  rows: AddressRow[];
  sender: { postalCode: string; address: string; companyName: string; name: string };
  duplexBackFlap: boolean;
  selectedIndices: number[];
}

/**
 * Generate a single multi-page PDF with one envelope per page.
 * Uses pdf-lib for pure client-side PDF generation.
 * All data stays in-browser — nothing sent to server.
 */
export async function generateBulkPdf(options: PdfExportOptions): Promise<Uint8Array> {
  const { envelopes, rows, sender, duplexBackFlap, selectedIndices } = options;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = await fetch("/fonts/NotoSansJP-Bold.ttf").then(r => r.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  const rowsToExport = selectedIndices.length > 0
    ? rows.filter((_, i) => selectedIndices.includes(i))
    : rows;

  for (const row of rowsToExport) {
    const env = envelopes[0]; // use first envelope spec for all (same size batch)
    const page = pdfDoc.addPage([env.widthMm, env.heightMm]);

    // Draw recipient info
    let yPos = env.heightMm - 20;
    const fontSize = 10;
    const lineHeight = fontSize + 2;

    // Postal code
    if (row.postalCode) {
      page.drawText(`〒 ${row.postalCode}`, {
        x: 10,
        y: yPos,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yPos -= lineHeight + 5;
    }

    // Address
    const addressLine = `${row.prefecture}${row.city}${row.address1}${row.address2}`;
    if (addressLine) {
      page.drawText(addressLine, {
        x: 10,
        y: yPos,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yPos -= lineHeight;
    }

    if (row.building) {
      page.drawText(row.building, {
        x: 10,
        y: yPos,
        size: fontSize - 1,
        font,
        color: rgb(0, 0, 0),
      });
      yPos -= lineHeight + 3;
    }

    // Company
    if (row.companyName) {
      page.drawText(row.companyName, {
        x: 10,
        y: yPos,
        size: fontSize + 2,
        font,
        color: rgb(0, 0, 0),
      });
      yPos -= lineHeight + 2;
    }

    // Department
    if (row.department) {
      page.drawText(row.department, {
        x: 14,
        y: yPos,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yPos -= lineHeight + 2;
    }

    // Name + Honorific
    if (row.name) {
      page.drawText(`${row.name} ${row.honorific}`, {
        x: 10,
        y: yPos,
        size: fontSize + 4,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // Draw sender info (top-right area)
    const senderX = env.widthMm - 80;
    if (sender.address || sender.name || sender.companyName) {
      let sy = env.heightMm - 15;

      if (sender.postalCode) {
        page.drawText(`〒${sender.postalCode}`, {
          x: senderX,
          y: sy,
          size: 8,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
        sy -= 10;
      }
      if (sender.address) {
        page.drawText(sender.address, {
          x: senderX,
          y: sy,
          size: 8,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
        sy -= 10;
      }
      if (sender.companyName) {
        page.drawText(sender.companyName, {
          x: senderX,
          y: sy,
          size: 8,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
        sy -= 10;
      }
      if (sender.name) {
        page.drawText(sender.name, {
          x: senderX,
          y: sy,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }
    }

    // Duplex back flap (second page per envelope)
    if (duplexBackFlap) {
      const backPage = pdfDoc.addPage([env.widthMm, env.heightMm]);
      if (sender.address || sender.name || sender.companyName) {
        backPage.drawText("差出人（裏面）", {
          x: 10,
          y: env.heightMm - 15,
          size: 8,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
        let by = env.heightMm - 30;
        if (sender.postalCode) {
          backPage.drawText(`〒${sender.postalCode}`, { x: 10, y: by, size: 8, font, color: rgb(0, 0, 0) });
          by -= 10;
        }
        if (sender.address) {
          backPage.drawText(sender.address, { x: 10, y: by, size: 8, font, color: rgb(0, 0, 0) });
          by -= 10;
        }
        if (sender.companyName) {
          backPage.drawText(sender.companyName, { x: 10, y: by, size: 8, font, color: rgb(0, 0, 0) });
          by -= 10;
        }
        if (sender.name) {
          backPage.drawText(sender.name, { x: 10, y: by, size: 9, font, color: rgb(0, 0, 0) });
        }
      }
    }
  }

  return pdfDoc.save();
}
