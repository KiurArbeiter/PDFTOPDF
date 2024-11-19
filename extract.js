(async function () {
  //Path to PDF
  const pdfUrl = "Pakkumine1.pdf";

  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

  //Extract all from PDF
  async function extractTextFromPDF(pdfUrl) {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const extractedText = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText.push(
        textContent.items.map((item) => item.str).join(" ")
      );
    }
    return extractedText.join("\n");
  }

  //Process Extracted Text
  function extractDetailedData(text) {
    //Extract items
    const lineItemRegex =
      /(\d+)\s+(.*?)\s+(\S+)\s+(\d+)\s+([\d.,]+)\s+([\d.,]+)/g;
    const lineItems = [];
    let match;
    while ((match = lineItemRegex.exec(text)) !== null) {
      lineItems.push({
        code: match[1],
        description: match[2],
        unit: match[3],
        quantity: match[4],
        unitPrice: parseFloat(match[5].replace(",", ".")),
        totalPrice: parseFloat(match[6].replace(",", ".")),
      });
    }

    //Extract totals
    const totalRegex = /Kokku EUR:\s*([\d.,]+)|Käibemaks.*?([\d.,]+)|Tasuda EUR:\s*([\d.,]+)/g;
    const totals = {};
    let totalMatch;
    while ((totalMatch = totalRegex.exec(text)) !== null) {
      if (totalMatch[1]) totals.totalEUR = parseFloat(totalMatch[1].replace(",", "."));
      if (totalMatch[2]) totals.vat = parseFloat(totalMatch[2].replace(",", "."));
      if (totalMatch[3]) totals.grandTotal = parseFloat(totalMatch[3].replace(",", "."));
    }

    return { lineItems, totals };
  }

  //Show on HTML
  function displayResults(data) {
    const outputDiv = document.getElementById("output");
    const itemsHTML = data.lineItems
      .map(
        (item) => `
        <tr>
          <td>${item.code}</td>
          <td>${item.description}</td>
          <td>${item.unit}</td>
          <td>${item.quantity}</td>
          <td>${item.unitPrice.toFixed(2)}</td>
          <td>${item.totalPrice.toFixed(2)}</td>
        </tr>`
      )
      .join("");
    outputDiv.innerHTML = `
      <h2>Extracted Data</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Kood</th>
            <th>Kauba nimetus</th>
            <th>Ühik</th>
            <th>Kogus</th>
            <th>Ühiku hind</th>
            <th>Kokku hind</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      <p><strong>Kokku EUR:</strong> ${data.totals.totalEUR.toFixed(2)}</p>
      <p><strong>Käibemaks:</strong> ${data.totals.vat.toFixed(2)}</p>
      <p><strong>Tasuda EUR:</strong> ${data.totals.grandTotal.toFixed(2)}</p>
    `;
  }

  //Run
  try {
    const text = await extractTextFromPDF(pdfUrl);
    const data = extractDetailedData(text);
    displayResults(data);
  } catch (error) {
    console.error("Error extracting or processing PDF:", error);
    document.getElementById("output").innerText = "Failed to load PDF.";
  }
})();
