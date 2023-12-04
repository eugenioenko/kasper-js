import { TokenType } from "./types/token";

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
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}

export function isKeyword(word: keyof typeof TokenType): boolean {
  return TokenType[word] >= TokenType.And;
}
