const fs = require('fs')
const AWS = require('aws-sdk')
const {removeAlphabetInName} = require('./CommonService')
const {commonConfig} = require('../config/config')

/* S3 File Object */
exports.s3FileObject = async (key) => {
    const s3 = new AWS.S3({
        accessKeyId: commonConfig.accessKeyID,
        secretAccessKey: commonConfig.secretKeyID,
        signatureVersion: 'v4',
        region: commonConfig.bucketRegion,
    })
    const params = {
        Bucket: commonConfig.bucketName,
        Key: key,
    }
    try {
        let data = await s3.getObject(params).promise()
        return {
            status: 1,
            message: 'success',
            data: data,
        }
    } catch (error) {
        return {
            status: 0,
            message: error ? JSON.stringify(error) : 'Error',
        }
    }
}

/* S3 File Upload */
exports.s3FileUpload = async (
    file,
    uploadFileDirPath,
    binaryData,
    binary = false
) => {
    try {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_KEY_ID,
            region: process.env.AWS_REGION_NAME,
        })

        const newFileName = removeAlphabetInName(file)
        let fileName = `${uploadFileDirPath}/${file}`
        let fileContent = binaryData

        if (!binary) fileContent = fs.readFileSync(fileName)

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: newFileName,
            Body: fileContent,
            ContentDisposition: `attachment; filename=${newFileName}`,
        }

        let data = await s3.upload(params).promise()
        return {status: 1, message: 'successfully uploaded file', data: data}
    } catch (error) {
        // console.log(error);
        return {status: 0, message: error}
    }
}

/* Function to Create a Temporary S3 Url for Access */
exports.S3TempAccessUrl = async (key) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY_ID,
        signatureVersion: 'v4',

        region: process.env.AWS_REGION_NAME,
    })

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Expires: 3 * 86400,
    };

    try {
        let data = await s3.getSignedUrl('getObject', params)

        return {
            status: 1,
            message: 'success',
            data: data,
        }
    } catch (error) {
        return {
            status: 0,
            message: error & error.message ? error.message : 'Error',
        }
    }
}
