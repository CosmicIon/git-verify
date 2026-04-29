const SEMANTIC_GROUPS = [
  ["javascript", "js", "ecmascript"],
  ["typescript", "ts"],
  ["node", "nodejs", "node.js"],
  ["react", "reactjs", "react.js"],
  ["mongodb", "mongo", "mongo-db"],
  ["express", "expressjs"],
  ["postgresql", "postgres", "psql"],
  ["docker", "container", "containers"],
  ["kubernetes", "k8s"],
  ["testing", "test", "jest", "mocha"],
  ["ci", "cicd", "pipeline", "pipelines"],
];

const TOKEN_TO_GROUP = new Map();
for (const group of SEMANTIC_GROUPS) {
  for (const token of group) {
    TOKEN_TO_GROUP.set(token, group);
  }
}

function expandSemanticTokens(tokens) {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    const group = TOKEN_TO_GROUP.get(token);
    if (!group) {
      continue;
    }

    for (const related of group) {
      expanded.add(related);
    }
  }

  return expanded;
}

function computeSemanticScore({ resumeTokens, jdTokens }) {
  const resumeExpanded = expandSemanticTokens(resumeTokens);
  const jdExpanded = expandSemanticTokens(jdTokens);

  const jdArray = [...jdExpanded];
  if (jdArray.length === 0) {
    return 0;
  }

  let matched = 0;
  for (const token of jdArray) {
    if (resumeExpanded.has(token)) {
      matched += 1;
    }
  }

  return Number((matched / jdArray.length).toFixed(6));
}

module.exports = {
  computeSemanticScore,
};
