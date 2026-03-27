const http = require("node:http");

const PORT = Number(process.env.PORT || 5000);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: "git-verify-backend",
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  );
});

server.listen(PORT, () => {
  // Baseline bootstrap so Phase 1 scripts have a working start target.
  console.log(`GitVerify backend listening on port ${PORT}`);
});
