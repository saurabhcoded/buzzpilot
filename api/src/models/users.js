const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/;
const model = require("./index");
const bcryptjs = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,

    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    profile_desc: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    verification_token: {
      type: DataTypes.STRING,

    },
    email_verify: {
      type: DataTypes.INTEGER,

    },
    activeStatus: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: true,
      validate: {
        isInt: true,
      },
    },

    deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

  });



  // to delete user some key from return model
  User.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    delete values.password
    return values;
  };

  return User;
};
