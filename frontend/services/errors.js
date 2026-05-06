export function getErrorMessage(error, fallback = "Something went wrong.") {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item?.msg && Array.isArray(item?.loc)) {
          return `${item.loc.join(".")}: ${item.msg}`;
        }

        if (item?.msg) {
          return item.msg;
        }

        return null;
      })
      .filter(Boolean)
      .join(" | ") || fallback;
  }

  if (detail && typeof detail === "object") {
    if (typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }

    return fallback;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
