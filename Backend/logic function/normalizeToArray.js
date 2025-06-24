export function normalizeToArray(file) {
  return Array.isArray(file) ? file : file ? [file] : [];
}
