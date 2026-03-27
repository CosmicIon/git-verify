const multer = require("multer");
const path = require("node:path");
const { AppError } = require("../utils/appError");

const MAX_FILES_PER_UPLOAD = Number(process.env.MAX_FILES_PER_UPLOAD || 20);
const MAX_RESUME_FILE_SIZE_MB = Number(process.env.MAX_RESUME_FILE_SIZE_MB || 10);
const MAX_RESUME_FILE_SIZE_BYTES = MAX_RESUME_FILE_SIZE_MB * 1024 * 1024;

const MIME_TO_EXTENSION = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

function sanitizeFileName(name) {
  const base = path.basename(String(name || "resume"));
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function fileFilter(_req, file, cb) {
  file.originalname = sanitizeFileName(file.originalname);
  const expectedExtension = MIME_TO_EXTENSION[file.mimetype];
  const extension = path.extname(String(file.originalname || "")).toLowerCase();

  if (!expectedExtension) {
    cb(
      new AppError({
        code: "INVALID_FILE_FORMAT",
        message: "Unsupported file type. Only PDF and DOCX are allowed",
        status: 400,
      })
    );
    return;
  }

  if (extension !== expectedExtension) {
    cb(
      new AppError({
        code: "INVALID_FILE_EXTENSION",
        message: "File extension does not match detected MIME type",
        status: 400,
        details: {
          fileName: file.originalname,
        },
      })
    );
    return;
  }

  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    files: MAX_FILES_PER_UPLOAD,
    fileSize: MAX_RESUME_FILE_SIZE_BYTES,
    parts: MAX_FILES_PER_UPLOAD + 10,
  },
});

function uploadResumes(req, res, next) {
  // Accept batch uploads under the field name "resumes".
  return upload.array("resumes")(req, res, next);
}

module.exports = {
  uploadResumes,
};
