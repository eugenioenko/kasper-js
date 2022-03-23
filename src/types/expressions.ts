import { Token, TokenType } from 'token';

export abstract class Expr {
    public result: any;
    public line: number;
    // tslint:disable-next-line
    constructor() { }
    public abstract accept<R>(visitor: ExprVisitor<R>): R;
}

// tslint:disable-next-line
export interface ExprVisitor<R> {
    visitAssignExpr(expr: Assign): R;
    visitBinaryExpr(expr: Binary): R;
    visitCallExpr(expr: Call): R;
    visitDictionaryExpr(expr: Dictionary): R;
    visitGetExpr(expr: Get): R;
    visitGroupingExpr(expr: Grouping): R;
    visitKeyExpr(expr: Key): R;
    visitLogicalExpr(expr: Logical): R;
    visitListExpr(expr: List): R;
    visitLiteralExpr(expr: Literal): R;
    visitNewExpr(expr: New): R;
    visitNullCoalescingExpr(expr: NullCoalescing): R;
    visitPostfixExpr(expr: Postfix): R;
    visitSetExpr(expr: Set): R;
    visitTemplateExpr(expr: Template): R;
    visitTernaryExpr(expr: Ternary): R;
    visitTypeofExpr(expr: Typeof): R;
    visitUnaryExpr(expr: Unary): R;
    visitVariableExpr(expr: Variable): R;
}

export class Assign extends Expr {
    public name: Token;
    public value: Expr;

    constructor(name: Token, value: Expr, line: number) {
        super();
        this.name = name;
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }

    public toString(): string {
        return 'Expr.Assign';
    }
}

export class Binary extends Expr {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    constructor(left: Expr, operator: Token, right: Expr, line: number) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }

    public toString(): string {
        return 'Expr.Binary';
    }
}

export class Call extends Expr {
    public callee: Expr;
    public paren: Token;
    public args: Expr[];

    constructor(callee: Expr, paren: Token, args: Expr[], line: number) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitCallExpr(this);
    }

    public toString(): string {
        return 'Expr.Call';
    }
}

export class Dictionary extends Expr {
    public properties: Expr[];

    constructor(properties: Expr[], line: number) {
        super();
        this.properties = properties;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitDictionaryExpr(this);
    }

    public toString(): string {
        return 'Expr.Dictionary';
    }
}

export class Get extends Expr {
    public entity: Expr;
    public key: Expr;
    public type: TokenType;

    constructor(entity: Expr, key: Expr, type: TokenType, line: number) {
        super();
        this.entity = entity;
        this.key = key;
        this.type = type;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGetExpr(this);
    }

    public toString(): string {
        return 'Expr.Get';
    }
}

export class Grouping extends Expr {
    public expression: Expr;

    constructor(expression: Expr, line: number) {
        super();
        this.expression = expression;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }

    public toString(): string {
        return 'Expr.Grouping';
    }
}

export class Key extends Expr {
    public name: Token;

    constructor(name: Token, line: number) {
        super();
        this.name = name;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitKeyExpr(this);
    }

    public toString(): string {
        return 'Expr.Key';
    }
}

export class Logical extends Expr {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    constructor(left: Expr, operator: Token, right: Expr, line: number) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLogicalExpr(this);
    }

    public toString(): string {
        return 'Expr.Logical';
    }
}

export class List extends Expr {
    public value: Expr[];

    constructor(value: Expr[], line: number) {
        super();
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitListExpr(this);
    }

    public toString(): string {
        return 'Expr.List';
    }
}

export class Literal extends Expr {
    public value: any;

    constructor(value: any, line: number) {
        super();
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }

    public toString(): string {
        return 'Expr.Literal';
    }
}

export class New extends Expr {
    public clazz: Expr;

    constructor(clazz: Expr, line: number) {
        super();
        this.clazz = clazz;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitNewExpr(this);
    }

    public toString(): string {
        return 'Expr.New';
    }
}

export class NullCoalescing extends Expr {
    public left: Expr;
    public right: Expr;

    constructor(left: Expr, right: Expr, line: number) {
        super();
        this.left = left;
        this.right = right;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitNullCoalescingExpr(this);
    }

    public toString(): string {
        return 'Expr.NullCoalescing';
    }
}

export class Postfix extends Expr {
    public name: Token;
    public increment: number;

    constructor(name: Token, increment: number, line: number) {
        super();
        this.name = name;
        this.increment = increment;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitPostfixExpr(this);
    }

    public toString(): string {
        return 'Expr.Postfix';
    }
}

export class Set extends Expr {
    public entity: Expr;
    public key: Expr;
    public value: Expr;

    constructor(entity: Expr, key: Expr, value: Expr, line: number) {
        super();
        this.entity = entity;
        this.key = key;
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSetExpr(this);
    }

    public toString(): string {
        return 'Expr.Set';
    }
}

export class Template extends Expr {
    public value: string;

    constructor(value: string, line: number) {
        super();
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitTemplateExpr(this);
    }

    public toString(): string {
        return 'Expr.Template';
    }
}

export class Ternary extends Expr {
    public condition: Expr;
    public thenExpr: Expr;
    public elseExpr: Expr;

    constructor(condition: Expr, thenExpr: Expr, elseExpr: Expr, line: number) {
        super();
        this.condition = condition;
        this.thenExpr = thenExpr;
        this.elseExpr = elseExpr;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitTernaryExpr(this);
    }

    public toString(): string {
        return 'Expr.Ternary';
    }
}

export class Typeof extends Expr {
    public value: Expr;

    constructor(value: Expr, line: number) {
        super();
        this.value = value;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitTypeofExpr(this);
    }

    public toString(): string {
        return 'Expr.Typeof';
    }
}

export class Unary extends Expr {
    public operator: Token;
    public right: Expr;

    constructor(operator: Token, right: Expr, line: number) {
        super();
        this.operator = operator;
        this.right = right;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }

    public toString(): string {
        return 'Expr.Unary';
    }
}

export class Variable extends Expr {
    public name: Token;

    constructor(name: Token, line: number) {
        super();
        this.name = name;
        this.line = line;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }

    public toString(): string {
        return 'Expr.Variable';
    }
}

