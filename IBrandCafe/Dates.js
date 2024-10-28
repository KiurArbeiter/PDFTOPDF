import { PdfReader } from "pdfreader";

new PdfReader().parseFileItems("Pakkumine1.pdf", (err, item) => {
    if (err) {
        console.log(err);
    } else if (!item) {
        console.warn("end of line");
    } else if (item.text) {
        if (item.text.includes("Kuupäev")) {
            console.log("Kuupäev:", item.text.split("Kuupäev:")[1].trim());
        }
        else if (item.text.includes("Kehtib kuni")) {
            console.log("Kehtib kuni:", item.text.split("Kehtib kuni:")[1].trim());
        }
    }
});
