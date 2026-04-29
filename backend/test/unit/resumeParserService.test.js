const test = require("node:test");
const assert = require("node:assert/strict");
const { parseResumeFiles } = require("../../src/services/resumeParserService");

test("Resume parser rejects unsupported MIME format", async () => {
  const [result] = await parseResumeFiles([
    {
      originalname: "resume.txt",
      mimetype: "text/plain",
      size: 400,
      buffer: Buffer.from("plain text"),
    },
  ]);

  assert.equal(result.status, "failed");
  assert.equal(result.errorCode, "INVALID_FILE_FORMAT");
});

test("Resume parser rejects files larger than configured limit", async () => {
  const hugeBuffer = Buffer.alloc(11 * 1024 * 1024);

  const [result] = await parseResumeFiles([
    {
      originalname: "resume.pdf",
      mimetype: "application/pdf",
      size: hugeBuffer.length,
      buffer: hugeBuffer,
    },
  ]);

  assert.equal(result.status, "failed");
  assert.equal(result.errorCode, "FILE_TOO_LARGE");
});
