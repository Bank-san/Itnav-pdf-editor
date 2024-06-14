const { PDFDocument } = require("pdf-lib");
const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.use(fileUpload());

app.post("/api/resize", async (req, res) => {
  if (!req.files || !req.files.pdf) {
    return res.status(400).send("No file was uploaded.");
  }

  const pdfBuffer = req.files.pdf.data;
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pageSize = [595.22, 841.86]; // A4サイズ

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const scaleX = pageSize[0] / width;
    const scaleY = pageSize[1] / height;
    const scale = Math.min(scaleX, scaleY);
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const yOffset = (pageSize[1] - scaledHeight) / 2;

    page.scale(scale, scale);
    page.setSize(pageSize[0], pageSize[1]);
    page.translateContent(0, yOffset); // Y軸方向に中央揃えする
  }

  const resizedPdfBytes = await pdfDoc.save();
  res.contentType("application/pdf");
  res.send(Buffer.from(resizedPdfBytes));
});

module.exports = app;
