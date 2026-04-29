const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const CandidateModel = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, defaultValue: "" },
    email: { type: DataTypes.STRING, defaultValue: "" },
    jobId: { type: DataTypes.STRING, defaultValue: null },
    jobDescription: { type: DataTypes.TEXT("long"), allowNull: false },
    resumeText: { type: DataTypes.TEXT("long"), allowNull: true },
    githubLink: { type: DataTypes.STRING, allowNull: false },
    githubUsername: { type: DataTypes.STRING, allowNull: false },
    resumes: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue('resumes');
        return typeof val === 'string' ? JSON.parse(val) : (val || []);
      }
    },
    atsScore: { type: DataTypes.FLOAT, defaultValue: 0 },
    githubScore: { type: DataTypes.FLOAT, defaultValue: 0 },
    finalScore: { type: DataTypes.FLOAT, defaultValue: 0 },
    confidenceScore: { type: DataTypes.FLOAT, defaultValue: 0 },
    rank: { type: DataTypes.INTEGER, defaultValue: null },
    flags: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue('flags');
        return typeof val === 'string' ? JSON.parse(val) : (val || []);
      }
    },
    atsDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue('atsDetails');
        return typeof val === 'string' ? JSON.parse(val) : val;
      }
    },
    githubDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue('githubDetails');
        return typeof val === 'string' ? JSON.parse(val) : val;
      }
    },
    scoreAudit: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const val = this.getDataValue('scoreAudit');
        return typeof val === 'string' ? JSON.parse(val) : val;
      }
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  CandidateModel,
};
