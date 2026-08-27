import * as Expr from "./types/expressions";
import { Scanner } from "./scanner";
import { ExpressionParser as Parser } from "./expression-parser";
import { Scope } from "./scope";
import { TokenType } from "./types/token";
import { KasperError, KErrorCode, KErrorCodeType } from "./types/error";

export class Interpreter implements Expr.ExprVisitor<any> {
  public scope = new Scope();
  private scanner = new Scanner();
  private parser = new Parser();

  public evaluate(expr: Expr.Expr): any {
    return (expr.result = expr.accept(this));
  }

  public visitPipelineExpr(expr: Expr.Pipeline): any {
    const value = this.evaluate(expr.left);

    if (expr.right instanceof Expr.Call) {
      const callee = this.evaluate(expr.right.callee);
      const args = [value];
      for (const arg of expr.right.args) {
        if (arg instanceof Expr.Spread) {
          args.push(...this.evaluate((arg as Expr.Spread).value));
        } else {
          args.push(this.evaluate(arg));
        }
      }
      if (expr.right.callee instanceof Expr.Get) {
        return callee.apply(expr.right.callee.entity.result, args);
      }
      return callee(...args);
    }

    const fn = this.evaluate(expr.right);
    return fn(value);
  }

  public visitArrowFunctionExpr(expr: Expr.ArrowFunction): any {
    const capturedScope = this.scope;
    return (...args: any[]) => {
      const prev = this.scope;
      this.scope = new Scope(capturedScope);
      for (let i = 0; i < expr.params.length; i++) {
        this.scope.set(expr.params[i].lexeme, args[i]);
      }
      try {
        return this.evaluate(expr.body);
      } finally {
        this.scope = prev;
      }
    };
  }

  public error(code: KErrorCodeType, args: any = {}, line?: number, col?: number): void {
    throw new KasperError(code, args, { line, col });
  }

  public visitVariableExpr(expr: Expr.Variable): any {
    return this.scope.get(expr.name.lexeme);
  }

  public visitAssignExpr(expr: Expr.Assign): any {
    const value = this.evaluate(expr.value);
    this.scope.set(expr.name.lexeme, value);
    return value;
  }

  public visitKeyExpr(expr: Expr.Key): any {
    return expr.name.literal;
  }

  public visitGetExpr(expr: Expr.Get): any {
    const entity = this.evaluate(expr.entity);
    const key = this.evaluate(expr.key);
    if (!entity && expr.type === TokenType.QuestionDot) {
      return undefined;
    }
    return entity[key];
  }

  public visitSetExpr(expr: Expr.Set): any {
    const entity = this.evaluate(expr.entity);
    const key = this.evaluate(expr.key);
    const value = this.evaluate(expr.value);
    entity[key] = value;
    return value;
  }

  public visitPostfixExpr(expr: Expr.Postfix): any {
    const value = this.evaluate(expr.entity);
    const newValue = value + expr.increment;

    if (expr.entity instanceof Expr.Variable) {
      this.scope.set(expr.entity.name.lexeme, newValue);
    } else if (expr.entity instanceof Expr.Get) {
      const assign = new Expr.Set(
        expr.entity.entity,
        expr.entity.key,
        new Expr.Literal(newValue, expr.line),
        expr.line
      );
      this.evaluate(assign);
    } else {
      this.error(KErrorCode.INVALID_POSTFIX_LVALUE, { entity: expr.entity }, expr.line);
    }

    return value;
  }

  public visitListExpr(expr: Expr.List): any {
    const values: any[] = [];
    for (const expression of expr.value) {
      if (expression instanceof Expr.Spread) {
        values.push(...this.evaluate((expression as Expr.Spread).value));
      } else {
        values.push(this.evaluate(expression));
      }
    }
    return values;
  }

  public visitSpreadExpr(expr: Expr.Spread): any {
    return this.evaluate(expr.value);
  }

  private templateParse(source: string): string {
    const tokens = this.scanner.scan(source);
    const expressions = this.parser.parse(tokens, source);
    let result = "";
    for (const expression of expressions) {
      result += this.evaluate(expression).toString();
    }
    return result;
  }

  public visitTemplateExpr(expr: Expr.Template): any {
    const result = expr.value.replace(
      /\{\{([\s\S]+?)\}\}/g,
      (m, placeholder) => {
        return this.templateParse(placeholder);
      }
    );
    return result;
  }

  public visitBinaryExpr(expr: Expr.Binary): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.Minus:
      case TokenType.MinusEqual:
        return left - right;
      case TokenType.Slash:
      case TokenType.SlashEqual:
        return left / right;
      case TokenType.Star:
      case TokenType.StarEqual:
        return left * right;
      case TokenType.Percent:
      case TokenType.PercentEqual:
        return left % right;
      case TokenType.Plus:
      case TokenType.PlusEqual:
        return left + right;
      case TokenType.Pipe:
        return left | right;
      case TokenType.Caret:
        return left ^ right;
      case TokenType.Greater:
        return left > right;
      case TokenType.GreaterEqual:
        return left >= right;
      case TokenType.Less:
        return left < right;
      case TokenType.LessEqual:
        return left <= right;
      case TokenType.EqualEqual:
      case TokenType.EqualEqualEqual:
        return left === right;
      case TokenType.BangEqual:
      case TokenType.BangEqualEqual:
        return left !== right;
      case TokenType.Instanceof:
        return left instanceof right;
      case TokenType.In:
        return left in right;
      case TokenType.LeftShift:
        return left << right;
      case TokenType.RightShift:
        return left >> right;
      default:
        this.error(KErrorCode.UNKNOWN_BINARY_OPERATOR, { operator: expr.operator }, expr.line);
        return null; // unreachable
    }
  }

  public visitLogicalExpr(expr: Expr.Logical): any {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.Or) {
      if (left) {
        return left;
      }
    } else {
      if (!left) {
        return left;
      }
    }

    return this.evaluate(expr.right);
  }

  public visitTernaryExpr(expr: Expr.Ternary): any {
    return this.evaluate(expr.condition)
      ? this.evaluate(expr.thenExpr)
      : this.evaluate(expr.elseExpr);
  }

  public visitNullCoalescingExpr(expr: Expr.NullCoalescing): any {
    const left = this.evaluate(expr.left);
    if (left == null) {
      return this.evaluate(expr.right);
    }
    return left;
  }

  public visitGroupingExpr(expr: Expr.Grouping): any {
    return this.evaluate(expr.expression);
  }

  public visitLiteralExpr(expr: Expr.Literal): any {
    return expr.value;
  }

  public visitUnaryExpr(expr: Expr.Unary): any {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.Minus:
        return -right;
      case TokenType.Bang:
        return !right;
      case TokenType.Tilde:
        return ~right;
      case TokenType.PlusPlus:
      case TokenType.MinusMinus: {
        const newValue =
          Number(right) + (expr.operator.type === TokenType.PlusPlus ? 1 : -1);
        if (expr.right instanceof Expr.Variable) {
          this.scope.set(expr.right.name.lexeme, newValue);
        } else if (expr.right instanceof Expr.Get) {
          const assign = new Expr.Set(
            expr.right.entity,
            expr.right.key,
            new Expr.Literal(newValue, expr.line),
            expr.line
          );
          this.evaluate(assign);
        } else {
          this.error(
            KErrorCode.INVALID_PREFIX_RVALUE,
            { right: expr.right },
            expr.line
          );
        }
        return newValue;
      }
      default:
        this.error(KErrorCode.UNKNOWN_UNARY_OPERATOR, { operator: expr.operator }, expr.line);
        return null; // should be unreachable
    }
  }

  public visitCallExpr(expr: Expr.Call): any {
    // verify callee is a function
    const callee = this.evaluate(expr.callee);
    if (callee == null && expr.optional) return undefined;
    if (typeof callee !== "function") {
      this.error(KErrorCode.NOT_A_FUNCTION, { callee: callee }, expr.line);
    }
    // evaluate function arguments
    const args = [];
    for (const argument of expr.args) {
      if (argument instanceof Expr.Spread) {
        args.push(...this.evaluate((argument as Expr.Spread).value));
      } else {
        args.push(this.evaluate(argument));
      }
    }
    // execute function — preserve `this` for method calls
    if (expr.callee instanceof Expr.Get) {
      return callee.apply(expr.callee.entity.result, args);
    } else {
      return callee(...args);
    }
  }

  public visitNewExpr(expr: Expr.New): any {
    const clazz = this.evaluate(expr.clazz);

    if (typeof clazz !== "function") {
      this.error(
        KErrorCode.NOT_A_CLASS,
        { clazz: clazz },
        expr.line
      );
    }

    const args: any[] = [];
    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }
    return new clazz(...args);
  }

  public visitDictionaryExpr(expr: Expr.Dictionary): any {
    const dict: any = {};
    for (const property of expr.properties) {
      if (property instanceof Expr.Spread) {
        Object.assign(dict, this.evaluate((property as Expr.Spread).value));
      } else {
        const key = this.evaluate((property as Expr.Set).key);
        const value = this.evaluate((property as Expr.Set).value);
        dict[key] = value;
      }
    }
    return dict;
  }

  public visitTypeofExpr(expr: Expr.Typeof): any {
    return typeof this.evaluate(expr.value);
  }

  public visitEachExpr(expr: Expr.Each): any {
    return [
      expr.name.lexeme,
      expr.key ? expr.key.lexeme : null,
      this.evaluate(expr.iterable),
    ];
  }

  visitVoidExpr(expr: Expr.Void): any {
    this.evaluate(expr.value);
    return "";
  }

  visitDebugExpr(expr: Expr.Void): any {
    const result = this.evaluate(expr.value);
    console.log(result);
    return "";
  }
}
