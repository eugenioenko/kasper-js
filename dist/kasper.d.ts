declare class Assign extends Expr_2 {
    name: Token;
    value: Expr_2;
    constructor(name: Token, value: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Attribute extends KNode {
    name: string;
    value: string;
    constructor(name: string, value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Binary extends Expr_2 {
    left: Expr_2;
    operator: Token;
    right: Expr_2;
    constructor(left: Expr_2, operator: Token, right: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Call extends Expr_2 {
    callee: Expr_2;
    paren: Token;
    args: Expr_2[];
    constructor(callee: Expr_2, paren: Token, args: Expr_2[], line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Comment_2 extends KNode {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Component {
    args: Record<string, any>;
    ref?: Node;
    transpiler?: Transpiler;
    $onInit: () => void;
    $onRender: () => void;
    $onChanges: () => void;
    $onDestroy: () => void;
    constructor(props?: ComponentArgs);
    $doRender(): void;
}

declare interface ComponentArgs {
    args: Record<string, any>;
    ref?: Node;
    transpiler?: Transpiler;
}

declare type ComponentClass = {
    new (args?: ComponentArgs): Component;
};

declare interface ComponentRegistry {
    [tagName: string]: {
        selector: string;
        component: ComponentClass;
        template: Element;
        nodes: KNode[];
    };
}

declare class Debug extends Expr_2 {
    value: Expr_2;
    constructor(value: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Dictionary extends Expr_2 {
    properties: Expr_2[];
    constructor(properties: Expr_2[], line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Doctype extends KNode {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Each extends Expr_2 {
    name: Token;
    key: Token;
    iterable: Expr_2;
    constructor(name: Token, key: Token, iterable: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Element_2 extends KNode {
    name: string;
    attributes: KNode[];
    children: KNode[];
    self: boolean;
    constructor(name: string, attributes: KNode[], children: KNode[], self: boolean, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare namespace Expr {
    export {
        Expr_2 as Expr,
        ExprVisitor,
        Assign,
        Binary,
        Call,
        Debug,
        Dictionary,
        Each,
        Get,
        Grouping,
        Key,
        Logical,
        List,
        Literal,
        New,
        NullCoalescing,
        Postfix,
        Set_2 as Set,
        Template,
        Ternary,
        Typeof,
        Unary,
        Variable,
        Void
    }
}

declare abstract class Expr_2 {
    result: any;
    line: number;
    constructor();
    abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export declare class ExpressionParser {
    private current;
    private tokens;
    errors: string[];
    errorLevel: number;
    parse(tokens: Token[]): Expr.Expr[];
    private match;
    private advance;
    private peek;
    private previous;
    private check;
    private eof;
    private consume;
    private error;
    private synchronize;
    foreach(tokens: Token[]): Expr.Expr;
    private expression;
    private assignment;
    private ternary;
    private nullCoalescing;
    private logicalOr;
    private logicalAnd;
    private equality;
    private addition;
    private modulus;
    private multiplication;
    private typeof;
    private unary;
    private newKeyword;
    private call;
    private dotGet;
    private bracketGet;
    private primary;
    dictionary(): Expr.Expr;
    private list;
}

declare interface ExprVisitor<R> {
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
    visitSetExpr(expr: Set_2): R;
    visitTemplateExpr(expr: Template): R;
    visitTernaryExpr(expr: Ternary): R;
    visitTypeofExpr(expr: Typeof): R;
    visitUnaryExpr(expr: Unary): R;
    visitVariableExpr(expr: Variable): R;
    visitVoidExpr(expr: Void): R;
}

declare class Get extends Expr_2 {
    entity: Expr_2;
    key: Expr_2;
    type: TokenType;
    constructor(entity: Expr_2, key: Expr_2, type: TokenType, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Grouping extends Expr_2 {
    expression: Expr_2;
    constructor(expression: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

export declare function InitKasper(): void;

export declare class Interpreter implements Expr.ExprVisitor<any> {
    scope: Scope;
    errors: string[];
    private scanner;
    private parser;
    evaluate(expr: Expr.Expr): any;
    error(message: string): void;
    visitVariableExpr(expr: Expr.Variable): any;
    visitAssignExpr(expr: Expr.Assign): any;
    visitKeyExpr(expr: Expr.Key): any;
    visitGetExpr(expr: Expr.Get): any;
    visitSetExpr(expr: Expr.Set): any;
    visitPostfixExpr(expr: Expr.Postfix): any;
    visitListExpr(expr: Expr.List): any;
    private templateParse;
    visitTemplateExpr(expr: Expr.Template): any;
    visitBinaryExpr(expr: Expr.Binary): any;
    visitLogicalExpr(expr: Expr.Logical): any;
    visitTernaryExpr(expr: Expr.Ternary): any;
    visitNullCoalescingExpr(expr: Expr.NullCoalescing): any;
    visitGroupingExpr(expr: Expr.Grouping): any;
    visitLiteralExpr(expr: Expr.Literal): any;
    visitUnaryExpr(expr: Expr.Unary): any;
    visitCallExpr(expr: Expr.Call): any;
    visitNewExpr(expr: Expr.New): any;
    visitDictionaryExpr(expr: Expr.Dictionary): any;
    visitTypeofExpr(expr: Expr.Typeof): any;
    visitEachExpr(expr: Expr.Each): any;
    visitVoidExpr(expr: Expr.Void): any;
    visitDebugExpr(expr: Expr.Void): any;
}

declare class Key extends Expr_2 {
    name: Token;
    constructor(name: Token, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare abstract class KNode {
    line: number;
    type: string;
    abstract accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
}

declare interface KNodeVisitor<R> {
    visitElementKNode(knode: Element_2, parent?: Node): R;
    visitAttributeKNode(knode: Attribute, parent?: Node): R;
    visitTextKNode(knode: Text_2, parent?: Node): R;
    visitCommentKNode(knode: Comment_2, parent?: Node): R;
    visitDoctypeKNode(knode: Doctype, parent?: Node): R;
}

declare class List extends Expr_2 {
    value: Expr_2[];
    constructor(value: Expr_2[], line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Literal extends Expr_2 {
    value: any;
    constructor(value: any, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Logical extends Expr_2 {
    left: Expr_2;
    operator: Token;
    right: Expr_2;
    constructor(left: Expr_2, operator: Token, right: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class New extends Expr_2 {
    clazz: Expr_2;
    constructor(clazz: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare namespace Node_2 {
    export {
        KNode,
        KNodeVisitor,
        Element_2 as Element,
        Attribute,
        Text_2 as Text,
        Comment_2 as Comment,
        Doctype
    }
}

declare class NullCoalescing extends Expr_2 {
    left: Expr_2;
    right: Expr_2;
    constructor(left: Expr_2, right: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Postfix extends Expr_2 {
    name: Token;
    increment: number;
    constructor(name: Token, increment: number, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

export declare class Scanner {
    /** scripts source code */
    source: string;
    /** contains the source code represented as list of tokens */
    tokens: Token[];
    /** List of errors from scanning */
    errors: string[];
    /** points to the current character being tokenized */
    private current;
    /** points to the start of the token  */
    private start;
    /** current line of source code being tokenized */
    private line;
    /** current column of the character being tokenized */
    private col;
    /** maximum number of errors before exiting */
    private readonly maxErrorcount;
    scan(source: string): Token[];
    private eof;
    private advance;
    private addToken;
    private match;
    private peek;
    private peekNext;
    private comment;
    private multilineComment;
    private string;
    private number;
    private identifier;
    private getToken;
    private error;
}

declare class Scope {
    values: Record<string, any>;
    parent: Scope;
    constructor(parent?: Scope, entity?: Record<string, any>);
    init(entity?: Record<string, any>): void;
    set(name: string, value: any): void;
    get(key: string): any;
}

declare class Set_2 extends Expr_2 {
    entity: Expr_2;
    key: Expr_2;
    value: Expr_2;
    constructor(entity: Expr_2, key: Expr_2, value: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Template extends Expr_2 {
    value: string;
    constructor(value: string, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

export declare class TemplateParser {
    current: number;
    line: number;
    col: number;
    source: string;
    errors: string[];
    nodes: Node_2.KNode[];
    parse(source: string): Node_2.KNode[];
    private match;
    private advance;
    private peek;
    private check;
    private eof;
    private error;
    private node;
    private comment;
    private doctype;
    private element;
    private close;
    private children;
    private attributes;
    private text;
    private whitespace;
    private identifier;
    private string;
}

declare class Ternary extends Expr_2 {
    condition: Expr_2;
    thenExpr: Expr_2;
    elseExpr: Expr_2;
    constructor(condition: Expr_2, thenExpr: Expr_2, elseExpr: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Text_2 extends KNode {
    value: string;
    constructor(value: string, line?: number);
    accept<R>(visitor: KNodeVisitor<R>, parent?: Node): R;
    toString(): string;
}

declare class Token {
    name: string;
    line: number;
    col: number;
    type: TokenType;
    literal: any;
    lexeme: string;
    constructor(type: TokenType, lexeme: string, literal: any, line: number, col: number);
    toString(): string;
}

declare enum TokenType {
    Eof = 0,
    Panic = 1,
    Ampersand = 2,
    AtSign = 3,
    Caret = 4,
    Comma = 5,
    Dollar = 6,
    Dot = 7,
    Hash = 8,
    LeftBrace = 9,
    LeftBracket = 10,
    LeftParen = 11,
    Percent = 12,
    Pipe = 13,
    RightBrace = 14,
    RightBracket = 15,
    RightParen = 16,
    Semicolon = 17,
    Slash = 18,
    Star = 19,
    Arrow = 20,
    Bang = 21,
    BangEqual = 22,
    Colon = 23,
    Equal = 24,
    EqualEqual = 25,
    EqualEqualEqual = 26,
    Greater = 27,
    GreaterEqual = 28,
    Less = 29,
    LessEqual = 30,
    Minus = 31,
    MinusEqual = 32,
    MinusMinus = 33,
    PercentEqual = 34,
    Plus = 35,
    PlusEqual = 36,
    PlusPlus = 37,
    Question = 38,
    QuestionDot = 39,
    QuestionQuestion = 40,
    SlashEqual = 41,
    StarEqual = 42,
    DotDot = 43,
    DotDotDot = 44,
    LessEqualGreater = 45,
    Identifier = 46,
    Template = 47,
    String = 48,
    Number = 49,
    And = 50,
    Const = 51,
    Debug = 52,
    False = 53,
    Instanceof = 54,
    New = 55,
    Null = 56,
    Undefined = 57,
    Of = 58,
    Or = 59,
    True = 60,
    Typeof = 61,
    Void = 62,
    With = 63
}

export declare class Transpiler implements Node_2.KNodeVisitor<void> {
    private scanner;
    private parser;
    private interpreter;
    errors: string[];
    private registry;
    constructor(options?: {
        registry: ComponentRegistry;
    });
    private evaluate;
    private execute;
    transpile(nodes: Node_2.KNode[], entity: object, container: Element): Node;
    visitElementKNode(node: Node_2.Element, parent?: Node): void;
    visitTextKNode(node: Node_2.Text, parent?: Node): void;
    visitAttributeKNode(node: Node_2.Attribute, parent?: Node): void;
    visitCommentKNode(node: Node_2.Comment, parent?: Node): void;
    private findAttr;
    private doIf;
    private doEach;
    private doWhile;
    private doLet;
    private createSiblings;
    private createElement;
    private createComponentArgs;
    private createEventListener;
    private evaluateTemplateString;
    private evaluateExpression;
    visitDoctypeKNode(_: Node_2.Doctype): void;
    error(message: string): void;
}

declare class Typeof extends Expr_2 {
    value: Expr_2;
    constructor(value: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Unary extends Expr_2 {
    operator: Token;
    right: Expr_2;
    constructor(operator: Token, right: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

declare class Variable extends Expr_2 {
    name: Token;
    constructor(name: Token, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

export declare class Viewer implements Node_2.KNodeVisitor<string> {
    errors: string[];
    private evaluate;
    transpile(nodes: Node_2.KNode[]): string[];
    visitElementKNode(node: Node_2.Element): string;
    visitAttributeKNode(node: Node_2.Attribute): string;
    visitTextKNode(node: Node_2.Text): string;
    visitCommentKNode(node: Node_2.Comment): string;
    visitDoctypeKNode(node: Node_2.Doctype): string;
    error(message: string): void;
}

declare class Void extends Expr_2 {
    value: Expr_2;
    constructor(value: Expr_2, line: number);
    accept<R>(visitor: ExprVisitor<R>): R;
    toString(): string;
}

export { }
