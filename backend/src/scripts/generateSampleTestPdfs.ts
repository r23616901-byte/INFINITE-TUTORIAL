import fs from 'fs';
import path from 'path';

/**
 * Generates a clean, valid PDF 1.4 document without external dependencies.
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
  formattedLines.push(``);

  for (const line of contentLines) {
    if (line.length > 85) {
      // Wrap lines
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
  // Margins: 40pt left, 800pt top
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

  streamBody += `/F1 9.5 Tf\n`;
  let currentY = 744;
  for (let i = 4; i < Math.min(formattedLines.length, 50); i++) {
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

// Generate the 4 seeded PDFs
const uploadsDir = path.join(process.cwd(), 'uploads', 'test-papers');
fs.mkdirSync(uploadsDir, { recursive: true });

const tests = [
  {
    filename: 'KSB_Class9_Maths_Monthly_Test.pdf',
    title: 'Karnataka State Board - Class 9 Mathematics (Number Systems)',
    subtitle: 'Max Marks: 50 | Duration: 90 Minutes | Subject Code: MAT9',
    lines: [
      'General Instructions:',
      '1. All questions are compulsory. Internal choices are provided in Section C and D.',
      '2. Section A has 4 MCQs (1 Mark each).',
      '3. Section B has 3 Short Answer Questions (2 Marks each).',
      '4. Section C has 4 Long Answer Questions (3 Marks each).',
      '5. Section D has 4 Analytical Questions (7 Marks each).',
      '',
      'SECTION A - MULTIPLE CHOICE QUESTIONS (1 Mark Each)',
      'Q1. Which of the following is an irrational number? [A] sqrt(4)  [B] sqrt(9)  [C] sqrt(7)  [D] 0.25',
      'Q2. The decimal representation of a rational number cannot be: Non-terminating non-repeating.',
      'Q3. Find the value of (64)^(1/2). Ans: 8.',
      'Q4. The sum of a rational and an irrational number is always: Irrational.',
      '',
      'SECTION B - SHORT ANSWER QUESTIONS (2 Marks Each)',
      'Q5. Express 0.3333... in the form p/q, where p and q are integers and q != 0.',
      'Q6. Find two rational numbers between 3/5 and 4/5.',
      'Q7. Rationalise the denominator of 1 / (sqrt(7) - sqrt(6)).',
      '',
      'SECTION C - LONG ANSWER QUESTIONS (3 Marks Each)',
      'Q8. Represent sqrt(5) on the number line using Pythagoras theorem.',
      'Q9. Simplify: (3 + sqrt(3)) * (2 + sqrt(2)) and expand fully.',
      'Q10. If a = 2 + sqrt(3), find the value of a + 1/a.',
      'Q11. Simplify: (256)^(0.16) * (256)^(0.09).',
      '',
      'SECTION D - ANALYTICAL PROBLEMS (7 Marks Each)',
      'Q12. If (sqrt(3) - 1)/(sqrt(3) + 1) = a + b*sqrt(3), determine the rational values of a and b.',
      'Q13. Prove that sqrt(2) is an irrational number using method of contradiction.',
    ],
  },
  {
    filename: 'CBSE_Class10_Maths_Unit_Test_1.pdf',
    title: 'CBSE - Class 10 Mathematics (Real Numbers & Polynomials)',
    subtitle: 'Max Marks: 50 | Duration: 90 Minutes | Subject Code: MAT10',
    lines: [
      'General Instructions: All questions are compulsory. Show detailed intermediate steps.',
      '',
      'SECTION A - OBJECTIVE QUESTIONS (1 Mark Each)',
      'Q1. If two positive integers a and b are written as a = x^3 y^2 and b = x y^3, find HCF(a, b).',
      'Q2. The total number of zeroes of a quadratic polynomial cannot exceed: 2.',
      'Q3. If alpha and beta are zeroes of x^2 - 5x + 6, find the value of alpha + beta.',
      '',
      'SECTION B - SHORT ANSWER (2 Marks Each)',
      'Q4. Prove that 3 + 2*sqrt(5) is irrational given that sqrt(5) is irrational.',
      'Q5. Find a quadratic polynomial whose sum and product of zeroes are -3 and 2.',
      '',
      'SECTION C - LONG QUESTIONS (3 Marks Each)',
      'Q6. Using Euclid Division Lemma, find the HCF of 4052 and 12576.',
      'Q7. Find the zeroes of polynomial 4s^2 - 4s + 1 and verify relationship with coefficients.',
      '',
      'SECTION D - ADVANCED PROBLEMS (4 Marks Each)',
      'Q8. If one zero of 2x^2 - 3x + k is reciprocal of the other, find the value of k.',
      'Q9. An army contingent of 616 members is to march behind an army band of 32 members in a parade. Find maximum columns.',
    ],
  },
  {
    filename: 'CBSE_Class10_Physics_Electricity.pdf',
    title: 'CBSE - Class 10 Science: Physics (Electricity & Circuits)',
    subtitle: 'Max Marks: 40 | Duration: 60 Minutes | Subject Code: PHY10',
    lines: [
      'General Instructions: Draw neat circuit diagrams. Step marks awarded for numerical formulas.',
      '',
      'SECTION A - CONCEPTUAL (1 Mark Each)',
      'Q1. State Ohm’s Law and write its mathematical formula.',
      'Q2. Name the physical quantity whose SI unit is Ohm-metre (Resistivity).',
      '',
      'SECTION B - NUMERICAL PROBLEMS (2 Marks Each)',
      'Q3. A potential difference of 220V is applied across a resistance of 100 ohms. Calculate current.',
      'Q4. Why is tungsten used almost exclusively for filaments of electric lamps?',
      '',
      'SECTION C - APPLICATION & CIRCUITS (3 Marks Each)',
      'Q5. Three resistors 2 ohm, 3 ohm, and 6 ohm are connected in parallel. Find equivalent resistance.',
      'Q6. Compute the heat generated while transferring 96,000 coulombs of charge in 1 hour through 50V.',
      '',
      'SECTION D - EXPERIMENTAL ANALYSIS (5 Marks Each)',
      'Q7. Derive the formula for Joule’s Law of Heating H = I^2 R t.',
      'Q8. State reasons why series arrangement is not used for domestic circuits.',
    ],
  },
  {
    filename: 'Chemistry_Ch1_Equations_Test1.pdf',
    title: 'CBSE - Class 10 Science: Chemistry (Chemical Reactions)',
    subtitle: 'Max Marks: 25 | Duration: 45 Minutes | Subject Code: CHE10',
    lines: [
      'General Instructions: Write balanced chemical equations with state symbols (s, l, g, aq).',
      '',
      'SECTION A - BALANCING & REACTIONS (1 Mark Each)',
      'Q1. Balance the following: Fe + H2O -> Fe3O4 + H2',
      'Q2. What type of reaction is represented by: CaO + H2O -> Ca(OH)2 + Heat?',
      '',
      'SECTION B - OBSERVATION BASED (2 Marks Each)',
      'Q3. Why does the color of copper sulphate solution change when an iron nail is dipped in it?',
      'Q4. What is the difference between displacement and double displacement reaction?',
      '',
      'SECTION C - EXPLANATORY (3 Marks Each)',
      'Q5. Why is respiration considered an exothermic reaction? Explain with equation.',
      'Q6. What happens when lead nitrate is heated in a boiling tube? Write balanced equation.',
      '',
      'SECTION D - CORROSION & RANCIDITY (5 Marks)',
      'Q7. Explain Rancidity and Corrosion with two preventive measures each.',
    ],
  },
];

for (const t of tests) {
  const filePath = path.join(uploadsDir, t.filename);
  const pdfBuf = buildPdfBuffer(t.title, t.subtitle, t.lines);
  fs.writeFileSync(filePath, pdfBuf);
  console.log(`Generated: ${filePath} (${pdfBuf.length} bytes)`);
}
