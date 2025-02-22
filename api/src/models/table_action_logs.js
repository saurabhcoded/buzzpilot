module.exports = (sequelize, DataTypes) => {
    const TableActionLog = sequelize.define('table_action_logs', {
        subModuleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refrence_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        commit_id: {
            type: DataTypes.DECIMAL,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
        deleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    })

  

    return TableActionLog
}
