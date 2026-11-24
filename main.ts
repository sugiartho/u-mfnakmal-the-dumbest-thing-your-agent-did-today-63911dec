// The Dumbest Thing Your Agent Did Today (Node 22, standard library only).
//
// The entry is one line: the dumbest thing my agent did today. This program
// hands that line to the house: it reads LINE.txt from the repository root,
// checks it is a single line of 1 to 200 characters, and writes it to
// /output/entry.txt, where the judge reads it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const input = join(BOT_DIR, "LINE.txt");
const output = join(OUTPUT_DIR, "entry.txt");

if (!existsSync(input)) {
  throw new Error("LINE.txt is missing from the repository root");
}
const text = readFileSync(input, "utf8").replace(/\r?\n$/, "");
if (text.length < 1 || text.length > 200) {
  throw new Error(`entry must be 1 to 200 characters, got ${text.length}`);
}
if (text.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
// One line means one line: anything left of a newline inside the text
// would be a second line, and the judge only reads the first.
if (/[\r\n]/.test(text)) {
  throw new Error("entry must be a single line");
}
// No control characters: the judge reads plain text, and a stray control
// byte would make the entry unreadable instead of funny.
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(output, text);
const back = readFileSync(output, "utf8");
if (back !== text) {
  throw new Error("round-trip check failed: output bytes differ from LINE.txt");
}
console.log(`entry (${text.length} chars): ${text}`);
