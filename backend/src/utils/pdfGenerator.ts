/**
 * Infinite Tutorial — Pure Node.js Standard PDF-1.4 Generator
 * Generates valid PDF documents with official headers, candidate metadata, and problem sets.
 */

export function buildPdfBuffer(title: string, subtitle: string, contentLines: string[]): Buffer {
  const sanitize = (str: string) =>
    str.replace(/[\\()]/g, (m) => '\\' + m);

  // Split lines if too long
  const formattedLines: string[] = [];
  formattedLines.push(`INFINITE TUTORIAL - OFFICIAL EXAMINATION PAPER`);
  formattedLines.push(title.toUpperCase());
  formattedLines.push(subtitle);
  formattedLines.push(`---------------------------------------------------------------------------------------------`);
  formattedLines.push(`Candidate Name: _______________________   Roll Number: ______________   Date: ________`);
  formattedLines.push(`---------------------------------------------------------------------------------------------`);
  formattedLines.push(``);

  for (const line of contentLines) {
    if (line.length > 85) {
      const words = line.split(' ');
      let current = '';
      for (const w of words) {
        if ((current + ' ' + w).length > 85) {
          formattedLines.push(current);
          current = w;
        } else {
          current = current ? current + ' ' + w : w;
        }
      }
      if (current) formattedLines.push(current);
    } else {
      formattedLines.push(line);
    }
  }

  // Build stream content
  // A4 is 595.28 x 841.89 points
  let streamBody = `BT\n`;
  streamBody += `/F1 14 Tf\n`;
  streamBody += `40 800 Td\n`;
  streamBody += `(${sanitize(formattedLines[0])}) Tj\n`;

  streamBody += `/F2 11 Tf\n`;
  streamBody += `0 -22 Td\n`;
  streamBody += `(${sanitize(formattedLines[1])}) Tj\n`;

  streamBody += `/F1 9 Tf\n`;
  streamBody += `0 -18 Td\n`;
  streamBody += `(${sanitize(formattedLines[2])}) Tj\n`;

  streamBody += `/F1 8.5 Tf\n`;
  streamBody += `0 -16 Td\n`;
  streamBody += `(${sanitize(formattedLines[3])}) Tj\n`;

  streamBody += `0 -14 Td\n`;
  streamBody += `(${sanitize(formattedLines[4])}) Tj\n`;

  streamBody += `0 -14 Td\n`;
  streamBody += `(${sanitize(formattedLines[5])}) Tj\n`;

  streamBody += `/F1 9.5 Tf\n`;
  let currentY = 716;
  for (let i = 6; i < Math.min(formattedLines.length, 50); i++) {
    const l = formattedLines[i];
    streamBody += `0 -15 Td\n`;
    streamBody += `(${sanitize(l)}) Tj\n`;
    currentY -= 15;
    if (currentY < 60) break;
  }

  // Footer
  streamBody += `0 -25 Td\n`;
  streamBody += `(${sanitize('---------------------------------------------------------------------------------------------')}) Tj\n`;
  streamBody += `0 -14 Td\n`;
  streamBody += `(${sanitize('*** End of Question Paper - Certified by Infinite Tutorial Academic Directorate ***')}) Tj\n`;
  streamBody += `ET\n`;

  const streamBuf = Buffer.from(streamBody, 'utf-8');
  const streamLen = streamBuf.length;

  const objects: string[] = [];

  // 1: Catalog
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  // 2: Pages
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);

  // 3: Page
  objects.push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`
  );

  // 4: Font Helvetica
  objects.push(`4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);

  // 5: Font Helvetica-Bold
  objects.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);

  // 6: Contents stream
  objects.push(`6 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamBody}endstream\nendobj\n`);

  let offset = 9; // "%PDF-1.4\n"
  const xrefEntries: string[] = ['0000000000 65535 f \n'];

  for (const obj of objects) {
    const offsetStr = String(offset).padStart(10, '0');
    xrefEntries.push(`${offsetStr} 00000 n \n`);
    offset += Buffer.byteLength(obj, 'utf-8');
  }

  const xrefOffset = offset;
  let pdf = `%PDF-1.4\n`;
  for (const obj of objects) {
    pdf += obj;
  }

  pdf += `xref\n0 ${objects.length + 1}\n`;
  for (const entry of xrefEntries) {
    pdf += entry;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf-8');
}
