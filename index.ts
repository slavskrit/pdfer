import { readFileSync, writeFileSync } from "fs";
import { PDFDocument } from "pdf-lib";

async function setPdfFormFields(pdfBytes: Buffer) {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    console.log("Editable fields in the PDF:");
    // Retrieve all fields in the form
    const fields = form.getFields();

    console.log("Editable fields in the PDF:");
    const uint8Array = readFileSync("test.png");
    const pngImage = await pdfDoc.embedPng(uint8Array);
    fields.forEach((field) => {
      try {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`Setting field ${name} of type ${type}`);
        if (type === "PDFTextField") {
          const str = (Math.random() + 1).toString(36).substring(7);
          const len = field.getMaxLength();
          field.setText(str.substring(0, len));
          field.setFontSize(12);
          field.setImage(pngImage);
          // field.setTextColor(0, 0, 0);
        }
      } catch (error) {
        console.error("Error processing field:", error);
      }
    });

    return await pdfDoc.save({ updateFieldAppearances: true });
  } catch (error) {
    console.error("Error while processing the PDF:", error);
    throw error; // Re-throw error after logging
  }
}

async function main() {
  try {
    // Read the input PDF file as a Buffer
    const pdfBytes = readFileSync("test.pdf");

    // Update the PDF form fields
    const updatedPdfBytes = await setPdfFormFields(pdfBytes);

    // Write the updated PDF to a new file
    writeFileSync("updated.pdf", updatedPdfBytes);

    console.log("PDF fields processed and saved successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
