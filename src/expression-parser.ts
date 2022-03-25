import { KasperError } from "./types/error";
import * as Expr from "./types/expressions";
import { Token, TokenType } from "./types/token";

export class ExpressionParser {
  private current: number;
  private tokens: Token[];
  public errors: string[];
  public errorLevel = 1;

  public parse(tokens: Token[]): Expr.Expr[] {
    this.current = 0;
    this.tokens = tokens;
    this.errors = [];
    const expressions: Expr.Expr[] = [];
    while (!this.eof()) {
      try {
        expressions.push(this.expression());
      } catch (e) {
        if (e instanceof KasperError) {
          this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
        } else {
          this.errors.push(`${e}`);
          if (this.errors.length > 100) {
            this.errors.push("Parse Error limit exceeded");
            return expressions;
          }
        }
        this.synchronize();
      }
    }
    return expressions;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private advance(): Token {
    if (!this.eof()) {
      this.current++;
    }
    return this.previous();
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private eof(): boolean {
    return this.check(TokenType.Eof);
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    return this.error(
      this.peek(),
      message + `, unexpected token "${this.peek().lexeme}"`
    );
  }

  private error(token: Token, message: string): any {
    throw new KasperError(message, token.line, token.col);
  }

  private synchronize(): void {
    do {
      if (this.check(TokenType.Semicolon) || this.check(TokenType.RightBrace)) {
        this.advance();
        return;
      }
      this.advance();
    } while (!this.eof());
  }

  public foreach(tokens: Token[]): Expr.Expr {
    this.current = 0;
    this.tokens = tokens;
    this.errors = [];

    this.consume(
      TokenType.Const,
      `Expected const definition starting "each" statement`
    );

    const name = this.consume(
      TokenType.Identifier,
      `Expected an identifier inside "each" statement`
    );

    let key: Token = null;
    if (this.match(TokenType.With)) {
      key = this.consume(
        TokenType.Identifier,
        `Expected a "key" identifier after "with" keyword in foreach statement`
      );
    }

    this.consume(
      TokenType.Of,
      `Expected "of" keyword inside foreach statement`
    );
    const iterable = this.expression();

    return new Expr.Each(name, key, iterable, name.line);
  }

  private expression(): Expr.Expr {
    const expression: Expr.Expr = this.assignment();
    if (this.match(TokenType.Semicolon)) {
      // consume all semicolons
      // tslint:disable-next-line
      while (this.match(TokenType.Semicolon)) {}
    }
    return expression;
  }

  private assignment(): Expr.Expr {
    const expr: Expr.Expr = this.ternary();
    if (
      this.match(
        TokenType.Equal,
        TokenType.PlusEqual,
        TokenType.MinusEqual,
        TokenType.StarEqual,
        TokenType.SlashEqual
      )
    ) {
      const operator: Token = this.previous();
      let value: Expr.Expr = this.assignment();
      if (expr instanceof Expr.Variable) {
        const name: Token = expr.name;
        if (operator.type !== TokenType.Equal) {
          value = new Expr.Binary(
            new Expr.Variable(name, name.line),
            operator,
            value,
            operator.line
          );
        }
        return new Expr.Assign(name, value, name.line);
      } else if (expr instanceof Expr.Get) {
        if (operator.type !== TokenType.Equal) {
          value = new Expr.Binary(
            new Expr.Get(expr.entity, expr.key, expr.type, expr.line),
            operator,
            value,
            operator.line
          );
        }
        return new Expr.Set(expr.entity, expr.key, value, expr.line);
      }
      this.error(operator, `Invalid l-value, is not an assigning target.`);
    }
    return expr;
  }

  private ternary(): Expr.Expr {
    const expr = this.nullCoalescing();
    if (this.match(TokenType.Question)) {
      const thenExpr: Expr.Expr = this.ternary();
      this.consume(TokenType.Colon, `Expected ":" after ternary ? expression`);
      const elseExpr: Expr.Expr = this.ternary();
      return new Expr.Ternary(expr, thenExpr, elseExpr, expr.line);
    }
    return expr;
  }

  private nullCoalescing(): Expr.Expr {
    const expr = this.logicalOr();
    if (this.match(TokenType.QuestionQuestion)) {
      const rightExpr: Expr.Expr = this.nullCoalescing();
      return new Expr.NullCoalescing(expr, rightExpr, expr.line);
    }
    return expr;
  }

  private logicalOr(): Expr.Expr {
    let expr = this.logicalAnd();
    while (this.match(TokenType.Or)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.logicalAnd();
      expr = new Expr.Logical(expr, operator, right, operator.line);
    }
    return expr;
  }

  private logicalAnd(): Expr.Expr {
    let expr = this.equality();
    while (this.match(TokenType.And)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.equality();
      expr = new Expr.Logical(expr, operator, right, operator.line);
    }
    return expr;
  }

  private equality(): Expr.Expr {
    let expr: Expr.Expr = this.addition();
    while (
      this.match(
        TokenType.BangEqual,
        TokenType.EqualEqual,
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual
      )
    ) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.addition();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  private addition(): Expr.Expr {
    let expr: Expr.Expr = this.modulus();
    while (this.match(TokenType.Minus, TokenType.Plus)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.modulus();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  private modulus(): Expr.Expr {
    let expr: Expr.Expr = this.multiplication();
    while (this.match(TokenType.Percent)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.multiplication();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  private multiplication(): Expr.Expr {
    let expr: Expr.Expr = this.typeof();
    while (this.match(TokenType.Slash, TokenType.Star)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.typeof();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  private typeof(): Expr.Expr {
    if (this.match(TokenType.Typeof)) {
      const operator: Token = this.previous();
      const value: Expr.Expr = this.typeof();
      return new Expr.Typeof(value, operator.line);
    }
    return this.unary();
  }

  private unary(): Expr.Expr {
    if (
      this.match(
        TokenType.Minus,
        TokenType.Bang,
        TokenType.Dollar,
        TokenType.PlusPlus,
        TokenType.MinusMinus
      )
    ) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.unary();
      return new Expr.Unary(operator, right, operator.line);
    }
    return this.newKeyword();
  }

  private newKeyword(): Expr.Expr {
    if (this.match(TokenType.New)) {
      const keyword = this.previous();
      const construct: Expr.Expr = this.call();
      return new Expr.New(construct, keyword.line);
    }
    return this.call();
  }

  private call(): Expr.Expr {
    let expr: Expr.Expr = this.primary();
    let consumed = true;
    do {
      consumed = false;
      if (this.match(TokenType.LeftParen)) {
        consumed = true;
        do {
          const args: Expr.Expr[] = [];
          if (!this.check(TokenType.RightParen)) {
            do {
              args.push(this.expression());
            } while (this.match(TokenType.Comma));
          }
          const paren: Token = this.consume(
            TokenType.RightParen,
            `Expected ")" after arguments`
          );
          expr = new Expr.Call(expr, paren, args, paren.line);
        } while (this.match(TokenType.LeftParen));
      }
      if (this.match(TokenType.Dot, TokenType.QuestionDot)) {
        consumed = true;
        expr = this.dotGet(expr, this.previous());
      }
      if (this.match(TokenType.LeftBracket)) {
        consumed = true;
        expr = this.bracketGet(expr, this.previous());
      }
    } while (consumed);
    return expr;
  }

  private dotGet(expr: Expr.Expr, operator: Token): Expr.Expr {
    const name: Token = this.consume(
      TokenType.Identifier,
      `Expect property name after '.'`
    );
    const key: Expr.Key = new Expr.Key(name, name.line);
    return new Expr.Get(expr, key, operator.type, name.line);
  }

  private bracketGet(expr: Expr.Expr, operator: Token): Expr.Expr {
    let key: Expr.Expr = null;

    if (!this.check(TokenType.RightBracket)) {
      key = this.expression();
    }

    this.consume(TokenType.RightBracket, `Expected "]" after an index`);
    return new Expr.Get(expr, key, operator.type, operator.line);
  }

  private primary(): Expr.Expr {
    if (this.match(TokenType.False)) {
      return new Expr.Literal(false, this.previous().line);
    }
    if (this.match(TokenType.True)) {
      return new Expr.Literal(true, this.previous().line);
    }
    if (this.match(TokenType.Null)) {
      return new Expr.Literal(null, this.previous().line);
    }
    if (this.match(TokenType.Undefined)) {
      return new Expr.Literal(undefined, this.previous().line);
    }
    if (this.match(TokenType.Number) || this.match(TokenType.String)) {
      return new Expr.Literal(this.previous().literal, this.previous().line);
    }
    if (this.match(TokenType.Template)) {
      return new Expr.Template(this.previous().literal, this.previous().line);
    }
    if (this.match(TokenType.Identifier)) {
      const identifier = this.previous();
      if (this.match(TokenType.PlusPlus)) {
        return new Expr.Postfix(identifier, 1, identifier.line);
      }
      if (this.match(TokenType.MinusMinus)) {
        return new Expr.Postfix(identifier, -1, identifier.line);
      }
      return new Expr.Variable(identifier, identifier.line);
    }
    if (this.match(TokenType.LeftParen)) {
      const expr: Expr.Expr = this.expression();
      this.consume(TokenType.RightParen, `Expected ")" after expression`);
      return new Expr.Grouping(expr, expr.line);
    }
    if (this.match(TokenType.LeftBrace)) {
      return this.dictionary();
    }
    if (this.match(TokenType.LeftBracket)) {
      return this.list();
    }
    if (this.match(TokenType.Void)) {
      const expr: Expr.Expr = this.expression();
      return new Expr.Void(expr, this.previous().line);
    }
    if (this.match(TokenType.Debug)) {
      const expr: Expr.Expr = this.expression();
      return new Expr.Debug(expr, this.previous().line);
    }

    throw this.error(
      this.peek(),
      `Expected expression, unexpected token "${this.peek().lexeme}"`
    );
    // unreacheable code
    return new Expr.Literal(null, 0);
  }

  public dictionary(): Expr.Expr {
    const leftBrace = this.previous();
    if (this.match(TokenType.RightBrace)) {
      return new Expr.Dictionary([], this.previous().line);
    }
    const properties: Expr.Expr[] = [];
    do {
      if (
        this.match(TokenType.String, TokenType.Identifier, TokenType.Number)
      ) {
        const key: Token = this.previous();
        if (this.match(TokenType.Colon)) {
          const value = this.expression();
          properties.push(
            new Expr.Set(null, new Expr.Key(key, key.line), value, key.line)
          );
        } else {
          const value = new Expr.Variable(key, key.line);
          properties.push(
            new Expr.Set(null, new Expr.Key(key, key.line), value, key.line)
          );
        }
      } else {
        this.error(
          this.peek(),
          `String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${
            this.peek().lexeme
          }`
        );
      }
    } while (this.match(TokenType.Comma));
    this.consume(TokenType.RightBrace, `Expected "}" after object literal`);

    return new Expr.Dictionary(properties, leftBrace.line);
  }

  private list(): Expr.Expr {
    const values: Expr.Expr[] = [];
    const leftBracket = this.previous();

    if (this.match(TokenType.RightBracket)) {
      return new Expr.List([], this.previous().line);
    }
    do {
      values.push(this.expression());
    } while (this.match(TokenType.Comma));

    this.consume(
      TokenType.RightBracket,
      `Expected "]" after array declaration`
    );
    return new Expr.List(values, leftBracket.line);
  }
}
