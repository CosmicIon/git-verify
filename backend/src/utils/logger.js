const REDACT_KEYS = new Set([
  "authorization",
  "token",
  "githubtoken",
  "password",
  "cookie",
  "set-cookie",
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function redactValue(value) {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.entries(value).reduce((acc, [key, item]) => {
    if (REDACT_KEYS.has(String(key).toLowerCase())) {
      acc[key] = "[REDACTED]";
      return acc;
    }

    acc[key] = redactValue(item);
    return acc;
  }, {});
}

function emit(level, event, details = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...redactValue(details),
  };

  console.log(JSON.stringify(payload));
}

function info(event, details) {
  emit("info", event, details);
}

function warn(event, details) {
  emit("warn", event, details);
}

function error(event, details) {
  emit("error", event, details);
}

module.exports = {
  info,
  warn,
  error,
  redactValue,
};
