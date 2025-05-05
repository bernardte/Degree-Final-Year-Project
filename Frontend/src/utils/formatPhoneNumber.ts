export const formatMalaysianPhoneNumber = (input: string): string =>  {
  // Remove non-digit characters except +
  const cleaned = input.replace(/(?!^\+)\D/g, "");

  // Mobile number (starts with 01)
  if (/^(?:\+?60|0)1[0-46-9]\d{7,8}$/.test(cleaned)) {
    const match = cleaned.match(/^(?:\+?60|0)(1[0-46-9])(\d{3})(\d{4,5})$/);
    if (match) {
      const [, prefix, part1, part2] = match;
      return input.startsWith("+60")
        ? `+60 ${prefix}-${part1} ${part2}`
        : `0${prefix}-${part1} ${part2}`;
    }
  }

  // Landline (03, 04, etc.)
  if (/^(?:\+?60|0)[3-9]\d{7,8}$/.test(cleaned)) {
    const match = cleaned.match(/^(?:\+?60|0)([3-9]\d)(\d{3,4})(\d{4})$/);
    if (match) {
      const [, area, part1, part2] = match;
      return input.startsWith("+60")
        ? `+60 ${area}-${part1} ${part2}`
        : `0${area}-${part1} ${part2}`;
    }
  }

  return input; // Return original if format not matched
}
