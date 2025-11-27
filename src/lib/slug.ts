// Hungarian character mapping for slug generation
const accentMap: Record<string, string> = {
  á: 'a',
  Á: 'a',
  é: 'e',
  É: 'e',
  í: 'i',
  Í: 'i',
  ó: 'o',
  Ó: 'o',
  ö: 'o',
  Ö: 'o',
  ő: 'o',
  Ő: 'o',
  ú: 'u',
  Ú: 'u',
  ü: 'u',
  Ü: 'u',
  ű: 'u',
  Ű: 'u',
};

/**
 * Generates a URL-friendly slug from a string.
 * Properly handles Hungarian accented characters.
 * 
 * @example
 * generateSlug("Füstölt halak") // "fustolt-halak"
 * generateSlug("Érlelt sajtok") // "erlelt-sajtok"
 */
export function generateSlug(name: string): string {
  return name
    .split('')
    .map((char) => accentMap[char] ?? char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
