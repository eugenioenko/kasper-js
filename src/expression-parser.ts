import { KasperError } from "./types/error";
import * as Expr from "./types/expressions";
import { Token, TokenType } from "./types/token";

export class ExpressionParser {
  // The current index in the tokens array
  private current: number = 0;
  // The list of tokens to parse
  private tokens: Token[] = [];
  // Accumulated parse errors
  public errors: KasperError[] = [];
  // Error reporting level (not currently used for branching)
  public errorLevel = 1;
  // The maximum number of errors before stopping parsing
  private readonly maxErrorCount = 7;

  /**
   * Parses a list of tokens into an array of expressions.
   * On error, attempts to synchronize and continue parsing.
   * @param tokens The tokens to parse
   * @returns Array of parsed expressions
   */
  public parse(tokens: Token[]): Expr.Expr[] {
    this.current = 0;
    this.tokens = tokens;
    this.errors = [];
    const expressions: Expr.Expr[] = [];
    while (!this.eof()) {
      try {
        // Parse a single expression
        expressions.push(this.expression());
      } catch (e) {
        // Catch and record errors, then synchronize to next statement
        if (e instanceof KasperError) {
          this.errors.push(e);
        } else {
          this.errors.push(
            new KasperError(
              `Parse Error  => ${e}`,
              this.peek().line,
              this.peek().col
            )
          );
          if (this.errors.length > this.maxErrorCount) {
            this.errors.push(
              new KasperError(
                `Parse Error limit exceeded, stopping parsing.`,
                this.peek().line,
                this.peek().col
              )
            );
            return expressions;
          }
        }
        this.synchronize();
      }
    }
    return expressions;
  }

  /**
   * Checks if the next token matches any of the given types and advances if so.
   * @param types Token types to match
   */
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * Advances to the next token and returns the previous one.
   * @returns The previous token
   */
  private advance(): Token {
    if (!this.eof()) {
      this.current++;
    }
    return this.previous();
  }

  /**
   * Returns the current token without advancing.
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Returns the previous token.
   */
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  /**
   * Checks if the current token matches the given type.
   * @param type Token type to check
   */
  private check(type: TokenType): boolean {
    // Fix: Prevent out-of-bounds access if at end of tokens
    if (this.current >= this.tokens.length) return false;
    return this.peek().type === type;
  }

  /**
   * Returns true if the current token is EOF.
   */
  private eof(): boolean {
    // Fix: Prevent crash if tokens is empty
    return this.tokens.length === 0 || this.check(TokenType.Eof);
  }

  /**
   * Consumes a token of the given type, or throws an error with the given message.
   * @param type Token type to consume
   * @param message Error message if not found
   */
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    return this.error(
      this.peek(),
      message + `, unexpected token "${this.peek().lexeme}"`
    );
  }

  /**
   * Throws a KasperError for parse errors.
   * @param token The token where the error occurred
   * @param message The error message
   */
  private error(token: Token, message: string): any {
    throw new KasperError(message, token.line, token.col);
  }

  /**
   * Synchronizes the parser after an error by advancing to the next likely statement boundary.
   */
  private synchronize(): void {
    do {
      if (this.check(TokenType.Semicolon) || this.check(TokenType.RightBrace)) {
        this.advance();
        return;
      }
      this.advance();
    } while (!this.eof());
  }

  /**
   * Parses a foreach/each expression. Used for template iteration.
   * @param tokens The tokens to parse
   */
  public foreach(tokens: Token[]): Expr.Expr {
    this.current = 0;
    this.tokens = tokens;
    this.errors = [];

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

  /**
   * Parses an expression, consuming trailing semicolons.
   */
  private expression(): Expr.Expr {
    const expression: Expr.Expr = this.assignment();
    if (this.match(TokenType.Semicolon)) {
      // consume all semicolons
      // tslint:disable-next-line
      while (this.match(TokenType.Semicolon)) {}
    }
    return expression;
  }

  /**
   * Parses assignment expressions, including compound assignments.
   */
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
          // Compound assignment: a += b => a = a + b
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

  /**
   * Parses ternary (?:) expressions.
   */
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

  /**
   * Parses null-coalescing (??) expressions.
   */
  private nullCoalescing(): Expr.Expr {
    const expr = this.logicalOr();
    if (this.match(TokenType.QuestionQuestion)) {
      const rightExpr: Expr.Expr = this.nullCoalescing();
      return new Expr.NullCoalescing(expr, rightExpr, expr.line);
    }
    return expr;
  }

  /**
   * Parses logical OR (||) expressions.
   */
  private logicalOr(): Expr.Expr {
    let expr = this.logicalAnd();
    while (this.match(TokenType.Or)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.logicalAnd();
      expr = new Expr.Logical(expr, operator, right, operator.line);
    }
    return expr;
  }

  /**
   * Parses logical AND (&&) expressions.
   */
  private logicalAnd(): Expr.Expr {
    let expr = this.equality();
    while (this.match(TokenType.And)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.equality();
      expr = new Expr.Logical(expr, operator, right, operator.line);
    }
    return expr;
  }

  /**
   * Parses equality and comparison expressions.
   */
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

  /**
   * Parses addition and subtraction expressions.
   */
  private addition(): Expr.Expr {
    let expr: Expr.Expr = this.modulus();
    while (this.match(TokenType.Minus, TokenType.Plus)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.modulus();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  /**
   * Parses modulus (%) expressions.
   */
  private modulus(): Expr.Expr {
    let expr: Expr.Expr = this.multiplication();
    while (this.match(TokenType.Percent)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.multiplication();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  /**
   * Parses multiplication and division expressions.
   */
  private multiplication(): Expr.Expr {
    let expr: Expr.Expr = this.typeof();
    while (this.match(TokenType.Slash, TokenType.Star)) {
      const operator: Token = this.previous();
      const right: Expr.Expr = this.typeof();
      expr = new Expr.Binary(expr, operator, right, operator.line);
    }
    return expr;
  }

  /**
   * Parses typeof expressions.
   */
  private typeof(): Expr.Expr {
    if (this.match(TokenType.Typeof)) {
      const operator: Token = this.previous();
      const value: Expr.Expr = this.typeof();
      return new Expr.Typeof(value, operator.line);
    }
    return this.unary();
  }

  /**
   * Parses unary expressions (negation, logical not, etc).
   */
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

  /**
   * Parses 'new' keyword expressions.
   */
  private newKeyword(): Expr.Expr {
    if (this.match(TokenType.New)) {
      const keyword = this.previous();
      const construct: Expr.Expr = this.call();
      return new Expr.New(construct, keyword.line);
    }
    return this.call();
  }

  /**
   * Parses function calls, property access, and array indexing.
   * Handles nested calls and chaining.
   */
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

  /**
   * Parses property access via dot or optional chaining.
   */
  private dotGet(expr: Expr.Expr, operator: Token): Expr.Expr {
    const name: Token = this.consume(
      TokenType.Identifier,
      `Expect property name after '.'`
    );
    const key: Expr.Key = new Expr.Key(name, name.line);
    return new Expr.Get(expr, key, operator.type, name.line);
  }

  /**
   * Parses property access via brackets (indexing).
   */
  private bracketGet(expr: Expr.Expr, operator: Token): Expr.Expr {
    let key: Expr.Expr = null;

    if (!this.check(TokenType.RightBracket)) {
      key = this.expression();
    }

    this.consume(TokenType.RightBracket, `Expected "]" after an index`);
    return new Expr.Get(expr, key, operator.type, operator.line);
  }

  /**
   * Parses literals, identifiers, grouping, arrays, objects, and special keywords.
   * Throws if no valid primary expression is found.
   */
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

    // Critical: If no valid primary expression, throw a parse error
    throw this.error(
      this.peek(),
      `Expected expression, unexpected token "${this.peek().lexeme}"`
    );
    // unreachable code
    // return new Expr.Literal(null, 0);
  }

  /**
   * Parses a dictionary/object literal.
   * @returns Expr.Dictionary
   */
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
          // Allow shorthand property: { foo }
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

  /**
   * Parses an array/list literal.
   * @returns Expr.List
   */
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
