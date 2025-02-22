module.exports = (sequelize, DataTypes) => {
    const events = sequelize.define('events', {
        event_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_data: {
            type: DataTypes.JSON,
            allowNull: true,
            get() {
                return JSON.parse(this.getDataValue("event_data") || "{}");
            },
            set(value) {
                this.setDataValue("event_data", JSON.stringify(value));
            }
        },
        sent_status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sent_time: {
            type: DataTypes.DATE,
            allowNull: true
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
            validate: {
                isInt: true,
            },
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
    events.associate = function (models) {
        events.hasMany(models.emails, {
            foreignKey: "event_id",
            as: "emails",
        });
        events.hasMany(models.notifications, {
            foreignKey: "event_id",
            as: "notifications"
        })
    };


    return events;
}