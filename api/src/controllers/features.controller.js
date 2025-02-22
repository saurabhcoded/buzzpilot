const clog = require('../services/ChalkService');
const path = require('path');
const {ExceltoJSON, JSONtoExcel} = require('../services/excelService');
const {textToPdf, htmlToPdf} = require('../services/pdfService');

/* Function to Generate S3 Signed Url */
exports.exceltoJsonController = async (req, res) => {
    try {
        console.log('ReqBody', req.body);
        // const result = ExceltoJSON('local', path.join(__dirname, 'test.xlsx'));
        const result = await ExceltoJSON('s3', req.body.fileurl);
        if (result) {
            return res.REST.SUCCESS(1, "SuccessFull", {result})
        } else {
            return res.REST.SERVERERROR(0, "Error While Converting Excel to JSON")
        }
    } catch (error) {
        clog.error(error);
        res.REST.BADREQUEST(0, "Error While Converting Excel to JSON", error)
    }
}

exports.jsontoExcelController = async (req, res) => {
    try {
        const data = req.body.data;
        if (data) {
            const result = await JSONtoExcel(data);
            if (result) {
                res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                return res.send(result);
            } else {
                return res.REST.SERVERERROR(0, "Error While Converting JSON to Excel")
            }
        }
    } catch (error) {
        clog.error(error);
        res.REST.BADREQUEST(0, "Error While Converting JSON to Excel", error)
    }
}

exports.pdf2TextController = async (req, res) => {
    try {
        // const result = ExceltoJSON('local', path.join(__dirname, 'test.xlsx')); // for local file
        const result = await ExceltoJSON('s3', req.body.fileurl);
        if (result) {
            return res.REST.SUCCESS(1, "SuccessFull", {result})
        } else {
            return res.REST.SERVERERROR(0, "Error While Converting Pdf to Text")
        }
    } catch (error) {
        clog.error(error);
        res.REST.BADREQUEST(0, "Error While Converting Pdf to Text", error)
    }
}

exports.text2PdfController = async (req, res) => {
    try {
        const data = req.body.data;
        if (data) {
            const result = await textToPdf(data);
            if (result) {
                res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');
                res.setHeader('Content-Type', 'application/pdf'); // Set correct MIME type for PDF
                return res.send(result);
            } else {
                return res.REST.SERVERERROR(0, "Error While Converting Text to Pdf")
            }
        }
    } catch (error) {
        clog.error(error);
        res.REST.BADREQUEST(0, "Error While Converting Text to Pdf", error)
    }
}
exports.html2PdfController = async (req, res) => {
    try {
        const data = req.body;
        console.log('Log', data);
        if (data) {
            const result = await htmlToPdf(data);
            if (result) {
                res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');
                res.setHeader('Content-Type', 'application/pdf'); // Set correct MIME type for PDF
                return res.send(result);
            } else {
                return res.REST.SERVERERROR(0, "Error While Converting Text to Pdf")
            }
        } else {
            return res.REST.NOTFOUND(0);
        }
    } catch (error) {
        clog.error(error);
        res.REST.BADREQUEST(0, "Error While Converting Text to Pdf", error)
    }
}