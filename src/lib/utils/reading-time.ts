const WORDS_PER_MINUTE = 200;

export function computeWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function computeReadingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
