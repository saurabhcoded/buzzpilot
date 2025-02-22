const xlsx = require('xlsx');
const {s3FileObject} = require('./AwsService');
const {s3urltoKey} = require('../controllers/upload.controller');


exports.ExceltoJSON = async (type, filepath) => {
    try {
        let workbook = null;
        if (type === 'local') {
            workbook = xlsx.readFile(filepath);
        } else if (type === 's3') {
            let s3Key = s3urltoKey(filepath);
            if (s3Key) {
                let fileObject = await s3FileObject(s3Key);
                workbook = xlsx.read(fileObject.data.Body);
            }
        }
        if (workbook) {
            let workbook_response = [];
            workbook.SheetNames.forEach((sheetName, sheetIndex) => {
                workbook_response[sheetIndex] = {sheetNumber: (sheetIndex + 1), sheetLabel: sheetName, data: xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])};
            });
            return workbook_response;
        } else {
            return null;
        }
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

exports.JSONtoExcel = (data) => {
    const workbook = xlsx.utils.book_new();

    data.forEach(sheet => {
        const worksheetData = sheet.data;
        const worksheet = xlsx.utils.json_to_sheet(worksheetData);
        xlsx.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    });

    // Write the workbook to a buffer
    const excelBuffer = xlsx.write(workbook, {type: 'buffer', bookType: 'xlsx'});

    return excelBuffer;
}