const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://moneyplusbackend.vercel.app");

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await response.text();
    let payload = {};

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { detail: text };
      }
    }

    if (!response.ok) {
      throw new Error(payload.detail || payload.message || "Something went wrong");
    }

    return payload;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error;
    }

    throw new Error("Unable to reach the server. Please make sure the backend is running.");
  }
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
