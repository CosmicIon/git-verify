const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.FRONTEND_PORT || 4173);
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function pipeRequestToBackend(req, res) {
  const targetUrl = new URL(req.url, BACKEND_ORIGIN);
  const proxyReq = http.request(
    {
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port || 80,
      path: `${targetUrl.pathname}${targetUrl.search}`,
      method: req.method,
      headers: {
        ...req.headers,
        host: targetUrl.host,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (error) => {
    sendJson(res, 502, {
      success: false,
      error: {
        code: "PROXY_ERROR",
        message: "Could not reach backend API",
        details: {
          backendOrigin: BACKEND_ORIGIN,
          reason: error.message,
        },
      },
    });
  });

  req.pipe(proxyReq);
}

function safeResolvePublicPath(urlPath) {
  const normalized = urlPath === "/" ? "/index.html" : urlPath;
  const resolved = path.normalize(path.join(PUBLIC_DIR, normalized));
  if (!resolved.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return resolved;
}

function serveStatic(req, res) {
  const filePath = safeResolvePublicPath(req.url.split("?")[0]);
  if (!filePath) {
    sendJson(res, 400, {
      success: false,
      error: {
        code: "INVALID_PATH",
        message: "Invalid request path",
      },
    });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        const fallbackFile = path.join(PUBLIC_DIR, "index.html");
        fs.readFile(fallbackFile, (fallbackError, fallbackContent) => {
          if (fallbackError) {
            sendJson(res, 404, {
              success: false,
              error: {
                code: "NOT_FOUND",
                message: "Resource not found",
              },
            });
            return;
          }

          res.writeHead(200, {
            "Content-Type": MIME_TYPES[".html"],
          });
          res.end(fallbackContent);
        });
        return;
      }

      sendJson(res, 500, {
        success: false,
        error: {
          code: "STATIC_READ_ERROR",
          message: "Unable to read static asset",
          details: { reason: error.message },
        },
      });
      return;
    }

    const extension = path.extname(filePath);
    const mimeType = MIME_TYPES[extension] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": mimeType,
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendJson(res, 400, {
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Missing request URL",
      },
    });
    return;
  }

  if (req.url.startsWith("/api/")) {
    pipeRequestToBackend(req, res);
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`GitVerify frontend listening on http://localhost:${PORT}`);
  console.log(`Proxying /api requests to ${BACKEND_ORIGIN}`);
});
