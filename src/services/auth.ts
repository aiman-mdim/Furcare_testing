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
      data.error || "Something went wrong"
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
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (
    email: string,
    password: string
  ) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  me: () =>
    request("/api/auth/me"),

  logout: () =>
    request("/api/auth/logout", {
      method: "POST",
    }),
};
