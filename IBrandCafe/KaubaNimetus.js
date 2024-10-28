import { PdfReader } from "pdfreader";

const keywords = [
  "Algmaterjal",
  "Formaat",
  "Materjal",
  "Värv",
  "Trükise ehitus",
  "Lisatööd",
  "Kommentaar",
  "kahepoolne"
];

let currentEntry = null;
const entries = [];

const isKeywordLine = (text) => {
  return keywords.some(keyword => text.toLowerCase().startsWith(keyword.toLowerCase()));
};

new PdfReader().parseFileItems("Pakkumine1.pdf", (err, item) => {
  if (err) {
    console.error(err);
  } else if (!item) {
    console.warn("End of document");

    if (currentEntry) entries.push(currentEntry);

    entries.forEach(entry => {
      entry.forEach(line => console.log(line));
      console.log("\n");
    });
  } else if (item.text) {
    const text = item.text.trim();

    if (text.includes("Kauba nimetus")) {
      if (currentEntry) entries.push(currentEntry);
      currentEntry = [];
    }

    if (isKeywordLine(text) && currentEntry) {
      currentEntry.push(text);
    }
  }
});
