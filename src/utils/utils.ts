// Utility function to open a popup window with consistent positioning
export function openPopup(
  url: string,
  name: string,
  width = 520,
  height = 700
) {
  const left = Math.max(
    (window.screenX || 0) + (window.innerWidth - width) / 2,
    0
  );
  const top = Math.max(
    (window.screenY || 0) + (window.innerHeight - height) / 2,
    0
  );

  return window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no`
  );
}

// Simple hex validation function
export function isValidHex(hex: string): boolean {
  if (!hex.trim()) return false;
  // Must be exactly 64 characters (32 bytes in hex)
  if (hex.length !== 64) return false;
  // Must only contain hex characters
  return /^[0-9a-fA-F]{64}$/.test(hex);
}

// Get the Rizful origin, fallback to default if not in env
export function getRizfulOrigin(): string {
  // Try to get from environment variable, fallback to default
  const envOrigin = import.meta.env.VITE_RIZFUL_ORIGIN;
  if (envOrigin) {
    return envOrigin.startsWith("http") ? envOrigin : `https://${envOrigin}`;
  }
  return "https://rizful.com";
}
