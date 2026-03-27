const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobDescription: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    title: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

JobSchema.index({ createdAt: -1 });
JobSchema.index({ requiredSkills: 1 });

const JobModel = mongoose.model("Job", JobSchema);

module.exports = {
  JobModel,
};
