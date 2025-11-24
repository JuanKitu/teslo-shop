import { levenshteinDistance } from '@/utils';

/**
 * Calcula un score de similitud (0-100)
 * Considera coincidencias parciales de palabras
 */
export function similarityScore(a: string, b: string): number {
  const strA = a.toLowerCase().trim();
  const strB = b.toLowerCase().trim();

  if (strA === strB) return 100;

  const distance = levenshteinDistance(strA, strB);
  const maxLength = Math.max(strA.length, strB.length);

  if (maxLength === 0) return 100;

  return Math.round(((maxLength - distance) / maxLength) * 100);
}

/**
 * Calcula score considerando palabras individuales
 * Útil para queries como "pvllover" que debería matchear "pullover"
 */
export function wordBasedScore(query: string, text: string): number {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const textWords = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (queryWords.length === 0 || textWords.length === 0) return 0;

  // Para cada palabra del query, buscar la mejor coincidencia en text
  const wordScores = queryWords.map((qWord) => {
    const scores = textWords.map((tWord) => similarityScore(qWord, tWord));
    return Math.max(...scores, 0);
  });

  // Promedio de los mejores scores
  return Math.round(wordScores.reduce((sum, s) => sum + s, 0) / wordScores.length);
}

/**
 * Verifica si un string es similar a otro
 */
export function isSimilar(a: string, b: string, threshold: number = 70): boolean {
  return similarityScore(a, b) >= threshold;
}

/**
 * Encuentra la mejor coincidencia en un array
 */
export function findBestMatch(
  query: string,
  options: string[],
  minScore: number = 60
): { match: string; score: number; index: number } | null {
  if (options.length === 0) return null;

  let bestMatch = options[0];
  let bestScore = wordBasedScore(query, options[0]); // ✅ Usar word-based
  let bestIndex = 0;

  for (let i = 1; i < options.length; i++) {
    const score = wordBasedScore(query, options[i]);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = options[i];
      bestIndex = i;
    }
  }

  if (bestScore < minScore) return null;

  return { match: bestMatch, score: bestScore, index: bestIndex };
}

/**
 * Filtra y ordena resultados por similitud
 */
export function fuzzyFilter<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string,
  threshold: number = 60
): Array<T & { fuzzyScore: number }> {
  const normalizedQuery = query.toLowerCase().trim();

  return items
    .map((item) => {
      const searchText = getSearchText(item).toLowerCase().trim();

      // ✅ Usar word-based score
      let score = wordBasedScore(normalizedQuery, searchText);

      // Boost para coincidencias exactas
      if (searchText.includes(normalizedQuery)) {
        score = Math.min(100, score + 15);
      }

      // Boost para coincidencias al inicio
      if (searchText.startsWith(normalizedQuery)) {
        score = Math.min(100, score + 25);
      }

      return {
        ...item,
        fuzzyScore: score,
      };
    })
    .filter((item) => item.fuzzyScore >= threshold)
    .sort((a, b) => b.fuzzyScore - a.fuzzyScore);
}

/**
 * Busca coincidencias parciales
 */
export function fuzzyMatch(query: string, text: string, threshold: number = 70): boolean {
  return wordBasedScore(query, text) >= threshold;
}

/**
 * Extrae y rankea sugerencias
 */
export function getSuggestions(
  query: string,
  corpus: string[],
  maxSuggestions: number = 3,
  minScore: number = 60
): Array<{ text: string; score: number }> {
  return corpus
    .map((text) => ({
      text,
      score: wordBasedScore(query, text), // ✅ Usar word-based
    }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);
}
