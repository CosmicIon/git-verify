const candidateForm = document.getElementById("candidate-form");
const filtersForm = document.getElementById("filters-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const rankingsBody = document.getElementById("rankings-body");
const tableMeta = document.getElementById("table-meta");
const detailsContent = document.getElementById("details-content");

const state = {
  items: [],
  selectedCandidateId: null,
};

function clampScore(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : 0;
}

function formatScore(value) {
  return clampScore(value).toFixed(3);
}

function setStatus(message, isError = false) {
  formStatus.textContent = message;
  formStatus.style.color = isError ? "var(--danger)" : "var(--accent-2)";
}

function getFilterQuery() {
  const params = new URLSearchParams();
  const sortBy = filtersForm.sortBy.value;
  const direction = filtersForm.direction.value;
  const flaggedOnly = filtersForm.flaggedOnly.checked;
  const minFinalScore = filtersForm.minFinalScore.value;

  params.set("page", "1");
  params.set("limit", "50");
  params.set("sortBy", sortBy);
  params.set("direction", direction);
  params.set("flaggedOnly", flaggedOnly ? "true" : "false");

  if (minFinalScore !== "") {
    params.set("minFinalScore", minFinalScore);
  }

  return params;
}

function getCandidateLabel(item) {
  if (item.githubUsername) {
    return `@${item.githubUsername}`;
  }

  return item.id;
}

function renderDetails(item) {
  if (!item) {
    detailsContent.textContent =
      "Select a candidate from the rankings table to inspect ATS reasoning, GitHub reasons, and verification flags.";
    return;
  }

  const reasonCodes = Array.isArray(item.githubDetails?.reasonCodes)
    ? item.githubDetails.reasonCodes
    : [];
  const flags = Array.isArray(item.flags) ? item.flags : [];
  const topSkills = item.atsDetails?.explanation?.topMatchedSkills || [];
  const missingSkills = item.atsDetails?.explanation?.missingRequiredSkills || [];

  detailsContent.innerHTML = `
    <div class="detail-grid">
      <div>
        <h3>Profile</h3>
        <p><strong>${getCandidateLabel(item)}</strong> · rank ${item.rank}</p>
        <p class="code">candidateId: ${item.id}</p>
        <p class="code">confidence: ${formatScore(item.confidenceScore)}</p>
      </div>
      <div>
        <h3>Score Breakdown</h3>
        <ul>
          <li>ATS: ${formatScore(item.atsScore)}</li>
          <li>GitHub: ${formatScore(item.githubScore)}</li>
          <li>Final: ${formatScore(item.finalScore)}</li>
        </ul>
      </div>
      <div>
        <h3>Explainability</h3>
        <p><strong>Top matched:</strong> ${topSkills.length ? topSkills.join(", ") : "None"}</p>
        <p><strong>Missing skills:</strong> ${missingSkills.length ? missingSkills.join(", ") : "None"}</p>
      </div>
      <div>
        <h3>GitHub Reasons</h3>
        <p>${reasonCodes.length ? reasonCodes.join(", ") : "No reason codes"}</p>
      </div>
    </div>
    <h3>Verification Flags</h3>
    ${
      flags.length
        ? `<ul>${flags
            .map(
              (flag) =>
                `<li><strong>${flag.code}</strong> (${flag.severity || "unknown"}) - ${flag.message || "No description"}</li>`
            )
            .join("")}</ul>`
        : "<p>No flags for this candidate.</p>"
    }
  `;
}

function renderRankings(items, meta) {
  state.items = items;

  rankingsBody.innerHTML = "";

  if (!items.length) {
    rankingsBody.innerHTML = `
      <tr>
        <td colspan="8">No candidates match current filters.</td>
      </tr>
    `;

    tableMeta.textContent = `Showing 0 of ${meta.total || 0} candidates.`;
    renderDetails(null);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    const flagsCount = Array.isArray(item.flags) ? item.flags.length : 0;
    const flagBadgeClass = flagsCount > 0 ? "badge badge-danger" : "badge badge-ok";
    const flagLabel = flagsCount > 0 ? `${flagsCount} flag(s)` : "clear";

    row.innerHTML = `
      <td>${item.rank}</td>
      <td class="code">${getCandidateLabel(item)}</td>
      <td>${formatScore(item.atsScore)}</td>
      <td>${formatScore(item.githubScore)}</td>
      <td><strong>${formatScore(item.finalScore)}</strong></td>
      <td>${formatScore(item.confidenceScore)}</td>
      <td><span class="${flagBadgeClass}">${flagLabel}</span></td>
      <td><button type="button" class="linkish" data-candidate-id="${item.id}">Inspect</button></td>
    `;

    rankingsBody.appendChild(row);
  });

  tableMeta.textContent = `Showing ${items.length} of ${meta.total || items.length} candidates · page ${meta.page || 1}.`;

  if (state.selectedCandidateId) {
    const selected = items.find((item) => String(item.id) === String(state.selectedCandidateId));
    renderDetails(selected || items[0]);
  } else {
    renderDetails(items[0]);
  }
}

async function refreshRankings() {
  const query = getFilterQuery();
  const response = await fetch(`/api/v1/rankings?${query.toString()}`);
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload?.error?.message || "Failed to fetch rankings");
  }

  renderRankings(payload.data.items || [], payload.meta || {});
}

async function uploadAndScore(formData) {
  const uploadResponse = await fetch("/api/v1/upload", {
    method: "POST",
    body: formData,
  });

  const uploadPayload = await uploadResponse.json();

  if (!uploadResponse.ok || !uploadPayload.success) {
    throw new Error(uploadPayload?.error?.message || "Upload failed");
  }

  const candidateId = uploadPayload.data.candidateId;

  const scoreResponse = await fetch("/api/v1/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ candidateId }),
  });

  const scorePayload = await scoreResponse.json();

  if (!scoreResponse.ok || !scorePayload.success) {
    throw new Error(scorePayload?.error?.message || "Scoring failed");
  }

  return {
    upload: uploadPayload.data,
    score: scorePayload.data,
  };
}

candidateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const githubLink = candidateForm.githubLink.value.trim();
  const jobDescription = candidateForm.jobDescription.value.trim();
  const jobId = candidateForm.jobId.value.trim();
  const files = candidateForm.resumes.files;

  if (!githubLink) {
    setStatus("GitHub link/username is required.", true);
    return;
  }

  if (!jobId && jobDescription.length < 30) {
    setStatus("Provide a valid job ID or at least 30 characters of job description.", true);
    return;
  }

  if (!files || files.length === 0) {
    setStatus("Attach at least one resume file.", true);
    return;
  }

  const formData = new FormData();
  formData.append("githubLink", githubLink);

  if (jobDescription) {
    formData.append("jobDescription", jobDescription);
  }

  if (jobId) {
    formData.append("jobId", jobId);
  }

  Array.from(files).forEach((file) => {
    formData.append("resumes", file);
  });

  submitButton.disabled = true;
  setStatus("Uploading resumes and computing scores...");

  try {
    const result = await uploadAndScore(formData);
    state.selectedCandidateId = result.score.candidateId;
    setStatus(
      `Candidate ${result.score.candidateId} scored. Final score ${formatScore(result.score.finalScore)}.`
    );
    await refreshRankings();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});

filtersForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await refreshRankings();
    setStatus("Rankings refreshed.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

rankingsBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (!target.matches("button[data-candidate-id]")) {
    return;
  }

  const candidateId = target.getAttribute("data-candidate-id");
  state.selectedCandidateId = candidateId;

  const selected = state.items.find((item) => String(item.id) === String(candidateId));
  renderDetails(selected || null);
});

refreshRankings().catch(() => {
  tableMeta.textContent = "Unable to load rankings. Start backend and try again.";
});
