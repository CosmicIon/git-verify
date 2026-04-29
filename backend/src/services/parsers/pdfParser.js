const pdfParse = require("pdf-parse");

async function parsePdf(buffer) {
  const result = await pdfParse(buffer);
  return result.text || "";
}

module.exports = { parsePdf };
