const { JobModel } = require("../models/Job");
const { isDatabaseReady } = require("../database/connection");

const inMemoryJobs = [];

function toEntity(job) {
  if (!job) {
    return null;
  }

  return {
    id: String(job._id || job.id),
    jobDescription: job.jobDescription,
    requiredSkills: job.requiredSkills || [],
    title: job.title || "",
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

async function createJob(payload) {
  if (isDatabaseReady()) {
    const created = await JobModel.create(payload);
    return toEntity(created.toObject());
  }

  const created = {
    id: String(inMemoryJobs.length + 1),
    jobDescription: payload.jobDescription,
    requiredSkills: payload.requiredSkills || [],
    title: payload.title || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryJobs.push(created);
  return created;
}

async function getJobById(id) {
  if (isDatabaseReady()) {
    const found = await JobModel.findById(id).lean();
    return toEntity(found);
  }

  return inMemoryJobs.find((job) => job.id === String(id)) || null;
}

async function listJobs({ page = 1, limit = 20 } = {}) {
  if (isDatabaseReady()) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      JobModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      JobModel.countDocuments(),
    ]);

    return {
      total,
      items: items.map(toEntity),
    };
  }

  const sorted = [...inMemoryJobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    total: sorted.length,
    items: sorted.slice(start, end),
  };
}

module.exports = {
  createJob,
  getJobById,
  listJobs,
};
