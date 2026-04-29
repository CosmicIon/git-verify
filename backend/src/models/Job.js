const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const JobModel = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobDescription: { type: DataTypes.TEXT("long"), allowNull: false },
    requiredSkills: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue('requiredSkills');
        return typeof val === 'string' ? JSON.parse(val) : (val || []);
      }
    },
    title: { type: DataTypes.STRING, defaultValue: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  JobModel,
};
