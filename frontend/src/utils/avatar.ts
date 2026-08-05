export const getAvatarUrl = (profileImg?: string | null): string | null => {
  if (!profileImg) return null;

  let url = profileImg;

  // Replace internal docker minio container hostname with browser-accessible localhost:9000
  if (url.includes("minio:9000")) {
    url = url.replace(/http:\/\/minio:9000/g, "http://localhost:9000");
  }

  // Extract relative path if local static upload was stored
  const staticIndex = url.indexOf("/static/uploads/");
  if (staticIndex !== -1) {
    url = url.substring(staticIndex);
  }

  if (url.startsWith("http")) {
    return encodeURI(url);
  }

  const cleanPath = url.startsWith("/") ? url : `/${url}`;

  // If running on Vite dev server (port 5173), direct to backend port 8000
  if (typeof window !== "undefined" && window.location.port === "5173") {
    return `http://localhost:8000${cleanPath}`;
  }

  const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
  return encodeURI(`${backendUrl}${cleanPath}`);
};
