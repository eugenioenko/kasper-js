export class KasperError {
  public value: string;
  public line: number;
  public col: number;

  constructor(value: string, line: number, col: number) {
    this.value = value;
    this.line = line;
    this.col = col;
  }

  public toString(): string {
    return this.value.toString();
  }
}
