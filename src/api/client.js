const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload.detail || "Something went wrong");
  }

  return payload;
}

export function sendOtp(mobile) {
  return request("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
}

export function verifyOtp(mobile, otp) {
  return request("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ mobile, otp }),
  });
}

export function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getDashboard(mobile) {
  return request(`/api/dashboard/overview?mobile=${encodeURIComponent(mobile)}`);
}
