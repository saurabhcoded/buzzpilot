const models = require("../models/index");
const CommonService = require('../services/CommonService')


// fetch all the notification list as per the  logged user==========>
exports.getAllNotificationList = async (req, res) => {
    try {
        let userID = req?.user?.id
        let options = {
            where: {
                userId: userID,
                deleted: 0,
            },
            order: [['createdAt', 'DESC']],
        };
        const response = await models.notifications.findAll(options);
        // clog.success("notification" ,response)
        if (response.length > 0) {
            return res.send({
                status: 1,
                data: response,
                message: req.__("success"),
            });
        } else {
            return res.send({
                status: 0,
                message: req.__("No records found"),
            });
        }
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

// mark the notication status as 1 ==================>
exports.markReadNotificationList = async (req, res) => {
    try {
        const {notificationIds} = req?.body;
        let actionLogOption = {
            id: req?.user?.id
        }
        const readDateTime = CommonService.getCurrentDateTime();
        let options = {
            where: {
                id: notificationIds,
            }
        }
        const response = await models.notifications.update({
            readStatus: 1,
            readDateTime: readDateTime,
            updatedBy: req?.user?.id
        }, options);

        if (response) {
            return res.send({
                status: 1,
                message: "Data Updated Successfully",
                // data: response,
            });
        } else {
            return res.send({
                status: 0,
                message: "Something went wrong!",
                data: {},
            });
        }

    } catch (error) {
        CommonService.filterError(error, req, res);
    }
}