export const fetchInternalApi = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, {
    ...init,
    credentials: "include",
  });
