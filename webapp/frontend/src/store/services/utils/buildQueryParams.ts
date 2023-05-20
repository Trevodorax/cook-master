export const buildQueryParams = (params: Record<string, any>): string => {
  const queryParams = Object.entries(params)
    .filter(([, value]) => !!value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return queryParams ? "?" + queryParams : "";
};
