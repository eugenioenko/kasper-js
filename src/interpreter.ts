import * as Expr from "./types/expressions";
import { Scanner } from "./scanner";
import { ExpressionParser as Parser } from "./expression-parser";
import { Scope } from "./scope";
import { TokenType } from "./types/token";

export class Interpreter implements Expr.ExprVisitor<any> {
  // The current scope for variable lookup and assignment
  public scope = new Scope();
  // A list to store any runtime errors encountered
  public errors: string[] = [];
  // Scanner for tokenizing template strings
  private scanner = new Scanner();
  // Parser for parsing expressions within template strings
  private parser = new Parser();

  /**
   * Evaluates an expression node by accepting the visitor.
   * Stores the result back into the expression node.
   */
  public evaluate(expr: Expr.Expr): any {
    return (expr.result = expr.accept(this));
  }

  /**
   * Throws a runtime error.
   * @param message The error message.
   */
  public error(message: string): void {
    throw new Error(`Runtime Error => ${message}`);
  }

  /**
   * Visits a variable expression.
   * Example: `myVariable`
   */
  public visitVariableExpr(expr: Expr.Variable): any {
    return this.scope.get(expr.name.lexeme);
  }

  /**
   * Visits an assignment expression.
   * Example: `myVariable = 10`
   */
  public visitAssignExpr(expr: Expr.Assign): any {
    const value = this.evaluate(expr.value);
    this.scope.set(expr.name.lexeme, value);
    return value;
  }

  /**
   * Visits a key expression (typically used for object property names).
   * Example: `{ "myKey": "value" }` (myKey is the KeyExpr)
   */
  public visitKeyExpr(expr: Expr.Key): any {
    return expr.name.literal;
  }

  /**
   * Visits a get expression (property access).
   * Example: `myObject.property` or `myObject?.optionalProperty`
   */
  public visitGetExpr(expr: Expr.Get): any {
    const entity = this.evaluate(expr.entity);
    const key = this.evaluate(expr.key);
    // Handle optional chaining: if entity is null/undefined and it's an optional access (?.), return undefined
    if (!entity && expr.type === TokenType.QuestionDot) {
      return undefined;
    }
    return entity[key];
  }

  /**
   * Visits a set expression (property assignment).
   * Example: `myObject.property = "newValue"`
   */
  public visitSetExpr(expr: Expr.Set): any {
    const entity = this.evaluate(expr.entity);
    const key = this.evaluate(expr.key);
    const value = this.evaluate(expr.value);
    entity[key] = value;
    return value;
  }

  /**
   * Visits a postfix expression (increment/decrement).
   * Example: `x++` or `y--`
   */
  public visitPostfixExpr(expr: Expr.Postfix): any {
    const value = this.scope.get(expr.name.lexeme);
    const newValue = value + expr.increment;
    this.scope.set(expr.name.lexeme, newValue);
    return value;
  }

  /**
   * Visits a list expression (array literal).
   * Example: `[1, "two", true]`
   */
  public visitListExpr(expr: Expr.List): any {
    const values: any[] = [];
    // Evaluate each expression in the list
    for (const expression of expr.value) {
      const value = this.evaluate(expression);
      values.push(value);
    }
    return values;
  }

  /**
   * Parses and evaluates expressions within a template string.
   * This is a helper method for visitTemplateExpr.
   * @param source The content of a template placeholder (e.g., `name` in `Hello {{name}}`).
   */
  private templateParse(source: string): string {
    const tokens = this.scanner.scan(source);
    const expressions = this.parser.parse(tokens);
    if (this.parser.errors.length) {
      this.error(`Template string error: ${this.parser.errors[0]}`);
    }
    let result = "";
    for (const expression of expressions) {
      result += this.evaluate(expression).toString();
    }
    return result;
  }

  /**
   * Visits a template expression (template literal).
   * Example: `"Hello {{name}}! You are {{age}}."`
   */
  public visitTemplateExpr(expr: Expr.Template): any {
    const result = expr.value.replace(
      /\{\{([\s\S]+?)\}\}/g, // Regex to find {{...}}
      (_, placeholder) => {
        // For each placeholder, parse and evaluate its content
        return this.templateParse(placeholder);
      }
    );
    return result;
  }

  /**
   * Visits a binary expression.
   * Examples: `a + b`, `x > y`, `c === d`
   */
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

  /**
   * Visits a logical expression.
   * Example: `a && b`, `x || y`
   */
  public visitLogicalExpr(expr: Expr.Logical): any {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.Or) {
      if (left) {
        return left; // If left is truthy, return left without evaluating right
      }
    } else {
      if (!left) {
        return left; // If left is falsy, return left without evaluating right
      }
    }

    // If not short-circuited, evaluate and return the right side
    return this.evaluate(expr.right);
  }

  /**
   * Visits a ternary conditional expression.
   * Example: `condition ? thenExpr : elseExpr`
   */
  public visitTernaryExpr(expr: Expr.Ternary): any {
    return this.evaluate(expr.condition)
      ? this.evaluate(expr.thenExpr)
      : this.evaluate(expr.elseExpr);
  }

  /**
   * Visits a null coalescing expression.
   * Example: `value ?? defaultValue`
   */
  public visitNullCoalescingExpr(expr: Expr.NullCoalescing): any {
    const left = this.evaluate(expr.left);
    // If the left side is null or undefined, evaluate and return the right side
    if (left === null || left === undefined) {
      return this.evaluate(expr.right);
    }
    // Otherwise, return the left side
    return left;
  }

  /**
   * Visits a grouping expression (parentheses).
   * Example: `(a + b)`
   */
  public visitGroupingExpr(expr: Expr.Grouping): any {
    // Grouping just evaluates the inner expression
    return this.evaluate(expr.expression);
  }

  /**
   * Visits a literal expression.
   * Example: `123`, `"hello"`, `true`, `null`
   */
  public visitLiteralExpr(expr: Expr.Literal): any {
    // Returns the literal value directly (numbers, strings, booleans, null)
    return expr.value;
  }

  /**
   * Visits a unary expression.
   * Example: `-x`, `!y`, `++z` (prefix), `--w` (prefix)
   */
  public visitUnaryExpr(expr: Expr.Unary): any {
    // Evaluate the right-hand side of the unary expression
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.Minus:
        // Negation (e.g., -x)
        return -right;
      case TokenType.Bang:
        // Logical NOT (e.g., !x)
        return !right;
      case TokenType.PlusPlus:
      case TokenType.MinusMinus:
        // Prefix increment/decrement (e.g., ++x or --x)
        // Converts the value to a number before operation
        const newValue =
          Number(right) + (expr.operator.type === TokenType.PlusPlus ? 1 : -1);
        // Update the variable or property if the operand is a valid LValue
        if (expr.right instanceof Expr.Variable) {
          // Update variable in scope
          this.scope.set(expr.right.name.lexeme, newValue);
        } else if (expr.right instanceof Expr.Get) {
          // Update property on object
          // This requires creating a Set expression to perform the assignment
          const assign = new Expr.Set(
            expr.right.entity,
            expr.right.key,
            new Expr.Literal(newValue, expr.line), // Create a literal for the new value
            expr.line
          );
          this.evaluate(assign); // Evaluate the assignment
        } else {
          // Invalid LValue for prefix operation (e.g., ++(a + b))
          this.error(
            `Invalid right-hand side expression in prefix operation: ${expr.right}`
          );
        }
        return newValue; // Return the new value (after increment/decrement)
      default:
        this.error(`Unknown unary operator '${expr.operator.lexeme}'`); // Fixed error message string
        return null; // should be unreachable
    }
  }

  /**
   * Visits a call expression (function or method call).
   * Example: `myFunction(arg1, arg2)`, `myObject.method(arg)`
   */
  public visitCallExpr(expr: Expr.Call): any {
    // Evaluate the callee expression to get the function/method
    const callee = this.evaluate(expr.callee);
    // Ensure the callee is actually a function
    if (typeof callee !== "function") {
      this.error(`${callee} is not a function`);
    }
    // Evaluate all arguments passed to the function
    const args = [];
    for (const argument of expr.args) {
      args.push(this.evaluate(argument));
    }
    // Execute the function/method
    // If it's a method call (e.g., object.method()), we need to set the 'this' context correctly
    if (
      expr.callee instanceof Expr.Get &&
      (expr.callee.entity instanceof Expr.Variable ||
        expr.callee.entity instanceof Expr.Grouping)
    ) {
      // 'this' will be the result of evaluating the entity part of the Get expression
      return callee.apply(expr.callee.entity.result, args);
    } else {
      // Regular function call
      return callee(...args);
    }
  }

  /**
   * Visits a 'new' expression (constructor call).
   * Example: `new MyClass(arg1, arg2)`
   */
  public visitNewExpr(expr: Expr.New): any {
    // The 'clazz' property of a New expression is expected to be a Call expression
    const newCall = expr.clazz as Expr.Call;
    // Evaluate the callee of this Call expression to get the constructor function
    const clazz = this.evaluate(newCall.callee);

    // Ensure the evaluated callee is a function (constructor)
    if (typeof clazz !== "function") {
      this.error(
        `'${clazz}' is not a class. 'new' statement must be used with classes.`
      );
    }

    // Evaluate all arguments passed to the constructor
    const args: any[] = [];
    for (const arg of newCall.args) {
      args.push(this.evaluate(arg));
    }
    // Instantiate the class using the 'new' keyword with the evaluated arguments
    return new clazz(...args);
  }

  /**
   * Visits a dictionary (object literal) expression.
   * Example: `{ key1: "value1", "key2": 123 }`
   */
  public visitDictionaryExpr(expr: Expr.Dictionary): any {
    const dict: any = {};
    // Iterate over each property (key-value pair) in the dictionary literal
    for (const property of expr.properties) {
      const key = this.evaluate((property as Expr.Set).key);
      const value = this.evaluate((property as Expr.Set).value);
      dict[key] = value;
    }
    return dict;
  }

  /**
   * Visits a 'typeof' expression.
   * Example: `typeof myVariable`
   */
  public visitTypeofExpr(expr: Expr.Typeof): any {
    return typeof this.evaluate(expr.value);
  }

  /**
   * Visits an 'each' expression (used for looping constructs, not directly evaluated to a single value here).
   * This visitor likely prepares data for a loop elsewhere in the interpreter/transpiler.
   * Example: `each item in items`, `each value, key in object`
   */
  public visitEachExpr(expr: Expr.Each): any {
    // Returns an array containing the loop variable name(s) and the evaluated iterable
    // This structure is likely consumed by a higher-level construct that implements the loop
    return [
      expr.name.lexeme, // The name of the item variable (e.g., 'item')
      expr.key ? expr.key.lexeme : null, // The name of the key/index variable, if present (e.g., 'key')
      this.evaluate(expr.iterable), // The evaluated iterable (e.g., the 'items' array or 'object')
    ];
  }

  /**
   * Visits a 'void' expression.
   * The void operator evaluates an expression and returns undefined.
   * In this interpreter, it seems to evaluate and return an empty string.
   * Example: `void (myFunction())`
   */
  visitVoidExpr(expr: Expr.Void): any {
    // Evaluate the expression for its side effects
    this.evaluate(expr.value);
    // Return an empty string (could also be undefined as per JavaScript's void operator)
    return "";
  }

  /**
   * Visits a 'debug' expression.
   * This is likely a custom expression for debugging purposes.
   * It evaluates an expression and logs its result to the console.
   * Example: `debug myVariable` or `debug (a + b)`
   */
  visitDebugExpr(expr: Expr.Debug): any {
    // Evaluate the expression to get its value
    const result = this.evaluate(expr.value);
    // Log the result to the console
    console.log(result);
    // Return an empty string (similar to void, result of debug is not typically used)
    return "";
  }
}
