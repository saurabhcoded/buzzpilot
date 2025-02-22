const Joi = require("joi");

/* Forgot Password Request Schema */
exports.getSignedUrlSchema = Joi.object({
    fileName: Joi.string().required().messages({
        'string.empty': 'Filename is Required',
    }),
    fileType: Joi.string().required().messages({
        'string.empty': 'FileType is Required',
    }),
    groupID: Joi.string().required().messages({
        'string.empty': 'groupID is Required',
    }),
    folder: Joi.string().required().messages({
        'string.empty': 'Folder is Required',
    }),
});
