/**
 * Extracts a numeric floating-point price from a string (e.g. "$29.99" -> 29.99 or "Item total: $29.99" -> 29.99)
 */
export function extractPrice(text: string): number {
  const match = text.match(/\$?(\d+\.\d{2})/);
  if (!match) {
    throw new Error(`Unable to extract price from string: "${text}"`);
  }
  return parseFloat(match[1]);
}

/**
 * Rounds a number to two decimal places for accurate financial assertions
 */
export function roundToTwoDecimals(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}
