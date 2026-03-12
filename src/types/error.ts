export class KasperError extends Error {
  public line: number;
  public col: number;

  constructor(value: string, line: number, col: number) {
    super(`Parse Error (${line}:${col}) => ${value}`);
    this.name = "KasperError";
    this.line = line;
    this.col = col;
  }
}
