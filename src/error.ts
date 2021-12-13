export class KasperError {
  public value: string;
  public line: number;
  public col: number;

  constructor(value: string, line: number, col: number) {
    this.line = line;
    this.col = col;
    this.value = value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
