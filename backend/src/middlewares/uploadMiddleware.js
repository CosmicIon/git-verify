const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

function uploadResumes(req, res, next) {
  // Accept batch uploads under the field name "resumes".
  return upload.array("resumes")(req, res, next);
}

module.exports = {
  uploadResumes,
};
