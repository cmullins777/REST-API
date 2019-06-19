'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Title is rquired"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  });

  Course.associate = (models) => {
    models.Course.belongsTo(models.User, {
      foreignKey: 'userId',
    })
  };
  return Course;
};
