const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function fetchCandidates() {
  const response = await fetch(`${API_BASE_URL}/candidates`);
  return response.json();
}

export async function addCandidate(data) {
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
