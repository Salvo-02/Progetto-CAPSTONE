const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const safeJson = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const apiFetch = async (url, options = {}) => {
  const hasBody = options.body !== undefined && options.body !== null;

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status} ${res.statusText}`);
  }

  return data;
};
