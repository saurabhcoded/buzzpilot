
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const {dbconfig} = require("../config/config");
const config = dbconfig;
const db = {};

config.define = {
    hooks: {
        afterCreate: async (model, options) => {},
        beforeUpdate: async (model, options) => {
            if (options.userId != undefined && options.userId != null) {
                model.updatedBy = options.userId;
            }
        },
        afterUpdate: async (model, options) => {
            if (
                options.id !== null &&
                options.id !== undefined &&
                options.actionLogId !== null &&
                options.actionLogId !== undefined
            ) {
                let action_log_id = options.actionLogId;

                //set option data
                let option_data = {
                    id: options.id,
                };

                //transaction
                if (options.transaction) {
                    option_data.transaction = options.transaction;
                }

                //get updated model attribute
                var attributes = model._options.attributes;
                //delete unwanted attributes
                var exclude_attribute = ["createdAt", "updatedAt", "updatedBy"];

                // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,")

                let name = model.constructor.getTableName();
                let id = model.dataValues.id;

                for (var attribute in attributes) {
                    if (exclude_attribute.indexOf(attributes[attribute]) == -1) {
                        var prevValue = model._previousDataValues[attributes[attribute]];
                        if (typeof prevValue == "object") {
                            prevValue = JSON.stringify(prevValue);
                        }
                        var changeValue = model.dataValues[attributes[attribute]];
                        if (typeof changeValue == "object") {
                            changeValue = JSON.stringify(changeValue);
                        }
                        if (prevValue != changeValue) {
                            //insert record
                            let obj = {
                                action_log_id: action_log_id,
                                fieldName: attributes[attribute],
                                tableName: name,
                                refrenceId: id,
                                prevValue: String(prevValue),
                                createdBy: options.id,
                                changeValue: String(changeValue),
                            };
                            await model.constructor.sequelize.models.table_change_logs.create(
                                obj,
                                option_data
                            );
                        }
                    }
                }
            }
        },
    }
}

let sequelize;
sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);


//getting all the file name inside models directory
let filesName = fs.readdirSync(__dirname);


filesName = filesName.filter((file) => {
    return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
    );
})



filesName.forEach((file) => {
    const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes
    );
    db[model.name] = model;
});


Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;