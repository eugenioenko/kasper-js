import * as Expr from "./types/expressions";
import { Scanner } from "./scanner";
import { ExpressionParser as Parser } from "./expression-parser";
import { Scope } from "./scope";
import { TokenType } from "./types/token";

export class Interpreter implements Expr.ExprVisitor<any> {
  public scope = new Scope();
  public errors: string[] = [];
  private scanner = new Scanner();
  private parser = new Parser();

  public evaluate(expr: Expr.Expr): any {
    return (expr.result = expr.accept(this));
  }

  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
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
    const value = this.scope.get(expr.name.lexeme);
    const newValue = value + expr.increment;
    this.scope.set(expr.name.lexeme, newValue);
    return value;
  }

  public visitListExpr(expr: Expr.List): any {
    const values: any[] = [];
    for (const expression of expr.value) {
      const value = this.evaluate(expression);
      values.push(value);
    }
    return values;
  }

  private templateParse(source: string): string {
    const tokens = this.scanner.scan(source);
    const expressions = this.parser.parse(tokens);
    if (this.parser.errors.length) {
      this.error(`Template string  error: ${this.parser.errors[0]}`);
    }
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
        return left === right;
      case TokenType.BangEqual:
        return left !== right;
      default:
        this.error("Unknown binary operator " + expr.operator);
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
    return this.evaluate(expr.condition).isTruthy()
      ? this.evaluate(expr.thenExpr)
      : this.evaluate(expr.elseExpr);
  }

  public visitNullCoalescingExpr(expr: Expr.NullCoalescing): any {
    const left = this.evaluate(expr.left);
    if (!left) {
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
      case TokenType.PlusPlus:
      case TokenType.MinusMinus:
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
            `Invalid right-hand side expression in prefix operation:  ${expr.right}`
          );
        }
        return newValue;
      default:
        this.error(`Unknown unary operator ' + expr.operator`);
        return null; // should be unreachable
    }
  }

  public visitCallExpr(expr: Expr.Call): any {
    // verify callee is a function
    const callee = this.evaluate(expr.callee);
    if (typeof callee !== "function") {
      this.error(`${callee} is not a function`);
    }
    // evaluate function arguments
    const args = [];
    for (const argument of expr.args) {
      args.push(this.evaluate(argument));
    }
    // execute function
    return callee(...args);
  }

  public visitNewExpr(expr: Expr.New): any {
    const newCall = expr.clazz as Expr.Call;
    // internal class definition instance
    const clazz = this.evaluate(newCall.callee);

    if (typeof clazz !== "function") {
      this.error(
        `'${clazz}' is not a class. 'new' statement must be used with classes.`
      );
    }

    const args: any[] = [];
    for (const arg of newCall.args) {
      args.push(this.evaluate(arg));
    }
    return new clazz(...args);
  }

  public visitDictionaryExpr(expr: Expr.Dictionary): any {
    const dict = {};
    for (const property of expr.properties) {
      const key = this.evaluate((property as Expr.Set).key);
      const value = this.evaluate((property as Expr.Set).value);
      dict[key] = value;
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
