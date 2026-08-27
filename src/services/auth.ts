import API_BASE_URL from "../config/api";

const request = async (
  url: string,
  options: RequestInit = {}
) => {
  const response = await fetch(url, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
};

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    role: string;
  }) =>
    request(
      `${API_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  login: (
    email: string,
    password: string
  ) =>
    request(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      }
    ),

  me: () =>
    request(
      `${API_BASE_URL}/api/auth/me`
    ),

  logout: () =>
    request(
      `${API_BASE_URL}/api/auth/logout`,
      {
        method: "POST",
      }
    ),
};