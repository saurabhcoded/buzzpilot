module.exports = (sequelize, DataTypes) => {
    const emails = sequelize.define('emails', {
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email_from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        other_recipient: {
            type: DataTypes.JSON,
            allowNull: true,
            get() {
                return JSON.parse(this.getDataValue("other_recipient") || "[]");
            },
            set(value) {
                this.setDataValue("other_recipient", JSON.stringify(value));
            }
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: true
        },
        body: {
            type: DataTypes.STRING,
            allowNull: true
        },
        attachments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: "[]",
            get() {
                return JSON.parse(this.getDataValue("attachments") || "[]");
            },
            set(value) {
                this.setDataValue("attachments", JSON.stringify(value));
            },
        },
        sent_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: true,
            },
        },
        sent_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        retry_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: true,
            },
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

    emails.associate = function (models) {
        emails.belongsTo(models.events, {
            foreignKey: "event_id",
            as: "events",
        });
    };


    return emails;
}