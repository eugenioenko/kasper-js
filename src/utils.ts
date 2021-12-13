export function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

export function isAlpha(char: string): boolean {
  return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}

export function isAlphaNumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

export const WhiteSpaces = [" ", "\n", "\t", "\r"] as const;

export const SelfClosingTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];
