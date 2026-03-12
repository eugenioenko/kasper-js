import { TokenType } from "./types/token";
export declare function isDigit(char: string): boolean;
export declare function isAlpha(char: string): boolean;
export declare function isAlphaNumeric(char: string): boolean;
export declare function capitalize(word: string): string;
export declare function isKeyword(word: keyof typeof TokenType): boolean;
