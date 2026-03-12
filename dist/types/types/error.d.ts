export declare class KasperError extends Error {
    line: number;
    col: number;
    constructor(value: string, line: number, col: number);
}
