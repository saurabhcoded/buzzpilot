const apiValidator = (validationSchema) => (req, res, next) => {
    if (validationSchema) {
        const validator = validationSchema?.validate(req.body);
        if (validator.error) {
            return res.REST.FORBIDDEN(0, validator.error.message.replace(/"/g, ''));
        } else {
            next();
        }
    } else {
        return res.REST.ERROR(0, "Validation Schema Not Provided.")
    }
};

module.exports = apiValidator;