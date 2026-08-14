export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (text.trim().startsWith("<")) {
      throw new Error(`Server API endpoint unavailable (${res.status} ${res.statusText}).`);
    }
    throw new Error(`Expected JSON response but received non-JSON format.`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}
