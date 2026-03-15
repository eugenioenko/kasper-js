// @vitest-environment node
import { ExpressionParser } from "../src/expression-parser";
import { Scanner } from "../src/scanner";
import * as Expr from "../src/types/expressions";
import { TokenType } from "../src/types/token";

function tokens(source: string) {
  return new Scanner().scan(source);
}

function parseOne(source: string): Expr.Expr {
  return new ExpressionParser().parse(tokens(source))[0];
}

function parseAll(source: string): Expr.Expr[] {
  return new ExpressionParser().parse(tokens(source));
}


function foreachExpr(source: string): Expr.Each {
  const parser = new ExpressionParser();
  return parser.foreach(tokens(source)) as Expr.Each;
}

describe("ExpressionParser", () => {
  describe("literals", () => {
    it("false → Literal(false)", () => {
      const expr = parseOne("false") as Expr.Literal;
      expect(expr).toBeInstanceOf(Expr.Literal);
      expect(expr.value).toBe(false);
    });

    it("true → Literal(true)", () => {
      const expr = parseOne("true") as Expr.Literal;
      expect(expr).toBeInstanceOf(Expr.Literal);
      expect(expr.value).toBe(true);
    });

    it("null → Literal(null)", () => {
      const expr = parseOne("null") as Expr.Literal;
      expect(expr).toBeInstanceOf(Expr.Literal);
      expect(expr.value).toBeNull();
    });

    it("undefined → Literal(undefined)", () => {
      const expr = parseOne("undefined") as Expr.Literal;
      expect(expr).toBeInstanceOf(Expr.Literal);
      expect(expr.value).toBeUndefined();
    });

    it("number → Literal(number)", () => {
      const expr = parseOne("42") as Expr.Literal;
      expect(expr).toBeInstanceOf(Expr.Literal);
      expect(expr.value).toBe(42);
    });

    it("string → Literal(string)", () => {
      const expr = parseOne(`"hello"`) as Expr.Literal;
      expect(expr).toBeInstanceOf(Expr.Literal);
      expect(expr.value).toBe("hello");
    });

    it("template string → Template", () => {
      const expr = parseOne("`hello`") as Expr.Template;
      expect(expr).toBeInstanceOf(Expr.Template);
      expect(expr.value).toBe("hello");
    });
  });

  describe("variable", () => {
    it("identifier → Variable", () => {
      const expr = parseOne("foo") as Expr.Variable;
      expect(expr).toBeInstanceOf(Expr.Variable);
      expect(expr.name.lexeme).toBe("foo");
    });
  });

  describe("postfix operators", () => {
    it("x++ → Postfix with increment +1", () => {
      const expr = parseOne("x++") as Expr.Postfix;
      expect(expr).toBeInstanceOf(Expr.Postfix);
      expect(expr.increment).toBe(1);
      expect((expr.entity as Expr.Variable).name.lexeme).toBe("x");
    });

    it("x-- → Postfix with increment -1", () => {
      const expr = parseOne("x--") as Expr.Postfix;
      expect(expr).toBeInstanceOf(Expr.Postfix);
      expect(expr.increment).toBe(-1);
    });
  });

  describe("unary operators", () => {
    it("-x → Unary(Minus)", () => {
      const expr = parseOne("-x") as Expr.Unary;
      expect(expr).toBeInstanceOf(Expr.Unary);
      expect(expr.operator.type).toBe(TokenType.Minus);
    });

    it("!x → Unary(Bang)", () => {
      const expr = parseOne("!x") as Expr.Unary;
      expect(expr).toBeInstanceOf(Expr.Unary);
      expect(expr.operator.type).toBe(TokenType.Bang);
    });

    it("++x → Unary(PlusPlus)", () => {
      const expr = parseOne("++x") as Expr.Unary;
      expect(expr).toBeInstanceOf(Expr.Unary);
      expect(expr.operator.type).toBe(TokenType.PlusPlus);
    });

    it("--x → Unary(MinusMinus)", () => {
      const expr = parseOne("--x") as Expr.Unary;
      expect(expr).toBeInstanceOf(Expr.Unary);
      expect(expr.operator.type).toBe(TokenType.MinusMinus);
    });

    it("unary right-hand side is parsed", () => {
      const expr = parseOne("-x") as Expr.Unary;
      expect(expr.right).toBeInstanceOf(Expr.Variable);
    });
  });

  describe("postfix operators", () => {
    it("x++ → Postfix(1)", () => {
      const expr = parseOne("x++") as Expr.Postfix;
      expect(expr).toBeInstanceOf(Expr.Postfix);
      expect(expr.increment).toBe(1);
      expect(expr.entity).toBeInstanceOf(Expr.Variable);
    });

    it("x-- → Postfix(-1)", () => {
      const expr = parseOne("x--") as Expr.Postfix;
      expect(expr).toBeInstanceOf(Expr.Postfix);
      expect(expr.increment).toBe(-1);
      expect(expr.entity).toBeInstanceOf(Expr.Variable);
    });

    it("obj.prop++ → Postfix(1) on Get", () => {
      const expr = parseOne("obj.prop++") as Expr.Postfix;
      expect(expr).toBeInstanceOf(Expr.Postfix);
      expect(expr.increment).toBe(1);
      expect(expr.entity).toBeInstanceOf(Expr.Get);
    });

    it("arr[0]-- → Postfix(-1) on Get", () => {
      const expr = parseOne("arr[0]--") as Expr.Postfix;
      expect(expr).toBeInstanceOf(Expr.Postfix);
      expect(expr.increment).toBe(-1);
      expect(expr.entity).toBeInstanceOf(Expr.Get);
    });
  });

  describe("binary operators", () => {
    const cases: [string, TokenType][] = [
      ["a + b", TokenType.Plus],
      ["a - b", TokenType.Minus],
      ["a * b", TokenType.Star],
      ["a / b", TokenType.Slash],
      ["a % b", TokenType.Percent],
      ["a == b", TokenType.EqualEqual],
      ["a != b", TokenType.BangEqual],
      ["a < b", TokenType.Less],
      ["a > b", TokenType.Greater],
      ["a <= b", TokenType.LessEqual],
      ["a >= b", TokenType.GreaterEqual],
    ];

    for (const [source, op] of cases) {
      it(`'${source}' → Binary(${TokenType[op]})`, () => {
        const expr = parseOne(source) as Expr.Binary;
        expect(expr).toBeInstanceOf(Expr.Binary);
        expect(expr.operator.type).toBe(op);
      });
    }

    it("binary has left and right operands", () => {
      const expr = parseOne("a + b") as Expr.Binary;
      expect(expr.left).toBeInstanceOf(Expr.Variable);
      expect(expr.right).toBeInstanceOf(Expr.Variable);
    });

    it("operator precedence: * before +", () => {
      // a + b * c → Binary(+, a, Binary(*, b, c))
      const expr = parseOne("a + b * c") as Expr.Binary;
      expect(expr.operator.type).toBe(TokenType.Plus);
      expect(expr.right).toBeInstanceOf(Expr.Binary);
      expect((expr.right as Expr.Binary).operator.type).toBe(TokenType.Star);
    });

    it("operator precedence: + before ==", () => {
      // a == b + c → Binary(==, a, Binary(+, b, c))
      const expr = parseOne("a == b + c") as Expr.Binary;
      expect(expr.operator.type).toBe(TokenType.EqualEqual);
      expect(expr.right).toBeInstanceOf(Expr.Binary);
    });
  });

  describe("logical operators", () => {
    it("a && b → Logical(And)", () => {
      const expr = parseOne("a && b") as Expr.Logical;
      expect(expr).toBeInstanceOf(Expr.Logical);
      expect(expr.operator.type).toBe(TokenType.And);
    });

    it("a || b → Logical(Or)", () => {
      const expr = parseOne("a || b") as Expr.Logical;
      expect(expr).toBeInstanceOf(Expr.Logical);
      expect(expr.operator.type).toBe(TokenType.Or);
    });

    it("logical has left and right", () => {
      const expr = parseOne("a && b") as Expr.Logical;
      expect(expr.left).toBeInstanceOf(Expr.Variable);
      expect(expr.right).toBeInstanceOf(Expr.Variable);
    });

    it("&& has higher precedence than ||", () => {
      // a || b && c → Logical(||, a, Logical(&&, b, c))
      const expr = parseOne("a || b && c") as Expr.Logical;
      expect(expr.operator.type).toBe(TokenType.Or);
      expect(expr.right).toBeInstanceOf(Expr.Logical);
      expect((expr.right as Expr.Logical).operator.type).toBe(TokenType.And);
    });
  });

  describe("null coalescing", () => {
    it("a ?? b → NullCoalescing", () => {
      const expr = parseOne("a ?? b") as Expr.NullCoalescing;
      expect(expr).toBeInstanceOf(Expr.NullCoalescing);
      expect(expr.left).toBeInstanceOf(Expr.Variable);
      expect(expr.right).toBeInstanceOf(Expr.Variable);
    });
  });

  describe("ternary", () => {
    it("a ? b : c → Ternary", () => {
      const expr = parseOne("a ? b : c") as Expr.Ternary;
      expect(expr).toBeInstanceOf(Expr.Ternary);
      expect(expr.condition).toBeInstanceOf(Expr.Variable);
      expect(expr.thenExpr).toBeInstanceOf(Expr.Variable);
      expect(expr.elseExpr).toBeInstanceOf(Expr.Variable);
    });

    it("nested ternary", () => {
      const expr = parseOne("a ? b ? c : d : e") as Expr.Ternary;
      expect(expr).toBeInstanceOf(Expr.Ternary);
      expect(expr.thenExpr).toBeInstanceOf(Expr.Ternary);
    });
  });

  describe("assignment", () => {
    it("x = 1 → Assign", () => {
      const expr = parseOne("x = 1") as Expr.Assign;
      expect(expr).toBeInstanceOf(Expr.Assign);
      expect(expr.name.lexeme).toBe("x");
      expect((expr.value as Expr.Literal).value).toBe(1);
    });

    it("x += 1 → Assign wrapping Binary", () => {
      const expr = parseOne("x += 1") as Expr.Assign;
      expect(expr).toBeInstanceOf(Expr.Assign);
      expect(expr.value).toBeInstanceOf(Expr.Binary);
      expect((expr.value as Expr.Binary).operator.type).toBe(TokenType.PlusEqual);
    });

    it("x -= 1 → Assign wrapping Binary", () => {
      const expr = parseOne("x -= 1") as Expr.Assign;
      expect(expr).toBeInstanceOf(Expr.Assign);
      expect(expr.value).toBeInstanceOf(Expr.Binary);
    });

    it("x *= 1 → Assign wrapping Binary", () => {
      expect(parseOne("x *= 1")).toBeInstanceOf(Expr.Assign);
    });

    it("x /= 1 → Assign wrapping Binary", () => {
      expect(parseOne("x /= 1")).toBeInstanceOf(Expr.Assign);
    });

    it("obj.prop = val → Set", () => {
      const expr = parseOne("obj.prop = val") as Expr.Set;
      expect(expr).toBeInstanceOf(Expr.Set);
      expect(expr.entity).toBeInstanceOf(Expr.Variable);
    });
  });

  describe("grouping", () => {
    it("(expr) → Grouping", () => {
      const expr = parseOne("(42)") as Expr.Grouping;
      expect(expr).toBeInstanceOf(Expr.Grouping);
      expect(expr.expression).toBeInstanceOf(Expr.Literal);
    });

    it("grouping affects precedence", () => {
      // (a + b) * c → Binary(*, Grouping(Binary(+, a, b)), c)
      const expr = parseOne("(a + b) * c") as Expr.Binary;
      expect(expr.operator.type).toBe(TokenType.Star);
      expect(expr.left).toBeInstanceOf(Expr.Grouping);
    });
  });

  describe("function calls", () => {
    it("fn() → Call with no args", () => {
      const expr = parseOne("fn()") as Expr.Call;
      expect(expr).toBeInstanceOf(Expr.Call);
      expect(expr.args).toHaveLength(0);
    });

    it("fn(a) → Call with one arg", () => {
      const expr = parseOne("fn(a)") as Expr.Call;
      expect(expr.args).toHaveLength(1);
      expect(expr.args[0]).toBeInstanceOf(Expr.Variable);
    });

    it("fn(a, b, c) → Call with three args", () => {
      const expr = parseOne("fn(a, b, c)") as Expr.Call;
      expect(expr.args).toHaveLength(3);
    });

    it("callee is the function variable", () => {
      const expr = parseOne("fn()") as Expr.Call;
      expect(expr.callee).toBeInstanceOf(Expr.Variable);
      expect((expr.callee as Expr.Variable).name.lexeme).toBe("fn");
    });

    it("chained call fn()()", () => {
      const expr = parseOne("fn()()") as Expr.Call;
      expect(expr).toBeInstanceOf(Expr.Call);
      expect(expr.callee).toBeInstanceOf(Expr.Call);
    });

    it("method call obj.method()", () => {
      const expr = parseOne("obj.method()") as Expr.Call;
      expect(expr).toBeInstanceOf(Expr.Call);
      expect(expr.callee).toBeInstanceOf(Expr.Get);
    });
  });

  describe("property access", () => {
    it("obj.prop → Get(Dot)", () => {
      const expr = parseOne("obj.prop") as Expr.Get;
      expect(expr).toBeInstanceOf(Expr.Get);
      expect(expr.type).toBe(TokenType.Dot);
      expect(expr.entity).toBeInstanceOf(Expr.Variable);
    });

    it("obj?.prop → Get(QuestionDot)", () => {
      const expr = parseOne("obj?.prop") as Expr.Get;
      expect(expr).toBeInstanceOf(Expr.Get);
      expect(expr.type).toBe(TokenType.QuestionDot);
    });

    it("obj[key] → Get(LeftBracket)", () => {
      const expr = parseOne("obj[key]") as Expr.Get;
      expect(expr).toBeInstanceOf(Expr.Get);
      expect(expr.type).toBe(TokenType.LeftBracket);
    });

    it("obj[0] → Get with Literal key", () => {
      const expr = parseOne("obj[0]") as Expr.Get;
      expect(expr.key).toBeInstanceOf(Expr.Literal);
    });

    it("chained: a.b.c", () => {
      const expr = parseOne("a.b.c") as Expr.Get;
      expect(expr).toBeInstanceOf(Expr.Get);
      expect(expr.entity).toBeInstanceOf(Expr.Get);
    });
  });

  describe("dictionary", () => {
    it("{} → empty Dictionary", () => {
      const expr = parseOne("{}") as Expr.Dictionary;
      expect(expr).toBeInstanceOf(Expr.Dictionary);
      expect(expr.properties).toHaveLength(0);
    });

    it("{a: 1} → Dictionary with one Set property", () => {
      const expr = parseOne("{a: 1}") as Expr.Dictionary;
      expect(expr).toBeInstanceOf(Expr.Dictionary);
      expect(expr.properties).toHaveLength(1);
      expect(expr.properties[0]).toBeInstanceOf(Expr.Set);
    });

    it("{a: 1, b: 2} → Dictionary with two properties", () => {
      const expr = parseOne("{a: 1, b: 2}") as Expr.Dictionary;
      expect(expr.properties).toHaveLength(2);
    });

    it("shorthand {x} → property value is Variable", () => {
      const expr = parseOne("{x}") as Expr.Dictionary;
      const prop = expr.properties[0] as Expr.Set;
      expect(prop.value).toBeInstanceOf(Expr.Variable);
    });

    it("string key {'key': val}", () => {
      const expr = parseOne(`{"key": 1}`) as Expr.Dictionary;
      expect(expr.properties).toHaveLength(1);
    });
  });

  describe("list", () => {
    it("[] → empty List", () => {
      const expr = parseOne("[]") as Expr.List;
      expect(expr).toBeInstanceOf(Expr.List);
      expect(expr.value).toHaveLength(0);
    });

    it("[1, 2, 3] → List with three elements", () => {
      const expr = parseOne("[1, 2, 3]") as Expr.List;
      expect(expr).toBeInstanceOf(Expr.List);
      expect(expr.value).toHaveLength(3);
    });

    it("list elements are expressions", () => {
      const expr = parseOne("[a, 1, true]") as Expr.List;
      expect(expr.value[0]).toBeInstanceOf(Expr.Variable);
      expect(expr.value[1]).toBeInstanceOf(Expr.Literal);
      expect(expr.value[2]).toBeInstanceOf(Expr.Literal);
    });
  });

  describe("void", () => {
    it("void x → Void", () => {
      const expr = parseOne("void x") as Expr.Void;
      expect(expr).toBeInstanceOf(Expr.Void);
      expect(expr.value).toBeInstanceOf(Expr.Variable);
    });
  });

  describe("debug", () => {
    it("debug x → Debug", () => {
      const expr = parseOne("debug x") as Expr.Debug;
      expect(expr).toBeInstanceOf(Expr.Debug);
      expect(expr.value).toBeInstanceOf(Expr.Variable);
    });
  });

  describe("typeof", () => {
    it("typeof x → Typeof", () => {
      const expr = parseOne("typeof x") as Expr.Typeof;
      expect(expr).toBeInstanceOf(Expr.Typeof);
      expect(expr.value).toBeInstanceOf(Expr.Variable);
    });
  });

  describe("new", () => {
    it("new Foo() -> New with class and args", () => {
      const expr = parseOne("new Foo()") as Expr.New;
      expect(expr).toBeInstanceOf(Expr.New);
      expect(expr.clazz).toBeInstanceOf(Expr.Variable);
      expect(expr.args).toHaveLength(0);
    });

    it("new Foo(1, 2) -> New with args", () => {
      const expr = parseOne("new Foo(1, 2)") as Expr.New;
      expect(expr.clazz).toBeInstanceOf(Expr.Variable);
      expect(expr.args).toHaveLength(2);
    });
  });

  describe("multiple expressions", () => {
    it("semicolon separates multiple expressions", () => {
      const exprs = parseAll("1; 2");
      expect(exprs).toHaveLength(2);
    });

    it("each expression is parsed independently", () => {
      const exprs = parseAll("1; true");
      expect((exprs[0] as Expr.Literal).value).toBe(1);
      expect((exprs[1] as Expr.Literal).value).toBe(true);
    });

    it("resets state between parse() calls", () => {
      const parser = new ExpressionParser();
      parser.parse(tokens("1 + 2"));
      const exprs = parser.parse(tokens("true"));
      expect(exprs).toHaveLength(1);
    });
  });

  describe("foreach()", () => {
    it("'item of list' → Each with name and iterable", () => {
      const expr = foreachExpr("item of list");
      expect(expr).toBeInstanceOf(Expr.Each);
      expect(expr.name.lexeme).toBe("item");
      expect(expr.key).toBeNull();
      expect(expr.iterable).toBeInstanceOf(Expr.Variable);
    });

    it("'item with key of list' → Each with key", () => {
      const expr = foreachExpr("item with key of list");
      expect(expr.name.lexeme).toBe("item");
      expect(expr.key.lexeme).toBe("key");
    });

    it("iterable can be a complex expression", () => {
      const expr = foreachExpr("x of obj.items");
      expect(expr.iterable).toBeInstanceOf(Expr.Get);
    });
  });

  describe("error handling", () => {
    it("throws on unexpected token", () => {
      expect(() => new ExpressionParser().parse(tokens(")"))).toThrow("unexpected token");
    });

    it("throws on invalid l-value assignment", () => {
      expect(() => new ExpressionParser().parse(tokens("1 = 2"))).toThrow();
    });
  });
});
