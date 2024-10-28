import {PdfReader} from "pdfreader"

new PdfReader().parseFileItems("Pakkumine1.pdf", (err,item) => {
    if (err) console.log(err)
    else if (!item) console.warn("end of line")
    else if (item.text) console.log(item.text)
})

