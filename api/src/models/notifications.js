module.exports = (sequelize, DataTypes) => {
    const notificationList = sequelize.define('notifications', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_id: {
            type: DataTypes.INTEGER,
        },
        message: {
            type: DataTypes.STRING
        },
        readStatus: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        readDateTime: {
            type: DataTypes.DATE,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
            },
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                isInt: true,
            },
        },
    })

    notificationList.associate = function (models) {
        notificationList.belongsTo(models.events, {
            foreignKey: "event_id",
            as: "events",
        });
    };

    return notificationList;
}