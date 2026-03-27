const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    githubLink: { type: String, required: true },
    githubUsername: { type: String, required: true },
    resumes: { type: [mongoose.Schema.Types.Mixed], default: [] },
    atsScore: { type: Number, default: 0, min: 0, max: 1 },
    githubScore: { type: Number, default: 0, min: 0, max: 1 },
    finalScore: { type: Number, default: 0, min: 0, max: 1 },
    confidenceScore: { type: Number, default: 0, min: 0, max: 1 },
    rank: { type: Number, default: null },
    flags: { type: [mongoose.Schema.Types.Mixed], default: [] },
    atsDetails: { type: mongoose.Schema.Types.Mixed, default: null },
    githubDetails: { type: mongoose.Schema.Types.Mixed, default: null },
    scoreAudit: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  }
);

CandidateSchema.index({ githubUsername: 1 });
CandidateSchema.index({ email: 1 });
CandidateSchema.index({ createdAt: -1 });
CandidateSchema.index({ finalScore: -1, githubScore: -1, atsScore: -1, updatedAt: -1 });
CandidateSchema.index({ confidenceScore: -1, createdAt: -1 });

const CandidateModel = mongoose.model("Candidate", CandidateSchema);

module.exports = {
  CandidateModel,
};
