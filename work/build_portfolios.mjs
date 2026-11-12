import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/USER/Documents/Codex/2026-08-07/upwork-english-portfolio";
const OUT = path.join(ROOT, "outputs");
const W = 1280;
const H = 720;
const FONT = "Aptos";

const C = {
  ink: "#101827",
  muted: "#5E6A7D",
  line: "#D9DEE7",
  paper: "#F7F5F0",
  white: "#FFFFFF",
  blue: "#246BFD",
  cyan: "#50D5E8",
  red: "#D63C48",
  green: "#2E9C68",
  gold: "#C8A55A",
  navy: "#081B34",
  sand: "#E8DCC8",
};

async function writeBlob(file, blob) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer()));
}

function rect(slide, x, y, w, h, fill, radius = "square", lineFill = "none", lineWidth = 0) {
  return slide.shapes.add({
    geometry: radius === "square" ? "rect" : "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
    ...(radius === "square" ? {} : { borderRadius: radius }),
  });
}

function txt(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name: opts.name,
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill || "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontFamily: FONT,
    fontSize: opts.size || 18,
    bold: opts.bold || false,
    color: opts.color || C.ink,
    alignment: opts.align || "left",
    verticalAlignment: opts.valign || "top",
  };
  return shape;
}

function rule(slide, x, y, w, color, height = 2) {
  return rect(slide, x, y, w, height, color);
}

function note(slide, sourceLines) {
  slide.speakerNotes.textFrame.setText(`[Sources]\n${sourceLines.map((s) => `- ${s}`).join("\n")}\n- All visible copy and graphics are anonymized, rewritten, and reconstructed for this portfolio draft.`);
}

function pageLabel(slide, label, dark = false) {
  txt(slide, label, 1150, 665, 70, 24, { size: 13, color: dark ? "#AAB7C8" : C.muted, align: "right" });
}

function badge(slide, text, x = 72, y = 64, dark = false) {
  rect(slide, x, y, 252, 28, dark ? "#17314F" : "#E9EDF5", "rounded-lg");
  txt(slide, text.toUpperCase(), x + 12, y + 5, 228, 18, { size: 12, bold: true, color: dark ? "#CDE7FF" : C.muted });
}

function cover(p, cfg) {
  const s = p.slides.add();
  s.background.fill = cfg.bg;
  rect(s, 0, 0, 18, H, cfg.accent);
  badge(s, cfg.kicker, 72, 62, cfg.dark);
  txt(s, "Presentation Design\n& Slide Redesign", 72, 150, 700, 170, { size: 60, bold: true, color: cfg.text, name: "deck-title" });
  txt(s, cfg.subtitle, 76, 348, 600, 62, { size: 25, color: cfg.muted });
  rule(s, 76, 456, 150, cfg.accent, 5);
  txt(s, "Presentation Designer - Visual Redesign & Slide Layout", 76, 480, 640, 34, { size: 17, bold: true, color: cfg.text });
  txt(s, "English selected edition / original material in Chinese", 76, 523, 600, 28, { size: 16, color: cfg.muted });

  // Decorative editorial composition, fully editable.
  rect(s, 830, 90, 320, 470, cfg.panel, "rounded-2xl");
  rect(s, 870, 132, 238, 94, cfg.accent, "rounded-xl");
  txt(s, "01", 890, 148, 70, 52, { size: 38, bold: true, color: cfg.accentText });
  txt(s, "HIERARCHY", 970, 160, 120, 24, { size: 14, bold: true, color: cfg.accentText });
  rect(s, 870, 260, 155, 12, cfg.line2, "rounded-lg");
  rect(s, 870, 288, 212, 8, cfg.line3, "rounded-lg");
  rect(s, 870, 310, 184, 8, cfg.line3, "rounded-lg");
  rect(s, 870, 350, 238, 130, cfg.canvas, "rounded-xl");
  rect(s, 890, 374, 72, 72, cfg.accent, "rounded-xl");
  rect(s, 980, 378, 102, 10, cfg.line2, "rounded-lg");
  rect(s, 980, 402, 84, 8, cfg.line3, "rounded-lg");
  rect(s, 980, 424, 110, 8, cfg.line3, "rounded-lg");
  note(s, [cfg.source]);
  return s;
}

function capabilitySlide(p, cfg) {
  const s = p.slides.add();
  s.background.fill = cfg.bg;
  badge(s, "Portfolio scope", 72, 56, cfg.dark);
  txt(s, "What this selection demonstrates", 72, 112, 900, 62, { size: 42, bold: true, color: cfg.text, name: "slide-title" });
  txt(s, cfg.intro, 72, 177, 900, 50, { size: 19, color: cfg.muted });
  const items = [
    ["01", "Visual hierarchy", "A clearer reading order built through scale, spacing, and contrast."],
    ["02", "Information design", "Dense source material translated into structured, scannable layouts."],
    ["03", "System consistency", "Typography, color, and page logic aligned across a full slide family."],
  ];
  items.forEach((item, i) => {
    const x = 72 + i * 382;
    rule(s, x, 270, 320, cfg.accents[i], 5);
    txt(s, item[0], x, 300, 80, 40, { size: 26, bold: true, color: cfg.accents[i] });
    txt(s, item[1], x, 355, 320, 38, { size: 24, bold: true, color: cfg.text });
    txt(s, item[2], x, 410, 318, 100, { size: 17, color: cfg.muted });
  });
  rect(s, 72, 567, 1136, 58, cfg.notice, "rounded-xl");
  txt(s, "Original content was Chinese. This draft presents visual design capability only and does not claim authorship of the underlying business content, data, or project outcomes.", 94, 582, 1090, 34, { size: 15, color: cfg.noticeText });
  pageLabel(s, "02 / 07", cfg.dark);
  note(s, [cfg.source, "No external assets or non-trivial external claims used."]);
  return s;
}

function miniBefore(slide, x, y, w, h, title, accent) {
  rect(slide, x, y, w, h, "#FFFFFF", "rounded-xl", "#D5DAE2", 1);
  txt(slide, title, x + 26, y + 28, w - 52, 46, { size: 25, bold: true, color: C.ink });
  rule(slide, x + 26, y + 92, w - 52, "#E4E7EC", 2);
  txt(slide, "Section overview", x + 26, y + 120, w - 52, 28, { size: 17, bold: true, color: C.ink });
  rect(slide, x + 26, y + 164, w - 52, 8, "#D7DBE2", "rounded-lg");
  rect(slide, x + 26, y + 184, w - 86, 8, "#E2E5EA", "rounded-lg");
  rect(slide, x + 26, y + 204, w - 72, 8, "#E2E5EA", "rounded-lg");
  rect(slide, x + 26, y + 246, 88, 38, "#F2F3F5", "rounded-lg");
  txt(slide, "A", x + 26, y + 254, 88, 24, { size: 18, bold: true, color: accent, align: "center" });
  rect(slide, x + 130, y + 246, 88, 38, "#F2F3F5", "rounded-lg");
  txt(slide, "B", x + 130, y + 254, 88, 24, { size: 18, bold: true, color: accent, align: "center" });
  rect(slide, x + 234, y + 246, 88, 38, "#F2F3F5", "rounded-lg");
  txt(slide, "C", x + 234, y + 254, 88, 24, { size: 18, bold: true, color: accent, align: "center" });
}

function miniAfter(slide, x, y, w, h, cfg) {
  rect(slide, x, y, w, h, cfg.bg, "rounded-xl", cfg.border || "none", cfg.border ? 1 : 0);
  rect(slide, x, y, 14, h, cfg.accent, "rounded-xl");
  txt(slide, cfg.eyebrow, x + 40, y + 30, w - 70, 24, { size: 13, bold: true, color: cfg.muted });
  txt(slide, cfg.title, x + 40, y + 70, w - 80, 70, { size: 30, bold: true, color: cfg.text });
  if (cfg.mode === "process") {
    [0, 1, 2].forEach((i) => {
      const xx = x + 42 + i * 140;
      rect(slide, xx, y + 180, 108, 88, i === 1 ? cfg.accent : cfg.surface, "rounded-xl");
      txt(slide, `0${i + 1}`, xx + 14, y + 194, 70, 22, { size: 16, bold: true, color: i === 1 ? cfg.accentText : cfg.accent });
      txt(slide, ["Frame", "Focus", "Flow"][i], xx + 14, y + 230, 80, 22, { size: 16, bold: true, color: i === 1 ? cfg.accentText : cfg.text });
    });
  } else if (cfg.mode === "orbit") {
    rect(slide, x + 52, y + 176, 164, 116, cfg.surface, "rounded-xl");
    txt(slide, "CORE", x + 84, y + 215, 100, 26, { size: 20, bold: true, color: cfg.accent, align: "center" });
    [0, 1, 2].forEach((i) => {
      const yy = y + 174 + i * 48;
      rect(slide, x + 248, yy, 184, 36, i === 0 ? cfg.accent : cfg.surface, "rounded-lg");
      txt(slide, ["Narrative", "Evidence", "Action"][i], x + 264, yy + 8, 150, 20, { size: 15, bold: true, color: i === 0 ? cfg.accentText : cfg.text });
    });
  } else {
    rect(slide, x + 40, y + 174, 112, 112, cfg.accent, "rounded-xl");
    txt(slide, "01", x + 62, y + 202, 70, 42, { size: 34, bold: true, color: cfg.accentText, align: "center" });
    rect(slide, x + 180, y + 180, 248, 12, cfg.line2, "rounded-lg");
    rect(slide, x + 180, y + 210, 196, 8, cfg.line3, "rounded-lg");
    rect(slide, x + 180, y + 234, 224, 8, cfg.line3, "rounded-lg");
    rect(slide, x + 180, y + 264, 110, 24, cfg.surface, "rounded-lg");
  }
}

function comparisonCase(p, cfg) {
  const s = p.slides.add();
  s.background.fill = cfg.slideBg || C.paper;
  badge(s, "Anonymized redesign sample", 72, 48, cfg.dark);
  txt(s, cfg.caseNo, 1120, 48, 90, 30, { size: 17, bold: true, color: cfg.accent, align: "right" });
  txt(s, cfg.title, 72, 98, 860, 54, { size: 40, bold: true, color: cfg.heading || C.ink, name: "slide-title" });
  txt(s, `Challenge  ${cfg.challenge}`, 72, 161, 1136, 28, { size: 16, color: cfg.body || C.muted });
  txt(s, `Design Focus  ${cfg.focus}     My Role  Presentation Designer - Visual Redesign & Slide Layout`, 72, 193, 1136, 30, { size: 16, bold: true, color: cfg.heading || C.ink });
  txt(s, "BEFORE", 72, 246, 200, 24, { size: 14, bold: true, color: cfg.body || C.muted });
  txt(s, "AFTER", 684, 246, 200, 24, { size: 14, bold: true, color: cfg.accent });
  miniBefore(s, 72, 278, 524, 320, cfg.beforeTitle, cfg.accent);
  miniAfter(s, 684, 278, 524, 320, cfg.after);
  pageLabel(s, cfg.page, cfg.dark);
  note(s, [cfg.source]);
  return s;
}

function methodSlide(p, cfg) {
  const s = p.slides.add();
  s.background.fill = cfg.bg;
  badge(s, "Design method", 72, 56, cfg.dark);
  txt(s, "A practical redesign workflow", 72, 112, 900, 62, { size: 42, bold: true, color: cfg.text, name: "slide-title" });
  txt(s, "Each stage turns dense source material into a coherent visual system while preserving meaning.", 72, 178, 930, 42, { size: 19, color: cfg.muted });
  const steps = [
    ["01", "Frame", "Clarify audience, purpose, and page priority."],
    ["02", "Structure", "Group content and establish reading order."],
    ["03", "Design", "Apply typography, color, rhythm, and imagery."],
    ["04", "Refine", "Check consistency, fit, and presentation flow."],
  ];
  steps.forEach((it, i) => {
    const x = 72 + i * 284;
    rect(s, x, 292, 246, 222, i === 1 ? cfg.accent : cfg.surface, "rounded-xl", cfg.border, 1);
    txt(s, it[0], x + 24, 316, 60, 30, { size: 22, bold: true, color: i === 1 ? cfg.accentText : cfg.accent });
    txt(s, it[1], x + 24, 374, 190, 34, { size: 24, bold: true, color: i === 1 ? cfg.accentText : cfg.text });
    txt(s, it[2], x + 24, 426, 194, 66, { size: 16, color: i === 1 ? cfg.accentText : cfg.muted });
  });
  pageLabel(s, "06 / 07", cfg.dark);
  note(s, [cfg.source, "No external assets or non-trivial external claims used."]);
  return s;
}

function closingSlide(p, cfg) {
  const s = p.slides.add();
  s.background.fill = cfg.bg;
  rect(s, 0, 0, 18, H, cfg.accent);
  badge(s, "Selected work", 72, 62, cfg.dark);
  txt(s, "Clearer slides.\nStronger visual stories.", 72, 150, 720, 132, { size: 52, bold: true, color: cfg.text, name: "slide-title" });
  txt(s, "Available for presentation redesign, visual hierarchy, slide layout, and presentation system refinement.", 76, 325, 720, 76, { size: 22, color: cfg.muted });
  rule(s, 76, 448, 160, cfg.accent, 5);
  txt(s, "Portfolio boundary", 76, 482, 220, 28, { size: 17, bold: true, color: cfg.text });
  txt(s, "Anonymized redesign samples. Original business content, data, and project outcomes are not claimed as authored work.", 76, 520, 730, 60, { size: 16, color: cfg.muted });
  rect(s, 888, 160, 260, 260, cfg.panel, "rounded-2xl");
  txt(s, "EDITABLE\nPPTX", 912, 220, 212, 96, { size: 32, bold: true, color: cfg.accent, align: "center" });
  txt(s, "English selected edition", 915, 350, 205, 26, { size: 15, color: cfg.muted, align: "center" });
  pageLabel(s, "07 / 07", cfg.dark);
  note(s, [cfg.source, "No external assets or non-trivial external claims used."]);
  return s;
}

function showcaseCase(p, cfg) {
  const s = p.slides.add();
  s.background.fill = cfg.slideBg;
  badge(s, "Anonymized redesign sample", 72, 48, cfg.dark);
  txt(s, cfg.caseNo, 1120, 48, 90, 30, { size: 17, bold: true, color: cfg.accent, align: "right" });
  txt(s, cfg.title, 72, 100, 900, 54, { size: 40, bold: true, color: cfg.text, name: "slide-title" });
  txt(s, `Challenge  ${cfg.challenge}`, 72, 162, 1090, 28, { size: 16, color: cfg.muted });
  txt(s, `Design Focus  ${cfg.focus}     My Role  Presentation Designer - Visual Redesign & Slide Layout`, 72, 194, 1136, 30, { size: 16, bold: true, color: cfg.text });
  const cards = cfg.cards;
  cards.forEach((card, i) => {
    const x = 72 + i * 382;
    const y = 278;
    rect(s, x, y, 336, 272, card.bg, "rounded-xl", card.border || "none", card.border ? 1 : 0);
    txt(s, card.eyebrow, x + 24, y + 24, 280, 22, { size: 12, bold: true, color: card.muted });
    txt(s, card.title, x + 24, y + 60, 280, 62, { size: 24, bold: true, color: card.text });
    if (card.mode === "metrics") {
      [0, 1, 2].forEach((j) => {
        rect(s, x + 24 + j * 96, y + 154, 78, 70, j === 1 ? card.accent : card.surface, "rounded-lg");
        txt(s, ["A", "B", "C"][j], x + 24 + j * 96, y + 170, 78, 28, { size: 20, bold: true, color: j === 1 ? card.accentText : card.accent, align: "center" });
      });
    } else if (card.mode === "editorial") {
      rect(s, x + 24, y + 150, 84, 84, card.accent, "rounded-xl");
      txt(s, "01", x + 24, y + 173, 84, 36, { size: 28, bold: true, color: card.accentText, align: "center" });
      rect(s, x + 132, y + 158, 168, 8, card.line, "rounded-lg");
      rect(s, x + 132, y + 184, 134, 7, card.line, "rounded-lg");
      rect(s, x + 132, y + 207, 154, 7, card.line, "rounded-lg");
    } else {
      rect(s, x + 24, y + 150, 288, 72, card.surface, "rounded-xl");
      rule(s, x + 46, y + 173, 92, card.accent, 6);
      rule(s, x + 46, y + 194, 154, card.line, 5);
      rect(s, x + 242, y + 166, 46, 46, card.accent, "rounded-xl");
    }
  });
  txt(s, cfg.caption, 72, 582, 1136, 32, { size: 15, color: cfg.muted });
  pageLabel(s, cfg.page, cfg.dark);
  note(s, [cfg.source]);
  return s;
}

async function exportDeck(p, basename, previewDir) {
  await fs.mkdir(previewDir, { recursive: true });
  for (const [index, slide] of p.slides.items.entries()) {
    const n = String(index + 1).padStart(2, "0");
    await writeBlob(path.join(previewDir, `slide-${n}.png`), await p.export({ slide, format: "png", scale: 1.5 }));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(ROOT, "work", `${basename}-slide-${n}.layout.json`), await layout.text());
  }
  await writeBlob(path.join(OUT, `${basename}_ContactSheet.webp`), await p.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(path.join(OUT, `${basename}.pptx`));
}

function buildComparison() {
  const p = Presentation.create({ slideSize: { width: W, height: H } });
  const source = "User-provided PDF: 专业设计对比效果(1).pdf (local, read-only).";
  cover(p, {
    bg: "#F5F2EC", text: C.ink, muted: C.muted, accent: C.red, panel: "#FFFFFF", canvas: "#F3F4F6", line2: "#B7BFCC", line3: "#D8DDE5", accentText: C.white, dark: false,
    kicker: "Comparison portfolio", subtitle: "Before-and-after presentation redesign samples", source,
  });
  capabilitySlide(p, { bg: "#F5F2EC", text: C.ink, muted: C.muted, dark: false, accents: [C.red, C.green, C.gold], notice: "#ECE7DE", noticeText: "#4E596A", intro: "Three anonymized before-and-after examples focused on turning plain source slides into purposeful visual systems.", source });
  comparisonCase(p, {
    caseNo: "CASE 01", title: "Editorial hierarchy for a formal report", challenge: "A text-heavy document with weak hierarchy and limited visual guidance.", focus: "Section structure, emphasis, reading rhythm, and restrained red accents.", beforeTitle: "Regional Growth Plan", accent: C.red, page: "03 / 07", source: `${source} Layout logic referenced from source page 2.`,
    after: { bg: "#FFF8F7", accent: C.red, accentText: C.white, eyebrow: "STRATEGIC OVERVIEW", title: "From dense copy to a clear editorial story", text: C.ink, muted: "#A2454C", surface: "#F6E3E5", line2: "#D66B74", line3: "#E7B6BA", mode: "editorial" },
  });
  comparisonCase(p, {
    caseNo: "CASE 02", title: "Process clarity for a product narrative", challenge: "Multiple concepts presented as unrelated blocks without a clear progression.", focus: "Process mapping, modular sections, and consistent green visual cues.", beforeTitle: "Product Overview", accent: C.green, page: "04 / 07", source: `${source} Layout logic referenced from source page 7.`,
    after: { bg: "#F3FBF6", accent: C.green, accentText: C.white, eyebrow: "PRODUCT SYSTEM", title: "A structured path from context to action", text: C.ink, muted: "#4E8065", surface: "#DCEFE4", line2: "#6CB58B", line3: "#B9DDC8", mode: "process" },
  });
  comparisonCase(p, {
    caseNo: "CASE 03", title: "Executive storytelling in a dark theme", challenge: "Important ideas were buried in uniform paragraphs and unstructured lists.", focus: "Narrative sequencing, premium contrast, and concise executive framing.", beforeTitle: "Strategy Brief", accent: C.gold, page: "05 / 07", dark: true, slideBg: "#09131F", heading: "#F4EFE6", body: "#AAB7C8", source: `${source} Layout logic referenced from source page 11.`,
    after: { bg: "#111E2D", accent: C.gold, accentText: C.navy, eyebrow: "EXECUTIVE BRIEF", title: "A focused story built around one core idea", text: "#F6F0E2", muted: "#B8A77F", surface: "#1B2E43", line2: "#C8A55A", line3: "#52647A", mode: "orbit" },
  });
  methodSlide(p, { bg: "#F5F2EC", text: C.ink, muted: C.muted, dark: false, accent: C.red, accentText: C.white, surface: "#FFFFFF", border: "#D8DDE5", source });
  closingSlide(p, { bg: "#F5F2EC", text: C.ink, muted: C.muted, dark: false, accent: C.red, panel: "#FFFFFF", source });
  return p;
}

function buildShowcase() {
  const p = Presentation.create({ slideSize: { width: W, height: H } });
  const source = "User-provided PDF: 作品展示(1)(2).pdf (local, read-only).";
  cover(p, {
    bg: "#071B31", text: "#F7FAFF", muted: "#A8B7CA", accent: C.cyan, panel: "#102A47", canvas: "#0B2038", line2: "#6C9CC5", line3: "#315878", accentText: C.navy, dark: true,
    kicker: "Showcase portfolio", subtitle: "Three distinct visual directions, rebuilt in English", source,
  });
  capabilitySlide(p, { bg: "#071B31", text: "#F7FAFF", muted: "#A8B7CA", dark: true, accents: [C.cyan, "#E7C67B", "#7F9CFF"], notice: "#102A47", noticeText: "#C5D3E2", intro: "A selected English edition showing range across corporate, editorial, and product-led presentation systems.", source });
  showcaseCase(p, {
    caseNo: "CASE 01", title: "Corporate narrative system", challenge: "A broad company story needed a consistent structure across overview, capabilities, and priorities.", focus: "Calm blue palette, modular page families, and repeatable content hierarchy.", accent: "#3F8CFF", slideBg: "#EEF5FA", text: C.ink, muted: C.muted, dark: false, page: "03 / 07", source: `${source} Visual language referenced from source pages 2 and 15.`, caption: "A unified slide family can flex between introductions, comparisons, and summary pages without losing coherence.",
    cards: [
      { bg: "#FFFFFF", text: C.ink, muted: "#5483A5", accent: "#3F8CFF", accentText: C.white, surface: "#E8F1FA", line: "#B8CEDD", eyebrow: "OVERVIEW", title: "A clear opening frame", mode: "product", border: "#D5E2EB" },
      { bg: "#E8F3F8", text: C.ink, muted: "#5483A5", accent: "#3F8CFF", accentText: C.white, surface: "#FFFFFF", line: "#B8CEDD", eyebrow: "CAPABILITIES", title: "Structured proof points", mode: "metrics" },
      { bg: "#173B5B", text: "#F7FAFF", muted: "#A7C8DE", accent: "#66C9E8", accentText: C.navy, surface: "#244F70", line: "#6D91AA", eyebrow: "PRIORITIES", title: "A focused close", mode: "product" },
    ],
  });
  showcaseCase(p, {
    caseNo: "CASE 02", title: "Editorial culture deck", challenge: "Cultural material required a modern presentation without losing a quiet, editorial tone.", focus: "Asymmetry, generous margins, warm neutrals, and typographic contrast.", accent: "#B44735", slideBg: "#F2ECE1", text: "#302A26", muted: "#756B62", dark: false, page: "04 / 07", source: `${source} Visual language referenced from source page 9.`, caption: "The design language is reconstructed without reusing source illustrations, seals, brand marks, or identifiable cultural assets.",
    cards: [
      { bg: "#E7DCCB", text: "#302A26", muted: "#86786B", accent: "#B44735", accentText: "#FFFFFF", surface: "#F4EEE5", line: "#B9AA9A", eyebrow: "OPENING", title: "A quiet visual entry", mode: "editorial" },
      { bg: "#F8F3EB", text: "#302A26", muted: "#86786B", accent: "#302A26", accentText: "#F8F3EB", surface: "#E9DFD0", line: "#B9AA9A", eyebrow: "CONTEXT", title: "Text-led storytelling", mode: "product" },
      { bg: "#DCCDBB", text: "#302A26", muted: "#756B62", accent: "#B44735", accentText: "#FFFFFF", surface: "#F8F3EB", line: "#AA9986", eyebrow: "REFLECTION", title: "A restrained conclusion", mode: "editorial" },
    ],
  });
  showcaseCase(p, {
    caseNo: "CASE 03", title: "Product storytelling with depth", challenge: "Technical product content needed stronger atmosphere and a clearer sequence of value.", focus: "Dark-mode contrast, controlled glow accents, and progressive information reveal.", accent: C.cyan, slideBg: "#071B31", text: "#F7FAFF", muted: "#A8B7CA", dark: true, page: "05 / 07", source: `${source} Visual language referenced from source page 28.`, caption: "The sample uses generic, non-technical placeholder content and does not reproduce source brands, claims, specifications, or imagery.",
    cards: [
      { bg: "#0D2848", text: "#F7FAFF", muted: "#82A4C1", accent: C.cyan, accentText: C.navy, surface: "#173B5B", line: "#426784", eyebrow: "VISION", title: "Set the product stage", mode: "product" },
      { bg: "#102D50", text: "#F7FAFF", muted: "#82A4C1", accent: C.cyan, accentText: C.navy, surface: "#173B5B", line: "#426784", eyebrow: "SYSTEM", title: "Explain the architecture", mode: "metrics" },
      { bg: "#0A2039", text: "#F7FAFF", muted: "#82A4C1", accent: "#7F9CFF", accentText: "#FFFFFF", surface: "#173B5B", line: "#426784", eyebrow: "VALUE", title: "Land the key message", mode: "product" },
    ],
  });
  methodSlide(p, { bg: "#071B31", text: "#F7FAFF", muted: "#A8B7CA", dark: true, accent: C.cyan, accentText: C.navy, surface: "#102A47", border: "#274766", source });
  closingSlide(p, { bg: "#071B31", text: "#F7FAFF", muted: "#A8B7CA", dark: true, accent: C.cyan, panel: "#102A47", source });
  return p;
}

await fs.mkdir(OUT, { recursive: true });
await exportDeck(buildComparison(), "English_Portfolio_Comparison", path.join(OUT, "English_Portfolio_Comparison_Previews"));
await exportDeck(buildShowcase(), "English_Portfolio_Showcase", path.join(OUT, "English_Portfolio_Showcase_Previews"));
