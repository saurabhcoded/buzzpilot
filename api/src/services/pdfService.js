const fs = require('fs');
const PDFDocument = require('pdfkit');
const PDFParser = require('pdf-parse');
const html_to_pdf = require('html-pdf-node');

/* converts a PDF file to text.*/
exports.pdfToText = (pdfPath) => {
    return new Promise((resolve, reject) => {
        const dataBuffer = fs.readFileSync(pdfPath);
        PDFParser(dataBuffer)
            .then(data => {
                resolve(Buffer.from(data.text, 'utf-8'));
            })
            .catch(error => {
                reject(error);
            });
    });
}


/* converts text to a PDF document. */
exports.textToPdf = (text) => {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const pdfDoc = new PDFDocument();

        pdfDoc.on('data', buffers.push.bind(buffers));
        pdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        pdfDoc.text(text);
        pdfDoc.end();
    });
}


/* converts HTML content to a PDFdocument */
exports.htmlToPdf = (html, type = 'url', pageSize = 'A4') => {
    return new Promise((resolve, reject) => {
        // Example of options with args //
        // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
        let options = {format: pageSize};
        let file = {};
        if (type === 'text') {
            file = {content: html};
        } else if (type === 'url') {
            file = {url: html};
        }
        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            console.log("PDF Buffer:-", pdfBuffer);
            resolve(pdfBuffer);
        }).catch((err) => {
            reject(err);
        });
    });
}
