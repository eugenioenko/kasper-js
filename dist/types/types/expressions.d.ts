import { Token, TokenType } from 'token';
export declare abstract class Expr {
    result: any;
    line: number;
    constructor();
    abstract accept<R>(visitor: ExprVisitor<R>): R;
}
export interface ExprVisitor<R> {
    visitArrowFunctionExpr(expr: ArrowFunction): R;
    visitAssignExpr(expr: Assign): R;
    visitBinaryExpr(expr: Binary): R;
    visitCallExpr(expr: Call): R;
    visitDebugExpr(expr: Debug): R;
    visitDictionaryExpr(expr: Dictionary): R;
    visitEachExpr(expr: Each): R;
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
    visitPipelineExpr(expr: Pipeline): R;
    visitSpreadExpr(expr: Spread): R;
    visitTemplateExpr(expr: Template): R;
    visitTernaryExpr(expr: Ternary): R;
    visitTypeofExpr(expr: Typeof): R;
    visitUnaryExpr(expr: Unary): R;
    visitVariableExpr(expr: Variable): R;
    visitVoidExpr(expr: Void): R;
}
export declare class ArrowFunction extends Expr {
    params: Token[];
    body: Expr;
    constructor(params: Token[], body: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Assign extends Expr {
    name: Token;
    value: Expr;
    constructor(name: Token, value: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Binary extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Call extends Expr {
    callee: Expr;
    paren: Token;
    args: Expr[];
    optional: boolean;
    constructor(callee: Expr, paren: Token, args: Expr[], line: number, optional?: boolean);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Debug extends Expr {
    value: Expr;
    constructor(value: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Dictionary extends Expr {
    properties: Expr[];
    constructor(properties: Expr[], line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Each extends Expr {
    name: Token;
    key: Token;
    iterable: Expr;
    constructor(name: Token, key: Token, iterable: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Get extends Expr {
    entity: Expr;
    key: Expr;
    type: TokenType;
    constructor(entity: Expr, key: Expr, type: TokenType, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Grouping extends Expr {
    expression: Expr;
    constructor(expression: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Key extends Expr {
    name: Token;
    constructor(name: Token, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Logical extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class List extends Expr {
    value: Expr[];
    constructor(value: Expr[], line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Literal extends Expr {
    value: any;
    constructor(value: any, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class New extends Expr {
    clazz: Expr;
    args: Expr[];
    constructor(clazz: Expr, args: Expr[], line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class NullCoalescing extends Expr {
    left: Expr;
    right: Expr;
    constructor(left: Expr, right: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Postfix extends Expr {
    entity: Expr;
    increment: number;
    constructor(entity: Expr, increment: number, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Set extends Expr {
    entity: Expr;
    key: Expr;
    value: Expr;
    constructor(entity: Expr, key: Expr, value: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Pipeline extends Expr {
    left: Expr;
    right: Expr;
    constructor(left: Expr, right: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Spread extends Expr {
    value: Expr;
    constructor(value: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Template extends Expr {
    value: string;
    constructor(value: string, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Ternary extends Expr {
    condition: Expr;
    thenExpr: Expr;
    elseExpr: Expr;
    constructor(condition: Expr, thenExpr: Expr, elseExpr: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Typeof extends Expr {
    value: Expr;
    constructor(value: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Unary extends Expr {
    operator: Token;
    right: Expr;
    constructor(operator: Token, right: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Variable extends Expr {
    name: Token;
    constructor(name: Token, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
export declare class Void extends Expr {
    value: Expr;
    constructor(value: Expr, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}
