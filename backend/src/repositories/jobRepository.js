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
    return toEntity(created.get({ plain: true }));
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
    const found = await JobModel.findByPk(id);
    return toEntity(found ? found.get({ plain: true }) : null);
  }

  return inMemoryJobs.find((job) => job.id === String(id)) || null;
}

async function listJobs({ page = 1, limit = 20 } = {}) {
  if (isDatabaseReady()) {
    const skip = (page - 1) * limit;
    const { count, rows } = await JobModel.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
    });

    return {
      total: count,
      items: rows.map(r => toEntity(r.get({ plain: true }))),
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
