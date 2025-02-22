const models = require('../models/index')
const clog = require('./ChalkService');
const i18n = require('../config/i18n.config')

exports.filterError = (error, req, res) => {
    clog.error('filterError', error);
    let return_data = {},
        http_status = 500;
    if (error !== undefined && error !== null && Object.keys(error).length != 0) {
        if (error.name !== undefined && error.name == "SequelizeValidationError") {
            //validation error
            let validattion_errors = {};
            for (let err in error.errors) {
                validattion_errors[err] = {
                    message: error.errors[err].message,
                    field: error.errors[err].path,
                    value: error.errors[err].value,
                };
            }
            http_status = 400;
            return_data = {
                status: 0,
                message: i18n.__n('VALIDATION_ERROR'),
                validation_error: validattion_errors,
            };
        } else {
            return_data = {
                status: 0,
                message: i18n.__n('EXCEPTION_ERROR'),
                error: error,
            };
        }
    } else {
        return_data = {
            status: 0,
            message: i18n.__n('EXCEPTION_ERROR'),
            error: error,
        };
    }
    // return response;
    return res.status(http_status).json(return_data);
};

exports.trimBodyData = (data) => {
    Object.keys(data).forEach((key) => {
        if (typeof data[key] == 'string') {
            data[key] = data[key].trim();
        }
    })

    return data;
}




//to track all the action -> ACTION Logs=====>
exports.actionLogs = async (subModuleName, recordId, actionName, options, createdBy, req, res) => {

    try {
        let date = new Date()
        let commitId = date.getTime()

        let userId = req?.user?.id
        let obj = {
            subModuleName: subModuleName,
            action: actionName,
            commit_id: commitId,
            refrence_id: recordId,
            ipAddress: req.connection.remoteAddress,
            createdBy: createdBy,
        }

        let actionTableModel = await models.table_action_logs.create(obj, {
            ...options,
            raw: true,
        })
        // console.log("actionModelTable" , actionTableModel);
        if (actionTableModel) {
            options.actionLogId = actionTableModel?.id
        }

        //return option with actionLogId
        return options
    } catch (error) {
        clog.error(error)
        return false;
    }
}



exports.getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

exports.isString = (str) => {
    try {
        return typeof str === 'string'
    } catch (e) {
        return false
    }
}