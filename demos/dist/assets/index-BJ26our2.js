var Em=Object.defineProperty;var Dm=(e,t,r)=>t in e?Em(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var U=(e,t,r)=>Dm(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const j={ROOT_ELEMENT_NOT_FOUND:"K001-1",ENTRY_COMPONENT_NOT_FOUND:"K001-2",UNTERMINATED_COMMENT:"K002-1",UNTERMINATED_STRING:"K002-2",UNEXPECTED_CHARACTER:"K002-3",UNEXPECTED_EOF:"K003-1",UNEXPECTED_CLOSING_TAG:"K003-2",EXPECTED_TAG_NAME:"K003-3",EXPECTED_CLOSING_BRACKET:"K003-4",EXPECTED_CLOSING_TAG:"K003-5",BLANK_ATTRIBUTE_NAME:"K003-6",MISPLACED_CONDITIONAL:"K003-7",DUPLICATE_IF:"K003-8",MULTIPLE_STRUCTURAL_DIRECTIVES:"K003-9",UNEXPECTED_TOKEN:"K004-1",INVALID_LVALUE:"K004-2",EXPECTED_EXPRESSION:"K004-3",INVALID_DICTIONARY_KEY:"K004-4",INVALID_POSTFIX_LVALUE:"K005-1",UNKNOWN_BINARY_OPERATOR:"K005-2",INVALID_PREFIX_RVALUE:"K005-3",UNKNOWN_UNARY_OPERATOR:"K005-4",NOT_A_FUNCTION:"K005-5",NOT_A_CLASS:"K005-6",CIRCULAR_COMPUTED:"K006-1",RUNTIME_ERROR:"K007-1",MISSING_REQUIRED_ATTR:"K007-2"},Pm={"K001-1":e=>`Root element not found: ${e.root}`,"K001-2":e=>`Entry component <${e.tag}> not found in registry.`,"K002-1":()=>'Unterminated comment, expecting closing "*/"',"K002-2":e=>`Unterminated string, expecting closing ${e.quote}`,"K002-3":e=>`Unexpected character '${e.char}'`,"K003-1":e=>`Unexpected end of file. ${e.eofError}`,"K003-2":()=>"Unexpected closing tag","K003-3":()=>"Expected a tag name","K003-4":()=>"Expected closing tag >","K003-5":e=>`Expected </${e.name}>`,"K003-6":()=>"Blank attribute name","K003-7":e=>`@${e.name} must be preceded by an @if or @elseif block.`,"K003-8":()=>"Multiple conditional directives (@if, @elseif, @else) on the same element are not allowed.","K003-9":()=>"Multiple structural directives (@if, @each) on the same element are not allowed. Nest them or use <void> instead.","K004-1":e=>`${e.message}, unexpected token "${e.token}"`,"K004-2":()=>"Invalid l-value, is not an assigning target.","K004-3":e=>`Expected expression, unexpected token "${e.token}"`,"K004-4":e=>`String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${e.token}`,"K005-1":e=>`Invalid left-hand side in postfix operation: ${e.entity}`,"K005-2":e=>`Unknown binary operator ${e.operator}`,"K005-3":e=>`Invalid right-hand side expression in prefix operation: ${e.right}`,"K005-4":e=>`Unknown unary operator ${e.operator}`,"K005-5":e=>`${e.callee} is not a function`,"K005-6":e=>`'${e.clazz}' is not a class. 'new' statement must be used with classes.`,"K006-1":()=>"Circular dependency detected in computed signal","K007-1":e=>e.message,"K007-2":e=>e.message};class me extends Error{constructor(t,r={},i,n,o){const a=!(typeof process<"u"),s=Pm[t],c=s?s(r):typeof r=="string"?r:"Unknown error",l=i!==void 0?` (${i}:${n})`:"",u=o?`
  at <${o}>`:"",d=a?`

See: https://kasperjs.top/reference/errors#${t.toLowerCase().replace(".","")}`:"";super(`[${t}] ${c}${l}${u}${d}`),this.code=t,this.args=r,this.line=i,this.col=n,this.tagName=o,this.name="KasperError"}}let ot=null;const Mt=[];let Ar=!1;const Cr=new Set,as=[];class ss{constructor(t){this.subscribers=new Set,this.watchers=new Set,this._value=t}get value(){return ot&&(this.subscribers.add(ot.fn),ot.deps.add(this)),this._value}set value(t){if(this._value!==t){const r=this._value;if(this._value=t,Ar){for(const i of this.subscribers)Cr.add(i);for(const i of this.watchers)as.push(()=>i(t,r))}else{const i=Array.from(this.subscribers);for(const n of i)n();for(const n of this.watchers)try{n(t,r)}catch(o){console.error("Watcher error:",o)}}}}onChange(t,r){var i;if((i=r==null?void 0:r.signal)!=null&&i.aborted)return()=>{};this.watchers.add(t);const n=()=>this.watchers.delete(t);return r!=null&&r.signal&&r.signal.addEventListener("abort",n,{once:!0}),n}unsubscribe(t){this.subscribers.delete(t)}toString(){return String(this.value)}peek(){return this._value}}class jm extends ss{constructor(t,r){super(void 0),this.computing=!1,this.fn=t;const i=Qr(()=>{if(this.computing)throw new me(j.CIRCULAR_COMPUTED);this.computing=!0;try{super.value=this.fn()}finally{this.computing=!1}},r);r!=null&&r.signal&&r.signal.addEventListener("abort",i,{once:!0})}get value(){return super.value}set value(t){}}function Qr(e,t){var r;if((r=t==null?void 0:t.signal)!=null&&r.aborted)return()=>{};const i={fn:()=>{i.deps.forEach(o=>o.unsubscribe(i.fn)),i.deps.clear(),Mt.push(i),ot=i;try{e()}finally{Mt.pop(),ot=Mt[Mt.length-1]||null}},deps:new Set};i.fn();const n=()=>{i.deps.forEach(o=>o.unsubscribe(i.fn)),i.deps.clear()};return n.run=i.fn,t!=null&&t.signal&&t.signal.addEventListener("abort",n,{once:!0}),n}function k(e){return new ss(e)}function Le(e){Ar=!0;try{e()}finally{Ar=!1;const t=Array.from(Cr);Cr.clear();const r=as.splice(0);for(const i of t)i();for(const i of r)try{i()}catch(n){console.error("Watcher error:",n)}}}function Oe(e,t){return new jm(e,t)}class _{constructor(t){if(this.args={},this.$abortController=new AbortController,!t){this.args={};return}t.args&&(this.args=t.args),t.ref&&(this.ref=t.ref),t.transpiler&&(this.transpiler=t.transpiler)}effect(t){Qr(t,{signal:this.$abortController.signal})}watch(t,r){t.onChange(r,{signal:this.$abortController.signal})}computed(t){return Oe(t,{signal:this.$abortController.signal})}onMount(){}onRender(){}onChanges(){}onDestroy(){}render(){var t;(t=this.$render)==null||t.call(this)}}class R{constructor(){}}class _a extends R{constructor(t,r,i){super(),this.params=t,this.body=r,this.line=i}accept(t){return t.visitArrowFunctionExpr(this)}toString(){return"Expr.ArrowFunction"}}class Om extends R{constructor(t,r,i){super(),this.name=t,this.value=r,this.line=i}accept(t){return t.visitAssignExpr(this)}toString(){return"Expr.Assign"}}class xe extends R{constructor(t,r,i,n){super(),this.left=t,this.operator=r,this.right=i,this.line=n}accept(t){return t.visitBinaryExpr(this)}toString(){return"Expr.Binary"}}class Tr extends R{constructor(t,r,i,n,o=!1){super(),this.callee=t,this.paren=r,this.args=i,this.line=n,this.optional=o}accept(t){return t.visitCallExpr(this)}toString(){return"Expr.Call"}}class Um extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitDebugExpr(this)}toString(){return"Expr.Debug"}}class wa extends R{constructor(t,r){super(),this.properties=t,this.line=r}accept(t){return t.visitDictionaryExpr(this)}toString(){return"Expr.Dictionary"}}class Nm extends R{constructor(t,r,i,n){super(),this.name=t,this.key=r,this.iterable=i,this.line=n}accept(t){return t.visitEachExpr(this)}toString(){return"Expr.Each"}}class ge extends R{constructor(t,r,i,n){super(),this.entity=t,this.key=r,this.type=i,this.line=n}accept(t){return t.visitGetExpr(this)}toString(){return"Expr.Get"}}class Am extends R{constructor(t,r){super(),this.expression=t,this.line=r}accept(t){return t.visitGroupingExpr(this)}toString(){return"Expr.Grouping"}}class Er extends R{constructor(t,r){super(),this.name=t,this.line=r}accept(t){return t.visitKeyExpr(this)}toString(){return"Expr.Key"}}class Sa extends R{constructor(t,r,i,n){super(),this.left=t,this.operator=r,this.right=i,this.line=n}accept(t){return t.visitLogicalExpr(this)}toString(){return"Expr.Logical"}}class za extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitListExpr(this)}toString(){return"Expr.List"}}class _e extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitLiteralExpr(this)}toString(){return"Expr.Literal"}}class Ia extends R{constructor(t,r,i){super(),this.clazz=t,this.args=r,this.line=i}accept(t){return t.visitNewExpr(this)}toString(){return"Expr.New"}}class Cm extends R{constructor(t,r,i){super(),this.left=t,this.right=r,this.line=i}accept(t){return t.visitNullCoalescingExpr(this)}toString(){return"Expr.NullCoalescing"}}class Ea extends R{constructor(t,r,i){super(),this.entity=t,this.increment=r,this.line=i}accept(t){return t.visitPostfixExpr(this)}toString(){return"Expr.Postfix"}}let at=class extends R{constructor(t,r,i,n){super(),this.entity=t,this.key=r,this.value=i,this.line=n}accept(t){return t.visitSetExpr(this)}toString(){return"Expr.Set"}};class Tm extends R{constructor(t,r,i){super(),this.left=t,this.right=r,this.line=i}accept(t){return t.visitPipelineExpr(this)}toString(){return"Expr.Pipeline"}}class Se extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitSpreadExpr(this)}toString(){return"Expr.Spread"}}class Rm extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitTemplateExpr(this)}toString(){return"Expr.Template"}}class Zm extends R{constructor(t,r,i,n){super(),this.condition=t,this.thenExpr=r,this.elseExpr=i,this.line=n}accept(t){return t.visitTernaryExpr(this)}toString(){return"Expr.Ternary"}}class Lm extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitTypeofExpr(this)}toString(){return"Expr.Typeof"}}class Fm extends R{constructor(t,r,i){super(),this.operator=t,this.right=r,this.line=i}accept(t){return t.visitUnaryExpr(this)}toString(){return"Expr.Unary"}}class Ze extends R{constructor(t,r){super(),this.name=t,this.line=r}accept(t){return t.visitVariableExpr(this)}toString(){return"Expr.Variable"}}class Mm extends R{constructor(t,r){super(),this.value=t,this.line=r}accept(t){return t.visitVoidExpr(this)}toString(){return"Expr.Void"}}var m=(e=>(e[e.Eof=0]="Eof",e[e.Panic=1]="Panic",e[e.Ampersand=2]="Ampersand",e[e.AtSign=3]="AtSign",e[e.Caret=4]="Caret",e[e.Comma=5]="Comma",e[e.Dollar=6]="Dollar",e[e.Dot=7]="Dot",e[e.Hash=8]="Hash",e[e.LeftBrace=9]="LeftBrace",e[e.LeftBracket=10]="LeftBracket",e[e.LeftParen=11]="LeftParen",e[e.Percent=12]="Percent",e[e.Pipe=13]="Pipe",e[e.RightBrace=14]="RightBrace",e[e.RightBracket=15]="RightBracket",e[e.RightParen=16]="RightParen",e[e.Semicolon=17]="Semicolon",e[e.Slash=18]="Slash",e[e.Star=19]="Star",e[e.Arrow=20]="Arrow",e[e.Bang=21]="Bang",e[e.BangEqual=22]="BangEqual",e[e.BangEqualEqual=23]="BangEqualEqual",e[e.Colon=24]="Colon",e[e.Equal=25]="Equal",e[e.EqualEqual=26]="EqualEqual",e[e.EqualEqualEqual=27]="EqualEqualEqual",e[e.Greater=28]="Greater",e[e.GreaterEqual=29]="GreaterEqual",e[e.Less=30]="Less",e[e.LessEqual=31]="LessEqual",e[e.Minus=32]="Minus",e[e.MinusEqual=33]="MinusEqual",e[e.MinusMinus=34]="MinusMinus",e[e.PercentEqual=35]="PercentEqual",e[e.Plus=36]="Plus",e[e.PlusEqual=37]="PlusEqual",e[e.PlusPlus=38]="PlusPlus",e[e.Question=39]="Question",e[e.QuestionDot=40]="QuestionDot",e[e.QuestionQuestion=41]="QuestionQuestion",e[e.SlashEqual=42]="SlashEqual",e[e.StarEqual=43]="StarEqual",e[e.DotDot=44]="DotDot",e[e.DotDotDot=45]="DotDotDot",e[e.LessEqualGreater=46]="LessEqualGreater",e[e.Identifier=47]="Identifier",e[e.Template=48]="Template",e[e.String=49]="String",e[e.Number=50]="Number",e[e.LeftShift=51]="LeftShift",e[e.RightShift=52]="RightShift",e[e.Pipeline=53]="Pipeline",e[e.Tilde=54]="Tilde",e[e.And=55]="And",e[e.Const=56]="Const",e[e.Debug=57]="Debug",e[e.False=58]="False",e[e.In=59]="In",e[e.Instanceof=60]="Instanceof",e[e.New=61]="New",e[e.Null=62]="Null",e[e.Undefined=63]="Undefined",e[e.Of=64]="Of",e[e.Or=65]="Or",e[e.True=66]="True",e[e.Typeof=67]="Typeof",e[e.Void=68]="Void",e[e.With=69]="With",e))(m||{});class Da{constructor(t,r,i,n,o){this.name=m[t],this.type=t,this.lexeme=r,this.literal=i,this.line=n,this.col=o}toString(){return`[(${this.line}):"${this.lexeme}"]`}}const Pa=[" ",`
`,"	","\r"],Km=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];class ls{parse(t){this.current=0,this.tokens=t;const r=[];for(;!this.eof();)r.push(this.expression());return r}match(...t){for(const r of t)if(this.check(r))return this.advance(),!0;return!1}advance(){return this.eof()||this.current++,this.previous()}peek(){return this.tokens[this.current]}previous(){return this.tokens[this.current-1]}check(t){return this.peek().type===t}eof(){return this.check(m.Eof)}consume(t,r){return this.check(t)?this.advance():this.error(j.UNEXPECTED_TOKEN,this.peek(),{message:r,token:this.peek().lexeme})}error(t,r,i={}){throw new me(t,i,r.line,r.col)}synchronize(){do{if(this.check(m.Semicolon)||this.check(m.RightBrace)){this.advance();return}this.advance()}while(!this.eof())}foreach(t){this.current=0,this.tokens=t;const r=this.consume(m.Identifier,'Expected an identifier inside "each" statement');let i=null;this.match(m.With)&&(i=this.consume(m.Identifier,'Expected a "key" identifier after "with" keyword in foreach statement')),this.consume(m.Of,'Expected "of" keyword inside foreach statement');const n=this.expression();return new Nm(r,i,n,r.line)}expression(){const t=this.assignment();if(this.match(m.Semicolon))for(;this.match(m.Semicolon););return t}assignment(){const t=this.pipeline();if(this.match(m.Equal,m.PlusEqual,m.MinusEqual,m.StarEqual,m.SlashEqual)){const r=this.previous();let i=this.assignment();if(t instanceof Ze){const n=t.name;return r.type!==m.Equal&&(i=new xe(new Ze(n,n.line),r,i,r.line)),new Om(n,i,n.line)}else if(t instanceof ge)return r.type!==m.Equal&&(i=new xe(new ge(t.entity,t.key,t.type,t.line),r,i,r.line)),new at(t.entity,t.key,i,t.line);this.error(j.INVALID_LVALUE,r)}return t}pipeline(){let t=this.ternary();for(;this.match(m.Pipeline);){const r=this.ternary();t=new Tm(t,r,t.line)}return t}ternary(){const t=this.nullCoalescing();if(this.match(m.Question)){const r=this.ternary();this.consume(m.Colon,'Expected ":" after ternary ? expression');const i=this.ternary();return new Zm(t,r,i,t.line)}return t}nullCoalescing(){const t=this.logicalOr();if(this.match(m.QuestionQuestion)){const r=this.nullCoalescing();return new Cm(t,r,t.line)}return t}logicalOr(){let t=this.logicalAnd();for(;this.match(m.Or);){const r=this.previous(),i=this.logicalAnd();t=new Sa(t,r,i,r.line)}return t}logicalAnd(){let t=this.equality();for(;this.match(m.And);){const r=this.previous(),i=this.equality();t=new Sa(t,r,i,r.line)}return t}equality(){let t=this.shift();for(;this.match(m.BangEqual,m.BangEqualEqual,m.EqualEqual,m.EqualEqualEqual,m.Greater,m.GreaterEqual,m.Less,m.LessEqual,m.Instanceof,m.In);){const r=this.previous(),i=this.shift();t=new xe(t,r,i,r.line)}return t}shift(){let t=this.addition();for(;this.match(m.LeftShift,m.RightShift);){const r=this.previous(),i=this.addition();t=new xe(t,r,i,r.line)}return t}addition(){let t=this.modulus();for(;this.match(m.Minus,m.Plus);){const r=this.previous(),i=this.modulus();t=new xe(t,r,i,r.line)}return t}modulus(){let t=this.multiplication();for(;this.match(m.Percent);){const r=this.previous(),i=this.multiplication();t=new xe(t,r,i,r.line)}return t}multiplication(){let t=this.typeof();for(;this.match(m.Slash,m.Star);){const r=this.previous(),i=this.typeof();t=new xe(t,r,i,r.line)}return t}typeof(){if(this.match(m.Typeof)){const t=this.previous(),r=this.typeof();return new Lm(r,t.line)}return this.unary()}unary(){if(this.match(m.Minus,m.Bang,m.Tilde,m.Dollar,m.PlusPlus,m.MinusMinus)){const t=this.previous(),r=this.unary();return new Fm(t,r,t.line)}return this.newKeyword()}newKeyword(){if(this.match(m.New)){const t=this.previous(),r=this.call();return r instanceof Tr?new Ia(r.callee,r.args,t.line):new Ia(r,[],t.line)}return this.postfix()}postfix(){const t=this.call();return this.match(m.PlusPlus)?new Ea(t,1,t.line):this.match(m.MinusMinus)?new Ea(t,-1,t.line):t}call(){let t=this.primary(),r;do{if(r=!1,this.match(m.LeftParen)){r=!0;do t=this.finishCall(t,this.previous(),!1);while(this.match(m.LeftParen))}if(this.match(m.Dot,m.QuestionDot)){r=!0;const i=this.previous();i.type===m.QuestionDot&&this.match(m.LeftBracket)?t=this.bracketGet(t,i):i.type===m.QuestionDot&&this.match(m.LeftParen)?t=this.finishCall(t,this.previous(),!0):t=this.dotGet(t,i)}this.match(m.LeftBracket)&&(r=!0,t=this.bracketGet(t,this.previous()))}while(r);return t}tokenAt(t){var r;return(r=this.tokens[this.current+t])==null?void 0:r.type}isArrowParams(){var t,r,i,n,o,a;let s=this.current+1;if(((t=this.tokens[s])==null?void 0:t.type)===m.RightParen)return((r=this.tokens[s+1])==null?void 0:r.type)===m.Arrow;for(;s<this.tokens.length;){if(((i=this.tokens[s])==null?void 0:i.type)!==m.Identifier)return!1;if(s++,((n=this.tokens[s])==null?void 0:n.type)===m.RightParen)return((o=this.tokens[s+1])==null?void 0:o.type)===m.Arrow;if(((a=this.tokens[s])==null?void 0:a.type)!==m.Comma)return!1;s++}return!1}finishCall(t,r,i){const n=[];if(!this.check(m.RightParen))do this.match(m.DotDotDot)?n.push(new Se(this.expression(),this.previous().line)):n.push(this.expression());while(this.match(m.Comma));const o=this.consume(m.RightParen,'Expected ")" after arguments');return new Tr(t,o,n,o.line,i)}dotGet(t,r){const i=this.consume(m.Identifier,"Expect property name after '.'"),n=new Er(i,i.line);return new ge(t,n,r.type,i.line)}bracketGet(t,r){let i=null;return this.check(m.RightBracket)||(i=this.expression()),this.consume(m.RightBracket,'Expected "]" after an index'),new ge(t,i,r.type,r.line)}primary(){if(this.match(m.False))return new _e(!1,this.previous().line);if(this.match(m.True))return new _e(!0,this.previous().line);if(this.match(m.Null))return new _e(null,this.previous().line);if(this.match(m.Undefined))return new _e(void 0,this.previous().line);if(this.match(m.Number)||this.match(m.String))return new _e(this.previous().literal,this.previous().line);if(this.match(m.Template))return new Rm(this.previous().literal,this.previous().line);if(this.check(m.Identifier)&&this.tokenAt(1)===m.Arrow){const t=this.advance();this.advance();const r=this.expression();return new _a([t],r,t.line)}if(this.match(m.Identifier)){const t=this.previous();return new Ze(t,t.line)}if(this.check(m.LeftParen)&&this.isArrowParams()){this.advance();const t=[];if(!this.check(m.RightParen))do t.push(this.consume(m.Identifier,"Expected parameter name"));while(this.match(m.Comma));this.consume(m.RightParen,'Expected ")"'),this.consume(m.Arrow,'Expected "=>"');const r=this.expression();return new _a(t,r,this.previous().line)}if(this.match(m.LeftParen)){const t=this.expression();return this.consume(m.RightParen,'Expected ")" after expression'),new Am(t,t.line)}if(this.match(m.LeftBrace))return this.dictionary();if(this.match(m.LeftBracket))return this.list();if(this.match(m.Void)){const t=this.expression();return new Mm(t,this.previous().line)}if(this.match(m.Debug)){const t=this.expression();return new Um(t,this.previous().line)}throw this.error(j.EXPECTED_EXPRESSION,this.peek(),{token:this.peek().lexeme})}dictionary(){const t=this.previous();if(this.match(m.RightBrace))return new wa([],this.previous().line);const r=[];do if(this.match(m.DotDotDot))r.push(new Se(this.expression(),this.previous().line));else if(this.match(m.String,m.Identifier,m.Number)){const i=this.previous();if(this.match(m.Colon)){const n=this.expression();r.push(new at(null,new Er(i,i.line),n,i.line))}else{const n=new Ze(i,i.line);r.push(new at(null,new Er(i,i.line),n,i.line))}}else this.error(j.INVALID_DICTIONARY_KEY,this.peek(),{token:this.peek().lexeme});while(this.match(m.Comma));return this.consume(m.RightBrace,'Expected "}" after object literal'),new wa(r,t.line)}list(){const t=[],r=this.previous();if(this.match(m.RightBracket))return new za([],this.previous().line);do this.match(m.DotDotDot)?t.push(new Se(this.expression(),this.previous().line)):t.push(this.expression());while(this.match(m.Comma));return this.consume(m.RightBracket,'Expected "]" after array declaration'),new za(t,r.line)}}function Re(e){return e>="0"&&e<="9"}function cs(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"||e==="$"||e==="_"}function qm(e){return cs(e)||Re(e)}function Jm(e){return e.charAt(0).toUpperCase()+e.substring(1).toLowerCase()}function Bm(e){return m[e]>=m.And}class us{scan(t){for(this.source=t,this.tokens=[],this.current=0,this.start=0,this.line=1,this.col=1;!this.eof();)this.start=this.current,this.getToken();return this.tokens.push(new Da(m.Eof,"",null,this.line,0)),this.tokens}eof(){return this.current>=this.source.length}advance(){return this.peek()===`
`&&(this.line++,this.col=0),this.current++,this.col++,this.source.charAt(this.current-1)}addToken(t,r){const i=this.source.substring(this.start,this.current);this.tokens.push(new Da(t,i,r,this.line,this.col))}match(t){return this.eof()||this.source.charAt(this.current)!==t?!1:(this.current++,!0)}peek(){return this.eof()?"\0":this.source.charAt(this.current)}peekNext(){return this.current+1>=this.source.length?"\0":this.source.charAt(this.current+1)}comment(){for(;this.peek()!==`
`&&!this.eof();)this.advance()}multilineComment(){for(;!this.eof()&&!(this.peek()==="*"&&this.peekNext()==="/");)this.advance();this.eof()?this.error(j.UNTERMINATED_COMMENT):(this.advance(),this.advance())}string(t){for(;this.peek()!==t&&!this.eof();)this.advance();if(this.eof()){this.error(j.UNTERMINATED_STRING,{quote:t});return}this.advance();const r=this.source.substring(this.start+1,this.current-1);this.addToken(t!=="`"?m.String:m.Template,r)}number(){for(;Re(this.peek());)this.advance();for(this.peek()==="."&&Re(this.peekNext())&&this.advance();Re(this.peek());)this.advance();for(this.peek().toLowerCase()==="e"&&(this.advance(),(this.peek()==="-"||this.peek()==="+")&&this.advance());Re(this.peek());)this.advance();const t=this.source.substring(this.start,this.current);this.addToken(m.Number,Number(t))}identifier(){for(;qm(this.peek());)this.advance();const t=this.source.substring(this.start,this.current),r=Jm(t);Bm(r)?this.addToken(m[r],t):this.addToken(m.Identifier,t)}getToken(){const t=this.advance();switch(t){case"(":this.addToken(m.LeftParen,null);break;case")":this.addToken(m.RightParen,null);break;case"[":this.addToken(m.LeftBracket,null);break;case"]":this.addToken(m.RightBracket,null);break;case"{":this.addToken(m.LeftBrace,null);break;case"}":this.addToken(m.RightBrace,null);break;case",":this.addToken(m.Comma,null);break;case";":this.addToken(m.Semicolon,null);break;case"~":this.addToken(m.Tilde,null);break;case"^":this.addToken(m.Caret,null);break;case"#":this.addToken(m.Hash,null);break;case":":this.addToken(this.match("=")?m.Arrow:m.Colon,null);break;case"*":this.addToken(this.match("=")?m.StarEqual:m.Star,null);break;case"%":this.addToken(this.match("=")?m.PercentEqual:m.Percent,null);break;case"|":this.addToken(this.match("|")?m.Or:this.match(">")?m.Pipeline:m.Pipe,null);break;case"&":this.addToken(this.match("&")?m.And:m.Ampersand,null);break;case">":this.addToken(this.match(">")?m.RightShift:this.match("=")?m.GreaterEqual:m.Greater,null);break;case"!":this.addToken(this.match("=")?this.match("=")?m.BangEqualEqual:m.BangEqual:m.Bang,null);break;case"?":this.addToken(this.match("?")?m.QuestionQuestion:this.match(".")?m.QuestionDot:m.Question,null);break;case"=":if(this.match("=")){this.addToken(this.match("=")?m.EqualEqualEqual:m.EqualEqual,null);break}this.addToken(this.match(">")?m.Arrow:m.Equal,null);break;case"+":this.addToken(this.match("+")?m.PlusPlus:this.match("=")?m.PlusEqual:m.Plus,null);break;case"-":this.addToken(this.match("-")?m.MinusMinus:this.match("=")?m.MinusEqual:m.Minus,null);break;case"<":this.addToken(this.match("<")?m.LeftShift:this.match("=")?this.match(">")?m.LessEqualGreater:m.LessEqual:m.Less,null);break;case".":this.match(".")?this.match(".")?this.addToken(m.DotDotDot,null):this.addToken(m.DotDot,null):this.addToken(m.Dot,null);break;case"/":this.match("/")?this.comment():this.match("*")?this.multilineComment():this.addToken(this.match("=")?m.SlashEqual:m.Slash,null);break;case"'":case'"':case"`":this.string(t);break;case`
`:case" ":case"\r":case"	":break;default:Re(t)?this.number():cs(t)?this.identifier():this.error(j.UNEXPECTED_CHARACTER,{char:t});break}}error(t,r={}){throw new me(t,r,this.line,this.col)}}class Q{constructor(t,r){this.parent=t||null,this.values=r||{}}init(t){this.values=t||{}}set(t,r){this.values[t]=r}get(t){var r,i;if(typeof this.values[t]<"u")return this.values[t];const n=(i=(r=this.values)==null?void 0:r.constructor)==null?void 0:i.$imports;return n&&typeof n[t]<"u"?n[t]:this.parent!==null?this.parent.get(t):window[t]}}class Gm{constructor(){this.scope=new Q,this.scanner=new us,this.parser=new ls}evaluate(t){return t.result=t.accept(this)}visitPipelineExpr(t){const r=this.evaluate(t.left);if(t.right instanceof Tr){const n=this.evaluate(t.right.callee),o=[r];for(const a of t.right.args)a instanceof Se?o.push(...this.evaluate(a.value)):o.push(this.evaluate(a));return t.right.callee instanceof ge?n.apply(t.right.callee.entity.result,o):n(...o)}return this.evaluate(t.right)(r)}visitArrowFunctionExpr(t){const r=this.scope;return(...i)=>{const n=this.scope;this.scope=new Q(r);for(let o=0;o<t.params.length;o++)this.scope.set(t.params[o].lexeme,i[o]);try{return this.evaluate(t.body)}finally{this.scope=n}}}error(t,r={},i,n){throw new me(t,r,i,n)}visitVariableExpr(t){return this.scope.get(t.name.lexeme)}visitAssignExpr(t){const r=this.evaluate(t.value);return this.scope.set(t.name.lexeme,r),r}visitKeyExpr(t){return t.name.literal}visitGetExpr(t){const r=this.evaluate(t.entity),i=this.evaluate(t.key);if(!(!r&&t.type===m.QuestionDot))return r[i]}visitSetExpr(t){const r=this.evaluate(t.entity),i=this.evaluate(t.key),n=this.evaluate(t.value);return r[i]=n,n}visitPostfixExpr(t){const r=this.evaluate(t.entity),i=r+t.increment;if(t.entity instanceof Ze)this.scope.set(t.entity.name.lexeme,i);else if(t.entity instanceof ge){const n=new at(t.entity.entity,t.entity.key,new _e(i,t.line),t.line);this.evaluate(n)}else this.error(j.INVALID_POSTFIX_LVALUE,{entity:t.entity},t.line);return r}visitListExpr(t){const r=[];for(const i of t.value)i instanceof Se?r.push(...this.evaluate(i.value)):r.push(this.evaluate(i));return r}visitSpreadExpr(t){return this.evaluate(t.value)}templateParse(t){const r=this.scanner.scan(t),i=this.parser.parse(r);let n="";for(const o of i)n+=this.evaluate(o).toString();return n}visitTemplateExpr(t){return t.value.replace(/\{\{([\s\S]+?)\}\}/g,(i,n)=>this.templateParse(n))}visitBinaryExpr(t){const r=this.evaluate(t.left),i=this.evaluate(t.right);switch(t.operator.type){case m.Minus:case m.MinusEqual:return r-i;case m.Slash:case m.SlashEqual:return r/i;case m.Star:case m.StarEqual:return r*i;case m.Percent:case m.PercentEqual:return r%i;case m.Plus:case m.PlusEqual:return r+i;case m.Pipe:return r|i;case m.Caret:return r^i;case m.Greater:return r>i;case m.GreaterEqual:return r>=i;case m.Less:return r<i;case m.LessEqual:return r<=i;case m.EqualEqual:case m.EqualEqualEqual:return r===i;case m.BangEqual:case m.BangEqualEqual:return r!==i;case m.Instanceof:return r instanceof i;case m.In:return r in i;case m.LeftShift:return r<<i;case m.RightShift:return r>>i;default:return this.error(j.UNKNOWN_BINARY_OPERATOR,{operator:t.operator},t.line),null}}visitLogicalExpr(t){const r=this.evaluate(t.left);if(t.operator.type===m.Or){if(r)return r}else if(!r)return r;return this.evaluate(t.right)}visitTernaryExpr(t){return this.evaluate(t.condition)?this.evaluate(t.thenExpr):this.evaluate(t.elseExpr)}visitNullCoalescingExpr(t){const r=this.evaluate(t.left);return r??this.evaluate(t.right)}visitGroupingExpr(t){return this.evaluate(t.expression)}visitLiteralExpr(t){return t.value}visitUnaryExpr(t){const r=this.evaluate(t.right);switch(t.operator.type){case m.Minus:return-r;case m.Bang:return!r;case m.Tilde:return~r;case m.PlusPlus:case m.MinusMinus:{const i=Number(r)+(t.operator.type===m.PlusPlus?1:-1);if(t.right instanceof Ze)this.scope.set(t.right.name.lexeme,i);else if(t.right instanceof ge){const n=new at(t.right.entity,t.right.key,new _e(i,t.line),t.line);this.evaluate(n)}else this.error(j.INVALID_PREFIX_RVALUE,{right:t.right},t.line);return i}default:return this.error(j.UNKNOWN_UNARY_OPERATOR,{operator:t.operator},t.line),null}}visitCallExpr(t){const r=this.evaluate(t.callee);if(r==null&&t.optional)return;typeof r!="function"&&this.error(j.NOT_A_FUNCTION,{callee:r},t.line);const i=[];for(const n of t.args)n instanceof Se?i.push(...this.evaluate(n.value)):i.push(this.evaluate(n));return t.callee instanceof ge?r.apply(t.callee.entity.result,i):r(...i)}visitNewExpr(t){const r=this.evaluate(t.clazz);typeof r!="function"&&this.error(j.NOT_A_CLASS,{clazz:r},t.line);const i=[];for(const n of t.args)i.push(this.evaluate(n));return new r(...i)}visitDictionaryExpr(t){const r={};for(const i of t.properties)if(i instanceof Se)Object.assign(r,this.evaluate(i.value));else{const n=this.evaluate(i.key),o=this.evaluate(i.value);r[n]=o}return r}visitTypeofExpr(t){return typeof this.evaluate(t.value)}visitEachExpr(t){return[t.name.lexeme,t.key?t.key.lexeme:null,this.evaluate(t.iterable)]}visitVoidExpr(t){return this.evaluate(t.value),""}visitDebugExpr(t){const r=this.evaluate(t.value);return console.log(r),""}}class gt{}class ja extends gt{constructor(t,r,i,n,o=0){super(),this.type="element",this.name=t,this.attributes=r,this.children=i,this.self=n,this.line=o}accept(t,r){return t.visitElementKNode(this,r)}toString(){return"KNode.Element"}}class Vm extends gt{constructor(t,r,i=0){super(),this.type="attribute",this.name=t,this.value=r,this.line=i}accept(t,r){return t.visitAttributeKNode(this,r)}toString(){return"KNode.Attribute"}}class Wm extends gt{constructor(t,r=0){super(),this.type="text",this.value=t,this.line=r}accept(t,r){return t.visitTextKNode(this,r)}toString(){return"KNode.Text"}}let Xm=class extends gt{constructor(t,r=0){super(),this.type="comment",this.value=t,this.line=r}accept(t,r){return t.visitCommentKNode(this,r)}toString(){return"KNode.Comment"}};class Hm extends gt{constructor(t,r=0){super(),this.type="doctype",this.value=t,this.line=r}accept(t,r){return t.visitDoctypeKNode(this,r)}toString(){return"KNode.Doctype"}}class ds{parse(t){for(this.current=0,this.line=1,this.col=1,this.source=t,this.nodes=[];!this.eof();){const r=this.node();r!==null&&this.nodes.push(r)}return this.source="",this.nodes}match(...t){for(const r of t)if(this.check(r))return this.current+=r.length,!0;return!1}advance(t=""){this.eof()||(this.check(`
`)&&(this.line+=1,this.col=0),this.eof()?this.error(j.UNEXPECTED_EOF,{eofError:t}):this.current++)}peek(...t){for(const r of t)if(this.check(r))return!0;return!1}check(t){return this.source.slice(this.current,this.current+t.length)===t}eof(){return this.current>this.source.length}error(t,r={}){throw new me(t,r,this.line,this.col)}node(){this.whitespace();let t;return this.match("</")&&this.error(j.UNEXPECTED_CLOSING_TAG),this.match("<!--")?t=this.comment():this.match("<!doctype")||this.match("<!DOCTYPE")?t=this.doctype():this.match("<")?t=this.element():t=this.text(),this.whitespace(),t}comment(){const t=this.current;do this.advance("Expected comment closing '-->'");while(!this.match("-->"));const r=this.source.slice(t,this.current-3);return new Xm(r,this.line)}doctype(){const t=this.current;do this.advance("Expected closing doctype");while(!this.match(">"));const r=this.source.slice(t,this.current-1).trim();return new Hm(r,this.line)}element(){const t=this.line,r=this.identifier("/",">");r||this.error(j.EXPECTED_TAG_NAME);const i=this.attributes();if(this.match("/>")||Km.includes(r)&&this.match(">"))return new ja(r,i,[],!0,this.line);this.match(">")||this.error(j.EXPECTED_CLOSING_BRACKET);let n=[];return this.whitespace(),this.peek("</")||(n=this.children(r)),this.close(r),new ja(r,i,n,!1,t)}close(t){this.match("</")||this.error(j.EXPECTED_CLOSING_TAG,{name:t}),this.match(`${t}`)||this.error(j.EXPECTED_CLOSING_TAG,{name:t}),this.whitespace(),this.match(">")||this.error(j.EXPECTED_CLOSING_TAG,{name:t})}children(t){const r=[];do{this.eof()&&this.error(j.EXPECTED_CLOSING_TAG,{name:t});const i=this.node();i!==null&&r.push(i)}while(!this.peek("</"));return r}attributes(){const t=[];for(;!this.peek(">","/>")&&!this.eof();){this.whitespace();const r=this.line,i=this.identifier("=",">","/>");i||this.error(j.BLANK_ATTRIBUTE_NAME),this.whitespace();let n="";this.match("=")&&(this.whitespace(),this.match("'")?n=this.decodeEntities(this.string("'")):this.match('"')?n=this.decodeEntities(this.string('"')):n=this.decodeEntities(this.identifier(">","/>"))),this.whitespace(),t.push(new Vm(i,n,r))}return t}text(){const t=this.current,r=this.line;let i=0;for(;!this.eof();){if(this.match("{{")){i++;continue}if(i>0&&this.match("}}")){i--;continue}if(i===0&&this.peek("<"))break;this.advance()}const n=this.source.slice(t,this.current).trim();return n?new Wm(this.decodeEntities(n),r):null}decodeEntities(t){return t.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&")}whitespace(){let t=0;for(;this.peek(...Pa)&&!this.eof();)t+=1,this.advance();return t}identifier(...t){this.whitespace();const r=this.current;for(;!this.peek(...Pa,...t);)this.advance(`Expected closing ${t}`);const i=this.current;return this.whitespace(),this.source.slice(r,i).trim()}string(t){const r=this.current;for(;!this.match(t);)this.advance(`Expected closing ${t}`);return this.source.slice(r,this.current-1)}}function un(e){history.pushState(null,"",e),window.dispatchEvent(new PopStateEvent("popstate"))}function Qm(e,t){if(e==="*")return{};const r=e.split("/").filter(Boolean),i=t.split("/").filter(Boolean);if(r.length!==i.length)return null;const n={};for(let o=0;o<r.length;o++)if(r[o].startsWith(":"))n[r[o].slice(1)]=i[o];else if(r[o]!==i[o])return null;return n}class Oa extends _{constructor(){super(...arguments),this.routes=[]}setRoutes(t){this.routes=t}onMount(){window.addEventListener("popstate",()=>this._navigate(),{signal:this.$abortController.signal}),this._navigate()}async _navigate(){const t=window.location.pathname;for(const r of this.routes){const i=Qm(r.path,t);if(i!==null){if(r.guard&&!await r.guard())return;this._mount(r.component,i);return}}}_mount(t,r){const i=this.ref;!i||!this.transpiler||this.transpiler.mountComponent(t,i,r)}}class Dr{constructor(t,r="boundary"){this.start=document.createComment(`${r}-start`),this.end=document.createComment(`${r}-end`),t.appendChild(this.start),t.appendChild(this.end)}clear(){var t;let r=this.start.nextSibling;for(;r&&r!==this.end;){const i=r;r=r.nextSibling,(t=i.parentNode)==null||t.removeChild(i)}}insert(t){var r;(r=this.end.parentNode)==null||r.insertBefore(t,this.end)}nodes(){const t=[];let r=this.start.nextSibling;for(;r&&r!==this.end;)t.push(r),r=r.nextSibling;return t}get parent(){return this.start.parentNode}}const st=new Map,Ym=[];let Rr=!1,Wt=!0;function ef(){Rr=!1;for(const[t,r]of st.entries())try{typeof t.onChanges=="function"&&t.onChanges();for(const i of r)i();typeof t.onRender=="function"&&t.onRender()}catch(i){console.error("[Kasper] Error during component update:",i)}st.clear();const e=Ym.splice(0);for(const t of e)try{t()}catch(r){console.error("[Kasper] Error in nextTick callback:",r)}}function Ce(e,t){if(!Wt){t();return}st.has(e)||st.set(e,[]),st.get(e).push(t),Rr||(Rr=!0,queueMicrotask(ef))}function Ye(e){const t=Wt;Wt=!1;try{e()}finally{Wt=t}}const Ua={esc:["Escape","Esc"],escape:["Escape","Esc"],space:[" ","Spacebar"],up:["ArrowUp","Up"],down:["ArrowDown","Down"],left:["ArrowLeft","Left"],right:["ArrowRight","Right"],del:["Delete","Del"],delete:["Delete","Del"],ins:["Insert"],dot:["."],comma:[","],slash:["/"],backslash:["\\"],plus:["+"],minus:["-"],equal:["="]};class tf{constructor(t){this.scanner=new us,this.parser=new ls,this.interpreter=new Gm,this.registry={},this.mode="development",this.isRendering=!1,this.registry.router={component:Oa,nodes:[]},t&&t.registry&&(this.registry={...this.registry,...t.registry})}evaluate(t,r){if(t.type==="element"){const i=t,n=this.findAttr(i,["@elseif","@else"]);if(n){const o=n.name.startsWith("@")?n.name.slice(1):n.name;this.error(j.MISPLACED_CONDITIONAL,{name:o},i.name)}}t.accept(this,r)}bindMethods(t){var r;if(!t||typeof t!="object")return;let i=Object.getPrototypeOf(t);for(;i&&i!==Object.prototype;){for(const n of Object.getOwnPropertyNames(i))(r=Object.getOwnPropertyDescriptor(i,n))!=null&&r.get||typeof t[n]=="function"&&n!=="constructor"&&!Object.prototype.hasOwnProperty.call(t,n)&&(t[n]=t[n].bind(t));i=Object.getPrototypeOf(i)}}scopedEffect(t){const r=this.interpreter.scope;return Qr(()=>{const i=this.interpreter.scope;this.interpreter.scope=r;try{t()}finally{this.interpreter.scope=i}})}execute(t,r){const i=this.scanner.scan(t),n=this.parser.parse(i),o=this.interpreter.scope;r&&(this.interpreter.scope=r);const a=n.map(s=>this.interpreter.evaluate(s));return this.interpreter.scope=o,a&&a.length?a[a.length-1]:void 0}transpile(t,r,i){this.isRendering=!0;try{return this.destroy(i),i.innerHTML="",this.bindMethods(r),this.interpreter.scope.init(r),this.interpreter.scope.set("$instance",r),Ye(()=>{this.createSiblings(t,i),this.triggerRender()}),i}finally{this.isRendering=!1}}visitElementKNode(t,r){this.createElement(t,r)}visitTextKNode(t,r){const i=document.createTextNode("");r&&(r.insert&&typeof r.insert=="function"?r.insert(i):r.appendChild(i));const n=this.scopedEffect(()=>{const o=this.evaluateTemplateString(t.value),a=this.interpreter.scope.get("$instance");a?Ce(a,()=>{i.textContent=o}):i.textContent=o});this.trackEffect(i,n)}visitAttributeKNode(t,r){const i=document.createAttribute(t.name),n=this.scopedEffect(()=>{i.value=this.evaluateTemplateString(t.value)});this.trackEffect(i,n),r&&r.setAttributeNode(i)}visitCommentKNode(t,r){const i=new Comment(t.value);r&&(r.insert&&typeof r.insert=="function"?r.insert(i):r.appendChild(i))}trackEffect(t,r){t.$kasperEffects||(t.$kasperEffects=[]),t.$kasperEffects.push(r)}findAttr(t,r){if(!t||!t.attributes||!t.attributes.length)return null;const i=t.attributes.find(n=>r.includes(n.name));return i||null}doIf(t,r){const i=new Dr(r,"if"),n=()=>{const a=this.interpreter.scope.get("$instance"),s=a?new Q(this.interpreter.scope):this.interpreter.scope,c=this.interpreter.scope;this.interpreter.scope=s;const l=[];if(l.push(!!this.execute(t[0][1].value)),!l[0]){for(const d of t.slice(1))if(this.findAttr(d[0],["@elseif"])){const f=!!this.execute(d[1].value);if(l.push(f),f)break}else if(this.findAttr(d[0],["@else"])){l.push(!0);break}}this.interpreter.scope=c;const u=()=>{i.nodes().forEach(f=>this.destroyNode(f)),i.clear();const d=this.interpreter.scope;this.interpreter.scope=s;try{if(l[0]){t[0][0].accept(this,i);return}for(let f=1;f<l.length;f++)if(l[f]){t[f][0].accept(this,i);return}}finally{this.interpreter.scope=d}};a?Ce(a,u):u()};i.start.$kasperRefresh=n;const o=this.scopedEffect(n);this.trackEffect(i,o)}doEach(t,r,i){const n=this.findAttr(r,["@key"]);n?this.doEachKeyed(t,r,i,n):this.doEachUnkeyed(t,r,i)}doEachUnkeyed(t,r,i){const n=new Dr(i,"each"),o=this.interpreter.scope,a=()=>{const c=this.scanner.scan(t.value),[l,u,d]=this.interpreter.evaluate(this.parser.foreach(c)),f=this.interpreter.scope.get("$instance"),p=()=>{n.nodes().forEach(g=>this.destroyNode(g)),n.clear();let b=0;for(const g of d){const x={[l]:g};u&&(x[u]=b),this.interpreter.scope=new Q(o,x),this.createElement(r,n),b+=1}this.interpreter.scope=o};f?Ce(f,p):p()};n.start.$kasperRefresh=a;const s=this.scopedEffect(a);this.trackEffect(n,s)}triggerRefresh(t){var r;t.$kasperRefresh&&t.$kasperRefresh(),t.$kasperEffects&&t.$kasperEffects.forEach(i=>{typeof i.run=="function"&&i.run()}),(r=t.childNodes)==null||r.forEach(i=>this.triggerRefresh(i))}doEachKeyed(t,r,i,n){const o=new Dr(i,"each"),a=this.interpreter.scope,s=new Map,c=()=>{const u=this.scanner.scan(t.value),[d,f,p]=this.interpreter.evaluate(this.parser.foreach(u)),b=this.interpreter.scope.get("$instance"),g=[],x=new Set;let T=0;for(const B of p){const M={[d]:B};f&&(M[f]=T),this.interpreter.scope=new Q(a,M);const Z=this.execute(n.value);this.mode==="development"&&x.has(Z)&&console.warn(`[Kasper] Duplicate key detected in @each: "${Z}". Keys must be unique to ensure correct reconciliation.`),x.add(Z),g.push({item:B,idx:T,key:Z}),T++}const P=()=>{var B;const M=new Set(g.map(G=>G.key));for(const[G,X]of s)M.has(G)||(this.destroyNode(X),(B=X.parentNode)==null||B.removeChild(X),s.delete(G));const Z=o.end.parentNode;let F=o.start;for(const{item:G,idx:X,key:zr}of g){const xa={[d]:G};if(f&&(xa[f]=X),this.interpreter.scope=new Q(a,xa),s.has(zr)){const te=s.get(zr);F.nextSibling!==te&&Z.insertBefore(te,F.nextSibling),F=te;const Ir=te.$kasperScope;Ir&&(Ir.set(d,G),f&&Ir.set(f,X),this.triggerRefresh(te))}else{const te=this.createElement(r,o);te&&(F.nextSibling!==te&&Z.insertBefore(te,F.nextSibling),F=te,s.set(zr,te),te.$kasperScope=this.interpreter.scope)}}this.interpreter.scope=a};b?Ce(b,P):P()};o.start.$kasperRefresh=c;const l=this.scopedEffect(c);this.trackEffect(o,l)}createSiblings(t,r){let i=0;const n=this.interpreter.scope;let o=null;for(;i<t.length;){const a=t[i++];if(a.type==="element"){const s=a,c=this.findAttr(s,["@let"]);c&&(o||(o=new Q(n),this.interpreter.scope=o),this.execute(c.value));const l=this.findAttr(s,["@if"]),u=this.findAttr(s,["@elseif"]),d=this.findAttr(s,["@else"]),f=this.findAttr(s,["@each"]);if(this.mode==="development"&&[l,u,d,f].filter(b=>b).length>1&&this.error(j.MULTIPLE_STRUCTURAL_DIRECTIVES,{},s.name),f){this.doEach(f,s,r);continue}if(l){const p=[[s,l]];for(;i<t.length;){const b=this.findAttr(t[i],["@else","@elseif"]);if(b)p.push([t[i],b]),i+=1;else break}this.doIf(p,r);continue}}this.evaluate(a,r)}this.interpreter.scope=n}createElement(t,r){var i;try{if(t.name==="slot"){const l=this.findAttr(t,["@name"]),u=l?l.value:"default",d=this.interpreter.scope.get("$slots");if(d&&d[u]){const f=this.interpreter.scope;d[u].scope&&(this.interpreter.scope=d[u].scope),this.createSiblings(d[u],r),this.interpreter.scope=f}return}const n=t.name==="void",o=!!this.registry[t.name],a=n?r:document.createElement(t.name),s=this.interpreter.scope;if(a&&a!==r&&this.interpreter.scope.set("$ref",a),o){let l={};const u=t.attributes.filter(p=>p.name.startsWith("@:")),d=this.createComponentArgs(u),f={default:[]};f.default.scope=this.interpreter.scope;for(const p of t.children){if(p.type==="element"){const b=this.findAttr(p,["@slot"]);if(b){const g=b.value;f[g]||(f[g]=[],f[g].scope=this.interpreter.scope),f[g].push(p);continue}}f.default.push(p)}if((i=this.registry[t.name])!=null&&i.component){l=new this.registry[t.name].component({args:d,ref:a,transpiler:this}),this.bindMethods(l),a.$kasperInstance=l;const p=this.registry[t.name].nodes;if(l.$render=()=>{this.isRendering=!0;try{this.destroy(a),a.innerHTML="";const b=new Q(s,l);b.set("$instance",l),l.$slots=f;const g=this.interpreter.scope;this.interpreter.scope=b,Ye(()=>{this.createSiblings(p,a),typeof l.onRender=="function"&&l.onRender()}),this.interpreter.scope=g}finally{this.isRendering=!1}},t.name==="router"&&l instanceof Oa){const b=new Q(s,l);l.setRoutes(this.extractRoutes(t.children,void 0,b))}typeof l.onMount=="function"&&l.onMount()}return l.$slots=f,this.interpreter.scope=new Q(s,l),this.interpreter.scope.set("$instance",l),Ye(()=>{this.createSiblings(this.registry[t.name].nodes,a),l&&typeof l.onRender=="function"&&l.onRender()}),this.interpreter.scope=s,r&&(r.insert&&typeof r.insert=="function"?r.insert(a):r.appendChild(a)),a}if(!n){const l=t.attributes.filter(f=>f.name.startsWith("@on:"));for(const f of l)this.createEventListener(a,f);const u=t.attributes.filter(f=>!f.name.startsWith("@"));for(const f of u)this.evaluate(f,a);const d=t.attributes.filter(f=>{const p=f.name;return p.startsWith("@")&&!["@if","@elseif","@else","@each","@let","@key","@ref"].includes(p)&&!p.startsWith("@on:")&&!p.startsWith("@:")});for(const f of d){const p=f.name.slice(1);if(p==="class"){const b=this.scopedEffect(()=>{const g=this.execute(f.value),x=this.interpreter.scope.get("$instance"),T=()=>{a.setAttribute("class",g)};x?Ce(x,T):T()});this.trackEffect(a,b)}else{const b=this.scopedEffect(()=>{const g=this.execute(f.value),x=this.interpreter.scope.get("$instance"),T=()=>{if(g===!1||g===null||g===void 0)p!=="style"&&a.removeAttribute(p);else if(p==="style"){const P=a.getAttribute("style"),B=P&&!P.includes(g)?`${P.endsWith(";")?P:P+";"} ${g}`:g;a.setAttribute("style",B)}else a.setAttribute(p,g)};x?Ce(x,T):T()});this.trackEffect(a,b)}}}r&&!n&&(r.insert&&typeof r.insert=="function"?r.insert(a):r.appendChild(a));const c=this.findAttr(t,["@ref"]);if(c&&!n){const l=c.value.trim(),u=this.interpreter.scope.get("$instance");u?u[l]=a:this.interpreter.scope.set(l,a)}return t.self||(this.createSiblings(t.children,a),this.interpreter.scope=s),a}catch(n){if(n instanceof me&&n.code===j.RUNTIME_ERROR)throw n;this.error(j.RUNTIME_ERROR,{message:n.message||`${n}`},t.name)}}createComponentArgs(t){if(!t.length)return{};const r={};for(const i of t){const n=i.name.split(":")[1];if(this.mode==="development"&&n.toLowerCase().startsWith("on")){const o=i.value.trim();/^[\w$.][\w$.]*\s*\(.*\)\s*$/.test(o)&&!o.includes("=>")&&console.warn(`[Kasper] @:${n}="${i.value}" — the expression is called during render and its return value is passed as the prop. If it returns a function, that function becomes the handler (factory pattern). If it returns undefined, the prop receives undefined. If the function has reactive side effects, ensure it does not both read and write the same signal.`)}r[n]=this.execute(i.value)}return r}createEventListener(t,r){const[i,...n]=r.name.split(":")[1].split("."),o=new Q(this.interpreter.scope),a=this.interpreter.scope.get("$instance"),s={};a&&a.$abortController&&(s.signal=a.$abortController.signal),n.includes("once")&&(s.once=!0),n.includes("passive")&&(s.passive=!0),n.includes("capture")&&(s.capture=!0);const c=["prevent","stop","once","passive","capture","ctrl","shift","alt","meta"],l=n.filter(u=>!c.includes(u.toLowerCase()));t.addEventListener(i,u=>{l.length>0&&!l.some(f=>{var p;const b=f.toLowerCase();return!!(Ua[b]&&Ua[b].includes(u.key)||b===((p=u.key)==null?void 0:p.toLowerCase()))})||n.includes("ctrl")&&!u.ctrlKey||n.includes("shift")&&!u.shiftKey||n.includes("alt")&&!u.altKey||n.includes("meta")&&!u.metaKey||(n.includes("prevent")&&u.preventDefault(),n.includes("stop")&&u.stopPropagation(),o.set("$event",u),this.execute(r.value,o))},s)}evaluateTemplateString(t){return t&&(/\{\{.+\}\}/ms.test(t)?t.replace(/\{\{([\s\S]+?)\}\}/g,(i,n)=>this.evaluateExpression(n)):t)}evaluateExpression(t){const r=this.scanner.scan(t),i=this.parser.parse(r);let n="";for(const o of i)n+=`${this.interpreter.evaluate(o)}`;return n}destroyNode(t){var r;if(t.$kasperInstance){const i=t.$kasperInstance;i.onDestroy&&i.onDestroy(),i.$abortController&&i.$abortController.abort()}if(t.$kasperEffects&&(t.$kasperEffects.forEach(i=>i()),t.$kasperEffects=[]),t.attributes)for(let i=0;i<t.attributes.length;i++){const n=t.attributes[i];n.$kasperEffects&&(n.$kasperEffects.forEach(o=>o()),n.$kasperEffects=[])}(r=t.childNodes)==null||r.forEach(i=>this.destroyNode(i))}destroy(t){t.childNodes.forEach(r=>this.destroyNode(r))}mountComponent(t,r,i={}){this.destroy(r),r.innerHTML="";const n=t.template;if(!n)return;const o=new ds().parse(n),a=document.createElement("div");r.appendChild(a);const s=new t({args:{params:i},ref:a,transpiler:this});this.bindMethods(s),a.$kasperInstance=s;const c=o;s.$render=()=>{this.isRendering=!0;try{this.destroy(a),a.innerHTML="";const d=new Q(null,s);d.set("$instance",s);const f=this.interpreter.scope;this.interpreter.scope=d,Ye(()=>{this.createSiblings(c,a),typeof s.onRender=="function"&&s.onRender()}),this.interpreter.scope=f}finally{this.isRendering=!1}};const l=new Q(null,s);l.set("$instance",s);const u=this.interpreter.scope;this.interpreter.scope=l,Ye(()=>{this.createSiblings(o,a)}),this.interpreter.scope=u,typeof s.onMount=="function"&&s.onMount(),typeof s.onRender=="function"&&s.onRender()}extractRoutes(t,r,i){const n=[],o=i?this.interpreter.scope:void 0;i&&(this.interpreter.scope=i);for(const a of t){if(a.type!=="element")continue;const s=a;if(s.name==="route"){const c=this.findAttr(s,["@path"]),l=this.findAttr(s,["@component"]),u=this.findAttr(s,["@guard"]);(!c||!l)&&this.error(j.MISSING_REQUIRED_ATTR,{message:"<route> requires @path and @component attributes."},s.name);const d=c.value,f=this.execute(l.value),p=u?this.execute(u.value):r;n.push({path:d,component:f,guard:p})}else if(s.name==="guard"){const c=this.findAttr(s,["@check"]);if(c||this.error(j.MISSING_REQUIRED_ATTR,{message:"<guard> requires @check attribute."},s.name),!c)continue;const l=this.execute(c.value);n.push(...this.extractRoutes(s.children,l))}}return i&&(this.interpreter.scope=o),n}triggerRender(){if(this.isRendering)return;const t=this.interpreter.scope.get("$instance");t&&typeof t.onRender=="function"&&t.onRender()}visitDoctypeKNode(t){}error(t,r,i){let n=r;throw typeof r=="string"&&(n={message:r.includes("Runtime Error")?r.replace("Runtime Error: ",""):r}),new me(t,n,void 0,void 0,i)}}function nf(e,t,r){const i=document.createElement(t),n=new r[t].component({ref:i,transpiler:e,args:{}});return{node:i,instance:n,nodes:r[t].nodes}}function rf(e,t){const r={...e};for(const i of Object.keys(e)){const n=e[i];if(n.nodes||(n.nodes=[]),n.nodes.length>0)continue;if(n.selector){const a=document.querySelector(n.selector);if(a){n.template=a,n.nodes=t.parse(a.innerHTML);continue}}if(typeof n.template=="string"){n.nodes=t.parse(n.template);continue}const o=n.component.template;o&&(n.nodes=t.parse(o))}return r}function of(e){const t=new ds,r=typeof e.root=="string"?document.querySelector(e.root):e.root;if(!r)throw new me(j.ROOT_ELEMENT_NOT_FOUND,{root:e.root});const i=e.entry||"kasper-app";if(!e.registry[i])throw new me(j.ENTRY_COMPONENT_NOT_FOUND,{tag:i});const n=rf(e.registry,t),o=new tf({registry:n});e.mode?o.mode=e.mode:o.mode="development";const{node:a,instance:s,nodes:c}=nf(o,i,n);return r&&(r.innerHTML="",r.appendChild(a)),typeof s.onMount=="function"&&s.onMount(),o.transpile(c,s,a),typeof s.onRender=="function"&&s.onRender(),s}(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","UISidebar"),e.textContent=`.sidebar {
  width: 220px;
  min-width: 220px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: white;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 1.25rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1rem;
}

.logo-icon {
  background: var(--color-primary);
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1rem;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 800;
  font-size: 1rem;
  color: #0f172a;
}

.sidebar-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  padding: 0 1.25rem;
  margin: 0 0 0.375rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1.25rem;
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0;
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}

.sidebar-nav a:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.sidebar-nav a.active {
  background: #eef2ff;
  color: var(--color-primary);
  font-weight: 600;
}

.nav-icon {
  width: 18px;
  text-align: center;
  font-size: 0.9rem;
}`,document.head.appendChild(e)})();class dn extends _{constructor(){super(...arguments),this.links=[{path:"/",icon:"🏠",label:"Home"},{path:"/todo",icon:"✅",label:"Todo App"},{path:"/counter",icon:"🔢",label:"Counter"},{path:"/kanban",icon:"📋",label:"Kanban Board"},{path:"/game",icon:"🎮",label:"Game of Life"},{path:"/products",icon:"🛍️",label:"Products"},{path:"/table",icon:"📊",label:"Data Table"},{path:"/cart",icon:"🛒",label:"Shopping Cart"},{path:"/form",icon:"📝",label:"Form Validation"},{path:"/dashboard",icon:"📡",label:"Live Dashboard"},{path:"/markdown",icon:"✍️",label:"Markdown Editor"},{path:"/toast",icon:"🔔",label:"Notifications"},{path:"/tree",icon:"🌳",label:"File Explorer"},{path:"/hex",icon:"🗂️",label:"Hex Explorer"},{path:"/wizard",icon:"🧙",label:"Setup Wizard"}]}}dn.template=`<aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">👻</span>
      <span class="logo-text">Kasper Demos</span>
    </div>

    <nav class="sidebar-nav">
      <p class="sidebar-section-label">Demos</p>
      <a @each="link of links"
         @on:click.prevent="args.onNavigate(link.path)"
         @href="link.path"
         @class="args.currentPath.value === link.path ? 'active' : ''">
        <span class="nav-icon">{{link.icon}}</span>
        {{link.label}}
      </a>
    </nav>
  </aside>`;dn.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","Home"),e.textContent=`.home {
  padding: 1rem;
  text-align: center;
}

.example-list {
  list-style: none;
  padding: 0;
  margin: 2rem auto 0 auto;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
  justify-content: center;
}

.example-list a {
  display: block;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.example-list a:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-color: #3498db;
}

.example-list strong {
  display: block;
  font-size: 1.25rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.example-list span {
  color: #666;
  font-size: 0.95rem;
}`,document.head.appendChild(e)})();class pn extends _{navigate(t){un(t)}}pn.template=`<div class="home">
    <h1>Kasper.js Demos</h1>
    <p>Explore these examples of Kasper.js features and components.</p>
    <ul class="example-list">
      <li>
        <a @on:click.prevent="navigate('/todo')" href="/todo">
          <strong>Todo App</strong>
          <span>A classic Todo application with signals, effects, and list reconciliation.</span>
        </a>
      </li>
      <li>
        <a @on:click.prevent="navigate('/counter')" href="/counter">
          <strong>Counter & Props</strong>
          <span>Demonstrates reactivity, computed signals, and passing data to child components.</span>
        </a>
      </li>
      <li>
        <a @on:click.prevent="navigate('/kanban')" href="/kanban">
          <strong>Kanban Board</strong>
          <span>A drag-and-drop task board with modular components and dialogs.</span>
        </a>
      </li>
      <li>
        <a @on:click.prevent="navigate('/game')" href="/game">
          <strong>Game of Life</strong>
          <span>A 50x50 grid simulation demonstrating high-performance reactive updates.</span>
        </a>
      </li>
      <li>
        <a @on:click.prevent="navigate('/products')" href="/products">
          <strong>Product Catalog</strong>
          <span>A full CRUD application with an external REST API, search, and sorting.</span>
        </a>
      </li>
    </ul>
  </div>`;pn.$imports={Component:_,navigate:un};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","TodoApp"),e.textContent=`.todo-app {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .input-group input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }

  li.completed span {
    text-decoration: line-through;
    color: #888;
  }

  li span {
    flex: 1;
  }

  .footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #666;
  }

  button {
    cursor: pointer;
    padding: 0.3rem 0.6rem;
  }`,document.head.appendChild(e)})();class mn extends _{constructor(){super(...arguments),this.newTodo=k(""),this.todos=k([]),this.remaining=this.computed(()=>this.todos.value.filter(t=>!t.done.value).length)}addTodo(){const t=this.newTodo.value.trim();t&&(this.todos.value=[...this.todos.value,{id:Date.now(),text:t,done:k(!1)}],this.newTodo.value="")}removeTodo(t){this.todos.value=this.todos.value.filter(r=>r.id!==t)}clearCompleted(){this.todos.value=this.todos.value.filter(t=>!t.done.value)}}mn.template=`<div class="todo-app">
    <h1>Todo App</h1>
    <div class="input-group">
      <input
        type="text"
        placeholder="What needs to be done?"
        @value="newTodo.value"
        @on:input="newTodo.value = $event.target.value"
        @on:keydown.enter="addTodo()"
      />
      <ui-button @:onClick="addTodo" @:variant="'primary'">Add</ui-button>
      </div>

      <ul @if="todos.value.length">
      <li @each="todo of todos.value" @key="todo.id" @class="todo.done.value ? 'completed' : ''">
        <input 
          type="checkbox" 
          @checked="todo.done.value" 
          @on:change="todo.done.value = $event.target.checked" 
        />
        <span>{{todo.text}}</span>
        <ui-button @:onClick="() => removeTodo(todo.id)" @:variant="'outline'">×</ui-button>
      </li>
      </ul>
      <p @else>No todos yet. Add one above!</p>

      <div class="footer" @if="todos.value.length">
      <span>{{remaining.value}} items left</span>
      <ui-button @:onClick="clearCompleted" @:variant="'secondary'">Clear completed</ui-button>
      </div>
  </div>`;mn.$imports={Component:_,signal:k};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","DisplayCounter"),e.textContent=`.display-box {
  padding: 1rem;
  border: 1px dashed #3498db;
  border-radius: 4px;
  margin: 1rem 0;
  background: #f0f8ff;
}

.status {
  font-style: italic;
  color: #7f8c8d;
  font-size: 0.85rem;
}`,document.head.appendChild(e)})();class fn extends _{constructor(){super(...arguments),this.displayValue=this.computed(()=>{const t=this.args.value;return t&&typeof t=="object"&&"value"in t?t.value:t}),this.message=this.computed(()=>{const t=this.displayValue.value;return t===0?"Zero":t>0?"Positive":"Negative"})}}fn.template=`<div class="display-box">
    <strong>{{args.label}}</strong>
    <p>Value: {{displayValue.value}}</p>
    <p class="status">{{message.value}}</p>
  </div>`;fn.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","CounterExample"),e.textContent=`.counter-example {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.value {
  font-size: 2rem;
  font-weight: bold;
}

hr {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid #eee;
}`,document.head.appendChild(e)})();class hn extends _{constructor(){super(...arguments),this.count=k(0)}increment(){this.count.value++}decrement(){this.count.value--}}hn.template=`<div class="counter-example">
    <h1>Counter & Props</h1>
    <p>This example demonstrates reactive signals and passing them as props to child components.</p>
    
    <div class="controls">
      <ui-button @:onClick="decrement" @:variant="'outline'">-</ui-button>
      <span class="value">{{count.value}}</span>
      <ui-button @:onClick="increment" @:variant="'outline'">+</ui-button>
    </div>

    <hr />

    <h3>Child Component (Reactive Prop)</h3>
    <display-counter @:value="count" @:label="'Counter 1'"></display-counter>

    <h3>Child Component (Snapshot Prop)</h3>
    <display-counter @:value="count.value" @:label="'Snapshot (Non-reactive)'"></display-counter>
  </div>`;hn.$imports={Component:_,signal:k,DisplayCounter:fn};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","KanbanBoard"),e.textContent=`.kanban-page {
  padding: 1.5rem;
}
.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.board-layout {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}`,document.head.appendChild(e)})();class gn extends _{constructor(){super(...arguments),this.isDialogOpen=k(!1),this.tasks=k([{id:"1",title:"Learn Kasper.js",description:"Read the documentation and build a demo.",status:"todo"},{id:"2",title:"Setup Project",description:"Initialize the vite project with kasper plugin.",status:"done"}])}addTask(t){const r={id:Date.now().toString(),...t,status:"todo"};this.tasks.value=[...this.tasks.value,r]}moveTask(t,r){this.tasks.value=this.tasks.value.map(i=>i.id===t?{...i,status:r}:i)}closeDialog(){this.isDialogOpen.value=!1}}gn.template=`<div class="kanban-page">
    <div class="kanban-header">
      <h1>Kanban Board</h1>
      <ui-button @:onClick="() => isDialogOpen.value = true" @:variant="'success'">+ New Task</ui-button>
    </div>

    <div class="board-layout">
      <kanban-column 
        @:title="'To Do'" 
        @:status="'todo'" 
        @:allTasks="tasks" 
        @:onMoveTask="moveTask"
      ></kanban-column>

      <kanban-column 
        @:title="'In Progress'" 
        @:status="'progress'" 
        @:allTasks="tasks" 
        @:onMoveTask="moveTask"
      ></kanban-column>

      <kanban-column 
        @:title="'Done'" 
        @:status="'done'" 
        @:allTasks="tasks" 
        @:onMoveTask="moveTask"
      ></kanban-column>
    </div>

    <add-task-dialog 
      @:isOpen="isDialogOpen" 
      @:onClose="closeDialog" 
      @:onAdd="addTask"
    ></add-task-dialog>
  </div>`;gn.$imports={Component:_,signal:k};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","GameOfLife"),e.textContent=`.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
}

.game-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.game-header h1 { margin: 0; }

.controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.mode-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: var(--color-text-muted);
}

.mode-label input { cursor: pointer; }
.mode-label code {
  background: #f1f5f9;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-primary);
}

.mode-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2em 0.6em;
  border-radius: 999px;
}
.mode-badge.signal { background: #d1fae5; color: #065f46; }
.mode-badge.render { background: #fef3c7; color: #92400e; }

.render-warning {
  margin: 0;
  padding: 0.5rem 0.875rem;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #78350f;
  max-width: 480px;
  line-height: 1.5;
}

.stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-family: monospace;
  color: var(--color-text-muted);
}
.stats strong { color: var(--color-text); }
.stat-sep { color: var(--color-border); }

.grid {
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  max-width: 600px;
  background: #ccc;
  border: 1px solid #999;
  grid-template-columns: repeat(50, 1fr);
  grid-template-rows: repeat(50, 1fr);
}

.cell { background: white; cursor: pointer; }
.cell.alive { background: #2c3e50; }
.cell:hover { background: #ecf0f1; }
.cell.alive:hover { background: #34495e; }`,document.head.appendChild(e)})();class vn extends _{constructor(){super(...arguments),this.rows=50,this.cols=50,this.grid=k(new Array(2500).fill(!1)),this.generation=k(0),this.fps=k(0),this.useRender=k(!1),this.useKey=k(!0),this.isPlaying=k(!1),this.timer=null,this._lastFrameTime=0,this._pendingFps=0}onMount(){this.randomize()}onDestroy(){this.stop()}toggleMode(t){this.stop(),this._lastFrameTime=0,this._pendingFps=0,this.fps.value=0,this.useRender.value=t.target.checked}togglePlay(){this.isPlaying.value?this.stop():this.start()}start(){this.isPlaying.value=!0,this.timer=setInterval(()=>this.step(),50)}stop(){this.isPlaying.value=!1,this.timer&&(clearInterval(this.timer),this.timer=null)}randomize(){this._lastFrameTime=0,this._pendingFps=0,Le(()=>{this.grid.value=this.grid.value.map(()=>Math.random()>.8),this.generation.value=0,this.fps.value=0})}clearGrid(){this.stop(),this._lastFrameTime=0,this._pendingFps=0,Le(()=>{this.grid.value=new Array(this.rows*this.cols).fill(!1),this.generation.value=0,this.fps.value=0})}toggleCell(t){const r=[...this.grid.value];r[t]=!r[t],this.grid.value=r,this.useRender.value&&this.render()}step(){const t=this.grid.value,r=new Array(this.rows*this.cols);let i=!1;for(let n=0;n<this.rows;n++)for(let o=0;o<this.cols;o++){const a=n*this.cols+o,s=this.countNeighbors(t,n,o),c=t[a],l=c&&s===2||s===3;r[a]=l,l!==c&&(i=!0)}if(!i){this.stop();return}this.tickFps(),this.useRender.value?(this.grid.value=r,this.generation.value++,this.fps.value=this._pendingFps,this.render()):Le(()=>{this.grid.value=r,this.generation.value++,this.fps.value=this._pendingFps})}countNeighbors(t,r,i){let n=0;for(let o=-1;o<=1;o++)for(let a=-1;a<=1;a++){if(o===0&&a===0)continue;const s=r+o,c=i+a;s>=0&&s<this.rows&&c>=0&&c<this.cols&&t[s*this.cols+c]&&n++}return n}tickFps(){const t=performance.now();this._lastFrameTime>0&&(this._pendingFps=Math.round(1e3/(t-this._lastFrameTime))),this._lastFrameTime=t}}vn.template=`<div class="game-container">
    <div class="game-header">
      <h1>Conway's Game of Life</h1>

      <div class="controls">
        <ui-button @:onClick="togglePlay" @:variant="isPlaying.value ? 'danger' : 'success'">
          {{ isPlaying.value ? 'Stop' : 'Start' }}
        </ui-button>
        <ui-button @:onClick="step" @:variant="'primary'">Step</ui-button>
        <ui-button @:onClick="randomize" @:variant="'secondary'">Randomize</ui-button>
        <ui-button @:onClick="clearGrid" @:variant="'outline'">Clear</ui-button>
      </div>

      <div class="mode-row">
        <label class="mode-label">
          <input type="checkbox" @ref="modeCheckbox" @on:change="toggleMode($event)" />
          Use <code>render()</code> instead of signals
        </label>
        <span @class="'mode-badge ' + (useRender.value ? 'render' : 'signal')">
          {{ useRender.value ? 'manual render()' : 'fine-grained signals' }}
        </span>
      </div>

      <div class="mode-row">
        <label class="mode-label">
          <input type="checkbox" checked @on:change="useKey.value = $event.target.checked" />
          Use <code>@key</code> on cells
        </label>
        <span @class="'mode-badge ' + (useKey.value ? 'signal' : 'render')">
          {{ useKey.value ? 'keyed reconciliation' : 'full rebuild' }}
        </span>
      </div>

      <p @if="useRender.value" class="render-warning">
        ⚠️ <strong>render() mode:</strong> every tick destroys and rebuilds all 2,500 cells from scratch.
        Expect low FPS — this is intentional and demonstrates why fine-grained signals exist.
      </p>
      <p @if="!useKey.value && !useRender.value" class="render-warning">
        ⚠️ <strong>No @key:</strong> every tick destroys and rebuilds all 2,500 cell DOM nodes.
        Expect lower FPS — this shows why keyed reconciliation matters.
      </p>

      <div class="stats">
        <span>Gen <strong>{{ generation.value }}</strong></span>
        <span class="stat-sep">|</span>
        <span>FPS <strong>{{ fps.value }}</strong></span>
        <span class="stat-sep">|</span>
        <span>50 × 50</span>
      </div>
    </div>

    <div class="grid">
      <void @if="useKey.value">
        <div
          @each="cell with i of grid.value" @key="i"
          @class="'cell ' + (cell ? 'alive' : 'dead')"
          @on:click="toggleCell(i)"
        ></div>
      </void>
      <void @if="!useKey.value">
        <div
          @each="cell with i of grid.value"
          @class="'cell ' + (cell ? 'alive' : 'dead')"
          @on:click="toggleCell(i)"
        ></div>
      </void>
    </div>
  </div>`;vn.$imports={Component:_,signal:k,batch:Le};const bn="https://69b23f3de06ef68ddd946d85.mockapi.io/products",de=k([]),Ht=k(!1),Qt=k(null);async function Zr(){Ht.value=!0,Qt.value=null;try{const e=await fetch(bn);if(!e.ok)throw new Error("Failed to fetch products");de.value=await e.json()}catch(e){Qt.value=e.message}finally{Ht.value=!1}}async function ps(e){try{const r=await(await fetch(bn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();de.value=[r,...de.value]}catch(t){console.error("Add failed:",t)}}async function ms(e,t){try{const r=await fetch(`${bn}/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok)throw new Error("Update failed");const i=await r.json();de.value=de.value.map(n=>n.id===e?i:n)}catch(r){console.error("Update failed:",r)}}async function fs(e){try{await fetch(`${bn}/${e}`,{method:"DELETE"}),de.value=de.value.filter(t=>t.id!==e)}catch(t){console.error("Delete failed:",t)}}(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","ProductCatalog"),e.textContent=`.catalog-page {
    padding: 1rem;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }
  .subtitle {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }

  .filters-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    background: white;
    padding: 1rem;
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
  }
  .search-input {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-family: inherit;
  }
  .sort-select {
    padding: 0.6rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-family: inherit;
    background: white;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .price-tag {
    color: var(--color-primary);
    font-weight: 800;
  }
  .product-desc {
    font-size: 0.9rem;
    color: #475569;
    margin: 0;
    line-height: 1.6;
    min-height: 3em;
  }
  .product-meta {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    font-weight: 600;
    text-transform: uppercase;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    justify-content: flex-end;
  }

  .loading-state,
  .error-state {
    text-align: center;
    padding: 4rem;
    color: var(--color-text-muted);
  }
  .spinner {
    width: 32px;
    height: 32px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .text-muted {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }`,document.head.appendChild(e)})();class yn extends _{constructor(){super(...arguments),this.searchQuery=k(""),this.sortBy=k("newest"),this.isAddOpen=k(!1),this.isEditOpen=k(!1),this.isConfirmOpen=k(!1),this.editingProduct=k(null),this.productToDelete=k(null),this.isLoading=Ht,this.error=Qt,this.filteredProducts=this.computed(()=>{let t=[...de.value];if(this.searchQuery.value){const r=this.searchQuery.value.toLowerCase();t=t.filter(i=>i.name.toLowerCase().includes(r)||i.department.toLowerCase().includes(r))}switch(this.sortBy.value){case"price-low":t.sort((r,i)=>Number(r.price)-Number(i.price));break;case"price-high":t.sort((r,i)=>Number(i.price)-Number(r.price));break;case"name":t.sort((r,i)=>r.name.localeCompare(i.name));break;default:t.sort((r,i)=>i.id.localeCompare(r.id))}return t})}onMount(){de.value.length===0&&Zr()}fetchProducts(){Zr()}async handleAdd(t){await ps(t),this.isAddOpen.value=!1}handleEdit(t){this.editingProduct.value=t,this.isEditOpen.value=!0}closeEdit(){this.isEditOpen.value=!1,this.editingProduct.value=null}async handleUpdate(t){this.editingProduct.value&&(await ms(this.editingProduct.value.id,t),this.closeEdit())}confirmDelete(t){this.productToDelete.value=t,this.isConfirmOpen.value=!0}async executeDelete(){if(this.productToDelete.value){const t=this.productToDelete.value.id;this.isConfirmOpen.value=!1,this.productToDelete.value=null,await fs(t)}}}yn.template=`<div class="catalog-page">
    <div class="page-header">
      <div>
        <h1>Product Catalog</h1>
        <p class="subtitle">
          Showing {{ filteredProducts.value.length }} products
        </p>
      </div>
      <ui-button @:onClick="() => isAddOpen.value = true" @:variant="'success'"
        >+ Add Product</ui-button
      >
    </div>

    <div class="filters-bar">
      <input
        type="text"
        placeholder="Search products..."
        @value="searchQuery.value"
        @on:input="searchQuery.value = $event.target.value"
        class="search-input"
      />
      <select
        @on:change="sortBy.value = $event.target.value"
        class="sort-select"
      >
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name">Name: A-Z</option>
      </select>
    </div>

    <div @if="isLoading.value" class="loading-state">
      <div class="spinner"></div>
      <p>Fetching products from API...</p>
    </div>

    <div @if="error.value" class="error-state">
      <p>Error: {{ error.value }}</p>
      <ui-button @:onClick="fetchProducts">Retry</ui-button>
    </div>

    <div @if="!isLoading.value && !error.value" class="product-grid">
      <div @each="p of filteredProducts.value" @key="p.id">
        <ui-card>
          <div @slot="header" class="card-title">
            <span>{{ p.name }}</span>
            <span class="price-tag">\${{ p.price }}</span>
          </div>
          <p class="product-desc">{{ p.description }}</p>
          <div class="product-meta">
            <span>{{ p.department }}</span>
            <span>{{ p.company }}</span>
          </div>
          <div @slot="footer" class="card-actions">
            <ui-button @:onClick="() => handleEdit(p)" @:variant="'outline'"
              >Edit</ui-button
            >
            <ui-button @:onClick="() => confirmDelete(p)" @:variant="'danger'"
              >Delete</ui-button
            >
          </div>
        </ui-card>
      </div>
    </div>

    <product-form
      @:isOpen="isAddOpen"
      @:onClose="() => isAddOpen.value = false"
      @:onSubmit="handleAdd"
    ></product-form>

    <product-form
      @if="isEditOpen.value"
      @:isOpen="isEditOpen"
      @:onClose="closeEdit"
      @:product="editingProduct"
      @:onSubmit="handleUpdate"
    ></product-form>

    <ui-dialog
      @:isOpen="isConfirmOpen"
      @:onClose="() => isConfirmOpen.value = false"
      @:title="'Confirm Delete'"
    >
      <p>Are you sure you want to delete this product?</p>
      <p class="text-muted">This action cannot be undone.</p>

      <div @slot="footer">
        <ui-button
          @:onClick="() => isConfirmOpen.value = false"
          @:variant="'secondary'"
          >Cancel</ui-button
        >
        <ui-button @:onClick="executeDelete" @:variant="'danger'"
          >Delete Product</ui-button
        >
      </div>
    </ui-dialog>
  </div>`;yn.$imports={Component:_,signal:k,batch:Le,products:de,isLoading:Ht,error:Qt,fetchProducts:Zr,addProduct:ps,updateProduct:ms,deleteProduct:fs};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","DataTable"),e.textContent=`.dt-wrap {
  max-width: 960px;
  margin: 0 auto;
}

.dt-wrap h1 {
  margin: 0 0 1.5rem;
}

.dt-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.dt-search {
  flex: 1;
  min-width: 220px;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.dt-search:focus {
  border-color: var(--color-primary);
}

.dt-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
  outline: none;
}

.dt-select:focus {
  border-color: var(--color-primary);
}

.dt-count {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.dt-wrapper {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-surface);
}

.dt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.dt-th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  background: var(--color-bg);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
  transition: color 0.15s;
}

.dt-th:hover {
  color: var(--color-text);
}

.dt-th--sorted {
  color: var(--color-primary);
}

.dt-row td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.dt-row:last-child td {
  border-bottom: none;
}

.dt-row:hover td {
  background: var(--color-bg);
}

.td-name {
  font-weight: 600;
  color: #0f172a !important;
}

.td-salary {
  font-family: monospace;
  font-size: 0.825rem;
}

.badge {
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge--active   { background: #d1fae5; color: #065f46; }
.badge--inactive { background: #fee2e2; color: #991b1b; }
.badge--on-leave { background: #fef3c7; color: #92400e; }

.dt-empty {
  text-align: center;
  padding: 2rem !important;
  color: var(--color-text-muted);
  font-style: italic;
}

.dt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.dt-page-info {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.dt-pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pg-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--color-text-muted);
}

.pg-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pg-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 700;
}`,document.head.appendChild(e)})();class $n extends _{constructor(){super(...arguments),this.searchQuery=k(""),this.filterDept=k("All"),this.sortColumn=k("name"),this.sortDir=k("asc"),this.page=k(1),this.pageSize=10,this.departments=["All","Design","Engineering","Finance","HR","Marketing","Sales"],this.columns=[{key:"name",label:"Name"},{key:"department",label:"Department"},{key:"role",label:"Role"},{key:"salary",label:"Salary"},{key:"status",label:"Status"},{key:"joined",label:"Joined"}],this.data=[{id:1,name:"Alice Johnson",department:"Engineering",role:"Senior Engineer",salary:12e4,status:"Active",joined:2019},{id:2,name:"Bob Martinez",department:"Marketing",role:"Manager",salary:92e3,status:"Active",joined:2020},{id:3,name:"Carlos Rivera",department:"Engineering",role:"Lead Engineer",salary:145e3,status:"Active",joined:2018},{id:4,name:"Diana Chen",department:"Design",role:"Senior Designer",salary:105e3,status:"On Leave",joined:2021},{id:5,name:"Ethan Kim",department:"Engineering",role:"Engineer",salary:85e3,status:"Active",joined:2022},{id:6,name:"Fiona Walsh",department:"HR",role:"HR Manager",salary:88e3,status:"Active",joined:2020},{id:7,name:"George Patel",department:"Finance",role:"Financial Analyst",salary:78e3,status:"Active",joined:2021},{id:8,name:"Hannah Schmidt",department:"Sales",role:"Account Executive",salary:82e3,status:"Inactive",joined:2019},{id:9,name:"Ivan Petrov",department:"Engineering",role:"Staff Engineer",salary:165e3,status:"Active",joined:2017},{id:10,name:"Julia Torres",department:"Marketing",role:"Director",salary:155e3,status:"Active",joined:2016},{id:11,name:"Kevin Brown",department:"Sales",role:"Sales Manager",salary:115e3,status:"Active",joined:2019},{id:12,name:"Laura Davis",department:"Design",role:"Designer",salary:75e3,status:"Active",joined:2023},{id:13,name:"Mike Wilson",department:"Finance",role:"Controller",salary:14e4,status:"Active",joined:2018},{id:14,name:"Nina Okafor",department:"HR",role:"Recruiter",salary:7e4,status:"Active",joined:2022},{id:15,name:"Oscar Zhang",department:"Engineering",role:"Engineering Manager",salary:16e4,status:"Active",joined:2017},{id:16,name:"Priya Nair",department:"Marketing",role:"Senior Analyst",salary:88e3,status:"On Leave",joined:2020},{id:17,name:"Quinn Foster",department:"Sales",role:"Sales Rep",salary:62e3,status:"Active",joined:2023},{id:18,name:"Rachel Adams",department:"Design",role:"Lead Designer",salary:118e3,status:"Active",joined:2019},{id:19,name:"Sam Lee",department:"Engineering",role:"Senior Engineer",salary:125e3,status:"Active",joined:2019},{id:20,name:"Tina Russo",department:"Finance",role:"Senior Analyst",salary:95e3,status:"Inactive",joined:2020},{id:21,name:"Uma Singh",department:"HR",role:"HR Director",salary:145e3,status:"Active",joined:2016},{id:22,name:"Victor Hoffman",department:"Sales",role:"Director of Sales",salary:165e3,status:"Active",joined:2015},{id:23,name:"Wendy Clark",department:"Marketing",role:"Analyst",salary:68e3,status:"Active",joined:2023},{id:24,name:"Xavier Diaz",department:"Engineering",role:"Engineer",salary:88e3,status:"Active",joined:2022},{id:25,name:"Yuki Tanaka",department:"Design",role:"UX Researcher",salary:95e3,status:"On Leave",joined:2020},{id:26,name:"Zoe Cooper",department:"Finance",role:"Finance Manager",salary:13e4,status:"Active",joined:2018},{id:27,name:"Aaron Murphy",department:"Engineering",role:"Lead Engineer",salary:148e3,status:"Active",joined:2018},{id:28,name:"Beth Nguyen",department:"HR",role:"HR Coordinator",salary:58e3,status:"Active",joined:2024},{id:29,name:"Cole Harrison",department:"Sales",role:"Account Executive",salary:78e3,status:"Active",joined:2021},{id:30,name:"Dana Flores",department:"Marketing",role:"Manager",salary:98e3,status:"Inactive",joined:2019},{id:31,name:"Eli Carter",department:"Design",role:"Senior Designer",salary:108e3,status:"Active",joined:2020},{id:32,name:"Faye Morales",department:"Finance",role:"Financial Analyst",salary:8e4,status:"Active",joined:2021},{id:33,name:"Greg Kim",department:"Engineering",role:"Staff Engineer",salary:172e3,status:"Active",joined:2016},{id:34,name:"Hana Iwata",department:"Design",role:"Designer",salary:72e3,status:"Active",joined:2023},{id:35,name:"Isaac Romano",department:"Sales",role:"Sales Rep",salary:6e4,status:"Active",joined:2023},{id:36,name:"Jade Williams",department:"HR",role:"Recruiter",salary:68e3,status:"On Leave",joined:2022},{id:37,name:"Kyle Bennett",department:"Engineering",role:"Senior Engineer",salary:122e3,status:"Active",joined:2020},{id:38,name:"Luna Castillo",department:"Marketing",role:"Senior Analyst",salary:9e4,status:"Active",joined:2021},{id:39,name:"Mason Turner",department:"Finance",role:"Controller",salary:138e3,status:"Active",joined:2018},{id:40,name:"Nadia Volkov",department:"Sales",role:"Sales Manager",salary:112e3,status:"Inactive",joined:2018},{id:41,name:"Owen Jenkins",department:"Engineering",role:"Engineer",salary:9e4,status:"Active",joined:2022},{id:42,name:"Paula Ortega",department:"HR",role:"HR Manager",salary:85e3,status:"Active",joined:2020},{id:43,name:"Ron Baker",department:"Finance",role:"Senior Analyst",salary:97e3,status:"Active",joined:2020},{id:44,name:"Sarah Mitchell",department:"Marketing",role:"Director",salary:158e3,status:"Active",joined:2016},{id:45,name:"Thomas Brooks",department:"Engineering",role:"Engineering Manager",salary:162e3,status:"Active",joined:2017},{id:46,name:"Vera Santos",department:"Design",role:"Lead Designer",salary:115e3,status:"Active",joined:2019},{id:47,name:"Will Thompson",department:"Sales",role:"Director of Sales",salary:168e3,status:"Inactive",joined:2015},{id:48,name:"Xena Reyes",department:"Finance",role:"Finance Manager",salary:132e3,status:"Active",joined:2019},{id:49,name:"Yvonne Laurent",department:"HR",role:"HR Director",salary:148e3,status:"Active",joined:2017},{id:50,name:"Zach Morris",department:"Engineering",role:"Senior Engineer",salary:118e3,status:"On Leave",joined:2021}],this.filteredSorted=this.computed(()=>{const t=this.searchQuery.value.toLowerCase(),r=this.filterDept.value;let i=this.data;r!=="All"&&(i=i.filter(a=>a.department===r)),t&&(i=i.filter(a=>a.name.toLowerCase().includes(t)||a.role.toLowerCase().includes(t)||a.department.toLowerCase().includes(t)));const n=this.sortColumn.value,o=this.sortDir.value==="asc"?1:-1;return[...i].sort((a,s)=>a[n]<s[n]?-o:a[n]>s[n]?o:0)}),this.totalPages=this.computed(()=>Math.max(1,Math.ceil(this.filteredSorted.value.length/this.pageSize))),this.rows=this.computed(()=>{const t=(this.page.value-1)*this.pageSize;return this.filteredSorted.value.slice(t,t+this.pageSize)}),this.pageNumbers=this.computed(()=>Array.from({length:this.totalPages.value},(t,r)=>r+1))}formatSalary(t){return"$"+t.toLocaleString()}onSearch(t){this.searchQuery.value=t.target.value,this.page.value=1}onDeptFilter(t){this.filterDept.value=t.target.value,this.page.value=1}sort(t){this.sortColumn.value===t?this.sortDir.value=this.sortDir.value==="asc"?"desc":"asc":(this.sortColumn.value=t,this.sortDir.value="asc"),this.page.value=1}prevPage(){this.page.value>1&&this.page.value--}nextPage(){this.page.value<this.totalPages.value&&this.page.value++}goToPage(t){this.page.value=t}}$n.template=`<div class="dt-wrap">
    <h1>Employee Directory</h1>

    <div class="dt-toolbar">
      <input
        type="text"
        class="dt-search"
        placeholder="Search name, role, or department…"
        @on:input="onSearch($event)"
      />
      <select class="dt-select" @on:change="onDeptFilter($event)">
        <option @each="dept of departments" @value="dept">{{ dept }}</option>
      </select>
      <span class="dt-count">{{ filteredSorted.value.length }} employees</span>
    </div>

    <div class="dt-wrapper">
      <table class="dt-table">
        <thead>
          <tr>
            <th
              @each="col of columns"
              @on:click="sort(col.key)"
              @class="'dt-th' + (sortColumn.value === col.key ? ' dt-th--sorted' : '')"
            >
              {{ col.label }}{{ sortColumn.value === col.key ? (sortDir.value === 'asc' ? ' ↑' : ' ↓') : '' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr @each="row of rows.value" class="dt-row">
            <td class="td-name">{{ row.name }}</td>
            <td>{{ row.department }}</td>
            <td>{{ row.role }}</td>
            <td class="td-salary">{{ formatSalary(row.salary) }}</td>
            <td>
              <span @class="'badge badge--' + row.status.toLowerCase().replace(' ', '-')">{{ row.status }}</span>
            </td>
            <td>{{ row.joined }}</td>
          </tr>
          <tr @if="rows.value.length === 0">
            <td colspan="6" class="dt-empty">No employees match your search.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="dt-footer">
      <span class="dt-page-info">Page {{ page.value }} of {{ totalPages.value }}</span>
      <div class="dt-pagination">
        <ui-button @:onClick="prevPage" @:variant="'outline'" @:disabled="page.value === 1">← Prev</ui-button>
        <button
          @each="p of pageNumbers.value"
          @on:click="goToPage(p)"
          @class="'pg-btn' + (page.value === p ? ' pg-btn--active' : '')"
        >{{ p }}</button>
        <ui-button @:onClick="nextPage" @:variant="'outline'" @:disabled="page.value === totalPages.value">Next →</ui-button>
      </div>
    </div>
  </div>`;$n.$imports={Component:_,signal:k};const q=k([]),kn=Oe(()=>q.value.reduce((e,t)=>e+t.qty,0)),hs=Oe(()=>q.value.reduce((e,t)=>e+t.price*t.qty,0));function gs(e){q.value.find(r=>r.id===e.id)?q.value=q.value.map(r=>r.id===e.id?{...r,qty:r.qty+1}:r):q.value=[...q.value,{...e,qty:1}]}function Yr(e){q.value=q.value.filter(t=>t.id!==e)}function Lr(e,t){if(t<=0){Yr(e);return}q.value=q.value.map(r=>r.id===e?{...r,qty:t}:r)}function Fr(){q.value=[]}(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","ProductGrid"),e.textContent=`.pg-wrap {
  min-width: 0;
}

.pg-heading {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pg-heading h1 { margin: 0; }

.pg-cart-hint {
  font-size: 0.8rem;
  color: var(--color-success);
  font-weight: 600;
}

.pg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.pg-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.15s;
}

.pg-card:hover {
  box-shadow: var(--shadow);
}

.pg-card__emoji {
  font-size: 2.25rem;
  line-height: 1;
}

.pg-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.pg-card__category {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.pg-card__name {
  margin: 0;
  font-size: 0.95rem;
  color: #0f172a;
  line-height: 1.3;
}

.pg-card__price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 0.25rem;
}

.pg-card__footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pg-add-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.pg-add-btn:hover { background: var(--color-primary-dark); }
.pg-add-btn:active { transform: scale(0.97); }

.pg-in-cart {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-success);
}`,document.head.appendChild(e)})();class xn extends _{constructor(){super(...arguments),this.cartItems=q,this.cartCount=kn,this.products=[{id:1,name:"Mechanical Keyboard",price:129.99,category:"Electronics",emoji:"⌨️"},{id:2,name:"Wireless Mouse",price:49.99,category:"Electronics",emoji:"🖱️"},{id:3,name:"USB-C Hub",price:39.99,category:"Electronics",emoji:"🔌"},{id:4,name:"Monitor Stand",price:59.99,category:"Accessories",emoji:"🖥️"},{id:5,name:"Desk Lamp",price:34.99,category:"Accessories",emoji:"💡"},{id:6,name:"Notebook",price:12.99,category:"Stationery",emoji:"📓"},{id:7,name:"Pen Set",price:9.99,category:"Stationery",emoji:"✒️"},{id:8,name:"Cable Organizer",price:14.99,category:"Accessories",emoji:"🗂️"}]}add(t){gs(t)}getCartQty(t){var r;return((r=this.cartItems.value.find(i=>i.id===t))==null?void 0:r.qty)??0}}xn.template=`<div class="pg-wrap">
    <div class="pg-heading">
      <h1>Products</h1>
      <span @if="cartCount.value > 0" class="pg-cart-hint">
        {{ cartCount.value }} item{{ cartCount.value !== 1 ? 's' : '' }} in your cart
      </span>
    </div>

    <div class="pg-grid">
      <div @each="product of products" @key="product.id" class="pg-card">
        <div class="pg-card__emoji">{{ product.emoji }}</div>

        <div class="pg-card__body">
          <span class="pg-card__category">{{ product.category }}</span>
          <h3 class="pg-card__name">{{ product.name }}</h3>
          <span class="pg-card__price">\${{ product.price.toFixed(2) }}</span>
        </div>

        <div class="pg-card__footer">
          <span @if="getCartQty(product.id) > 0" class="pg-in-cart">
            ✓ {{ getCartQty(product.id) }} in cart
          </span>
          <button @on:click="add(product)" class="pg-add-btn">
            {{ getCartQty(product.id) > 0 ? 'Add another' : 'Add to cart' }}
          </button>
        </div>
      </div>
    </div>
  </div>`;xn.$imports={Component:_,cartItems:q,cartCount:kn,addToCart:gs};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","CartPanel"),e.textContent=`.cp-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  position: sticky;
  top: 2rem;
}

.cp-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

.cp-title { margin: 0; }

.cp-badge {
  background: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.cp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 0;
  color: var(--color-text-muted);
}

.cp-empty__icon { font-size: 2rem; }
.cp-empty p { margin: 0; font-size: 0.875rem; }

.cp-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.cp-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.cp-item__emoji { font-size: 1.25rem; flex-shrink: 0; }

.cp-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.cp-item__name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cp-item__subtotal {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.cp-item__qty {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: background 0.1s;
}

.qty-btn:hover { background: var(--color-bg); }

.qty-val {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.cp-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 0.7rem;
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.1s, background 0.1s;
}

.cp-remove:hover { color: var(--color-danger); background: #fff1f2; }

.cp-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.cp-total strong {
  font-size: 1.1rem;
  color: #0f172a;
}

.cp-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}`,document.head.appendChild(e)})();class _n extends _{constructor(){super(...arguments),this.cartItems=q,this.cartCount=kn,this.cartTotal=hs}decrement(t,r){Lr(t,r-1)}increment(t,r){Lr(t,r+1)}remove(t){Yr(t)}clear(){Fr()}checkout(){alert(`Order placed! Total: $${this.cartTotal.value.toFixed(2)}`),Fr()}}_n.template=`<div class="cp-panel">
    <div class="cp-header">
      <h2 class="cp-title">Cart</h2>
      <span @if="cartCount.value > 0" class="cp-badge">{{ cartCount.value }}</span>
    </div>

    <div @if="cartItems.value.length === 0" class="cp-empty">
      <span class="cp-empty__icon">🛒</span>
      <p>Your cart is empty</p>
    </div>

    <div @if="cartItems.value.length > 0">
      <div class="cp-items">
        <div @each="item of cartItems.value" @key="item.id" class="cp-item">
          <span class="cp-item__emoji">{{ item.emoji }}</span>

          <div class="cp-item__info">
            <span class="cp-item__name">{{ item.name }}</span>
            <span class="cp-item__subtotal">\${{ (item.price * item.qty).toFixed(2) }}</span>
          </div>

          <div class="cp-item__qty">
            <button @on:click="decrement(item.id, item.qty)" class="qty-btn">−</button>
            <span class="qty-val">{{ item.qty }}</span>
            <button @on:click="increment(item.id, item.qty)" class="qty-btn">+</button>
          </div>

          <button @on:click="remove(item.id)" class="cp-remove" title="Remove">✕</button>
        </div>
      </div>

      <div class="cp-total">
        <span>Total</span>
        <strong>\${{ cartTotal.value.toFixed(2) }}</strong>
      </div>

      <div class="cp-actions">
        <ui-button @:onClick="checkout" @:variant="'success'">Checkout</ui-button>
        <ui-button @:onClick="clear" @:variant="'outline'">Clear cart</ui-button>
      </div>
    </div>
  </div>`;_n.$imports={Component:_,cartItems:q,cartCount:kn,cartTotal:hs,removeFromCart:Yr,updateQty:Lr,clearCart:Fr};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","CartPage"),e.textContent=`.cartpage {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}`,document.head.appendChild(e)})();class wn extends _{}wn.template=`<div class="cartpage">
    <cart-product-grid></cart-product-grid>
    <cart-panel></cart-panel>
  </div>`;wn.$imports={Component:_,ProductGrid:xn,CartPanel:_n};const vs=Object.freeze({status:"aborted"});function h(e,t,r){function i(s,c){if(s._zod||Object.defineProperty(s,"_zod",{value:{def:c,constr:a,traits:new Set},enumerable:!1}),s._zod.traits.has(e))return;s._zod.traits.add(e),t(s,c);const l=a.prototype,u=Object.keys(l);for(let d=0;d<u.length;d++){const f=u[d];f in s||(s[f]=l[f].bind(s))}}const n=(r==null?void 0:r.Parent)??Object;class o extends n{}Object.defineProperty(o,"name",{value:e});function a(s){var c;const l=r!=null&&r.Parent?new o:this;i(l,s),(c=l._zod).deferred??(c.deferred=[]);for(const u of l._zod.deferred)u();return l}return Object.defineProperty(a,"init",{value:i}),Object.defineProperty(a,Symbol.hasInstance,{value:s=>{var c,l;return r!=null&&r.Parent&&s instanceof r.Parent?!0:(l=(c=s==null?void 0:s._zod)==null?void 0:c.traits)==null?void 0:l.has(e)}}),Object.defineProperty(a,"name",{value:e}),a}const bs=Symbol("zod_brand");class Ie extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class Sn extends Error{constructor(t){super(`Encountered unidirectional transform during encode: ${t}`),this.name="ZodEncodeError"}}const Yt={};function J(e){return e&&Object.assign(Yt,e),Yt}function af(e){return e}function sf(e){return e}function lf(e){}function cf(e){throw new Error("Unexpected value in exhaustive check")}function uf(e){}function ei(e){const t=Object.values(e).filter(i=>typeof i=="number");return Object.entries(e).filter(([i,n])=>t.indexOf(+i)===-1).map(([i,n])=>n)}function y(e,t="|"){return e.map(r=>w(r)).join(t)}function en(e,t){return typeof t=="bigint"?t.toString():t}function vt(e){return{get value(){{const t=e();return Object.defineProperty(this,"value",{value:t}),t}}}}function Ue(e){return e==null}function zn(e){const t=e.startsWith("^")?1:0,r=e.endsWith("$")?e.length-1:e.length;return e.slice(t,r)}function ys(e,t){const r=(e.toString().split(".")[1]||"").length,i=t.toString();let n=(i.split(".")[1]||"").length;if(n===0&&/\d?e-\d?/.test(i)){const c=i.match(/\d?e-(\d?)/);c!=null&&c[1]&&(n=Number.parseInt(c[1]))}const o=r>n?r:n,a=Number.parseInt(e.toFixed(o).replace(".","")),s=Number.parseInt(t.toFixed(o).replace(".",""));return a%s/10**o}const Na=Symbol("evaluating");function E(e,t,r){let i;Object.defineProperty(e,t,{get(){if(i!==Na)return i===void 0&&(i=Na,i=r()),i},set(n){Object.defineProperty(e,t,{value:n})},configurable:!0})}function df(e){return Object.create(Object.getPrototypeOf(e),Object.getOwnPropertyDescriptors(e))}function ke(e,t,r){Object.defineProperty(e,t,{value:r,writable:!0,enumerable:!0,configurable:!0})}function pe(...e){const t={};for(const r of e){const i=Object.getOwnPropertyDescriptors(r);Object.assign(t,i)}return Object.defineProperties({},t)}function pf(e){return pe(e._zod.def)}function mf(e,t){return t?t.reduce((r,i)=>r==null?void 0:r[i],e):e}function ff(e){const t=Object.keys(e),r=t.map(i=>e[i]);return Promise.all(r).then(i=>{const n={};for(let o=0;o<t.length;o++)n[t[o]]=i[o];return n})}function hf(e=10){const t="abcdefghijklmnopqrstuvwxyz";let r="";for(let i=0;i<e;i++)r+=t[Math.floor(Math.random()*t.length)];return r}function Mr(e){return JSON.stringify(e)}function $s(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const ti="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function Me(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}const ks=vt(()=>{var e;if(typeof navigator<"u"&&((e=navigator==null?void 0:navigator.userAgent)!=null&&e.includes("Cloudflare")))return!1;try{const t=Function;return new t(""),!0}catch{return!1}});function Ee(e){if(Me(e)===!1)return!1;const t=e.constructor;if(t===void 0||typeof t!="function")return!0;const r=t.prototype;return!(Me(r)===!1||Object.prototype.hasOwnProperty.call(r,"isPrototypeOf")===!1)}function In(e){return Ee(e)?{...e}:Array.isArray(e)?[...e]:e}function gf(e){let t=0;for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&t++;return t}const vf=e=>{const t=typeof e;switch(t){case"undefined":return"undefined";case"string":return"string";case"number":return Number.isNaN(e)?"nan":"number";case"boolean":return"boolean";case"function":return"function";case"bigint":return"bigint";case"symbol":return"symbol";case"object":return Array.isArray(e)?"array":e===null?"null":e.then&&typeof e.then=="function"&&e.catch&&typeof e.catch=="function"?"promise":typeof Map<"u"&&e instanceof Map?"map":typeof Set<"u"&&e instanceof Set?"set":typeof Date<"u"&&e instanceof Date?"date":typeof File<"u"&&e instanceof File?"file":"object";default:throw new Error(`Unknown data type: ${t}`)}},tn=new Set(["string","number","symbol"]),xs=new Set(["string","number","bigint","boolean","symbol","undefined"]);function fe(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function oe(e,t,r){const i=new e._zod.constr(t??e._zod.def);return(!t||r!=null&&r.parent)&&(i._zod.parent=e),i}function v(e){const t=e;if(!t)return{};if(typeof t=="string")return{error:()=>t};if((t==null?void 0:t.message)!==void 0){if((t==null?void 0:t.error)!==void 0)throw new Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error=="string"?{...t,error:()=>t.error}:t}function bf(e){let t;return new Proxy({},{get(r,i,n){return t??(t=e()),Reflect.get(t,i,n)},set(r,i,n,o){return t??(t=e()),Reflect.set(t,i,n,o)},has(r,i){return t??(t=e()),Reflect.has(t,i)},deleteProperty(r,i){return t??(t=e()),Reflect.deleteProperty(t,i)},ownKeys(r){return t??(t=e()),Reflect.ownKeys(t)},getOwnPropertyDescriptor(r,i){return t??(t=e()),Reflect.getOwnPropertyDescriptor(t,i)},defineProperty(r,i,n){return t??(t=e()),Reflect.defineProperty(t,i,n)}})}function w(e){return typeof e=="bigint"?e.toString()+"n":typeof e=="string"?`"${e}"`:`${e}`}function _s(e){return Object.keys(e).filter(t=>e[t]._zod.optin==="optional"&&e[t]._zod.optout==="optional")}const ws={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},Ss={int64:[BigInt("-9223372036854775808"),BigInt("9223372036854775807")],uint64:[BigInt(0),BigInt("18446744073709551615")]};function zs(e,t){const r=e._zod.def,i=r.checks;if(i&&i.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const o=pe(e._zod.def,{get shape(){const a={};for(const s in t){if(!(s in r.shape))throw new Error(`Unrecognized key: "${s}"`);t[s]&&(a[s]=r.shape[s])}return ke(this,"shape",a),a},checks:[]});return oe(e,o)}function Is(e,t){const r=e._zod.def,i=r.checks;if(i&&i.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const o=pe(e._zod.def,{get shape(){const a={...e._zod.def.shape};for(const s in t){if(!(s in r.shape))throw new Error(`Unrecognized key: "${s}"`);t[s]&&delete a[s]}return ke(this,"shape",a),a},checks:[]});return oe(e,o)}function Es(e,t){if(!Ee(t))throw new Error("Invalid input to extend: expected a plain object");const r=e._zod.def.checks;if(r&&r.length>0){const o=e._zod.def.shape;for(const a in t)if(Object.getOwnPropertyDescriptor(o,a)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}const n=pe(e._zod.def,{get shape(){const o={...e._zod.def.shape,...t};return ke(this,"shape",o),o}});return oe(e,n)}function Ds(e,t){if(!Ee(t))throw new Error("Invalid input to safeExtend: expected a plain object");const r=pe(e._zod.def,{get shape(){const i={...e._zod.def.shape,...t};return ke(this,"shape",i),i}});return oe(e,r)}function Ps(e,t){const r=pe(e._zod.def,{get shape(){const i={...e._zod.def.shape,...t._zod.def.shape};return ke(this,"shape",i),i},get catchall(){return t._zod.def.catchall},checks:[]});return oe(e,r)}function js(e,t,r){const n=t._zod.def.checks;if(n&&n.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");const a=pe(t._zod.def,{get shape(){const s=t._zod.def.shape,c={...s};if(r)for(const l in r){if(!(l in s))throw new Error(`Unrecognized key: "${l}"`);r[l]&&(c[l]=e?new e({type:"optional",innerType:s[l]}):s[l])}else for(const l in s)c[l]=e?new e({type:"optional",innerType:s[l]}):s[l];return ke(this,"shape",c),c},checks:[]});return oe(t,a)}function Os(e,t,r){const i=pe(t._zod.def,{get shape(){const n=t._zod.def.shape,o={...n};if(r)for(const a in r){if(!(a in o))throw new Error(`Unrecognized key: "${a}"`);r[a]&&(o[a]=new e({type:"nonoptional",innerType:n[a]}))}else for(const a in n)o[a]=new e({type:"nonoptional",innerType:n[a]});return ke(this,"shape",o),o}});return oe(t,i)}function ze(e,t=0){var r;if(e.aborted===!0)return!0;for(let i=t;i<e.issues.length;i++)if(((r=e.issues[i])==null?void 0:r.continue)!==!0)return!0;return!1}function le(e,t){return t.map(r=>{var i;return(i=r).path??(i.path=[]),r.path.unshift(e),r})}function rt(e){return typeof e=="string"?e:e==null?void 0:e.message}function ie(e,t,r){var n,o,a,s,c,l;const i={...e,path:e.path??[]};if(!e.message){const u=rt((a=(o=(n=e.inst)==null?void 0:n._zod.def)==null?void 0:o.error)==null?void 0:a.call(o,e))??rt((s=t==null?void 0:t.error)==null?void 0:s.call(t,e))??rt((c=r.customError)==null?void 0:c.call(r,e))??rt((l=r.localeError)==null?void 0:l.call(r,e))??"Invalid input";i.message=u}return delete i.inst,delete i.continue,t!=null&&t.reportInput||delete i.input,i}function En(e){return e instanceof Set?"set":e instanceof Map?"map":e instanceof File?"file":"unknown"}function Dn(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function S(e){const t=typeof e;switch(t){case"number":return Number.isNaN(e)?"nan":"number";case"object":{if(e===null)return"null";if(Array.isArray(e))return"array";const r=e;if(r&&Object.getPrototypeOf(r)!==Object.prototype&&"constructor"in r&&r.constructor)return r.constructor.name}}return t}function Ke(...e){const[t,r,i]=e;return typeof t=="string"?{message:t,code:"custom",input:r,inst:i}:{...t}}function yf(e){return Object.entries(e).filter(([t,r])=>Number.isNaN(Number.parseInt(t,10))).map(t=>t[1])}function Us(e){const t=atob(e),r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}function Ns(e){let t="";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return btoa(t)}function $f(e){const t=e.replace(/-/g,"+").replace(/_/g,"/"),r="=".repeat((4-t.length%4)%4);return Us(t+r)}function kf(e){return Ns(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function xf(e){const t=e.replace(/^0x/,"");if(t.length%2!==0)throw new Error("Invalid hex string length");const r=new Uint8Array(t.length/2);for(let i=0;i<t.length;i+=2)r[i/2]=Number.parseInt(t.slice(i,i+2),16);return r}function _f(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}class wf{constructor(...t){}}const As=Object.freeze(Object.defineProperty({__proto__:null,BIGINT_FORMAT_RANGES:Ss,Class:wf,NUMBER_FORMAT_RANGES:ws,aborted:ze,allowsEval:ks,assert:uf,assertEqual:af,assertIs:lf,assertNever:cf,assertNotEqual:sf,assignProp:ke,base64ToUint8Array:Us,base64urlToUint8Array:$f,cached:vt,captureStackTrace:ti,cleanEnum:yf,cleanRegex:zn,clone:oe,cloneDef:pf,createTransparentProxy:bf,defineLazy:E,esc:Mr,escapeRegex:fe,extend:Es,finalizeIssue:ie,floatSafeRemainder:ys,getElementAtPath:mf,getEnumValues:ei,getLengthableOrigin:Dn,getParsedType:vf,getSizableOrigin:En,hexToUint8Array:xf,isObject:Me,isPlainObject:Ee,issue:Ke,joinValues:y,jsonStringifyReplacer:en,merge:Ps,mergeDefs:pe,normalizeParams:v,nullish:Ue,numKeys:gf,objectClone:df,omit:Is,optionalKeys:_s,parsedType:S,partial:js,pick:zs,prefixIssues:le,primitiveTypes:xs,promiseAllObject:ff,propertyKeyTypes:tn,randomString:hf,required:Os,safeExtend:Ds,shallowClone:In,slugify:$s,stringifyPrimitive:w,uint8ArrayToBase64:Ns,uint8ArrayToBase64url:kf,uint8ArrayToHex:_f,unwrapMessage:rt},Symbol.toStringTag,{value:"Module"})),Cs=(e,t)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:t,enumerable:!1}),e.message=JSON.stringify(t,en,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},ni=h("$ZodError",Cs),Y=h("$ZodError",Cs,{Parent:Error});function ri(e,t=r=>r.message){const r={},i=[];for(const n of e.issues)n.path.length>0?(r[n.path[0]]=r[n.path[0]]||[],r[n.path[0]].push(t(n))):i.push(t(n));return{formErrors:i,fieldErrors:r}}function ii(e,t=r=>r.message){const r={_errors:[]},i=n=>{for(const o of n.issues)if(o.code==="invalid_union"&&o.errors.length)o.errors.map(a=>i({issues:a}));else if(o.code==="invalid_key")i({issues:o.issues});else if(o.code==="invalid_element")i({issues:o.issues});else if(o.path.length===0)r._errors.push(t(o));else{let a=r,s=0;for(;s<o.path.length;){const c=o.path[s];s===o.path.length-1?(a[c]=a[c]||{_errors:[]},a[c]._errors.push(t(o))):a[c]=a[c]||{_errors:[]},a=a[c],s++}}};return i(e),r}function Ts(e,t=r=>r.message){const r={errors:[]},i=(n,o=[])=>{var a,s;for(const c of n.issues)if(c.code==="invalid_union"&&c.errors.length)c.errors.map(l=>i({issues:l},c.path));else if(c.code==="invalid_key")i({issues:c.issues},c.path);else if(c.code==="invalid_element")i({issues:c.issues},c.path);else{const l=[...o,...c.path];if(l.length===0){r.errors.push(t(c));continue}let u=r,d=0;for(;d<l.length;){const f=l[d],p=d===l.length-1;typeof f=="string"?(u.properties??(u.properties={}),(a=u.properties)[f]??(a[f]={errors:[]}),u=u.properties[f]):(u.items??(u.items=[]),(s=u.items)[f]??(s[f]={errors:[]}),u=u.items[f]),p&&u.errors.push(t(c)),d++}}};return i(e),r}function Rs(e){const t=[],r=e.map(i=>typeof i=="object"?i.key:i);for(const i of r)typeof i=="number"?t.push(`[${i}]`):typeof i=="symbol"?t.push(`[${JSON.stringify(String(i))}]`):/[^\w$]/.test(i)?t.push(`[${JSON.stringify(i)}]`):(t.length&&t.push("."),t.push(i));return t.join("")}function Zs(e){var i;const t=[],r=[...e.issues].sort((n,o)=>(n.path??[]).length-(o.path??[]).length);for(const n of r)t.push(`✖ ${n.message}`),(i=n.path)!=null&&i.length&&t.push(`  → at ${Rs(n.path)}`);return t.join(`
`)}const bt=e=>(t,r,i,n)=>{const o=i?Object.assign(i,{async:!1}):{async:!1},a=t._zod.run({value:r,issues:[]},o);if(a instanceof Promise)throw new Ie;if(a.issues.length){const s=new((n==null?void 0:n.Err)??e)(a.issues.map(c=>ie(c,o,J())));throw ti(s,n==null?void 0:n.callee),s}return a.value},Kr=bt(Y),yt=e=>async(t,r,i,n)=>{const o=i?Object.assign(i,{async:!0}):{async:!0};let a=t._zod.run({value:r,issues:[]},o);if(a instanceof Promise&&(a=await a),a.issues.length){const s=new((n==null?void 0:n.Err)??e)(a.issues.map(c=>ie(c,o,J())));throw ti(s,n==null?void 0:n.callee),s}return a.value},qr=yt(Y),$t=e=>(t,r,i)=>{const n=i?{...i,async:!1}:{async:!1},o=t._zod.run({value:r,issues:[]},n);if(o instanceof Promise)throw new Ie;return o.issues.length?{success:!1,error:new(e??ni)(o.issues.map(a=>ie(a,n,J())))}:{success:!0,data:o.value}},Ls=$t(Y),kt=e=>async(t,r,i)=>{const n=i?Object.assign(i,{async:!0}):{async:!0};let o=t._zod.run({value:r,issues:[]},n);return o instanceof Promise&&(o=await o),o.issues.length?{success:!1,error:new e(o.issues.map(a=>ie(a,n,J())))}:{success:!0,data:o.value}},Fs=kt(Y),oi=e=>(t,r,i)=>{const n=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return bt(e)(t,r,n)},Sf=oi(Y),ai=e=>(t,r,i)=>bt(e)(t,r,i),zf=ai(Y),si=e=>async(t,r,i)=>{const n=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return yt(e)(t,r,n)},If=si(Y),li=e=>async(t,r,i)=>yt(e)(t,r,i),Ef=li(Y),ci=e=>(t,r,i)=>{const n=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return $t(e)(t,r,n)},Df=ci(Y),ui=e=>(t,r,i)=>$t(e)(t,r,i),Pf=ui(Y),di=e=>async(t,r,i)=>{const n=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return kt(e)(t,r,n)},jf=di(Y),pi=e=>async(t,r,i)=>kt(e)(t,r,i),Of=pi(Y),Ms=/^[cC][^\s-]{8,}$/,Ks=/^[0-9a-z]+$/,qs=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Js=/^[0-9a-vA-V]{20}$/,Bs=/^[A-Za-z0-9]{27}$/,Gs=/^[a-zA-Z0-9_-]{21}$/,Vs=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Uf=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,Ws=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,qe=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Nf=qe(4),Af=qe(6),Cf=qe(7),Xs=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Tf=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Rf=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,Hs=/^[^\s@"]{1,64}@[^\s@]{1,255}$/u,Zf=Hs,Lf=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Ff="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Qs(){return new RegExp(Ff,"u")}const Ys=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,el=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,tl=e=>{const t=fe(e??":");return new RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`)},nl=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,rl=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,il=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,mi=/^[A-Za-z0-9_-]*$/,ol=/^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,al=/^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,sl=/^\+[1-9]\d{6,14}$/,ll="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",cl=new RegExp(`^${ll}$`);function ul(e){const t="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function dl(e){return new RegExp(`^${ul(e)}$`)}function pl(e){const t=ul({precision:e.precision}),r=["Z"];e.local&&r.push(""),e.offset&&r.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const i=`${t}(?:${r.join("|")})`;return new RegExp(`^${ll}T(?:${i})$`)}const ml=e=>{const t=e?`[\\s\\S]{${(e==null?void 0:e.minimum)??0},${(e==null?void 0:e.maximum)??""}}`:"[\\s\\S]*";return new RegExp(`^${t}$`)},fl=/^-?\d+n?$/,hl=/^-?\d+$/,fi=/^-?\d+(?:\.\d+)?$/,gl=/^(?:true|false)$/i,vl=/^null$/i,bl=/^undefined$/i,yl=/^[^A-Z]*$/,$l=/^[^a-z]*$/,kl=/^[0-9a-fA-F]*$/;function xt(e,t){return new RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`)}function _t(e){return new RegExp(`^[A-Za-z0-9_-]{${e}}$`)}const Mf=/^[0-9a-fA-F]{32}$/,Kf=xt(22,"=="),qf=_t(22),Jf=/^[0-9a-fA-F]{40}$/,Bf=xt(27,"="),Gf=_t(27),Vf=/^[0-9a-fA-F]{64}$/,Wf=xt(43,"="),Xf=_t(43),Hf=/^[0-9a-fA-F]{96}$/,Qf=xt(64,""),Yf=_t(64),eh=/^[0-9a-fA-F]{128}$/,th=xt(86,"=="),nh=_t(86),hi=Object.freeze(Object.defineProperty({__proto__:null,base64:il,base64url:mi,bigint:fl,boolean:gl,browserEmail:Lf,cidrv4:nl,cidrv6:rl,cuid:Ms,cuid2:Ks,date:cl,datetime:pl,domain:al,duration:Vs,e164:sl,email:Xs,emoji:Qs,extendedDuration:Uf,guid:Ws,hex:kl,hostname:ol,html5Email:Tf,idnEmail:Zf,integer:hl,ipv4:Ys,ipv6:el,ksuid:Bs,lowercase:yl,mac:tl,md5_base64:Kf,md5_base64url:qf,md5_hex:Mf,nanoid:Gs,null:vl,number:fi,rfc5322Email:Rf,sha1_base64:Bf,sha1_base64url:Gf,sha1_hex:Jf,sha256_base64:Wf,sha256_base64url:Xf,sha256_hex:Vf,sha384_base64:Qf,sha384_base64url:Yf,sha384_hex:Hf,sha512_base64:th,sha512_base64url:nh,sha512_hex:eh,string:ml,time:dl,ulid:qs,undefined:bl,unicodeEmail:Hs,uppercase:$l,uuid:qe,uuid4:Nf,uuid6:Af,uuid7:Cf,xid:Js},Symbol.toStringTag,{value:"Module"})),L=h("$ZodCheck",(e,t)=>{var r;e._zod??(e._zod={}),e._zod.def=t,(r=e._zod).onattach??(r.onattach=[])}),xl={number:"number",bigint:"bigint",object:"date"},gi=h("$ZodCheckLessThan",(e,t)=>{L.init(e,t);const r=xl[typeof t.value];e._zod.onattach.push(i=>{const n=i._zod.bag,o=(t.inclusive?n.maximum:n.exclusiveMaximum)??Number.POSITIVE_INFINITY;t.value<o&&(t.inclusive?n.maximum=t.value:n.exclusiveMaximum=t.value)}),e._zod.check=i=>{(t.inclusive?i.value<=t.value:i.value<t.value)||i.issues.push({origin:r,code:"too_big",maximum:typeof t.value=="object"?t.value.getTime():t.value,input:i.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),vi=h("$ZodCheckGreaterThan",(e,t)=>{L.init(e,t);const r=xl[typeof t.value];e._zod.onattach.push(i=>{const n=i._zod.bag,o=(t.inclusive?n.minimum:n.exclusiveMinimum)??Number.NEGATIVE_INFINITY;t.value>o&&(t.inclusive?n.minimum=t.value:n.exclusiveMinimum=t.value)}),e._zod.check=i=>{(t.inclusive?i.value>=t.value:i.value>t.value)||i.issues.push({origin:r,code:"too_small",minimum:typeof t.value=="object"?t.value.getTime():t.value,input:i.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),_l=h("$ZodCheckMultipleOf",(e,t)=>{L.init(e,t),e._zod.onattach.push(r=>{var i;(i=r._zod.bag).multipleOf??(i.multipleOf=t.value)}),e._zod.check=r=>{if(typeof r.value!=typeof t.value)throw new Error("Cannot mix number and bigint in multiple_of check.");(typeof r.value=="bigint"?r.value%t.value===BigInt(0):ys(r.value,t.value)===0)||r.issues.push({origin:typeof r.value,code:"not_multiple_of",divisor:t.value,input:r.value,inst:e,continue:!t.abort})}}),wl=h("$ZodCheckNumberFormat",(e,t)=>{var a;L.init(e,t),t.format=t.format||"float64";const r=(a=t.format)==null?void 0:a.includes("int"),i=r?"int":"number",[n,o]=ws[t.format];e._zod.onattach.push(s=>{const c=s._zod.bag;c.format=t.format,c.minimum=n,c.maximum=o,r&&(c.pattern=hl)}),e._zod.check=s=>{const c=s.value;if(r){if(!Number.isInteger(c)){s.issues.push({expected:i,format:t.format,code:"invalid_type",continue:!1,input:c,inst:e});return}if(!Number.isSafeInteger(c)){c>0?s.issues.push({input:c,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:e,origin:i,inclusive:!0,continue:!t.abort}):s.issues.push({input:c,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:e,origin:i,inclusive:!0,continue:!t.abort});return}}c<n&&s.issues.push({origin:"number",input:c,code:"too_small",minimum:n,inclusive:!0,inst:e,continue:!t.abort}),c>o&&s.issues.push({origin:"number",input:c,code:"too_big",maximum:o,inclusive:!0,inst:e,continue:!t.abort})}}),Sl=h("$ZodCheckBigIntFormat",(e,t)=>{L.init(e,t);const[r,i]=Ss[t.format];e._zod.onattach.push(n=>{const o=n._zod.bag;o.format=t.format,o.minimum=r,o.maximum=i}),e._zod.check=n=>{const o=n.value;o<r&&n.issues.push({origin:"bigint",input:o,code:"too_small",minimum:r,inclusive:!0,inst:e,continue:!t.abort}),o>i&&n.issues.push({origin:"bigint",input:o,code:"too_big",maximum:i,inclusive:!0,inst:e,continue:!t.abort})}}),zl=h("$ZodCheckMaxSize",(e,t)=>{var r;L.init(e,t),(r=e._zod.def).when??(r.when=i=>{const n=i.value;return!Ue(n)&&n.size!==void 0}),e._zod.onattach.push(i=>{const n=i._zod.bag.maximum??Number.POSITIVE_INFINITY;t.maximum<n&&(i._zod.bag.maximum=t.maximum)}),e._zod.check=i=>{const n=i.value;n.size<=t.maximum||i.issues.push({origin:En(n),code:"too_big",maximum:t.maximum,inclusive:!0,input:n,inst:e,continue:!t.abort})}}),Il=h("$ZodCheckMinSize",(e,t)=>{var r;L.init(e,t),(r=e._zod.def).when??(r.when=i=>{const n=i.value;return!Ue(n)&&n.size!==void 0}),e._zod.onattach.push(i=>{const n=i._zod.bag.minimum??Number.NEGATIVE_INFINITY;t.minimum>n&&(i._zod.bag.minimum=t.minimum)}),e._zod.check=i=>{const n=i.value;n.size>=t.minimum||i.issues.push({origin:En(n),code:"too_small",minimum:t.minimum,inclusive:!0,input:n,inst:e,continue:!t.abort})}}),El=h("$ZodCheckSizeEquals",(e,t)=>{var r;L.init(e,t),(r=e._zod.def).when??(r.when=i=>{const n=i.value;return!Ue(n)&&n.size!==void 0}),e._zod.onattach.push(i=>{const n=i._zod.bag;n.minimum=t.size,n.maximum=t.size,n.size=t.size}),e._zod.check=i=>{const n=i.value,o=n.size;if(o===t.size)return;const a=o>t.size;i.issues.push({origin:En(n),...a?{code:"too_big",maximum:t.size}:{code:"too_small",minimum:t.size},inclusive:!0,exact:!0,input:i.value,inst:e,continue:!t.abort})}}),Dl=h("$ZodCheckMaxLength",(e,t)=>{var r;L.init(e,t),(r=e._zod.def).when??(r.when=i=>{const n=i.value;return!Ue(n)&&n.length!==void 0}),e._zod.onattach.push(i=>{const n=i._zod.bag.maximum??Number.POSITIVE_INFINITY;t.maximum<n&&(i._zod.bag.maximum=t.maximum)}),e._zod.check=i=>{const n=i.value;if(n.length<=t.maximum)return;const a=Dn(n);i.issues.push({origin:a,code:"too_big",maximum:t.maximum,inclusive:!0,input:n,inst:e,continue:!t.abort})}}),Pl=h("$ZodCheckMinLength",(e,t)=>{var r;L.init(e,t),(r=e._zod.def).when??(r.when=i=>{const n=i.value;return!Ue(n)&&n.length!==void 0}),e._zod.onattach.push(i=>{const n=i._zod.bag.minimum??Number.NEGATIVE_INFINITY;t.minimum>n&&(i._zod.bag.minimum=t.minimum)}),e._zod.check=i=>{const n=i.value;if(n.length>=t.minimum)return;const a=Dn(n);i.issues.push({origin:a,code:"too_small",minimum:t.minimum,inclusive:!0,input:n,inst:e,continue:!t.abort})}}),jl=h("$ZodCheckLengthEquals",(e,t)=>{var r;L.init(e,t),(r=e._zod.def).when??(r.when=i=>{const n=i.value;return!Ue(n)&&n.length!==void 0}),e._zod.onattach.push(i=>{const n=i._zod.bag;n.minimum=t.length,n.maximum=t.length,n.length=t.length}),e._zod.check=i=>{const n=i.value,o=n.length;if(o===t.length)return;const a=Dn(n),s=o>t.length;i.issues.push({origin:a,...s?{code:"too_big",maximum:t.length}:{code:"too_small",minimum:t.length},inclusive:!0,exact:!0,input:i.value,inst:e,continue:!t.abort})}}),wt=h("$ZodCheckStringFormat",(e,t)=>{var r,i;L.init(e,t),e._zod.onattach.push(n=>{const o=n._zod.bag;o.format=t.format,t.pattern&&(o.patterns??(o.patterns=new Set),o.patterns.add(t.pattern))}),t.pattern?(r=e._zod).check??(r.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:t.format,input:n.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(i=e._zod).check??(i.check=()=>{})}),Ol=h("$ZodCheckRegex",(e,t)=>{wt.init(e,t),e._zod.check=r=>{t.pattern.lastIndex=0,!t.pattern.test(r.value)&&r.issues.push({origin:"string",code:"invalid_format",format:"regex",input:r.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),Ul=h("$ZodCheckLowerCase",(e,t)=>{t.pattern??(t.pattern=yl),wt.init(e,t)}),Nl=h("$ZodCheckUpperCase",(e,t)=>{t.pattern??(t.pattern=$l),wt.init(e,t)}),Al=h("$ZodCheckIncludes",(e,t)=>{L.init(e,t);const r=fe(t.includes),i=new RegExp(typeof t.position=="number"?`^.{${t.position}}${r}`:r);t.pattern=i,e._zod.onattach.push(n=>{const o=n._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(i)}),e._zod.check=n=>{n.value.includes(t.includes,t.position)||n.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:t.includes,input:n.value,inst:e,continue:!t.abort})}}),Cl=h("$ZodCheckStartsWith",(e,t)=>{L.init(e,t);const r=new RegExp(`^${fe(t.prefix)}.*`);t.pattern??(t.pattern=r),e._zod.onattach.push(i=>{const n=i._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(r)}),e._zod.check=i=>{i.value.startsWith(t.prefix)||i.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:t.prefix,input:i.value,inst:e,continue:!t.abort})}}),Tl=h("$ZodCheckEndsWith",(e,t)=>{L.init(e,t);const r=new RegExp(`.*${fe(t.suffix)}$`);t.pattern??(t.pattern=r),e._zod.onattach.push(i=>{const n=i._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(r)}),e._zod.check=i=>{i.value.endsWith(t.suffix)||i.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:t.suffix,input:i.value,inst:e,continue:!t.abort})}});function Aa(e,t,r){e.issues.length&&t.issues.push(...le(r,e.issues))}const Rl=h("$ZodCheckProperty",(e,t)=>{L.init(e,t),e._zod.check=r=>{const i=t.schema._zod.run({value:r.value[t.property],issues:[]},{});if(i instanceof Promise)return i.then(n=>Aa(n,r,t.property));Aa(i,r,t.property)}}),Zl=h("$ZodCheckMimeType",(e,t)=>{L.init(e,t);const r=new Set(t.mime);e._zod.onattach.push(i=>{i._zod.bag.mime=t.mime}),e._zod.check=i=>{r.has(i.value.type)||i.issues.push({code:"invalid_value",values:t.mime,input:i.value.type,inst:e,continue:!t.abort})}}),Ll=h("$ZodCheckOverwrite",(e,t)=>{L.init(e,t),e._zod.check=r=>{r.value=t.tx(r.value)}});class Fl{constructor(t=[]){this.content=[],this.indent=0,this&&(this.args=t)}indented(t){this.indent+=1,t(this),this.indent-=1}write(t){if(typeof t=="function"){t(this,{execution:"sync"}),t(this,{execution:"async"});return}const i=t.split(`
`).filter(a=>a),n=Math.min(...i.map(a=>a.length-a.trimStart().length)),o=i.map(a=>a.slice(n)).map(a=>" ".repeat(this.indent*2)+a);for(const a of o)this.content.push(a)}compile(){const t=Function,r=this==null?void 0:this.args,n=[...((this==null?void 0:this.content)??[""]).map(o=>`  ${o}`)];return new t(...r,n.join(`
`))}}const Ml={major:4,minor:3,patch:6},z=h("$ZodType",(e,t)=>{var n;var r;e??(e={}),e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=Ml;const i=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&i.unshift(e);for(const o of i)for(const a of o._zod.onattach)a(e);if(i.length===0)(r=e._zod).deferred??(r.deferred=[]),(n=e._zod.deferred)==null||n.push(()=>{e._zod.run=e._zod.parse});else{const o=(s,c,l)=>{let u=ze(s),d;for(const f of c){if(f._zod.def.when){if(!f._zod.def.when(s))continue}else if(u)continue;const p=s.issues.length,b=f._zod.check(s);if(b instanceof Promise&&(l==null?void 0:l.async)===!1)throw new Ie;if(d||b instanceof Promise)d=(d??Promise.resolve()).then(async()=>{await b,s.issues.length!==p&&(u||(u=ze(s,p)))});else{if(s.issues.length===p)continue;u||(u=ze(s,p))}}return d?d.then(()=>s):s},a=(s,c,l)=>{if(ze(s))return s.aborted=!0,s;const u=o(c,i,l);if(u instanceof Promise){if(l.async===!1)throw new Ie;return u.then(d=>e._zod.parse(d,l))}return e._zod.parse(u,l)};e._zod.run=(s,c)=>{if(c.skipChecks)return e._zod.parse(s,c);if(c.direction==="backward"){const u=e._zod.parse({value:s.value,issues:[]},{...c,skipChecks:!0});return u instanceof Promise?u.then(d=>a(d,s,c)):a(u,s,c)}const l=e._zod.parse(s,c);if(l instanceof Promise){if(c.async===!1)throw new Ie;return l.then(u=>o(u,i,c))}return o(l,i,c)}}E(e,"~standard",()=>({validate:o=>{var a;try{const s=Ls(e,o);return s.success?{value:s.data}:{issues:(a=s.error)==null?void 0:a.issues}}catch{return Fs(e,o).then(c=>{var l;return c.success?{value:c.data}:{issues:(l=c.error)==null?void 0:l.issues}})}},vendor:"zod",version:1}))}),St=h("$ZodString",(e,t)=>{var r;z.init(e,t),e._zod.pattern=[...((r=e==null?void 0:e._zod.bag)==null?void 0:r.patterns)??[]].pop()??ml(e._zod.bag),e._zod.parse=(i,n)=>{if(t.coerce)try{i.value=String(i.value)}catch{}return typeof i.value=="string"||i.issues.push({expected:"string",code:"invalid_type",input:i.value,inst:e}),i}}),A=h("$ZodStringFormat",(e,t)=>{wt.init(e,t),St.init(e,t)}),Kl=h("$ZodGUID",(e,t)=>{t.pattern??(t.pattern=Ws),A.init(e,t)}),ql=h("$ZodUUID",(e,t)=>{if(t.version){const i={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(i===void 0)throw new Error(`Invalid UUID version: "${t.version}"`);t.pattern??(t.pattern=qe(i))}else t.pattern??(t.pattern=qe());A.init(e,t)}),Jl=h("$ZodEmail",(e,t)=>{t.pattern??(t.pattern=Xs),A.init(e,t)}),Bl=h("$ZodURL",(e,t)=>{A.init(e,t),e._zod.check=r=>{try{const i=r.value.trim(),n=new URL(i);t.hostname&&(t.hostname.lastIndex=0,t.hostname.test(n.hostname)||r.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:t.hostname.source,input:r.value,inst:e,continue:!t.abort})),t.protocol&&(t.protocol.lastIndex=0,t.protocol.test(n.protocol.endsWith(":")?n.protocol.slice(0,-1):n.protocol)||r.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:t.protocol.source,input:r.value,inst:e,continue:!t.abort})),t.normalize?r.value=n.href:r.value=i;return}catch{r.issues.push({code:"invalid_format",format:"url",input:r.value,inst:e,continue:!t.abort})}}}),Gl=h("$ZodEmoji",(e,t)=>{t.pattern??(t.pattern=Qs()),A.init(e,t)}),Vl=h("$ZodNanoID",(e,t)=>{t.pattern??(t.pattern=Gs),A.init(e,t)}),Wl=h("$ZodCUID",(e,t)=>{t.pattern??(t.pattern=Ms),A.init(e,t)}),Xl=h("$ZodCUID2",(e,t)=>{t.pattern??(t.pattern=Ks),A.init(e,t)}),Hl=h("$ZodULID",(e,t)=>{t.pattern??(t.pattern=qs),A.init(e,t)}),Ql=h("$ZodXID",(e,t)=>{t.pattern??(t.pattern=Js),A.init(e,t)}),Yl=h("$ZodKSUID",(e,t)=>{t.pattern??(t.pattern=Bs),A.init(e,t)}),ec=h("$ZodISODateTime",(e,t)=>{t.pattern??(t.pattern=pl(t)),A.init(e,t)}),tc=h("$ZodISODate",(e,t)=>{t.pattern??(t.pattern=cl),A.init(e,t)}),nc=h("$ZodISOTime",(e,t)=>{t.pattern??(t.pattern=dl(t)),A.init(e,t)}),rc=h("$ZodISODuration",(e,t)=>{t.pattern??(t.pattern=Vs),A.init(e,t)}),ic=h("$ZodIPv4",(e,t)=>{t.pattern??(t.pattern=Ys),A.init(e,t),e._zod.bag.format="ipv4"}),oc=h("$ZodIPv6",(e,t)=>{t.pattern??(t.pattern=el),A.init(e,t),e._zod.bag.format="ipv6",e._zod.check=r=>{try{new URL(`http://[${r.value}]`)}catch{r.issues.push({code:"invalid_format",format:"ipv6",input:r.value,inst:e,continue:!t.abort})}}}),ac=h("$ZodMAC",(e,t)=>{t.pattern??(t.pattern=tl(t.delimiter)),A.init(e,t),e._zod.bag.format="mac"}),sc=h("$ZodCIDRv4",(e,t)=>{t.pattern??(t.pattern=nl),A.init(e,t)}),lc=h("$ZodCIDRv6",(e,t)=>{t.pattern??(t.pattern=rl),A.init(e,t),e._zod.check=r=>{const i=r.value.split("/");try{if(i.length!==2)throw new Error;const[n,o]=i;if(!o)throw new Error;const a=Number(o);if(`${a}`!==o)throw new Error;if(a<0||a>128)throw new Error;new URL(`http://[${n}]`)}catch{r.issues.push({code:"invalid_format",format:"cidrv6",input:r.value,inst:e,continue:!t.abort})}}});function bi(e){if(e==="")return!0;if(e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}const cc=h("$ZodBase64",(e,t)=>{t.pattern??(t.pattern=il),A.init(e,t),e._zod.bag.contentEncoding="base64",e._zod.check=r=>{bi(r.value)||r.issues.push({code:"invalid_format",format:"base64",input:r.value,inst:e,continue:!t.abort})}});function uc(e){if(!mi.test(e))return!1;const t=e.replace(/[-_]/g,i=>i==="-"?"+":"/"),r=t.padEnd(Math.ceil(t.length/4)*4,"=");return bi(r)}const dc=h("$ZodBase64URL",(e,t)=>{t.pattern??(t.pattern=mi),A.init(e,t),e._zod.bag.contentEncoding="base64url",e._zod.check=r=>{uc(r.value)||r.issues.push({code:"invalid_format",format:"base64url",input:r.value,inst:e,continue:!t.abort})}}),pc=h("$ZodE164",(e,t)=>{t.pattern??(t.pattern=sl),A.init(e,t)});function mc(e,t=null){try{const r=e.split(".");if(r.length!==3)return!1;const[i]=r;if(!i)return!1;const n=JSON.parse(atob(i));return!("typ"in n&&(n==null?void 0:n.typ)!=="JWT"||!n.alg||t&&(!("alg"in n)||n.alg!==t))}catch{return!1}}const fc=h("$ZodJWT",(e,t)=>{A.init(e,t),e._zod.check=r=>{mc(r.value,t.alg)||r.issues.push({code:"invalid_format",format:"jwt",input:r.value,inst:e,continue:!t.abort})}}),hc=h("$ZodCustomStringFormat",(e,t)=>{A.init(e,t),e._zod.check=r=>{t.fn(r.value)||r.issues.push({code:"invalid_format",format:t.format,input:r.value,inst:e,continue:!t.abort})}}),yi=h("$ZodNumber",(e,t)=>{z.init(e,t),e._zod.pattern=e._zod.bag.pattern??fi,e._zod.parse=(r,i)=>{if(t.coerce)try{r.value=Number(r.value)}catch{}const n=r.value;if(typeof n=="number"&&!Number.isNaN(n)&&Number.isFinite(n))return r;const o=typeof n=="number"?Number.isNaN(n)?"NaN":Number.isFinite(n)?void 0:"Infinity":void 0;return r.issues.push({expected:"number",code:"invalid_type",input:n,inst:e,...o?{received:o}:{}}),r}}),gc=h("$ZodNumberFormat",(e,t)=>{wl.init(e,t),yi.init(e,t)}),$i=h("$ZodBoolean",(e,t)=>{z.init(e,t),e._zod.pattern=gl,e._zod.parse=(r,i)=>{if(t.coerce)try{r.value=!!r.value}catch{}const n=r.value;return typeof n=="boolean"||r.issues.push({expected:"boolean",code:"invalid_type",input:n,inst:e}),r}}),ki=h("$ZodBigInt",(e,t)=>{z.init(e,t),e._zod.pattern=fl,e._zod.parse=(r,i)=>{if(t.coerce)try{r.value=BigInt(r.value)}catch{}return typeof r.value=="bigint"||r.issues.push({expected:"bigint",code:"invalid_type",input:r.value,inst:e}),r}}),vc=h("$ZodBigIntFormat",(e,t)=>{Sl.init(e,t),ki.init(e,t)}),bc=h("$ZodSymbol",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;return typeof n=="symbol"||r.issues.push({expected:"symbol",code:"invalid_type",input:n,inst:e}),r}}),yc=h("$ZodUndefined",(e,t)=>{z.init(e,t),e._zod.pattern=bl,e._zod.values=new Set([void 0]),e._zod.optin="optional",e._zod.optout="optional",e._zod.parse=(r,i)=>{const n=r.value;return typeof n>"u"||r.issues.push({expected:"undefined",code:"invalid_type",input:n,inst:e}),r}}),$c=h("$ZodNull",(e,t)=>{z.init(e,t),e._zod.pattern=vl,e._zod.values=new Set([null]),e._zod.parse=(r,i)=>{const n=r.value;return n===null||r.issues.push({expected:"null",code:"invalid_type",input:n,inst:e}),r}}),kc=h("$ZodAny",(e,t)=>{z.init(e,t),e._zod.parse=r=>r}),xc=h("$ZodUnknown",(e,t)=>{z.init(e,t),e._zod.parse=r=>r}),_c=h("$ZodNever",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>(r.issues.push({expected:"never",code:"invalid_type",input:r.value,inst:e}),r)}),wc=h("$ZodVoid",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;return typeof n>"u"||r.issues.push({expected:"void",code:"invalid_type",input:n,inst:e}),r}}),Sc=h("$ZodDate",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{if(t.coerce)try{r.value=new Date(r.value)}catch{}const n=r.value,o=n instanceof Date;return o&&!Number.isNaN(n.getTime())||r.issues.push({expected:"date",code:"invalid_type",input:n,...o?{received:"Invalid Date"}:{},inst:e}),r}});function Ca(e,t,r){e.issues.length&&t.issues.push(...le(r,e.issues)),t.value[r]=e.value}const zc=h("$ZodArray",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;if(!Array.isArray(n))return r.issues.push({expected:"array",code:"invalid_type",input:n,inst:e}),r;r.value=Array(n.length);const o=[];for(let a=0;a<n.length;a++){const s=n[a],c=t.element._zod.run({value:s,issues:[]},i);c instanceof Promise?o.push(c.then(l=>Ca(l,r,a))):Ca(c,r,a)}return o.length?Promise.all(o).then(()=>r):r}});function nn(e,t,r,i,n){if(e.issues.length){if(n&&!(r in i))return;t.issues.push(...le(r,e.issues))}e.value===void 0?r in i&&(t.value[r]=void 0):t.value[r]=e.value}function Ic(e){var i,n,o,a;const t=Object.keys(e.shape);for(const s of t)if(!((a=(o=(n=(i=e.shape)==null?void 0:i[s])==null?void 0:n._zod)==null?void 0:o.traits)!=null&&a.has("$ZodType")))throw new Error(`Invalid element at key "${s}": expected a Zod schema`);const r=_s(e.shape);return{...e,keys:t,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(r)}}function Ec(e,t,r,i,n,o){const a=[],s=n.keySet,c=n.catchall._zod,l=c.def.type,u=c.optout==="optional";for(const d in t){if(s.has(d))continue;if(l==="never"){a.push(d);continue}const f=c.run({value:t[d],issues:[]},i);f instanceof Promise?e.push(f.then(p=>nn(p,r,d,t,u))):nn(f,r,d,t,u)}return a.length&&r.issues.push({code:"unrecognized_keys",keys:a,input:t,inst:o}),e.length?Promise.all(e).then(()=>r):r}const Dc=h("$ZodObject",(e,t)=>{z.init(e,t);const r=Object.getOwnPropertyDescriptor(t,"shape");if(!(r!=null&&r.get)){const s=t.shape;Object.defineProperty(t,"shape",{get:()=>{const c={...s};return Object.defineProperty(t,"shape",{value:c}),c}})}const i=vt(()=>Ic(t));E(e._zod,"propValues",()=>{const s=t.shape,c={};for(const l in s){const u=s[l]._zod;if(u.values){c[l]??(c[l]=new Set);for(const d of u.values)c[l].add(d)}}return c});const n=Me,o=t.catchall;let a;e._zod.parse=(s,c)=>{a??(a=i.value);const l=s.value;if(!n(l))return s.issues.push({expected:"object",code:"invalid_type",input:l,inst:e}),s;s.value={};const u=[],d=a.shape;for(const f of a.keys){const p=d[f],b=p._zod.optout==="optional",g=p._zod.run({value:l[f],issues:[]},c);g instanceof Promise?u.push(g.then(x=>nn(x,s,f,l,b))):nn(g,s,f,l,b)}return o?Ec(u,l,s,c,i.value,e):u.length?Promise.all(u).then(()=>s):s}}),Pc=h("$ZodObjectJIT",(e,t)=>{Dc.init(e,t);const r=e._zod.parse,i=vt(()=>Ic(t)),n=f=>{var B;const p=new Fl(["shape","payload","ctx"]),b=i.value,g=M=>{const Z=Mr(M);return`shape[${Z}]._zod.run({ value: input[${Z}], issues: [] }, ctx)`};p.write("const input = payload.value;");const x=Object.create(null);let T=0;for(const M of b.keys)x[M]=`key_${T++}`;p.write("const newResult = {};");for(const M of b.keys){const Z=x[M],F=Mr(M),G=f[M],X=((B=G==null?void 0:G._zod)==null?void 0:B.optout)==="optional";p.write(`const ${Z} = ${g(M)};`),X?p.write(`
        if (${Z}.issues.length) {
          if (${F} in input) {
            payload.issues = payload.issues.concat(${Z}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${F}, ...iss.path] : [${F}]
            })));
          }
        }
        
        if (${Z}.value === undefined) {
          if (${F} in input) {
            newResult[${F}] = undefined;
          }
        } else {
          newResult[${F}] = ${Z}.value;
        }
        
      `):p.write(`
        if (${Z}.issues.length) {
          payload.issues = payload.issues.concat(${Z}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${F}, ...iss.path] : [${F}]
          })));
        }
        
        if (${Z}.value === undefined) {
          if (${F} in input) {
            newResult[${F}] = undefined;
          }
        } else {
          newResult[${F}] = ${Z}.value;
        }
        
      `)}p.write("payload.value = newResult;"),p.write("return payload;");const P=p.compile();return(M,Z)=>P(f,M,Z)};let o;const a=Me,s=!Yt.jitless,l=s&&ks.value,u=t.catchall;let d;e._zod.parse=(f,p)=>{d??(d=i.value);const b=f.value;return a(b)?s&&l&&(p==null?void 0:p.async)===!1&&p.jitless!==!0?(o||(o=n(t.shape)),f=o(f,p),u?Ec([],b,f,p,d,e):f):r(f,p):(f.issues.push({expected:"object",code:"invalid_type",input:b,inst:e}),f)}});function Ta(e,t,r,i){for(const o of e)if(o.issues.length===0)return t.value=o.value,t;const n=e.filter(o=>!ze(o));return n.length===1?(t.value=n[0].value,n[0]):(t.issues.push({code:"invalid_union",input:t.value,inst:r,errors:e.map(o=>o.issues.map(a=>ie(a,i,J())))}),t)}const Pn=h("$ZodUnion",(e,t)=>{z.init(e,t),E(e._zod,"optin",()=>t.options.some(n=>n._zod.optin==="optional")?"optional":void 0),E(e._zod,"optout",()=>t.options.some(n=>n._zod.optout==="optional")?"optional":void 0),E(e._zod,"values",()=>{if(t.options.every(n=>n._zod.values))return new Set(t.options.flatMap(n=>Array.from(n._zod.values)))}),E(e._zod,"pattern",()=>{if(t.options.every(n=>n._zod.pattern)){const n=t.options.map(o=>o._zod.pattern);return new RegExp(`^(${n.map(o=>zn(o.source)).join("|")})$`)}});const r=t.options.length===1,i=t.options[0]._zod.run;e._zod.parse=(n,o)=>{if(r)return i(n,o);let a=!1;const s=[];for(const c of t.options){const l=c._zod.run({value:n.value,issues:[]},o);if(l instanceof Promise)s.push(l),a=!0;else{if(l.issues.length===0)return l;s.push(l)}}return a?Promise.all(s).then(c=>Ta(c,n,e,o)):Ta(s,n,e,o)}});function Ra(e,t,r,i){const n=e.filter(o=>o.issues.length===0);return n.length===1?(t.value=n[0].value,t):(n.length===0?t.issues.push({code:"invalid_union",input:t.value,inst:r,errors:e.map(o=>o.issues.map(a=>ie(a,i,J())))}):t.issues.push({code:"invalid_union",input:t.value,inst:r,errors:[],inclusive:!1}),t)}const jc=h("$ZodXor",(e,t)=>{Pn.init(e,t),t.inclusive=!1;const r=t.options.length===1,i=t.options[0]._zod.run;e._zod.parse=(n,o)=>{if(r)return i(n,o);let a=!1;const s=[];for(const c of t.options){const l=c._zod.run({value:n.value,issues:[]},o);l instanceof Promise?(s.push(l),a=!0):s.push(l)}return a?Promise.all(s).then(c=>Ra(c,n,e,o)):Ra(s,n,e,o)}}),Oc=h("$ZodDiscriminatedUnion",(e,t)=>{t.inclusive=!1,Pn.init(e,t);const r=e._zod.parse;E(e._zod,"propValues",()=>{const n={};for(const o of t.options){const a=o._zod.propValues;if(!a||Object.keys(a).length===0)throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(o)}"`);for(const[s,c]of Object.entries(a)){n[s]||(n[s]=new Set);for(const l of c)n[s].add(l)}}return n});const i=vt(()=>{var a;const n=t.options,o=new Map;for(const s of n){const c=(a=s._zod.propValues)==null?void 0:a[t.discriminator];if(!c||c.size===0)throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(s)}"`);for(const l of c){if(o.has(l))throw new Error(`Duplicate discriminator value "${String(l)}"`);o.set(l,s)}}return o});e._zod.parse=(n,o)=>{const a=n.value;if(!Me(a))return n.issues.push({code:"invalid_type",expected:"object",input:a,inst:e}),n;const s=i.value.get(a==null?void 0:a[t.discriminator]);return s?s._zod.run(n,o):t.unionFallback?r(n,o):(n.issues.push({code:"invalid_union",errors:[],note:"No matching discriminator",discriminator:t.discriminator,input:a,path:[t.discriminator],inst:e}),n)}}),Uc=h("$ZodIntersection",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value,o=t.left._zod.run({value:n,issues:[]},i),a=t.right._zod.run({value:n,issues:[]},i);return o instanceof Promise||a instanceof Promise?Promise.all([o,a]).then(([c,l])=>Za(r,c,l)):Za(r,o,a)}});function Jr(e,t){if(e===t)return{valid:!0,data:e};if(e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(Ee(e)&&Ee(t)){const r=Object.keys(t),i=Object.keys(e).filter(o=>r.indexOf(o)!==-1),n={...e,...t};for(const o of i){const a=Jr(e[o],t[o]);if(!a.valid)return{valid:!1,mergeErrorPath:[o,...a.mergeErrorPath]};n[o]=a.data}return{valid:!0,data:n}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};const r=[];for(let i=0;i<e.length;i++){const n=e[i],o=t[i],a=Jr(n,o);if(!a.valid)return{valid:!1,mergeErrorPath:[i,...a.mergeErrorPath]};r.push(a.data)}return{valid:!0,data:r}}return{valid:!1,mergeErrorPath:[]}}function Za(e,t,r){const i=new Map;let n;for(const s of t.issues)if(s.code==="unrecognized_keys"){n??(n=s);for(const c of s.keys)i.has(c)||i.set(c,{}),i.get(c).l=!0}else e.issues.push(s);for(const s of r.issues)if(s.code==="unrecognized_keys")for(const c of s.keys)i.has(c)||i.set(c,{}),i.get(c).r=!0;else e.issues.push(s);const o=[...i].filter(([,s])=>s.l&&s.r).map(([s])=>s);if(o.length&&n&&e.issues.push({...n,keys:o}),ze(e))return e;const a=Jr(t.value,r.value);if(!a.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(a.mergeErrorPath)}`);return e.value=a.data,e}const xi=h("$ZodTuple",(e,t)=>{z.init(e,t);const r=t.items;e._zod.parse=(i,n)=>{const o=i.value;if(!Array.isArray(o))return i.issues.push({input:o,inst:e,expected:"tuple",code:"invalid_type"}),i;i.value=[];const a=[],s=[...r].reverse().findIndex(u=>u._zod.optin!=="optional"),c=s===-1?0:r.length-s;if(!t.rest){const u=o.length>r.length,d=o.length<c-1;if(u||d)return i.issues.push({...u?{code:"too_big",maximum:r.length,inclusive:!0}:{code:"too_small",minimum:r.length},input:o,inst:e,origin:"array"}),i}let l=-1;for(const u of r){if(l++,l>=o.length&&l>=c)continue;const d=u._zod.run({value:o[l],issues:[]},n);d instanceof Promise?a.push(d.then(f=>Kt(f,i,l))):Kt(d,i,l)}if(t.rest){const u=o.slice(r.length);for(const d of u){l++;const f=t.rest._zod.run({value:d,issues:[]},n);f instanceof Promise?a.push(f.then(p=>Kt(p,i,l))):Kt(f,i,l)}}return a.length?Promise.all(a).then(()=>i):i}});function Kt(e,t,r){e.issues.length&&t.issues.push(...le(r,e.issues)),t.value[r]=e.value}const Nc=h("$ZodRecord",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;if(!Ee(n))return r.issues.push({expected:"record",code:"invalid_type",input:n,inst:e}),r;const o=[],a=t.keyType._zod.values;if(a){r.value={};const s=new Set;for(const l of a)if(typeof l=="string"||typeof l=="number"||typeof l=="symbol"){s.add(typeof l=="number"?l.toString():l);const u=t.valueType._zod.run({value:n[l],issues:[]},i);u instanceof Promise?o.push(u.then(d=>{d.issues.length&&r.issues.push(...le(l,d.issues)),r.value[l]=d.value})):(u.issues.length&&r.issues.push(...le(l,u.issues)),r.value[l]=u.value)}let c;for(const l in n)s.has(l)||(c=c??[],c.push(l));c&&c.length>0&&r.issues.push({code:"unrecognized_keys",input:n,inst:e,keys:c})}else{r.value={};for(const s of Reflect.ownKeys(n)){if(s==="__proto__")continue;let c=t.keyType._zod.run({value:s,issues:[]},i);if(c instanceof Promise)throw new Error("Async schemas not supported in object keys currently");if(typeof s=="string"&&fi.test(s)&&c.issues.length){const d=t.keyType._zod.run({value:Number(s),issues:[]},i);if(d instanceof Promise)throw new Error("Async schemas not supported in object keys currently");d.issues.length===0&&(c=d)}if(c.issues.length){t.mode==="loose"?r.value[s]=n[s]:r.issues.push({code:"invalid_key",origin:"record",issues:c.issues.map(d=>ie(d,i,J())),input:s,path:[s],inst:e});continue}const u=t.valueType._zod.run({value:n[s],issues:[]},i);u instanceof Promise?o.push(u.then(d=>{d.issues.length&&r.issues.push(...le(s,d.issues)),r.value[c.value]=d.value})):(u.issues.length&&r.issues.push(...le(s,u.issues)),r.value[c.value]=u.value)}}return o.length?Promise.all(o).then(()=>r):r}}),Ac=h("$ZodMap",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;if(!(n instanceof Map))return r.issues.push({expected:"map",code:"invalid_type",input:n,inst:e}),r;const o=[];r.value=new Map;for(const[a,s]of n){const c=t.keyType._zod.run({value:a,issues:[]},i),l=t.valueType._zod.run({value:s,issues:[]},i);c instanceof Promise||l instanceof Promise?o.push(Promise.all([c,l]).then(([u,d])=>{La(u,d,r,a,n,e,i)})):La(c,l,r,a,n,e,i)}return o.length?Promise.all(o).then(()=>r):r}});function La(e,t,r,i,n,o,a){e.issues.length&&(tn.has(typeof i)?r.issues.push(...le(i,e.issues)):r.issues.push({code:"invalid_key",origin:"map",input:n,inst:o,issues:e.issues.map(s=>ie(s,a,J()))})),t.issues.length&&(tn.has(typeof i)?r.issues.push(...le(i,t.issues)):r.issues.push({origin:"map",code:"invalid_element",input:n,inst:o,key:i,issues:t.issues.map(s=>ie(s,a,J()))})),r.value.set(e.value,t.value)}const Cc=h("$ZodSet",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;if(!(n instanceof Set))return r.issues.push({input:n,inst:e,expected:"set",code:"invalid_type"}),r;const o=[];r.value=new Set;for(const a of n){const s=t.valueType._zod.run({value:a,issues:[]},i);s instanceof Promise?o.push(s.then(c=>Fa(c,r))):Fa(s,r)}return o.length?Promise.all(o).then(()=>r):r}});function Fa(e,t){e.issues.length&&t.issues.push(...e.issues),t.value.add(e.value)}const Tc=h("$ZodEnum",(e,t)=>{z.init(e,t);const r=ei(t.entries),i=new Set(r);e._zod.values=i,e._zod.pattern=new RegExp(`^(${r.filter(n=>tn.has(typeof n)).map(n=>typeof n=="string"?fe(n):n.toString()).join("|")})$`),e._zod.parse=(n,o)=>{const a=n.value;return i.has(a)||n.issues.push({code:"invalid_value",values:r,input:a,inst:e}),n}}),Rc=h("$ZodLiteral",(e,t)=>{if(z.init(e,t),t.values.length===0)throw new Error("Cannot create literal schema with no valid values");const r=new Set(t.values);e._zod.values=r,e._zod.pattern=new RegExp(`^(${t.values.map(i=>typeof i=="string"?fe(i):i?fe(i.toString()):String(i)).join("|")})$`),e._zod.parse=(i,n)=>{const o=i.value;return r.has(o)||i.issues.push({code:"invalid_value",values:t.values,input:o,inst:e}),i}}),Zc=h("$ZodFile",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{const n=r.value;return n instanceof File||r.issues.push({expected:"file",code:"invalid_type",input:n,inst:e}),r}}),Lc=h("$ZodTransform",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{if(i.direction==="backward")throw new Sn(e.constructor.name);const n=t.transform(r.value,r);if(i.async)return(n instanceof Promise?n:Promise.resolve(n)).then(a=>(r.value=a,r));if(n instanceof Promise)throw new Ie;return r.value=n,r}});function Ma(e,t){return e.issues.length&&t===void 0?{issues:[],value:void 0}:e}const _i=h("$ZodOptional",(e,t)=>{z.init(e,t),e._zod.optin="optional",e._zod.optout="optional",E(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,void 0]):void 0),E(e._zod,"pattern",()=>{const r=t.innerType._zod.pattern;return r?new RegExp(`^(${zn(r.source)})?$`):void 0}),e._zod.parse=(r,i)=>{if(t.innerType._zod.optin==="optional"){const n=t.innerType._zod.run(r,i);return n instanceof Promise?n.then(o=>Ma(o,r.value)):Ma(n,r.value)}return r.value===void 0?r:t.innerType._zod.run(r,i)}}),Fc=h("$ZodExactOptional",(e,t)=>{_i.init(e,t),E(e._zod,"values",()=>t.innerType._zod.values),E(e._zod,"pattern",()=>t.innerType._zod.pattern),e._zod.parse=(r,i)=>t.innerType._zod.run(r,i)}),Mc=h("$ZodNullable",(e,t)=>{z.init(e,t),E(e._zod,"optin",()=>t.innerType._zod.optin),E(e._zod,"optout",()=>t.innerType._zod.optout),E(e._zod,"pattern",()=>{const r=t.innerType._zod.pattern;return r?new RegExp(`^(${zn(r.source)}|null)$`):void 0}),E(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,null]):void 0),e._zod.parse=(r,i)=>r.value===null?r:t.innerType._zod.run(r,i)}),Kc=h("$ZodDefault",(e,t)=>{z.init(e,t),e._zod.optin="optional",E(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(r,i)=>{if(i.direction==="backward")return t.innerType._zod.run(r,i);if(r.value===void 0)return r.value=t.defaultValue,r;const n=t.innerType._zod.run(r,i);return n instanceof Promise?n.then(o=>Ka(o,t)):Ka(n,t)}});function Ka(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}const qc=h("$ZodPrefault",(e,t)=>{z.init(e,t),e._zod.optin="optional",E(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(r,i)=>(i.direction==="backward"||r.value===void 0&&(r.value=t.defaultValue),t.innerType._zod.run(r,i))}),Jc=h("$ZodNonOptional",(e,t)=>{z.init(e,t),E(e._zod,"values",()=>{const r=t.innerType._zod.values;return r?new Set([...r].filter(i=>i!==void 0)):void 0}),e._zod.parse=(r,i)=>{const n=t.innerType._zod.run(r,i);return n instanceof Promise?n.then(o=>qa(o,e)):qa(n,e)}});function qa(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:t}),e}const Bc=h("$ZodSuccess",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>{if(i.direction==="backward")throw new Sn("ZodSuccess");const n=t.innerType._zod.run(r,i);return n instanceof Promise?n.then(o=>(r.value=o.issues.length===0,r)):(r.value=n.issues.length===0,r)}}),Gc=h("$ZodCatch",(e,t)=>{z.init(e,t),E(e._zod,"optin",()=>t.innerType._zod.optin),E(e._zod,"optout",()=>t.innerType._zod.optout),E(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(r,i)=>{if(i.direction==="backward")return t.innerType._zod.run(r,i);const n=t.innerType._zod.run(r,i);return n instanceof Promise?n.then(o=>(r.value=o.value,o.issues.length&&(r.value=t.catchValue({...r,error:{issues:o.issues.map(a=>ie(a,i,J()))},input:r.value}),r.issues=[]),r)):(r.value=n.value,n.issues.length&&(r.value=t.catchValue({...r,error:{issues:n.issues.map(o=>ie(o,i,J()))},input:r.value}),r.issues=[]),r)}}),Vc=h("$ZodNaN",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>((typeof r.value!="number"||!Number.isNaN(r.value))&&r.issues.push({input:r.value,inst:e,expected:"nan",code:"invalid_type"}),r)}),Wc=h("$ZodPipe",(e,t)=>{z.init(e,t),E(e._zod,"values",()=>t.in._zod.values),E(e._zod,"optin",()=>t.in._zod.optin),E(e._zod,"optout",()=>t.out._zod.optout),E(e._zod,"propValues",()=>t.in._zod.propValues),e._zod.parse=(r,i)=>{if(i.direction==="backward"){const o=t.out._zod.run(r,i);return o instanceof Promise?o.then(a=>qt(a,t.in,i)):qt(o,t.in,i)}const n=t.in._zod.run(r,i);return n instanceof Promise?n.then(o=>qt(o,t.out,i)):qt(n,t.out,i)}});function qt(e,t,r){return e.issues.length?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},r)}const wi=h("$ZodCodec",(e,t)=>{z.init(e,t),E(e._zod,"values",()=>t.in._zod.values),E(e._zod,"optin",()=>t.in._zod.optin),E(e._zod,"optout",()=>t.out._zod.optout),E(e._zod,"propValues",()=>t.in._zod.propValues),e._zod.parse=(r,i)=>{if((i.direction||"forward")==="forward"){const o=t.in._zod.run(r,i);return o instanceof Promise?o.then(a=>Jt(a,t,i)):Jt(o,t,i)}else{const o=t.out._zod.run(r,i);return o instanceof Promise?o.then(a=>Jt(a,t,i)):Jt(o,t,i)}}});function Jt(e,t,r){if(e.issues.length)return e.aborted=!0,e;if((r.direction||"forward")==="forward"){const n=t.transform(e.value,e);return n instanceof Promise?n.then(o=>Bt(e,o,t.out,r)):Bt(e,n,t.out,r)}else{const n=t.reverseTransform(e.value,e);return n instanceof Promise?n.then(o=>Bt(e,o,t.in,r)):Bt(e,n,t.in,r)}}function Bt(e,t,r,i){return e.issues.length?(e.aborted=!0,e):r._zod.run({value:t,issues:e.issues},i)}const Xc=h("$ZodReadonly",(e,t)=>{z.init(e,t),E(e._zod,"propValues",()=>t.innerType._zod.propValues),E(e._zod,"values",()=>t.innerType._zod.values),E(e._zod,"optin",()=>{var r,i;return(i=(r=t.innerType)==null?void 0:r._zod)==null?void 0:i.optin}),E(e._zod,"optout",()=>{var r,i;return(i=(r=t.innerType)==null?void 0:r._zod)==null?void 0:i.optout}),e._zod.parse=(r,i)=>{if(i.direction==="backward")return t.innerType._zod.run(r,i);const n=t.innerType._zod.run(r,i);return n instanceof Promise?n.then(Ja):Ja(n)}});function Ja(e){return e.value=Object.freeze(e.value),e}const Hc=h("$ZodTemplateLiteral",(e,t)=>{z.init(e,t);const r=[];for(const i of t.parts)if(typeof i=="object"&&i!==null){if(!i._zod.pattern)throw new Error(`Invalid template literal part, no pattern found: ${[...i._zod.traits].shift()}`);const n=i._zod.pattern instanceof RegExp?i._zod.pattern.source:i._zod.pattern;if(!n)throw new Error(`Invalid template literal part: ${i._zod.traits}`);const o=n.startsWith("^")?1:0,a=n.endsWith("$")?n.length-1:n.length;r.push(n.slice(o,a))}else if(i===null||xs.has(typeof i))r.push(fe(`${i}`));else throw new Error(`Invalid template literal part: ${i}`);e._zod.pattern=new RegExp(`^${r.join("")}$`),e._zod.parse=(i,n)=>typeof i.value!="string"?(i.issues.push({input:i.value,inst:e,expected:"string",code:"invalid_type"}),i):(e._zod.pattern.lastIndex=0,e._zod.pattern.test(i.value)||i.issues.push({input:i.value,inst:e,code:"invalid_format",format:t.format??"template_literal",pattern:e._zod.pattern.source}),i)}),Qc=h("$ZodFunction",(e,t)=>(z.init(e,t),e._def=t,e._zod.def=t,e.implement=r=>{if(typeof r!="function")throw new Error("implement() must be called with a function");return function(...i){const n=e._def.input?Kr(e._def.input,i):i,o=Reflect.apply(r,this,n);return e._def.output?Kr(e._def.output,o):o}},e.implementAsync=r=>{if(typeof r!="function")throw new Error("implementAsync() must be called with a function");return async function(...i){const n=e._def.input?await qr(e._def.input,i):i,o=await Reflect.apply(r,this,n);return e._def.output?await qr(e._def.output,o):o}},e._zod.parse=(r,i)=>typeof r.value!="function"?(r.issues.push({code:"invalid_type",expected:"function",input:r.value,inst:e}),r):(e._def.output&&e._def.output._zod.def.type==="promise"?r.value=e.implementAsync(r.value):r.value=e.implement(r.value),r),e.input=(...r)=>{const i=e.constructor;return Array.isArray(r[0])?new i({type:"function",input:new xi({type:"tuple",items:r[0],rest:r[1]}),output:e._def.output}):new i({type:"function",input:r[0],output:e._def.output})},e.output=r=>{const i=e.constructor;return new i({type:"function",input:e._def.input,output:r})},e)),Yc=h("$ZodPromise",(e,t)=>{z.init(e,t),e._zod.parse=(r,i)=>Promise.resolve(r.value).then(n=>t.innerType._zod.run({value:n,issues:[]},i))}),eu=h("$ZodLazy",(e,t)=>{z.init(e,t),E(e._zod,"innerType",()=>t.getter()),E(e._zod,"pattern",()=>{var r,i;return(i=(r=e._zod.innerType)==null?void 0:r._zod)==null?void 0:i.pattern}),E(e._zod,"propValues",()=>{var r,i;return(i=(r=e._zod.innerType)==null?void 0:r._zod)==null?void 0:i.propValues}),E(e._zod,"optin",()=>{var r,i;return((i=(r=e._zod.innerType)==null?void 0:r._zod)==null?void 0:i.optin)??void 0}),E(e._zod,"optout",()=>{var r,i;return((i=(r=e._zod.innerType)==null?void 0:r._zod)==null?void 0:i.optout)??void 0}),e._zod.parse=(r,i)=>e._zod.innerType._zod.run(r,i)}),tu=h("$ZodCustom",(e,t)=>{L.init(e,t),z.init(e,t),e._zod.parse=(r,i)=>r,e._zod.check=r=>{const i=r.value,n=t.fn(i);if(n instanceof Promise)return n.then(o=>Ba(o,r,i,e));Ba(n,r,i,e)}});function Ba(e,t,r,i){if(!e){const n={code:"custom",input:r,inst:i,path:[...i._zod.def.path??[]],continue:!i._zod.def.abort};i._zod.def.params&&(n.params=i._zod.def.params),t.issues.push(Ke(n))}}const rh=()=>{const e={string:{unit:"حرف",verb:"أن يحوي"},file:{unit:"بايت",verb:"أن يحوي"},array:{unit:"عنصر",verb:"أن يحوي"},set:{unit:"عنصر",verb:"أن يحوي"}};function t(n){return e[n]??null}const r={regex:"مدخل",email:"بريد إلكتروني",url:"رابط",emoji:"إيموجي",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"تاريخ ووقت بمعيار ISO",date:"تاريخ بمعيار ISO",time:"وقت بمعيار ISO",duration:"مدة بمعيار ISO",ipv4:"عنوان IPv4",ipv6:"عنوان IPv6",cidrv4:"مدى عناوين بصيغة IPv4",cidrv6:"مدى عناوين بصيغة IPv6",base64:"نَص بترميز base64-encoded",base64url:"نَص بترميز base64url-encoded",json_string:"نَص على هيئة JSON",e164:"رقم هاتف بمعيار E.164",jwt:"JWT",template_literal:"مدخل"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`مدخلات غير مقبولة: يفترض إدخال instanceof ${n.expected}، ولكن تم إدخال ${s}`:`مدخلات غير مقبولة: يفترض إدخال ${o}، ولكن تم إدخال ${s}`}case"invalid_value":return n.values.length===1?`مدخلات غير مقبولة: يفترض إدخال ${w(n.values[0])}`:`اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?` أكبر من اللازم: يفترض أن تكون ${n.origin??"القيمة"} ${o} ${n.maximum.toString()} ${a.unit??"عنصر"}`:`أكبر من اللازم: يفترض أن تكون ${n.origin??"القيمة"} ${o} ${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`أصغر من اللازم: يفترض لـ ${n.origin} أن يكون ${o} ${n.minimum.toString()} ${a.unit}`:`أصغر من اللازم: يفترض لـ ${n.origin} أن يكون ${o} ${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`نَص غير مقبول: يجب أن يبدأ بـ "${n.prefix}"`:o.format==="ends_with"?`نَص غير مقبول: يجب أن ينتهي بـ "${o.suffix}"`:o.format==="includes"?`نَص غير مقبول: يجب أن يتضمَّن "${o.includes}"`:o.format==="regex"?`نَص غير مقبول: يجب أن يطابق النمط ${o.pattern}`:`${r[o.format]??n.format} غير مقبول`}case"not_multiple_of":return`رقم غير مقبول: يجب أن يكون من مضاعفات ${n.divisor}`;case"unrecognized_keys":return`معرف${n.keys.length>1?"ات":""} غريب${n.keys.length>1?"ة":""}: ${y(n.keys,"، ")}`;case"invalid_key":return`معرف غير مقبول في ${n.origin}`;case"invalid_union":return"مدخل غير مقبول";case"invalid_element":return`مدخل غير مقبول في ${n.origin}`;default:return"مدخل غير مقبول"}}};function ih(){return{localeError:rh()}}const oh=()=>{const e={string:{unit:"simvol",verb:"olmalıdır"},file:{unit:"bayt",verb:"olmalıdır"},array:{unit:"element",verb:"olmalıdır"},set:{unit:"element",verb:"olmalıdır"}};function t(n){return e[n]??null}const r={regex:"input",email:"email address",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO datetime",date:"ISO date",time:"ISO time",duration:"ISO duration",ipv4:"IPv4 address",ipv6:"IPv6 address",cidrv4:"IPv4 range",cidrv6:"IPv6 range",base64:"base64-encoded string",base64url:"base64url-encoded string",json_string:"JSON string",e164:"E.164 number",jwt:"JWT",template_literal:"input"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Yanlış dəyər: gözlənilən instanceof ${n.expected}, daxil olan ${s}`:`Yanlış dəyər: gözlənilən ${o}, daxil olan ${s}`}case"invalid_value":return n.values.length===1?`Yanlış dəyər: gözlənilən ${w(n.values[0])}`:`Yanlış seçim: aşağıdakılardan biri olmalıdır: ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Çox böyük: gözlənilən ${n.origin??"dəyər"} ${o}${n.maximum.toString()} ${a.unit??"element"}`:`Çox böyük: gözlənilən ${n.origin??"dəyər"} ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Çox kiçik: gözlənilən ${n.origin} ${o}${n.minimum.toString()} ${a.unit}`:`Çox kiçik: gözlənilən ${n.origin} ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Yanlış mətn: "${o.prefix}" ilə başlamalıdır`:o.format==="ends_with"?`Yanlış mətn: "${o.suffix}" ilə bitməlidir`:o.format==="includes"?`Yanlış mətn: "${o.includes}" daxil olmalıdır`:o.format==="regex"?`Yanlış mətn: ${o.pattern} şablonuna uyğun olmalıdır`:`Yanlış ${r[o.format]??n.format}`}case"not_multiple_of":return`Yanlış ədəd: ${n.divisor} ilə bölünə bilən olmalıdır`;case"unrecognized_keys":return`Tanınmayan açar${n.keys.length>1?"lar":""}: ${y(n.keys,", ")}`;case"invalid_key":return`${n.origin} daxilində yanlış açar`;case"invalid_union":return"Yanlış dəyər";case"invalid_element":return`${n.origin} daxilində yanlış dəyər`;default:return"Yanlış dəyər"}}};function ah(){return{localeError:oh()}}function Ga(e,t,r,i){const n=Math.abs(e),o=n%10,a=n%100;return a>=11&&a<=19?i:o===1?t:o>=2&&o<=4?r:i}const sh=()=>{const e={string:{unit:{one:"сімвал",few:"сімвалы",many:"сімвалаў"},verb:"мець"},array:{unit:{one:"элемент",few:"элементы",many:"элементаў"},verb:"мець"},set:{unit:{one:"элемент",few:"элементы",many:"элементаў"},verb:"мець"},file:{unit:{one:"байт",few:"байты",many:"байтаў"},verb:"мець"}};function t(n){return e[n]??null}const r={regex:"увод",email:"email адрас",url:"URL",emoji:"эмодзі",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO дата і час",date:"ISO дата",time:"ISO час",duration:"ISO працягласць",ipv4:"IPv4 адрас",ipv6:"IPv6 адрас",cidrv4:"IPv4 дыяпазон",cidrv6:"IPv6 дыяпазон",base64:"радок у фармаце base64",base64url:"радок у фармаце base64url",json_string:"JSON радок",e164:"нумар E.164",jwt:"JWT",template_literal:"увод"},i={nan:"NaN",number:"лік",array:"масіў"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Няправільны ўвод: чакаўся instanceof ${n.expected}, атрымана ${s}`:`Няправільны ўвод: чакаўся ${o}, атрымана ${s}`}case"invalid_value":return n.values.length===1?`Няправільны ўвод: чакалася ${w(n.values[0])}`:`Няправільны варыянт: чакаўся адзін з ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);if(a){const s=Number(n.maximum),c=Ga(s,a.unit.one,a.unit.few,a.unit.many);return`Занадта вялікі: чакалася, што ${n.origin??"значэнне"} павінна ${a.verb} ${o}${n.maximum.toString()} ${c}`}return`Занадта вялікі: чакалася, што ${n.origin??"значэнне"} павінна быць ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);if(a){const s=Number(n.minimum),c=Ga(s,a.unit.one,a.unit.few,a.unit.many);return`Занадта малы: чакалася, што ${n.origin} павінна ${a.verb} ${o}${n.minimum.toString()} ${c}`}return`Занадта малы: чакалася, што ${n.origin} павінна быць ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Няправільны радок: павінен пачынацца з "${o.prefix}"`:o.format==="ends_with"?`Няправільны радок: павінен заканчвацца на "${o.suffix}"`:o.format==="includes"?`Няправільны радок: павінен змяшчаць "${o.includes}"`:o.format==="regex"?`Няправільны радок: павінен адпавядаць шаблону ${o.pattern}`:`Няправільны ${r[o.format]??n.format}`}case"not_multiple_of":return`Няправільны лік: павінен быць кратным ${n.divisor}`;case"unrecognized_keys":return`Нераспазнаны ${n.keys.length>1?"ключы":"ключ"}: ${y(n.keys,", ")}`;case"invalid_key":return`Няправільны ключ у ${n.origin}`;case"invalid_union":return"Няправільны ўвод";case"invalid_element":return`Няправільнае значэнне ў ${n.origin}`;default:return"Няправільны ўвод"}}};function lh(){return{localeError:sh()}}const ch=()=>{const e={string:{unit:"символа",verb:"да съдържа"},file:{unit:"байта",verb:"да съдържа"},array:{unit:"елемента",verb:"да съдържа"},set:{unit:"елемента",verb:"да съдържа"}};function t(n){return e[n]??null}const r={regex:"вход",email:"имейл адрес",url:"URL",emoji:"емоджи",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO време",date:"ISO дата",time:"ISO време",duration:"ISO продължителност",ipv4:"IPv4 адрес",ipv6:"IPv6 адрес",cidrv4:"IPv4 диапазон",cidrv6:"IPv6 диапазон",base64:"base64-кодиран низ",base64url:"base64url-кодиран низ",json_string:"JSON низ",e164:"E.164 номер",jwt:"JWT",template_literal:"вход"},i={nan:"NaN",number:"число",array:"масив"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Невалиден вход: очакван instanceof ${n.expected}, получен ${s}`:`Невалиден вход: очакван ${o}, получен ${s}`}case"invalid_value":return n.values.length===1?`Невалиден вход: очакван ${w(n.values[0])}`:`Невалидна опция: очаквано едно от ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Твърде голямо: очаква се ${n.origin??"стойност"} да съдържа ${o}${n.maximum.toString()} ${a.unit??"елемента"}`:`Твърде голямо: очаква се ${n.origin??"стойност"} да бъде ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Твърде малко: очаква се ${n.origin} да съдържа ${o}${n.minimum.toString()} ${a.unit}`:`Твърде малко: очаква се ${n.origin} да бъде ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;if(o.format==="starts_with")return`Невалиден низ: трябва да започва с "${o.prefix}"`;if(o.format==="ends_with")return`Невалиден низ: трябва да завършва с "${o.suffix}"`;if(o.format==="includes")return`Невалиден низ: трябва да включва "${o.includes}"`;if(o.format==="regex")return`Невалиден низ: трябва да съвпада с ${o.pattern}`;let a="Невалиден";return o.format==="emoji"&&(a="Невалидно"),o.format==="datetime"&&(a="Невалидно"),o.format==="date"&&(a="Невалидна"),o.format==="time"&&(a="Невалидно"),o.format==="duration"&&(a="Невалидна"),`${a} ${r[o.format]??n.format}`}case"not_multiple_of":return`Невалидно число: трябва да бъде кратно на ${n.divisor}`;case"unrecognized_keys":return`Неразпознат${n.keys.length>1?"и":""} ключ${n.keys.length>1?"ове":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Невалиден ключ в ${n.origin}`;case"invalid_union":return"Невалиден вход";case"invalid_element":return`Невалидна стойност в ${n.origin}`;default:return"Невалиден вход"}}};function uh(){return{localeError:ch()}}const dh=()=>{const e={string:{unit:"caràcters",verb:"contenir"},file:{unit:"bytes",verb:"contenir"},array:{unit:"elements",verb:"contenir"},set:{unit:"elements",verb:"contenir"}};function t(n){return e[n]??null}const r={regex:"entrada",email:"adreça electrònica",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"data i hora ISO",date:"data ISO",time:"hora ISO",duration:"durada ISO",ipv4:"adreça IPv4",ipv6:"adreça IPv6",cidrv4:"rang IPv4",cidrv6:"rang IPv6",base64:"cadena codificada en base64",base64url:"cadena codificada en base64url",json_string:"cadena JSON",e164:"número E.164",jwt:"JWT",template_literal:"entrada"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Tipus invàlid: s'esperava instanceof ${n.expected}, s'ha rebut ${s}`:`Tipus invàlid: s'esperava ${o}, s'ha rebut ${s}`}case"invalid_value":return n.values.length===1?`Valor invàlid: s'esperava ${w(n.values[0])}`:`Opció invàlida: s'esperava una de ${y(n.values," o ")}`;case"too_big":{const o=n.inclusive?"com a màxim":"menys de",a=t(n.origin);return a?`Massa gran: s'esperava que ${n.origin??"el valor"} contingués ${o} ${n.maximum.toString()} ${a.unit??"elements"}`:`Massa gran: s'esperava que ${n.origin??"el valor"} fos ${o} ${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?"com a mínim":"més de",a=t(n.origin);return a?`Massa petit: s'esperava que ${n.origin} contingués ${o} ${n.minimum.toString()} ${a.unit}`:`Massa petit: s'esperava que ${n.origin} fos ${o} ${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Format invàlid: ha de començar amb "${o.prefix}"`:o.format==="ends_with"?`Format invàlid: ha d'acabar amb "${o.suffix}"`:o.format==="includes"?`Format invàlid: ha d'incloure "${o.includes}"`:o.format==="regex"?`Format invàlid: ha de coincidir amb el patró ${o.pattern}`:`Format invàlid per a ${r[o.format]??n.format}`}case"not_multiple_of":return`Número invàlid: ha de ser múltiple de ${n.divisor}`;case"unrecognized_keys":return`Clau${n.keys.length>1?"s":""} no reconeguda${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Clau invàlida a ${n.origin}`;case"invalid_union":return"Entrada invàlida";case"invalid_element":return`Element invàlid a ${n.origin}`;default:return"Entrada invàlida"}}};function ph(){return{localeError:dh()}}const mh=()=>{const e={string:{unit:"znaků",verb:"mít"},file:{unit:"bajtů",verb:"mít"},array:{unit:"prvků",verb:"mít"},set:{unit:"prvků",verb:"mít"}};function t(n){return e[n]??null}const r={regex:"regulární výraz",email:"e-mailová adresa",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"datum a čas ve formátu ISO",date:"datum ve formátu ISO",time:"čas ve formátu ISO",duration:"doba trvání ISO",ipv4:"IPv4 adresa",ipv6:"IPv6 adresa",cidrv4:"rozsah IPv4",cidrv6:"rozsah IPv6",base64:"řetězec zakódovaný ve formátu base64",base64url:"řetězec zakódovaný ve formátu base64url",json_string:"řetězec ve formátu JSON",e164:"číslo E.164",jwt:"JWT",template_literal:"vstup"},i={nan:"NaN",number:"číslo",string:"řetězec",function:"funkce",array:"pole"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Neplatný vstup: očekáváno instanceof ${n.expected}, obdrženo ${s}`:`Neplatný vstup: očekáváno ${o}, obdrženo ${s}`}case"invalid_value":return n.values.length===1?`Neplatný vstup: očekáváno ${w(n.values[0])}`:`Neplatná možnost: očekávána jedna z hodnot ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Hodnota je příliš velká: ${n.origin??"hodnota"} musí mít ${o}${n.maximum.toString()} ${a.unit??"prvků"}`:`Hodnota je příliš velká: ${n.origin??"hodnota"} musí být ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Hodnota je příliš malá: ${n.origin??"hodnota"} musí mít ${o}${n.minimum.toString()} ${a.unit??"prvků"}`:`Hodnota je příliš malá: ${n.origin??"hodnota"} musí být ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Neplatný řetězec: musí začínat na "${o.prefix}"`:o.format==="ends_with"?`Neplatný řetězec: musí končit na "${o.suffix}"`:o.format==="includes"?`Neplatný řetězec: musí obsahovat "${o.includes}"`:o.format==="regex"?`Neplatný řetězec: musí odpovídat vzoru ${o.pattern}`:`Neplatný formát ${r[o.format]??n.format}`}case"not_multiple_of":return`Neplatné číslo: musí být násobkem ${n.divisor}`;case"unrecognized_keys":return`Neznámé klíče: ${y(n.keys,", ")}`;case"invalid_key":return`Neplatný klíč v ${n.origin}`;case"invalid_union":return"Neplatný vstup";case"invalid_element":return`Neplatná hodnota v ${n.origin}`;default:return"Neplatný vstup"}}};function fh(){return{localeError:mh()}}const hh=()=>{const e={string:{unit:"tegn",verb:"havde"},file:{unit:"bytes",verb:"havde"},array:{unit:"elementer",verb:"indeholdt"},set:{unit:"elementer",verb:"indeholdt"}};function t(n){return e[n]??null}const r={regex:"input",email:"e-mailadresse",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO dato- og klokkeslæt",date:"ISO-dato",time:"ISO-klokkeslæt",duration:"ISO-varighed",ipv4:"IPv4-område",ipv6:"IPv6-område",cidrv4:"IPv4-spektrum",cidrv6:"IPv6-spektrum",base64:"base64-kodet streng",base64url:"base64url-kodet streng",json_string:"JSON-streng",e164:"E.164-nummer",jwt:"JWT",template_literal:"input"},i={nan:"NaN",string:"streng",number:"tal",boolean:"boolean",array:"liste",object:"objekt",set:"sæt",file:"fil"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Ugyldigt input: forventede instanceof ${n.expected}, fik ${s}`:`Ugyldigt input: forventede ${o}, fik ${s}`}case"invalid_value":return n.values.length===1?`Ugyldig værdi: forventede ${w(n.values[0])}`:`Ugyldigt valg: forventede en af følgende ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin),s=i[n.origin]??n.origin;return a?`For stor: forventede ${s??"value"} ${a.verb} ${o} ${n.maximum.toString()} ${a.unit??"elementer"}`:`For stor: forventede ${s??"value"} havde ${o} ${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin),s=i[n.origin]??n.origin;return a?`For lille: forventede ${s} ${a.verb} ${o} ${n.minimum.toString()} ${a.unit}`:`For lille: forventede ${s} havde ${o} ${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ugyldig streng: skal starte med "${o.prefix}"`:o.format==="ends_with"?`Ugyldig streng: skal ende med "${o.suffix}"`:o.format==="includes"?`Ugyldig streng: skal indeholde "${o.includes}"`:o.format==="regex"?`Ugyldig streng: skal matche mønsteret ${o.pattern}`:`Ugyldig ${r[o.format]??n.format}`}case"not_multiple_of":return`Ugyldigt tal: skal være deleligt med ${n.divisor}`;case"unrecognized_keys":return`${n.keys.length>1?"Ukendte nøgler":"Ukendt nøgle"}: ${y(n.keys,", ")}`;case"invalid_key":return`Ugyldig nøgle i ${n.origin}`;case"invalid_union":return"Ugyldigt input: matcher ingen af de tilladte typer";case"invalid_element":return`Ugyldig værdi i ${n.origin}`;default:return"Ugyldigt input"}}};function gh(){return{localeError:hh()}}const vh=()=>{const e={string:{unit:"Zeichen",verb:"zu haben"},file:{unit:"Bytes",verb:"zu haben"},array:{unit:"Elemente",verb:"zu haben"},set:{unit:"Elemente",verb:"zu haben"}};function t(n){return e[n]??null}const r={regex:"Eingabe",email:"E-Mail-Adresse",url:"URL",emoji:"Emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO-Datum und -Uhrzeit",date:"ISO-Datum",time:"ISO-Uhrzeit",duration:"ISO-Dauer",ipv4:"IPv4-Adresse",ipv6:"IPv6-Adresse",cidrv4:"IPv4-Bereich",cidrv6:"IPv6-Bereich",base64:"Base64-codierter String",base64url:"Base64-URL-codierter String",json_string:"JSON-String",e164:"E.164-Nummer",jwt:"JWT",template_literal:"Eingabe"},i={nan:"NaN",number:"Zahl",array:"Array"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Ungültige Eingabe: erwartet instanceof ${n.expected}, erhalten ${s}`:`Ungültige Eingabe: erwartet ${o}, erhalten ${s}`}case"invalid_value":return n.values.length===1?`Ungültige Eingabe: erwartet ${w(n.values[0])}`:`Ungültige Option: erwartet eine von ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Zu groß: erwartet, dass ${n.origin??"Wert"} ${o}${n.maximum.toString()} ${a.unit??"Elemente"} hat`:`Zu groß: erwartet, dass ${n.origin??"Wert"} ${o}${n.maximum.toString()} ist`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Zu klein: erwartet, dass ${n.origin} ${o}${n.minimum.toString()} ${a.unit} hat`:`Zu klein: erwartet, dass ${n.origin} ${o}${n.minimum.toString()} ist`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ungültiger String: muss mit "${o.prefix}" beginnen`:o.format==="ends_with"?`Ungültiger String: muss mit "${o.suffix}" enden`:o.format==="includes"?`Ungültiger String: muss "${o.includes}" enthalten`:o.format==="regex"?`Ungültiger String: muss dem Muster ${o.pattern} entsprechen`:`Ungültig: ${r[o.format]??n.format}`}case"not_multiple_of":return`Ungültige Zahl: muss ein Vielfaches von ${n.divisor} sein`;case"unrecognized_keys":return`${n.keys.length>1?"Unbekannte Schlüssel":"Unbekannter Schlüssel"}: ${y(n.keys,", ")}`;case"invalid_key":return`Ungültiger Schlüssel in ${n.origin}`;case"invalid_union":return"Ungültige Eingabe";case"invalid_element":return`Ungültiger Wert in ${n.origin}`;default:return"Ungültige Eingabe"}}};function bh(){return{localeError:vh()}}const yh=()=>{const e={string:{unit:"characters",verb:"to have"},file:{unit:"bytes",verb:"to have"},array:{unit:"items",verb:"to have"},set:{unit:"items",verb:"to have"},map:{unit:"entries",verb:"to have"}};function t(n){return e[n]??null}const r={regex:"input",email:"email address",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO datetime",date:"ISO date",time:"ISO time",duration:"ISO duration",ipv4:"IPv4 address",ipv6:"IPv6 address",mac:"MAC address",cidrv4:"IPv4 range",cidrv6:"IPv6 range",base64:"base64-encoded string",base64url:"base64url-encoded string",json_string:"JSON string",e164:"E.164 number",jwt:"JWT",template_literal:"input"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return`Invalid input: expected ${o}, received ${s}`}case"invalid_value":return n.values.length===1?`Invalid input: expected ${w(n.values[0])}`:`Invalid option: expected one of ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Too big: expected ${n.origin??"value"} to have ${o}${n.maximum.toString()} ${a.unit??"elements"}`:`Too big: expected ${n.origin??"value"} to be ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Too small: expected ${n.origin} to have ${o}${n.minimum.toString()} ${a.unit}`:`Too small: expected ${n.origin} to be ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Invalid string: must start with "${o.prefix}"`:o.format==="ends_with"?`Invalid string: must end with "${o.suffix}"`:o.format==="includes"?`Invalid string: must include "${o.includes}"`:o.format==="regex"?`Invalid string: must match pattern ${o.pattern}`:`Invalid ${r[o.format]??n.format}`}case"not_multiple_of":return`Invalid number: must be a multiple of ${n.divisor}`;case"unrecognized_keys":return`Unrecognized key${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Invalid key in ${n.origin}`;case"invalid_union":return"Invalid input";case"invalid_element":return`Invalid value in ${n.origin}`;default:return"Invalid input"}}};function nu(){return{localeError:yh()}}const $h=()=>{const e={string:{unit:"karaktrojn",verb:"havi"},file:{unit:"bajtojn",verb:"havi"},array:{unit:"elementojn",verb:"havi"},set:{unit:"elementojn",verb:"havi"}};function t(n){return e[n]??null}const r={regex:"enigo",email:"retadreso",url:"URL",emoji:"emoĝio",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO-datotempo",date:"ISO-dato",time:"ISO-tempo",duration:"ISO-daŭro",ipv4:"IPv4-adreso",ipv6:"IPv6-adreso",cidrv4:"IPv4-rango",cidrv6:"IPv6-rango",base64:"64-ume kodita karaktraro",base64url:"URL-64-ume kodita karaktraro",json_string:"JSON-karaktraro",e164:"E.164-nombro",jwt:"JWT",template_literal:"enigo"},i={nan:"NaN",number:"nombro",array:"tabelo",null:"senvalora"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Nevalida enigo: atendiĝis instanceof ${n.expected}, riceviĝis ${s}`:`Nevalida enigo: atendiĝis ${o}, riceviĝis ${s}`}case"invalid_value":return n.values.length===1?`Nevalida enigo: atendiĝis ${w(n.values[0])}`:`Nevalida opcio: atendiĝis unu el ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Tro granda: atendiĝis ke ${n.origin??"valoro"} havu ${o}${n.maximum.toString()} ${a.unit??"elementojn"}`:`Tro granda: atendiĝis ke ${n.origin??"valoro"} havu ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Tro malgranda: atendiĝis ke ${n.origin} havu ${o}${n.minimum.toString()} ${a.unit}`:`Tro malgranda: atendiĝis ke ${n.origin} estu ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Nevalida karaktraro: devas komenciĝi per "${o.prefix}"`:o.format==="ends_with"?`Nevalida karaktraro: devas finiĝi per "${o.suffix}"`:o.format==="includes"?`Nevalida karaktraro: devas inkluzivi "${o.includes}"`:o.format==="regex"?`Nevalida karaktraro: devas kongrui kun la modelo ${o.pattern}`:`Nevalida ${r[o.format]??n.format}`}case"not_multiple_of":return`Nevalida nombro: devas esti oblo de ${n.divisor}`;case"unrecognized_keys":return`Nekonata${n.keys.length>1?"j":""} ŝlosilo${n.keys.length>1?"j":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Nevalida ŝlosilo en ${n.origin}`;case"invalid_union":return"Nevalida enigo";case"invalid_element":return`Nevalida valoro en ${n.origin}`;default:return"Nevalida enigo"}}};function kh(){return{localeError:$h()}}const xh=()=>{const e={string:{unit:"caracteres",verb:"tener"},file:{unit:"bytes",verb:"tener"},array:{unit:"elementos",verb:"tener"},set:{unit:"elementos",verb:"tener"}};function t(n){return e[n]??null}const r={regex:"entrada",email:"dirección de correo electrónico",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"fecha y hora ISO",date:"fecha ISO",time:"hora ISO",duration:"duración ISO",ipv4:"dirección IPv4",ipv6:"dirección IPv6",cidrv4:"rango IPv4",cidrv6:"rango IPv6",base64:"cadena codificada en base64",base64url:"URL codificada en base64",json_string:"cadena JSON",e164:"número E.164",jwt:"JWT",template_literal:"entrada"},i={nan:"NaN",string:"texto",number:"número",boolean:"booleano",array:"arreglo",object:"objeto",set:"conjunto",file:"archivo",date:"fecha",bigint:"número grande",symbol:"símbolo",undefined:"indefinido",null:"nulo",function:"función",map:"mapa",record:"registro",tuple:"tupla",enum:"enumeración",union:"unión",literal:"literal",promise:"promesa",void:"vacío",never:"nunca",unknown:"desconocido",any:"cualquiera"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Entrada inválida: se esperaba instanceof ${n.expected}, recibido ${s}`:`Entrada inválida: se esperaba ${o}, recibido ${s}`}case"invalid_value":return n.values.length===1?`Entrada inválida: se esperaba ${w(n.values[0])}`:`Opción inválida: se esperaba una de ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin),s=i[n.origin]??n.origin;return a?`Demasiado grande: se esperaba que ${s??"valor"} tuviera ${o}${n.maximum.toString()} ${a.unit??"elementos"}`:`Demasiado grande: se esperaba que ${s??"valor"} fuera ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin),s=i[n.origin]??n.origin;return a?`Demasiado pequeño: se esperaba que ${s} tuviera ${o}${n.minimum.toString()} ${a.unit}`:`Demasiado pequeño: se esperaba que ${s} fuera ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Cadena inválida: debe comenzar con "${o.prefix}"`:o.format==="ends_with"?`Cadena inválida: debe terminar en "${o.suffix}"`:o.format==="includes"?`Cadena inválida: debe incluir "${o.includes}"`:o.format==="regex"?`Cadena inválida: debe coincidir con el patrón ${o.pattern}`:`Inválido ${r[o.format]??n.format}`}case"not_multiple_of":return`Número inválido: debe ser múltiplo de ${n.divisor}`;case"unrecognized_keys":return`Llave${n.keys.length>1?"s":""} desconocida${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Llave inválida en ${i[n.origin]??n.origin}`;case"invalid_union":return"Entrada inválida";case"invalid_element":return`Valor inválido en ${i[n.origin]??n.origin}`;default:return"Entrada inválida"}}};function _h(){return{localeError:xh()}}const wh=()=>{const e={string:{unit:"کاراکتر",verb:"داشته باشد"},file:{unit:"بایت",verb:"داشته باشد"},array:{unit:"آیتم",verb:"داشته باشد"},set:{unit:"آیتم",verb:"داشته باشد"}};function t(n){return e[n]??null}const r={regex:"ورودی",email:"آدرس ایمیل",url:"URL",emoji:"ایموجی",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"تاریخ و زمان ایزو",date:"تاریخ ایزو",time:"زمان ایزو",duration:"مدت زمان ایزو",ipv4:"IPv4 آدرس",ipv6:"IPv6 آدرس",cidrv4:"IPv4 دامنه",cidrv6:"IPv6 دامنه",base64:"base64-encoded رشته",base64url:"base64url-encoded رشته",json_string:"JSON رشته",e164:"E.164 عدد",jwt:"JWT",template_literal:"ورودی"},i={nan:"NaN",number:"عدد",array:"آرایه"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`ورودی نامعتبر: می‌بایست instanceof ${n.expected} می‌بود، ${s} دریافت شد`:`ورودی نامعتبر: می‌بایست ${o} می‌بود، ${s} دریافت شد`}case"invalid_value":return n.values.length===1?`ورودی نامعتبر: می‌بایست ${w(n.values[0])} می‌بود`:`گزینه نامعتبر: می‌بایست یکی از ${y(n.values,"|")} می‌بود`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`خیلی بزرگ: ${n.origin??"مقدار"} باید ${o}${n.maximum.toString()} ${a.unit??"عنصر"} باشد`:`خیلی بزرگ: ${n.origin??"مقدار"} باید ${o}${n.maximum.toString()} باشد`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`خیلی کوچک: ${n.origin} باید ${o}${n.minimum.toString()} ${a.unit} باشد`:`خیلی کوچک: ${n.origin} باید ${o}${n.minimum.toString()} باشد`}case"invalid_format":{const o=n;return o.format==="starts_with"?`رشته نامعتبر: باید با "${o.prefix}" شروع شود`:o.format==="ends_with"?`رشته نامعتبر: باید با "${o.suffix}" تمام شود`:o.format==="includes"?`رشته نامعتبر: باید شامل "${o.includes}" باشد`:o.format==="regex"?`رشته نامعتبر: باید با الگوی ${o.pattern} مطابقت داشته باشد`:`${r[o.format]??n.format} نامعتبر`}case"not_multiple_of":return`عدد نامعتبر: باید مضرب ${n.divisor} باشد`;case"unrecognized_keys":return`کلید${n.keys.length>1?"های":""} ناشناس: ${y(n.keys,", ")}`;case"invalid_key":return`کلید ناشناس در ${n.origin}`;case"invalid_union":return"ورودی نامعتبر";case"invalid_element":return`مقدار نامعتبر در ${n.origin}`;default:return"ورودی نامعتبر"}}};function Sh(){return{localeError:wh()}}const zh=()=>{const e={string:{unit:"merkkiä",subject:"merkkijonon"},file:{unit:"tavua",subject:"tiedoston"},array:{unit:"alkiota",subject:"listan"},set:{unit:"alkiota",subject:"joukon"},number:{unit:"",subject:"luvun"},bigint:{unit:"",subject:"suuren kokonaisluvun"},int:{unit:"",subject:"kokonaisluvun"},date:{unit:"",subject:"päivämäärän"}};function t(n){return e[n]??null}const r={regex:"säännöllinen lauseke",email:"sähköpostiosoite",url:"URL-osoite",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO-aikaleima",date:"ISO-päivämäärä",time:"ISO-aika",duration:"ISO-kesto",ipv4:"IPv4-osoite",ipv6:"IPv6-osoite",cidrv4:"IPv4-alue",cidrv6:"IPv6-alue",base64:"base64-koodattu merkkijono",base64url:"base64url-koodattu merkkijono",json_string:"JSON-merkkijono",e164:"E.164-luku",jwt:"JWT",template_literal:"templaattimerkkijono"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Virheellinen tyyppi: odotettiin instanceof ${n.expected}, oli ${s}`:`Virheellinen tyyppi: odotettiin ${o}, oli ${s}`}case"invalid_value":return n.values.length===1?`Virheellinen syöte: täytyy olla ${w(n.values[0])}`:`Virheellinen valinta: täytyy olla yksi seuraavista: ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Liian suuri: ${a.subject} täytyy olla ${o}${n.maximum.toString()} ${a.unit}`.trim():`Liian suuri: arvon täytyy olla ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Liian pieni: ${a.subject} täytyy olla ${o}${n.minimum.toString()} ${a.unit}`.trim():`Liian pieni: arvon täytyy olla ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Virheellinen syöte: täytyy alkaa "${o.prefix}"`:o.format==="ends_with"?`Virheellinen syöte: täytyy loppua "${o.suffix}"`:o.format==="includes"?`Virheellinen syöte: täytyy sisältää "${o.includes}"`:o.format==="regex"?`Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${o.pattern}`:`Virheellinen ${r[o.format]??n.format}`}case"not_multiple_of":return`Virheellinen luku: täytyy olla luvun ${n.divisor} monikerta`;case"unrecognized_keys":return`${n.keys.length>1?"Tuntemattomat avaimet":"Tuntematon avain"}: ${y(n.keys,", ")}`;case"invalid_key":return"Virheellinen avain tietueessa";case"invalid_union":return"Virheellinen unioni";case"invalid_element":return"Virheellinen arvo joukossa";default:return"Virheellinen syöte"}}};function Ih(){return{localeError:zh()}}const Eh=()=>{const e={string:{unit:"caractères",verb:"avoir"},file:{unit:"octets",verb:"avoir"},array:{unit:"éléments",verb:"avoir"},set:{unit:"éléments",verb:"avoir"}};function t(n){return e[n]??null}const r={regex:"entrée",email:"adresse e-mail",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"date et heure ISO",date:"date ISO",time:"heure ISO",duration:"durée ISO",ipv4:"adresse IPv4",ipv6:"adresse IPv6",cidrv4:"plage IPv4",cidrv6:"plage IPv6",base64:"chaîne encodée en base64",base64url:"chaîne encodée en base64url",json_string:"chaîne JSON",e164:"numéro E.164",jwt:"JWT",template_literal:"entrée"},i={nan:"NaN",number:"nombre",array:"tableau"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Entrée invalide : instanceof ${n.expected} attendu, ${s} reçu`:`Entrée invalide : ${o} attendu, ${s} reçu`}case"invalid_value":return n.values.length===1?`Entrée invalide : ${w(n.values[0])} attendu`:`Option invalide : une valeur parmi ${y(n.values,"|")} attendue`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Trop grand : ${n.origin??"valeur"} doit ${a.verb} ${o}${n.maximum.toString()} ${a.unit??"élément(s)"}`:`Trop grand : ${n.origin??"valeur"} doit être ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Trop petit : ${n.origin} doit ${a.verb} ${o}${n.minimum.toString()} ${a.unit}`:`Trop petit : ${n.origin} doit être ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Chaîne invalide : doit commencer par "${o.prefix}"`:o.format==="ends_with"?`Chaîne invalide : doit se terminer par "${o.suffix}"`:o.format==="includes"?`Chaîne invalide : doit inclure "${o.includes}"`:o.format==="regex"?`Chaîne invalide : doit correspondre au modèle ${o.pattern}`:`${r[o.format]??n.format} invalide`}case"not_multiple_of":return`Nombre invalide : doit être un multiple de ${n.divisor}`;case"unrecognized_keys":return`Clé${n.keys.length>1?"s":""} non reconnue${n.keys.length>1?"s":""} : ${y(n.keys,", ")}`;case"invalid_key":return`Clé invalide dans ${n.origin}`;case"invalid_union":return"Entrée invalide";case"invalid_element":return`Valeur invalide dans ${n.origin}`;default:return"Entrée invalide"}}};function Dh(){return{localeError:Eh()}}const Ph=()=>{const e={string:{unit:"caractères",verb:"avoir"},file:{unit:"octets",verb:"avoir"},array:{unit:"éléments",verb:"avoir"},set:{unit:"éléments",verb:"avoir"}};function t(n){return e[n]??null}const r={regex:"entrée",email:"adresse courriel",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"date-heure ISO",date:"date ISO",time:"heure ISO",duration:"durée ISO",ipv4:"adresse IPv4",ipv6:"adresse IPv6",cidrv4:"plage IPv4",cidrv6:"plage IPv6",base64:"chaîne encodée en base64",base64url:"chaîne encodée en base64url",json_string:"chaîne JSON",e164:"numéro E.164",jwt:"JWT",template_literal:"entrée"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Entrée invalide : attendu instanceof ${n.expected}, reçu ${s}`:`Entrée invalide : attendu ${o}, reçu ${s}`}case"invalid_value":return n.values.length===1?`Entrée invalide : attendu ${w(n.values[0])}`:`Option invalide : attendu l'une des valeurs suivantes ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"≤":"<",a=t(n.origin);return a?`Trop grand : attendu que ${n.origin??"la valeur"} ait ${o}${n.maximum.toString()} ${a.unit}`:`Trop grand : attendu que ${n.origin??"la valeur"} soit ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?"≥":">",a=t(n.origin);return a?`Trop petit : attendu que ${n.origin} ait ${o}${n.minimum.toString()} ${a.unit}`:`Trop petit : attendu que ${n.origin} soit ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Chaîne invalide : doit commencer par "${o.prefix}"`:o.format==="ends_with"?`Chaîne invalide : doit se terminer par "${o.suffix}"`:o.format==="includes"?`Chaîne invalide : doit inclure "${o.includes}"`:o.format==="regex"?`Chaîne invalide : doit correspondre au motif ${o.pattern}`:`${r[o.format]??n.format} invalide`}case"not_multiple_of":return`Nombre invalide : doit être un multiple de ${n.divisor}`;case"unrecognized_keys":return`Clé${n.keys.length>1?"s":""} non reconnue${n.keys.length>1?"s":""} : ${y(n.keys,", ")}`;case"invalid_key":return`Clé invalide dans ${n.origin}`;case"invalid_union":return"Entrée invalide";case"invalid_element":return`Valeur invalide dans ${n.origin}`;default:return"Entrée invalide"}}};function jh(){return{localeError:Ph()}}const Oh=()=>{const e={string:{label:"מחרוזת",gender:"f"},number:{label:"מספר",gender:"m"},boolean:{label:"ערך בוליאני",gender:"m"},bigint:{label:"BigInt",gender:"m"},date:{label:"תאריך",gender:"m"},array:{label:"מערך",gender:"m"},object:{label:"אובייקט",gender:"m"},null:{label:"ערך ריק (null)",gender:"m"},undefined:{label:"ערך לא מוגדר (undefined)",gender:"m"},symbol:{label:"סימבול (Symbol)",gender:"m"},function:{label:"פונקציה",gender:"f"},map:{label:"מפה (Map)",gender:"f"},set:{label:"קבוצה (Set)",gender:"f"},file:{label:"קובץ",gender:"m"},promise:{label:"Promise",gender:"m"},NaN:{label:"NaN",gender:"m"},unknown:{label:"ערך לא ידוע",gender:"m"},value:{label:"ערך",gender:"m"}},t={string:{unit:"תווים",shortLabel:"קצר",longLabel:"ארוך"},file:{unit:"בייטים",shortLabel:"קטן",longLabel:"גדול"},array:{unit:"פריטים",shortLabel:"קטן",longLabel:"גדול"},set:{unit:"פריטים",shortLabel:"קטן",longLabel:"גדול"},number:{unit:"",shortLabel:"קטן",longLabel:"גדול"}},r=l=>l?e[l]:void 0,i=l=>{const u=r(l);return u?u.label:l??e.unknown.label},n=l=>`ה${i(l)}`,o=l=>{const u=r(l);return((u==null?void 0:u.gender)??"m")==="f"?"צריכה להיות":"צריך להיות"},a=l=>l?t[l]??null:null,s={regex:{label:"קלט",gender:"m"},email:{label:"כתובת אימייל",gender:"f"},url:{label:"כתובת רשת",gender:"f"},emoji:{label:"אימוג'י",gender:"m"},uuid:{label:"UUID",gender:"m"},nanoid:{label:"nanoid",gender:"m"},guid:{label:"GUID",gender:"m"},cuid:{label:"cuid",gender:"m"},cuid2:{label:"cuid2",gender:"m"},ulid:{label:"ULID",gender:"m"},xid:{label:"XID",gender:"m"},ksuid:{label:"KSUID",gender:"m"},datetime:{label:"תאריך וזמן ISO",gender:"m"},date:{label:"תאריך ISO",gender:"m"},time:{label:"זמן ISO",gender:"m"},duration:{label:"משך זמן ISO",gender:"m"},ipv4:{label:"כתובת IPv4",gender:"f"},ipv6:{label:"כתובת IPv6",gender:"f"},cidrv4:{label:"טווח IPv4",gender:"m"},cidrv6:{label:"טווח IPv6",gender:"m"},base64:{label:"מחרוזת בבסיס 64",gender:"f"},base64url:{label:"מחרוזת בבסיס 64 לכתובות רשת",gender:"f"},json_string:{label:"מחרוזת JSON",gender:"f"},e164:{label:"מספר E.164",gender:"m"},jwt:{label:"JWT",gender:"m"},ends_with:{label:"קלט",gender:"m"},includes:{label:"קלט",gender:"m"},lowercase:{label:"קלט",gender:"m"},starts_with:{label:"קלט",gender:"m"},uppercase:{label:"קלט",gender:"m"}},c={nan:"NaN"};return l=>{var u;switch(l.code){case"invalid_type":{const d=l.expected,f=c[d??""]??i(d),p=S(l.input),b=c[p]??((u=e[p])==null?void 0:u.label)??p;return/^[A-Z]/.test(l.expected)?`קלט לא תקין: צריך להיות instanceof ${l.expected}, התקבל ${b}`:`קלט לא תקין: צריך להיות ${f}, התקבל ${b}`}case"invalid_value":{if(l.values.length===1)return`ערך לא תקין: הערך חייב להיות ${w(l.values[0])}`;const d=l.values.map(b=>w(b));if(l.values.length===2)return`ערך לא תקין: האפשרויות המתאימות הן ${d[0]} או ${d[1]}`;const f=d[d.length-1];return`ערך לא תקין: האפשרויות המתאימות הן ${d.slice(0,-1).join(", ")} או ${f}`}case"too_big":{const d=a(l.origin),f=n(l.origin??"value");if(l.origin==="string")return`${(d==null?void 0:d.longLabel)??"ארוך"} מדי: ${f} צריכה להכיל ${l.maximum.toString()} ${(d==null?void 0:d.unit)??""} ${l.inclusive?"או פחות":"לכל היותר"}`.trim();if(l.origin==="number"){const g=l.inclusive?`קטן או שווה ל-${l.maximum}`:`קטן מ-${l.maximum}`;return`גדול מדי: ${f} צריך להיות ${g}`}if(l.origin==="array"||l.origin==="set"){const g=l.origin==="set"?"צריכה":"צריך",x=l.inclusive?`${l.maximum} ${(d==null?void 0:d.unit)??""} או פחות`:`פחות מ-${l.maximum} ${(d==null?void 0:d.unit)??""}`;return`גדול מדי: ${f} ${g} להכיל ${x}`.trim()}const p=l.inclusive?"<=":"<",b=o(l.origin??"value");return d!=null&&d.unit?`${d.longLabel} מדי: ${f} ${b} ${p}${l.maximum.toString()} ${d.unit}`:`${(d==null?void 0:d.longLabel)??"גדול"} מדי: ${f} ${b} ${p}${l.maximum.toString()}`}case"too_small":{const d=a(l.origin),f=n(l.origin??"value");if(l.origin==="string")return`${(d==null?void 0:d.shortLabel)??"קצר"} מדי: ${f} צריכה להכיל ${l.minimum.toString()} ${(d==null?void 0:d.unit)??""} ${l.inclusive?"או יותר":"לפחות"}`.trim();if(l.origin==="number"){const g=l.inclusive?`גדול או שווה ל-${l.minimum}`:`גדול מ-${l.minimum}`;return`קטן מדי: ${f} צריך להיות ${g}`}if(l.origin==="array"||l.origin==="set"){const g=l.origin==="set"?"צריכה":"צריך";if(l.minimum===1&&l.inclusive){const T=(l.origin==="set","לפחות פריט אחד");return`קטן מדי: ${f} ${g} להכיל ${T}`}const x=l.inclusive?`${l.minimum} ${(d==null?void 0:d.unit)??""} או יותר`:`יותר מ-${l.minimum} ${(d==null?void 0:d.unit)??""}`;return`קטן מדי: ${f} ${g} להכיל ${x}`.trim()}const p=l.inclusive?">=":">",b=o(l.origin??"value");return d!=null&&d.unit?`${d.shortLabel} מדי: ${f} ${b} ${p}${l.minimum.toString()} ${d.unit}`:`${(d==null?void 0:d.shortLabel)??"קטן"} מדי: ${f} ${b} ${p}${l.minimum.toString()}`}case"invalid_format":{const d=l;if(d.format==="starts_with")return`המחרוזת חייבת להתחיל ב "${d.prefix}"`;if(d.format==="ends_with")return`המחרוזת חייבת להסתיים ב "${d.suffix}"`;if(d.format==="includes")return`המחרוזת חייבת לכלול "${d.includes}"`;if(d.format==="regex")return`המחרוזת חייבת להתאים לתבנית ${d.pattern}`;const f=s[d.format],p=(f==null?void 0:f.label)??d.format,g=((f==null?void 0:f.gender)??"m")==="f"?"תקינה":"תקין";return`${p} לא ${g}`}case"not_multiple_of":return`מספר לא תקין: חייב להיות מכפלה של ${l.divisor}`;case"unrecognized_keys":return`מפתח${l.keys.length>1?"ות":""} לא מזוה${l.keys.length>1?"ים":"ה"}: ${y(l.keys,", ")}`;case"invalid_key":return"שדה לא תקין באובייקט";case"invalid_union":return"קלט לא תקין";case"invalid_element":return`ערך לא תקין ב${n(l.origin??"array")}`;default:return"קלט לא תקין"}}};function Uh(){return{localeError:Oh()}}const Nh=()=>{const e={string:{unit:"karakter",verb:"legyen"},file:{unit:"byte",verb:"legyen"},array:{unit:"elem",verb:"legyen"},set:{unit:"elem",verb:"legyen"}};function t(n){return e[n]??null}const r={regex:"bemenet",email:"email cím",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO időbélyeg",date:"ISO dátum",time:"ISO idő",duration:"ISO időintervallum",ipv4:"IPv4 cím",ipv6:"IPv6 cím",cidrv4:"IPv4 tartomány",cidrv6:"IPv6 tartomány",base64:"base64-kódolt string",base64url:"base64url-kódolt string",json_string:"JSON string",e164:"E.164 szám",jwt:"JWT",template_literal:"bemenet"},i={nan:"NaN",number:"szám",array:"tömb"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Érvénytelen bemenet: a várt érték instanceof ${n.expected}, a kapott érték ${s}`:`Érvénytelen bemenet: a várt érték ${o}, a kapott érték ${s}`}case"invalid_value":return n.values.length===1?`Érvénytelen bemenet: a várt érték ${w(n.values[0])}`:`Érvénytelen opció: valamelyik érték várt ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Túl nagy: ${n.origin??"érték"} mérete túl nagy ${o}${n.maximum.toString()} ${a.unit??"elem"}`:`Túl nagy: a bemeneti érték ${n.origin??"érték"} túl nagy: ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Túl kicsi: a bemeneti érték ${n.origin} mérete túl kicsi ${o}${n.minimum.toString()} ${a.unit}`:`Túl kicsi: a bemeneti érték ${n.origin} túl kicsi ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Érvénytelen string: "${o.prefix}" értékkel kell kezdődnie`:o.format==="ends_with"?`Érvénytelen string: "${o.suffix}" értékkel kell végződnie`:o.format==="includes"?`Érvénytelen string: "${o.includes}" értéket kell tartalmaznia`:o.format==="regex"?`Érvénytelen string: ${o.pattern} mintának kell megfelelnie`:`Érvénytelen ${r[o.format]??n.format}`}case"not_multiple_of":return`Érvénytelen szám: ${n.divisor} többszörösének kell lennie`;case"unrecognized_keys":return`Ismeretlen kulcs${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Érvénytelen kulcs ${n.origin}`;case"invalid_union":return"Érvénytelen bemenet";case"invalid_element":return`Érvénytelen érték: ${n.origin}`;default:return"Érvénytelen bemenet"}}};function Ah(){return{localeError:Nh()}}function Va(e,t,r){return Math.abs(e)===1?t:r}function Te(e){if(!e)return"";const t=["ա","ե","ը","ի","ո","ու","օ"],r=e[e.length-1];return e+(t.includes(r)?"ն":"ը")}const Ch=()=>{const e={string:{unit:{one:"նշան",many:"նշաններ"},verb:"ունենալ"},file:{unit:{one:"բայթ",many:"բայթեր"},verb:"ունենալ"},array:{unit:{one:"տարր",many:"տարրեր"},verb:"ունենալ"},set:{unit:{one:"տարր",many:"տարրեր"},verb:"ունենալ"}};function t(n){return e[n]??null}const r={regex:"մուտք",email:"էլ. հասցե",url:"URL",emoji:"էմոջի",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO ամսաթիվ և ժամ",date:"ISO ամսաթիվ",time:"ISO ժամ",duration:"ISO տևողություն",ipv4:"IPv4 հասցե",ipv6:"IPv6 հասցե",cidrv4:"IPv4 միջակայք",cidrv6:"IPv6 միջակայք",base64:"base64 ձևաչափով տող",base64url:"base64url ձևաչափով տող",json_string:"JSON տող",e164:"E.164 համար",jwt:"JWT",template_literal:"մուտք"},i={nan:"NaN",number:"թիվ",array:"զանգված"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Սխալ մուտքագրում․ սպասվում էր instanceof ${n.expected}, ստացվել է ${s}`:`Սխալ մուտքագրում․ սպասվում էր ${o}, ստացվել է ${s}`}case"invalid_value":return n.values.length===1?`Սխալ մուտքագրում․ սպասվում էր ${w(n.values[1])}`:`Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);if(a){const s=Number(n.maximum),c=Va(s,a.unit.one,a.unit.many);return`Չափազանց մեծ արժեք․ սպասվում է, որ ${Te(n.origin??"արժեք")} կունենա ${o}${n.maximum.toString()} ${c}`}return`Չափազանց մեծ արժեք․ սպասվում է, որ ${Te(n.origin??"արժեք")} լինի ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);if(a){const s=Number(n.minimum),c=Va(s,a.unit.one,a.unit.many);return`Չափազանց փոքր արժեք․ սպասվում է, որ ${Te(n.origin)} կունենա ${o}${n.minimum.toString()} ${c}`}return`Չափազանց փոքր արժեք․ սպասվում է, որ ${Te(n.origin)} լինի ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Սխալ տող․ պետք է սկսվի "${o.prefix}"-ով`:o.format==="ends_with"?`Սխալ տող․ պետք է ավարտվի "${o.suffix}"-ով`:o.format==="includes"?`Սխալ տող․ պետք է պարունակի "${o.includes}"`:o.format==="regex"?`Սխալ տող․ պետք է համապատասխանի ${o.pattern} ձևաչափին`:`Սխալ ${r[o.format]??n.format}`}case"not_multiple_of":return`Սխալ թիվ․ պետք է բազմապատիկ լինի ${n.divisor}-ի`;case"unrecognized_keys":return`Չճանաչված բանալի${n.keys.length>1?"ներ":""}. ${y(n.keys,", ")}`;case"invalid_key":return`Սխալ բանալի ${Te(n.origin)}-ում`;case"invalid_union":return"Սխալ մուտքագրում";case"invalid_element":return`Սխալ արժեք ${Te(n.origin)}-ում`;default:return"Սխալ մուտքագրում"}}};function Th(){return{localeError:Ch()}}const Rh=()=>{const e={string:{unit:"karakter",verb:"memiliki"},file:{unit:"byte",verb:"memiliki"},array:{unit:"item",verb:"memiliki"},set:{unit:"item",verb:"memiliki"}};function t(n){return e[n]??null}const r={regex:"input",email:"alamat email",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"tanggal dan waktu format ISO",date:"tanggal format ISO",time:"jam format ISO",duration:"durasi format ISO",ipv4:"alamat IPv4",ipv6:"alamat IPv6",cidrv4:"rentang alamat IPv4",cidrv6:"rentang alamat IPv6",base64:"string dengan enkode base64",base64url:"string dengan enkode base64url",json_string:"string JSON",e164:"angka E.164",jwt:"JWT",template_literal:"input"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Input tidak valid: diharapkan instanceof ${n.expected}, diterima ${s}`:`Input tidak valid: diharapkan ${o}, diterima ${s}`}case"invalid_value":return n.values.length===1?`Input tidak valid: diharapkan ${w(n.values[0])}`:`Pilihan tidak valid: diharapkan salah satu dari ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Terlalu besar: diharapkan ${n.origin??"value"} memiliki ${o}${n.maximum.toString()} ${a.unit??"elemen"}`:`Terlalu besar: diharapkan ${n.origin??"value"} menjadi ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Terlalu kecil: diharapkan ${n.origin} memiliki ${o}${n.minimum.toString()} ${a.unit}`:`Terlalu kecil: diharapkan ${n.origin} menjadi ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`String tidak valid: harus dimulai dengan "${o.prefix}"`:o.format==="ends_with"?`String tidak valid: harus berakhir dengan "${o.suffix}"`:o.format==="includes"?`String tidak valid: harus menyertakan "${o.includes}"`:o.format==="regex"?`String tidak valid: harus sesuai pola ${o.pattern}`:`${r[o.format]??n.format} tidak valid`}case"not_multiple_of":return`Angka tidak valid: harus kelipatan dari ${n.divisor}`;case"unrecognized_keys":return`Kunci tidak dikenali ${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Kunci tidak valid di ${n.origin}`;case"invalid_union":return"Input tidak valid";case"invalid_element":return`Nilai tidak valid di ${n.origin}`;default:return"Input tidak valid"}}};function Zh(){return{localeError:Rh()}}const Lh=()=>{const e={string:{unit:"stafi",verb:"að hafa"},file:{unit:"bæti",verb:"að hafa"},array:{unit:"hluti",verb:"að hafa"},set:{unit:"hluti",verb:"að hafa"}};function t(n){return e[n]??null}const r={regex:"gildi",email:"netfang",url:"vefslóð",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO dagsetning og tími",date:"ISO dagsetning",time:"ISO tími",duration:"ISO tímalengd",ipv4:"IPv4 address",ipv6:"IPv6 address",cidrv4:"IPv4 range",cidrv6:"IPv6 range",base64:"base64-encoded strengur",base64url:"base64url-encoded strengur",json_string:"JSON strengur",e164:"E.164 tölugildi",jwt:"JWT",template_literal:"gildi"},i={nan:"NaN",number:"númer",array:"fylki"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Rangt gildi: Þú slóst inn ${s} þar sem á að vera instanceof ${n.expected}`:`Rangt gildi: Þú slóst inn ${s} þar sem á að vera ${o}`}case"invalid_value":return n.values.length===1?`Rangt gildi: gert ráð fyrir ${w(n.values[0])}`:`Ógilt val: má vera eitt af eftirfarandi ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Of stórt: gert er ráð fyrir að ${n.origin??"gildi"} hafi ${o}${n.maximum.toString()} ${a.unit??"hluti"}`:`Of stórt: gert er ráð fyrir að ${n.origin??"gildi"} sé ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Of lítið: gert er ráð fyrir að ${n.origin} hafi ${o}${n.minimum.toString()} ${a.unit}`:`Of lítið: gert er ráð fyrir að ${n.origin} sé ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ógildur strengur: verður að byrja á "${o.prefix}"`:o.format==="ends_with"?`Ógildur strengur: verður að enda á "${o.suffix}"`:o.format==="includes"?`Ógildur strengur: verður að innihalda "${o.includes}"`:o.format==="regex"?`Ógildur strengur: verður að fylgja mynstri ${o.pattern}`:`Rangt ${r[o.format]??n.format}`}case"not_multiple_of":return`Röng tala: verður að vera margfeldi af ${n.divisor}`;case"unrecognized_keys":return`Óþekkt ${n.keys.length>1?"ir lyklar":"ur lykill"}: ${y(n.keys,", ")}`;case"invalid_key":return`Rangur lykill í ${n.origin}`;case"invalid_union":return"Rangt gildi";case"invalid_element":return`Rangt gildi í ${n.origin}`;default:return"Rangt gildi"}}};function Fh(){return{localeError:Lh()}}const Mh=()=>{const e={string:{unit:"caratteri",verb:"avere"},file:{unit:"byte",verb:"avere"},array:{unit:"elementi",verb:"avere"},set:{unit:"elementi",verb:"avere"}};function t(n){return e[n]??null}const r={regex:"input",email:"indirizzo email",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"data e ora ISO",date:"data ISO",time:"ora ISO",duration:"durata ISO",ipv4:"indirizzo IPv4",ipv6:"indirizzo IPv6",cidrv4:"intervallo IPv4",cidrv6:"intervallo IPv6",base64:"stringa codificata in base64",base64url:"URL codificata in base64",json_string:"stringa JSON",e164:"numero E.164",jwt:"JWT",template_literal:"input"},i={nan:"NaN",number:"numero",array:"vettore"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Input non valido: atteso instanceof ${n.expected}, ricevuto ${s}`:`Input non valido: atteso ${o}, ricevuto ${s}`}case"invalid_value":return n.values.length===1?`Input non valido: atteso ${w(n.values[0])}`:`Opzione non valida: atteso uno tra ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Troppo grande: ${n.origin??"valore"} deve avere ${o}${n.maximum.toString()} ${a.unit??"elementi"}`:`Troppo grande: ${n.origin??"valore"} deve essere ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Troppo piccolo: ${n.origin} deve avere ${o}${n.minimum.toString()} ${a.unit}`:`Troppo piccolo: ${n.origin} deve essere ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Stringa non valida: deve iniziare con "${o.prefix}"`:o.format==="ends_with"?`Stringa non valida: deve terminare con "${o.suffix}"`:o.format==="includes"?`Stringa non valida: deve includere "${o.includes}"`:o.format==="regex"?`Stringa non valida: deve corrispondere al pattern ${o.pattern}`:`Invalid ${r[o.format]??n.format}`}case"not_multiple_of":return`Numero non valido: deve essere un multiplo di ${n.divisor}`;case"unrecognized_keys":return`Chiav${n.keys.length>1?"i":"e"} non riconosciut${n.keys.length>1?"e":"a"}: ${y(n.keys,", ")}`;case"invalid_key":return`Chiave non valida in ${n.origin}`;case"invalid_union":return"Input non valido";case"invalid_element":return`Valore non valido in ${n.origin}`;default:return"Input non valido"}}};function Kh(){return{localeError:Mh()}}const qh=()=>{const e={string:{unit:"文字",verb:"である"},file:{unit:"バイト",verb:"である"},array:{unit:"要素",verb:"である"},set:{unit:"要素",verb:"である"}};function t(n){return e[n]??null}const r={regex:"入力値",email:"メールアドレス",url:"URL",emoji:"絵文字",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO日時",date:"ISO日付",time:"ISO時刻",duration:"ISO期間",ipv4:"IPv4アドレス",ipv6:"IPv6アドレス",cidrv4:"IPv4範囲",cidrv6:"IPv6範囲",base64:"base64エンコード文字列",base64url:"base64urlエンコード文字列",json_string:"JSON文字列",e164:"E.164番号",jwt:"JWT",template_literal:"入力値"},i={nan:"NaN",number:"数値",array:"配列"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`無効な入力: instanceof ${n.expected}が期待されましたが、${s}が入力されました`:`無効な入力: ${o}が期待されましたが、${s}が入力されました`}case"invalid_value":return n.values.length===1?`無効な入力: ${w(n.values[0])}が期待されました`:`無効な選択: ${y(n.values,"、")}のいずれかである必要があります`;case"too_big":{const o=n.inclusive?"以下である":"より小さい",a=t(n.origin);return a?`大きすぎる値: ${n.origin??"値"}は${n.maximum.toString()}${a.unit??"要素"}${o}必要があります`:`大きすぎる値: ${n.origin??"値"}は${n.maximum.toString()}${o}必要があります`}case"too_small":{const o=n.inclusive?"以上である":"より大きい",a=t(n.origin);return a?`小さすぎる値: ${n.origin}は${n.minimum.toString()}${a.unit}${o}必要があります`:`小さすぎる値: ${n.origin}は${n.minimum.toString()}${o}必要があります`}case"invalid_format":{const o=n;return o.format==="starts_with"?`無効な文字列: "${o.prefix}"で始まる必要があります`:o.format==="ends_with"?`無効な文字列: "${o.suffix}"で終わる必要があります`:o.format==="includes"?`無効な文字列: "${o.includes}"を含む必要があります`:o.format==="regex"?`無効な文字列: パターン${o.pattern}に一致する必要があります`:`無効な${r[o.format]??n.format}`}case"not_multiple_of":return`無効な数値: ${n.divisor}の倍数である必要があります`;case"unrecognized_keys":return`認識されていないキー${n.keys.length>1?"群":""}: ${y(n.keys,"、")}`;case"invalid_key":return`${n.origin}内の無効なキー`;case"invalid_union":return"無効な入力";case"invalid_element":return`${n.origin}内の無効な値`;default:return"無効な入力"}}};function Jh(){return{localeError:qh()}}const Bh=()=>{const e={string:{unit:"სიმბოლო",verb:"უნდა შეიცავდეს"},file:{unit:"ბაიტი",verb:"უნდა შეიცავდეს"},array:{unit:"ელემენტი",verb:"უნდა შეიცავდეს"},set:{unit:"ელემენტი",verb:"უნდა შეიცავდეს"}};function t(n){return e[n]??null}const r={regex:"შეყვანა",email:"ელ-ფოსტის მისამართი",url:"URL",emoji:"ემოჯი",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"თარიღი-დრო",date:"თარიღი",time:"დრო",duration:"ხანგრძლივობა",ipv4:"IPv4 მისამართი",ipv6:"IPv6 მისამართი",cidrv4:"IPv4 დიაპაზონი",cidrv6:"IPv6 დიაპაზონი",base64:"base64-კოდირებული სტრინგი",base64url:"base64url-კოდირებული სტრინგი",json_string:"JSON სტრინგი",e164:"E.164 ნომერი",jwt:"JWT",template_literal:"შეყვანა"},i={nan:"NaN",number:"რიცხვი",string:"სტრინგი",boolean:"ბულეანი",function:"ფუნქცია",array:"მასივი"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`არასწორი შეყვანა: მოსალოდნელი instanceof ${n.expected}, მიღებული ${s}`:`არასწორი შეყვანა: მოსალოდნელი ${o}, მიღებული ${s}`}case"invalid_value":return n.values.length===1?`არასწორი შეყვანა: მოსალოდნელი ${w(n.values[0])}`:`არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${y(n.values,"|")}-დან`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`ზედმეტად დიდი: მოსალოდნელი ${n.origin??"მნიშვნელობა"} ${a.verb} ${o}${n.maximum.toString()} ${a.unit}`:`ზედმეტად დიდი: მოსალოდნელი ${n.origin??"მნიშვნელობა"} იყოს ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`ზედმეტად პატარა: მოსალოდნელი ${n.origin} ${a.verb} ${o}${n.minimum.toString()} ${a.unit}`:`ზედმეტად პატარა: მოსალოდნელი ${n.origin} იყოს ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`არასწორი სტრინგი: უნდა იწყებოდეს "${o.prefix}"-ით`:o.format==="ends_with"?`არასწორი სტრინგი: უნდა მთავრდებოდეს "${o.suffix}"-ით`:o.format==="includes"?`არასწორი სტრინგი: უნდა შეიცავდეს "${o.includes}"-ს`:o.format==="regex"?`არასწორი სტრინგი: უნდა შეესაბამებოდეს შაბლონს ${o.pattern}`:`არასწორი ${r[o.format]??n.format}`}case"not_multiple_of":return`არასწორი რიცხვი: უნდა იყოს ${n.divisor}-ის ჯერადი`;case"unrecognized_keys":return`უცნობი გასაღებ${n.keys.length>1?"ები":"ი"}: ${y(n.keys,", ")}`;case"invalid_key":return`არასწორი გასაღები ${n.origin}-ში`;case"invalid_union":return"არასწორი შეყვანა";case"invalid_element":return`არასწორი მნიშვნელობა ${n.origin}-ში`;default:return"არასწორი შეყვანა"}}};function Gh(){return{localeError:Bh()}}const Vh=()=>{const e={string:{unit:"តួអក្សរ",verb:"គួរមាន"},file:{unit:"បៃ",verb:"គួរមាន"},array:{unit:"ធាតុ",verb:"គួរមាន"},set:{unit:"ធាតុ",verb:"គួរមាន"}};function t(n){return e[n]??null}const r={regex:"ទិន្នន័យបញ្ចូល",email:"អាសយដ្ឋានអ៊ីមែល",url:"URL",emoji:"សញ្ញាអារម្មណ៍",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"កាលបរិច្ឆេទ និងម៉ោង ISO",date:"កាលបរិច្ឆេទ ISO",time:"ម៉ោង ISO",duration:"រយៈពេល ISO",ipv4:"អាសយដ្ឋាន IPv4",ipv6:"អាសយដ្ឋាន IPv6",cidrv4:"ដែនអាសយដ្ឋាន IPv4",cidrv6:"ដែនអាសយដ្ឋាន IPv6",base64:"ខ្សែអក្សរអ៊ិកូដ base64",base64url:"ខ្សែអក្សរអ៊ិកូដ base64url",json_string:"ខ្សែអក្សរ JSON",e164:"លេខ E.164",jwt:"JWT",template_literal:"ទិន្នន័យបញ្ចូល"},i={nan:"NaN",number:"លេខ",array:"អារេ (Array)",null:"គ្មានតម្លៃ (null)"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${n.expected} ប៉ុន្តែទទួលបាន ${s}`:`ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${o} ប៉ុន្តែទទួលបាន ${s}`}case"invalid_value":return n.values.length===1?`ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${w(n.values[0])}`:`ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`ធំពេក៖ ត្រូវការ ${n.origin??"តម្លៃ"} ${o} ${n.maximum.toString()} ${a.unit??"ធាតុ"}`:`ធំពេក៖ ត្រូវការ ${n.origin??"តម្លៃ"} ${o} ${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`តូចពេក៖ ត្រូវការ ${n.origin} ${o} ${n.minimum.toString()} ${a.unit}`:`តូចពេក៖ ត្រូវការ ${n.origin} ${o} ${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${o.prefix}"`:o.format==="ends_with"?`ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${o.suffix}"`:o.format==="includes"?`ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${o.includes}"`:o.format==="regex"?`ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${o.pattern}`:`មិនត្រឹមត្រូវ៖ ${r[o.format]??n.format}`}case"not_multiple_of":return`លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${n.divisor}`;case"unrecognized_keys":return`រកឃើញសោមិនស្គាល់៖ ${y(n.keys,", ")}`;case"invalid_key":return`សោមិនត្រឹមត្រូវនៅក្នុង ${n.origin}`;case"invalid_union":return"ទិន្នន័យមិនត្រឹមត្រូវ";case"invalid_element":return`ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${n.origin}`;default:return"ទិន្នន័យមិនត្រឹមត្រូវ"}}};function ru(){return{localeError:Vh()}}function Wh(){return ru()}const Xh=()=>{const e={string:{unit:"문자",verb:"to have"},file:{unit:"바이트",verb:"to have"},array:{unit:"개",verb:"to have"},set:{unit:"개",verb:"to have"}};function t(n){return e[n]??null}const r={regex:"입력",email:"이메일 주소",url:"URL",emoji:"이모지",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO 날짜시간",date:"ISO 날짜",time:"ISO 시간",duration:"ISO 기간",ipv4:"IPv4 주소",ipv6:"IPv6 주소",cidrv4:"IPv4 범위",cidrv6:"IPv6 범위",base64:"base64 인코딩 문자열",base64url:"base64url 인코딩 문자열",json_string:"JSON 문자열",e164:"E.164 번호",jwt:"JWT",template_literal:"입력"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`잘못된 입력: 예상 타입은 instanceof ${n.expected}, 받은 타입은 ${s}입니다`:`잘못된 입력: 예상 타입은 ${o}, 받은 타입은 ${s}입니다`}case"invalid_value":return n.values.length===1?`잘못된 입력: 값은 ${w(n.values[0])} 이어야 합니다`:`잘못된 옵션: ${y(n.values,"또는 ")} 중 하나여야 합니다`;case"too_big":{const o=n.inclusive?"이하":"미만",a=o==="미만"?"이어야 합니다":"여야 합니다",s=t(n.origin),c=(s==null?void 0:s.unit)??"요소";return s?`${n.origin??"값"}이 너무 큽니다: ${n.maximum.toString()}${c} ${o}${a}`:`${n.origin??"값"}이 너무 큽니다: ${n.maximum.toString()} ${o}${a}`}case"too_small":{const o=n.inclusive?"이상":"초과",a=o==="이상"?"이어야 합니다":"여야 합니다",s=t(n.origin),c=(s==null?void 0:s.unit)??"요소";return s?`${n.origin??"값"}이 너무 작습니다: ${n.minimum.toString()}${c} ${o}${a}`:`${n.origin??"값"}이 너무 작습니다: ${n.minimum.toString()} ${o}${a}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`잘못된 문자열: "${o.prefix}"(으)로 시작해야 합니다`:o.format==="ends_with"?`잘못된 문자열: "${o.suffix}"(으)로 끝나야 합니다`:o.format==="includes"?`잘못된 문자열: "${o.includes}"을(를) 포함해야 합니다`:o.format==="regex"?`잘못된 문자열: 정규식 ${o.pattern} 패턴과 일치해야 합니다`:`잘못된 ${r[o.format]??n.format}`}case"not_multiple_of":return`잘못된 숫자: ${n.divisor}의 배수여야 합니다`;case"unrecognized_keys":return`인식할 수 없는 키: ${y(n.keys,", ")}`;case"invalid_key":return`잘못된 키: ${n.origin}`;case"invalid_union":return"잘못된 입력";case"invalid_element":return`잘못된 값: ${n.origin}`;default:return"잘못된 입력"}}};function Hh(){return{localeError:Xh()}}const et=e=>e.charAt(0).toUpperCase()+e.slice(1);function Wa(e){const t=Math.abs(e),r=t%10,i=t%100;return i>=11&&i<=19||r===0?"many":r===1?"one":"few"}const Qh=()=>{const e={string:{unit:{one:"simbolis",few:"simboliai",many:"simbolių"},verb:{smaller:{inclusive:"turi būti ne ilgesnė kaip",notInclusive:"turi būti trumpesnė kaip"},bigger:{inclusive:"turi būti ne trumpesnė kaip",notInclusive:"turi būti ilgesnė kaip"}}},file:{unit:{one:"baitas",few:"baitai",many:"baitų"},verb:{smaller:{inclusive:"turi būti ne didesnis kaip",notInclusive:"turi būti mažesnis kaip"},bigger:{inclusive:"turi būti ne mažesnis kaip",notInclusive:"turi būti didesnis kaip"}}},array:{unit:{one:"elementą",few:"elementus",many:"elementų"},verb:{smaller:{inclusive:"turi turėti ne daugiau kaip",notInclusive:"turi turėti mažiau kaip"},bigger:{inclusive:"turi turėti ne mažiau kaip",notInclusive:"turi turėti daugiau kaip"}}},set:{unit:{one:"elementą",few:"elementus",many:"elementų"},verb:{smaller:{inclusive:"turi turėti ne daugiau kaip",notInclusive:"turi turėti mažiau kaip"},bigger:{inclusive:"turi turėti ne mažiau kaip",notInclusive:"turi turėti daugiau kaip"}}}};function t(n,o,a,s){const c=e[n]??null;return c===null?c:{unit:c.unit[o],verb:c.verb[s][a?"inclusive":"notInclusive"]}}const r={regex:"įvestis",email:"el. pašto adresas",url:"URL",emoji:"jaustukas",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO data ir laikas",date:"ISO data",time:"ISO laikas",duration:"ISO trukmė",ipv4:"IPv4 adresas",ipv6:"IPv6 adresas",cidrv4:"IPv4 tinklo prefiksas (CIDR)",cidrv6:"IPv6 tinklo prefiksas (CIDR)",base64:"base64 užkoduota eilutė",base64url:"base64url užkoduota eilutė",json_string:"JSON eilutė",e164:"E.164 numeris",jwt:"JWT",template_literal:"įvestis"},i={nan:"NaN",number:"skaičius",bigint:"sveikasis skaičius",string:"eilutė",boolean:"loginė reikšmė",undefined:"neapibrėžta reikšmė",function:"funkcija",symbol:"simbolis",array:"masyvas",object:"objektas",null:"nulinė reikšmė"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Gautas tipas ${s}, o tikėtasi - instanceof ${n.expected}`:`Gautas tipas ${s}, o tikėtasi - ${o}`}case"invalid_value":return n.values.length===1?`Privalo būti ${w(n.values[0])}`:`Privalo būti vienas iš ${y(n.values,"|")} pasirinkimų`;case"too_big":{const o=i[n.origin]??n.origin,a=t(n.origin,Wa(Number(n.maximum)),n.inclusive??!1,"smaller");if(a!=null&&a.verb)return`${et(o??n.origin??"reikšmė")} ${a.verb} ${n.maximum.toString()} ${a.unit??"elementų"}`;const s=n.inclusive?"ne didesnis kaip":"mažesnis kaip";return`${et(o??n.origin??"reikšmė")} turi būti ${s} ${n.maximum.toString()} ${a==null?void 0:a.unit}`}case"too_small":{const o=i[n.origin]??n.origin,a=t(n.origin,Wa(Number(n.minimum)),n.inclusive??!1,"bigger");if(a!=null&&a.verb)return`${et(o??n.origin??"reikšmė")} ${a.verb} ${n.minimum.toString()} ${a.unit??"elementų"}`;const s=n.inclusive?"ne mažesnis kaip":"didesnis kaip";return`${et(o??n.origin??"reikšmė")} turi būti ${s} ${n.minimum.toString()} ${a==null?void 0:a.unit}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Eilutė privalo prasidėti "${o.prefix}"`:o.format==="ends_with"?`Eilutė privalo pasibaigti "${o.suffix}"`:o.format==="includes"?`Eilutė privalo įtraukti "${o.includes}"`:o.format==="regex"?`Eilutė privalo atitikti ${o.pattern}`:`Neteisingas ${r[o.format]??n.format}`}case"not_multiple_of":return`Skaičius privalo būti ${n.divisor} kartotinis.`;case"unrecognized_keys":return`Neatpažint${n.keys.length>1?"i":"as"} rakt${n.keys.length>1?"ai":"as"}: ${y(n.keys,", ")}`;case"invalid_key":return"Rastas klaidingas raktas";case"invalid_union":return"Klaidinga įvestis";case"invalid_element":{const o=i[n.origin]??n.origin;return`${et(o??n.origin??"reikšmė")} turi klaidingą įvestį`}default:return"Klaidinga įvestis"}}};function Yh(){return{localeError:Qh()}}const eg=()=>{const e={string:{unit:"знаци",verb:"да имаат"},file:{unit:"бајти",verb:"да имаат"},array:{unit:"ставки",verb:"да имаат"},set:{unit:"ставки",verb:"да имаат"}};function t(n){return e[n]??null}const r={regex:"внес",email:"адреса на е-пошта",url:"URL",emoji:"емоџи",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO датум и време",date:"ISO датум",time:"ISO време",duration:"ISO времетраење",ipv4:"IPv4 адреса",ipv6:"IPv6 адреса",cidrv4:"IPv4 опсег",cidrv6:"IPv6 опсег",base64:"base64-енкодирана низа",base64url:"base64url-енкодирана низа",json_string:"JSON низа",e164:"E.164 број",jwt:"JWT",template_literal:"внес"},i={nan:"NaN",number:"број",array:"низа"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Грешен внес: се очекува instanceof ${n.expected}, примено ${s}`:`Грешен внес: се очекува ${o}, примено ${s}`}case"invalid_value":return n.values.length===1?`Invalid input: expected ${w(n.values[0])}`:`Грешана опција: се очекува една ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Премногу голем: се очекува ${n.origin??"вредноста"} да има ${o}${n.maximum.toString()} ${a.unit??"елементи"}`:`Премногу голем: се очекува ${n.origin??"вредноста"} да биде ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Премногу мал: се очекува ${n.origin} да има ${o}${n.minimum.toString()} ${a.unit}`:`Премногу мал: се очекува ${n.origin} да биде ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Неважечка низа: мора да започнува со "${o.prefix}"`:o.format==="ends_with"?`Неважечка низа: мора да завршува со "${o.suffix}"`:o.format==="includes"?`Неважечка низа: мора да вклучува "${o.includes}"`:o.format==="regex"?`Неважечка низа: мора да одгоара на патернот ${o.pattern}`:`Invalid ${r[o.format]??n.format}`}case"not_multiple_of":return`Грешен број: мора да биде делив со ${n.divisor}`;case"unrecognized_keys":return`${n.keys.length>1?"Непрепознаени клучеви":"Непрепознаен клуч"}: ${y(n.keys,", ")}`;case"invalid_key":return`Грешен клуч во ${n.origin}`;case"invalid_union":return"Грешен внес";case"invalid_element":return`Грешна вредност во ${n.origin}`;default:return"Грешен внес"}}};function tg(){return{localeError:eg()}}const ng=()=>{const e={string:{unit:"aksara",verb:"mempunyai"},file:{unit:"bait",verb:"mempunyai"},array:{unit:"elemen",verb:"mempunyai"},set:{unit:"elemen",verb:"mempunyai"}};function t(n){return e[n]??null}const r={regex:"input",email:"alamat e-mel",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"tarikh masa ISO",date:"tarikh ISO",time:"masa ISO",duration:"tempoh ISO",ipv4:"alamat IPv4",ipv6:"alamat IPv6",cidrv4:"julat IPv4",cidrv6:"julat IPv6",base64:"string dikodkan base64",base64url:"string dikodkan base64url",json_string:"string JSON",e164:"nombor E.164",jwt:"JWT",template_literal:"input"},i={nan:"NaN",number:"nombor"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Input tidak sah: dijangka instanceof ${n.expected}, diterima ${s}`:`Input tidak sah: dijangka ${o}, diterima ${s}`}case"invalid_value":return n.values.length===1?`Input tidak sah: dijangka ${w(n.values[0])}`:`Pilihan tidak sah: dijangka salah satu daripada ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Terlalu besar: dijangka ${n.origin??"nilai"} ${a.verb} ${o}${n.maximum.toString()} ${a.unit??"elemen"}`:`Terlalu besar: dijangka ${n.origin??"nilai"} adalah ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Terlalu kecil: dijangka ${n.origin} ${a.verb} ${o}${n.minimum.toString()} ${a.unit}`:`Terlalu kecil: dijangka ${n.origin} adalah ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`String tidak sah: mesti bermula dengan "${o.prefix}"`:o.format==="ends_with"?`String tidak sah: mesti berakhir dengan "${o.suffix}"`:o.format==="includes"?`String tidak sah: mesti mengandungi "${o.includes}"`:o.format==="regex"?`String tidak sah: mesti sepadan dengan corak ${o.pattern}`:`${r[o.format]??n.format} tidak sah`}case"not_multiple_of":return`Nombor tidak sah: perlu gandaan ${n.divisor}`;case"unrecognized_keys":return`Kunci tidak dikenali: ${y(n.keys,", ")}`;case"invalid_key":return`Kunci tidak sah dalam ${n.origin}`;case"invalid_union":return"Input tidak sah";case"invalid_element":return`Nilai tidak sah dalam ${n.origin}`;default:return"Input tidak sah"}}};function rg(){return{localeError:ng()}}const ig=()=>{const e={string:{unit:"tekens",verb:"heeft"},file:{unit:"bytes",verb:"heeft"},array:{unit:"elementen",verb:"heeft"},set:{unit:"elementen",verb:"heeft"}};function t(n){return e[n]??null}const r={regex:"invoer",email:"emailadres",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO datum en tijd",date:"ISO datum",time:"ISO tijd",duration:"ISO duur",ipv4:"IPv4-adres",ipv6:"IPv6-adres",cidrv4:"IPv4-bereik",cidrv6:"IPv6-bereik",base64:"base64-gecodeerde tekst",base64url:"base64 URL-gecodeerde tekst",json_string:"JSON string",e164:"E.164-nummer",jwt:"JWT",template_literal:"invoer"},i={nan:"NaN",number:"getal"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Ongeldige invoer: verwacht instanceof ${n.expected}, ontving ${s}`:`Ongeldige invoer: verwacht ${o}, ontving ${s}`}case"invalid_value":return n.values.length===1?`Ongeldige invoer: verwacht ${w(n.values[0])}`:`Ongeldige optie: verwacht één van ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin),s=n.origin==="date"?"laat":n.origin==="string"?"lang":"groot";return a?`Te ${s}: verwacht dat ${n.origin??"waarde"} ${o}${n.maximum.toString()} ${a.unit??"elementen"} ${a.verb}`:`Te ${s}: verwacht dat ${n.origin??"waarde"} ${o}${n.maximum.toString()} is`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin),s=n.origin==="date"?"vroeg":n.origin==="string"?"kort":"klein";return a?`Te ${s}: verwacht dat ${n.origin} ${o}${n.minimum.toString()} ${a.unit} ${a.verb}`:`Te ${s}: verwacht dat ${n.origin} ${o}${n.minimum.toString()} is`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ongeldige tekst: moet met "${o.prefix}" beginnen`:o.format==="ends_with"?`Ongeldige tekst: moet op "${o.suffix}" eindigen`:o.format==="includes"?`Ongeldige tekst: moet "${o.includes}" bevatten`:o.format==="regex"?`Ongeldige tekst: moet overeenkomen met patroon ${o.pattern}`:`Ongeldig: ${r[o.format]??n.format}`}case"not_multiple_of":return`Ongeldig getal: moet een veelvoud van ${n.divisor} zijn`;case"unrecognized_keys":return`Onbekende key${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Ongeldige key in ${n.origin}`;case"invalid_union":return"Ongeldige invoer";case"invalid_element":return`Ongeldige waarde in ${n.origin}`;default:return"Ongeldige invoer"}}};function og(){return{localeError:ig()}}const ag=()=>{const e={string:{unit:"tegn",verb:"å ha"},file:{unit:"bytes",verb:"å ha"},array:{unit:"elementer",verb:"å inneholde"},set:{unit:"elementer",verb:"å inneholde"}};function t(n){return e[n]??null}const r={regex:"input",email:"e-postadresse",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO dato- og klokkeslett",date:"ISO-dato",time:"ISO-klokkeslett",duration:"ISO-varighet",ipv4:"IPv4-område",ipv6:"IPv6-område",cidrv4:"IPv4-spekter",cidrv6:"IPv6-spekter",base64:"base64-enkodet streng",base64url:"base64url-enkodet streng",json_string:"JSON-streng",e164:"E.164-nummer",jwt:"JWT",template_literal:"input"},i={nan:"NaN",number:"tall",array:"liste"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Ugyldig input: forventet instanceof ${n.expected}, fikk ${s}`:`Ugyldig input: forventet ${o}, fikk ${s}`}case"invalid_value":return n.values.length===1?`Ugyldig verdi: forventet ${w(n.values[0])}`:`Ugyldig valg: forventet en av ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`For stor(t): forventet ${n.origin??"value"} til å ha ${o}${n.maximum.toString()} ${a.unit??"elementer"}`:`For stor(t): forventet ${n.origin??"value"} til å ha ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`For lite(n): forventet ${n.origin} til å ha ${o}${n.minimum.toString()} ${a.unit}`:`For lite(n): forventet ${n.origin} til å ha ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ugyldig streng: må starte med "${o.prefix}"`:o.format==="ends_with"?`Ugyldig streng: må ende med "${o.suffix}"`:o.format==="includes"?`Ugyldig streng: må inneholde "${o.includes}"`:o.format==="regex"?`Ugyldig streng: må matche mønsteret ${o.pattern}`:`Ugyldig ${r[o.format]??n.format}`}case"not_multiple_of":return`Ugyldig tall: må være et multiplum av ${n.divisor}`;case"unrecognized_keys":return`${n.keys.length>1?"Ukjente nøkler":"Ukjent nøkkel"}: ${y(n.keys,", ")}`;case"invalid_key":return`Ugyldig nøkkel i ${n.origin}`;case"invalid_union":return"Ugyldig input";case"invalid_element":return`Ugyldig verdi i ${n.origin}`;default:return"Ugyldig input"}}};function sg(){return{localeError:ag()}}const lg=()=>{const e={string:{unit:"harf",verb:"olmalıdır"},file:{unit:"bayt",verb:"olmalıdır"},array:{unit:"unsur",verb:"olmalıdır"},set:{unit:"unsur",verb:"olmalıdır"}};function t(n){return e[n]??null}const r={regex:"giren",email:"epostagâh",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO hengâmı",date:"ISO tarihi",time:"ISO zamanı",duration:"ISO müddeti",ipv4:"IPv4 nişânı",ipv6:"IPv6 nişânı",cidrv4:"IPv4 menzili",cidrv6:"IPv6 menzili",base64:"base64-şifreli metin",base64url:"base64url-şifreli metin",json_string:"JSON metin",e164:"E.164 sayısı",jwt:"JWT",template_literal:"giren"},i={nan:"NaN",number:"numara",array:"saf",null:"gayb"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Fâsit giren: umulan instanceof ${n.expected}, alınan ${s}`:`Fâsit giren: umulan ${o}, alınan ${s}`}case"invalid_value":return n.values.length===1?`Fâsit giren: umulan ${w(n.values[0])}`:`Fâsit tercih: mûteberler ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Fazla büyük: ${n.origin??"value"}, ${o}${n.maximum.toString()} ${a.unit??"elements"} sahip olmalıydı.`:`Fazla büyük: ${n.origin??"value"}, ${o}${n.maximum.toString()} olmalıydı.`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Fazla küçük: ${n.origin}, ${o}${n.minimum.toString()} ${a.unit} sahip olmalıydı.`:`Fazla küçük: ${n.origin}, ${o}${n.minimum.toString()} olmalıydı.`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Fâsit metin: "${o.prefix}" ile başlamalı.`:o.format==="ends_with"?`Fâsit metin: "${o.suffix}" ile bitmeli.`:o.format==="includes"?`Fâsit metin: "${o.includes}" ihtivâ etmeli.`:o.format==="regex"?`Fâsit metin: ${o.pattern} nakşına uymalı.`:`Fâsit ${r[o.format]??n.format}`}case"not_multiple_of":return`Fâsit sayı: ${n.divisor} katı olmalıydı.`;case"unrecognized_keys":return`Tanınmayan anahtar ${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`${n.origin} için tanınmayan anahtar var.`;case"invalid_union":return"Giren tanınamadı.";case"invalid_element":return`${n.origin} için tanınmayan kıymet var.`;default:return"Kıymet tanınamadı."}}};function cg(){return{localeError:lg()}}const ug=()=>{const e={string:{unit:"توکي",verb:"ولري"},file:{unit:"بایټس",verb:"ولري"},array:{unit:"توکي",verb:"ولري"},set:{unit:"توکي",verb:"ولري"}};function t(n){return e[n]??null}const r={regex:"ورودي",email:"بریښنالیک",url:"یو آر ال",emoji:"ایموجي",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"نیټه او وخت",date:"نېټه",time:"وخت",duration:"موده",ipv4:"د IPv4 پته",ipv6:"د IPv6 پته",cidrv4:"د IPv4 ساحه",cidrv6:"د IPv6 ساحه",base64:"base64-encoded متن",base64url:"base64url-encoded متن",json_string:"JSON متن",e164:"د E.164 شمېره",jwt:"JWT",template_literal:"ورودي"},i={nan:"NaN",number:"عدد",array:"ارې"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`ناسم ورودي: باید instanceof ${n.expected} وای, مګر ${s} ترلاسه شو`:`ناسم ورودي: باید ${o} وای, مګر ${s} ترلاسه شو`}case"invalid_value":return n.values.length===1?`ناسم ورودي: باید ${w(n.values[0])} وای`:`ناسم انتخاب: باید یو له ${y(n.values,"|")} څخه وای`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`ډیر لوی: ${n.origin??"ارزښت"} باید ${o}${n.maximum.toString()} ${a.unit??"عنصرونه"} ولري`:`ډیر لوی: ${n.origin??"ارزښت"} باید ${o}${n.maximum.toString()} وي`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`ډیر کوچنی: ${n.origin} باید ${o}${n.minimum.toString()} ${a.unit} ولري`:`ډیر کوچنی: ${n.origin} باید ${o}${n.minimum.toString()} وي`}case"invalid_format":{const o=n;return o.format==="starts_with"?`ناسم متن: باید د "${o.prefix}" سره پیل شي`:o.format==="ends_with"?`ناسم متن: باید د "${o.suffix}" سره پای ته ورسيږي`:o.format==="includes"?`ناسم متن: باید "${o.includes}" ولري`:o.format==="regex"?`ناسم متن: باید د ${o.pattern} سره مطابقت ولري`:`${r[o.format]??n.format} ناسم دی`}case"not_multiple_of":return`ناسم عدد: باید د ${n.divisor} مضرب وي`;case"unrecognized_keys":return`ناسم ${n.keys.length>1?"کلیډونه":"کلیډ"}: ${y(n.keys,", ")}`;case"invalid_key":return`ناسم کلیډ په ${n.origin} کې`;case"invalid_union":return"ناسمه ورودي";case"invalid_element":return`ناسم عنصر په ${n.origin} کې`;default:return"ناسمه ورودي"}}};function dg(){return{localeError:ug()}}const pg=()=>{const e={string:{unit:"znaków",verb:"mieć"},file:{unit:"bajtów",verb:"mieć"},array:{unit:"elementów",verb:"mieć"},set:{unit:"elementów",verb:"mieć"}};function t(n){return e[n]??null}const r={regex:"wyrażenie",email:"adres email",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"data i godzina w formacie ISO",date:"data w formacie ISO",time:"godzina w formacie ISO",duration:"czas trwania ISO",ipv4:"adres IPv4",ipv6:"adres IPv6",cidrv4:"zakres IPv4",cidrv6:"zakres IPv6",base64:"ciąg znaków zakodowany w formacie base64",base64url:"ciąg znaków zakodowany w formacie base64url",json_string:"ciąg znaków w formacie JSON",e164:"liczba E.164",jwt:"JWT",template_literal:"wejście"},i={nan:"NaN",number:"liczba",array:"tablica"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Nieprawidłowe dane wejściowe: oczekiwano instanceof ${n.expected}, otrzymano ${s}`:`Nieprawidłowe dane wejściowe: oczekiwano ${o}, otrzymano ${s}`}case"invalid_value":return n.values.length===1?`Nieprawidłowe dane wejściowe: oczekiwano ${w(n.values[0])}`:`Nieprawidłowa opcja: oczekiwano jednej z wartości ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Za duża wartość: oczekiwano, że ${n.origin??"wartość"} będzie mieć ${o}${n.maximum.toString()} ${a.unit??"elementów"}`:`Zbyt duż(y/a/e): oczekiwano, że ${n.origin??"wartość"} będzie wynosić ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Za mała wartość: oczekiwano, że ${n.origin??"wartość"} będzie mieć ${o}${n.minimum.toString()} ${a.unit??"elementów"}`:`Zbyt mał(y/a/e): oczekiwano, że ${n.origin??"wartość"} będzie wynosić ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Nieprawidłowy ciąg znaków: musi zaczynać się od "${o.prefix}"`:o.format==="ends_with"?`Nieprawidłowy ciąg znaków: musi kończyć się na "${o.suffix}"`:o.format==="includes"?`Nieprawidłowy ciąg znaków: musi zawierać "${o.includes}"`:o.format==="regex"?`Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${o.pattern}`:`Nieprawidłow(y/a/e) ${r[o.format]??n.format}`}case"not_multiple_of":return`Nieprawidłowa liczba: musi być wielokrotnością ${n.divisor}`;case"unrecognized_keys":return`Nierozpoznane klucze${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Nieprawidłowy klucz w ${n.origin}`;case"invalid_union":return"Nieprawidłowe dane wejściowe";case"invalid_element":return`Nieprawidłowa wartość w ${n.origin}`;default:return"Nieprawidłowe dane wejściowe"}}};function mg(){return{localeError:pg()}}const fg=()=>{const e={string:{unit:"caracteres",verb:"ter"},file:{unit:"bytes",verb:"ter"},array:{unit:"itens",verb:"ter"},set:{unit:"itens",verb:"ter"}};function t(n){return e[n]??null}const r={regex:"padrão",email:"endereço de e-mail",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"data e hora ISO",date:"data ISO",time:"hora ISO",duration:"duração ISO",ipv4:"endereço IPv4",ipv6:"endereço IPv6",cidrv4:"faixa de IPv4",cidrv6:"faixa de IPv6",base64:"texto codificado em base64",base64url:"URL codificada em base64",json_string:"texto JSON",e164:"número E.164",jwt:"JWT",template_literal:"entrada"},i={nan:"NaN",number:"número",null:"nulo"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Tipo inválido: esperado instanceof ${n.expected}, recebido ${s}`:`Tipo inválido: esperado ${o}, recebido ${s}`}case"invalid_value":return n.values.length===1?`Entrada inválida: esperado ${w(n.values[0])}`:`Opção inválida: esperada uma das ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Muito grande: esperado que ${n.origin??"valor"} tivesse ${o}${n.maximum.toString()} ${a.unit??"elementos"}`:`Muito grande: esperado que ${n.origin??"valor"} fosse ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Muito pequeno: esperado que ${n.origin} tivesse ${o}${n.minimum.toString()} ${a.unit}`:`Muito pequeno: esperado que ${n.origin} fosse ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Texto inválido: deve começar com "${o.prefix}"`:o.format==="ends_with"?`Texto inválido: deve terminar com "${o.suffix}"`:o.format==="includes"?`Texto inválido: deve incluir "${o.includes}"`:o.format==="regex"?`Texto inválido: deve corresponder ao padrão ${o.pattern}`:`${r[o.format]??n.format} inválido`}case"not_multiple_of":return`Número inválido: deve ser múltiplo de ${n.divisor}`;case"unrecognized_keys":return`Chave${n.keys.length>1?"s":""} desconhecida${n.keys.length>1?"s":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Chave inválida em ${n.origin}`;case"invalid_union":return"Entrada inválida";case"invalid_element":return`Valor inválido em ${n.origin}`;default:return"Campo inválido"}}};function hg(){return{localeError:fg()}}function Xa(e,t,r,i){const n=Math.abs(e),o=n%10,a=n%100;return a>=11&&a<=19?i:o===1?t:o>=2&&o<=4?r:i}const gg=()=>{const e={string:{unit:{one:"символ",few:"символа",many:"символов"},verb:"иметь"},file:{unit:{one:"байт",few:"байта",many:"байт"},verb:"иметь"},array:{unit:{one:"элемент",few:"элемента",many:"элементов"},verb:"иметь"},set:{unit:{one:"элемент",few:"элемента",many:"элементов"},verb:"иметь"}};function t(n){return e[n]??null}const r={regex:"ввод",email:"email адрес",url:"URL",emoji:"эмодзи",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO дата и время",date:"ISO дата",time:"ISO время",duration:"ISO длительность",ipv4:"IPv4 адрес",ipv6:"IPv6 адрес",cidrv4:"IPv4 диапазон",cidrv6:"IPv6 диапазон",base64:"строка в формате base64",base64url:"строка в формате base64url",json_string:"JSON строка",e164:"номер E.164",jwt:"JWT",template_literal:"ввод"},i={nan:"NaN",number:"число",array:"массив"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Неверный ввод: ожидалось instanceof ${n.expected}, получено ${s}`:`Неверный ввод: ожидалось ${o}, получено ${s}`}case"invalid_value":return n.values.length===1?`Неверный ввод: ожидалось ${w(n.values[0])}`:`Неверный вариант: ожидалось одно из ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);if(a){const s=Number(n.maximum),c=Xa(s,a.unit.one,a.unit.few,a.unit.many);return`Слишком большое значение: ожидалось, что ${n.origin??"значение"} будет иметь ${o}${n.maximum.toString()} ${c}`}return`Слишком большое значение: ожидалось, что ${n.origin??"значение"} будет ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);if(a){const s=Number(n.minimum),c=Xa(s,a.unit.one,a.unit.few,a.unit.many);return`Слишком маленькое значение: ожидалось, что ${n.origin} будет иметь ${o}${n.minimum.toString()} ${c}`}return`Слишком маленькое значение: ожидалось, что ${n.origin} будет ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Неверная строка: должна начинаться с "${o.prefix}"`:o.format==="ends_with"?`Неверная строка: должна заканчиваться на "${o.suffix}"`:o.format==="includes"?`Неверная строка: должна содержать "${o.includes}"`:o.format==="regex"?`Неверная строка: должна соответствовать шаблону ${o.pattern}`:`Неверный ${r[o.format]??n.format}`}case"not_multiple_of":return`Неверное число: должно быть кратным ${n.divisor}`;case"unrecognized_keys":return`Нераспознанн${n.keys.length>1?"ые":"ый"} ключ${n.keys.length>1?"и":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Неверный ключ в ${n.origin}`;case"invalid_union":return"Неверные входные данные";case"invalid_element":return`Неверное значение в ${n.origin}`;default:return"Неверные входные данные"}}};function vg(){return{localeError:gg()}}const bg=()=>{const e={string:{unit:"znakov",verb:"imeti"},file:{unit:"bajtov",verb:"imeti"},array:{unit:"elementov",verb:"imeti"},set:{unit:"elementov",verb:"imeti"}};function t(n){return e[n]??null}const r={regex:"vnos",email:"e-poštni naslov",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO datum in čas",date:"ISO datum",time:"ISO čas",duration:"ISO trajanje",ipv4:"IPv4 naslov",ipv6:"IPv6 naslov",cidrv4:"obseg IPv4",cidrv6:"obseg IPv6",base64:"base64 kodiran niz",base64url:"base64url kodiran niz",json_string:"JSON niz",e164:"E.164 številka",jwt:"JWT",template_literal:"vnos"},i={nan:"NaN",number:"število",array:"tabela"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Neveljaven vnos: pričakovano instanceof ${n.expected}, prejeto ${s}`:`Neveljaven vnos: pričakovano ${o}, prejeto ${s}`}case"invalid_value":return n.values.length===1?`Neveljaven vnos: pričakovano ${w(n.values[0])}`:`Neveljavna možnost: pričakovano eno izmed ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Preveliko: pričakovano, da bo ${n.origin??"vrednost"} imelo ${o}${n.maximum.toString()} ${a.unit??"elementov"}`:`Preveliko: pričakovano, da bo ${n.origin??"vrednost"} ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Premajhno: pričakovano, da bo ${n.origin} imelo ${o}${n.minimum.toString()} ${a.unit}`:`Premajhno: pričakovano, da bo ${n.origin} ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Neveljaven niz: mora se začeti z "${o.prefix}"`:o.format==="ends_with"?`Neveljaven niz: mora se končati z "${o.suffix}"`:o.format==="includes"?`Neveljaven niz: mora vsebovati "${o.includes}"`:o.format==="regex"?`Neveljaven niz: mora ustrezati vzorcu ${o.pattern}`:`Neveljaven ${r[o.format]??n.format}`}case"not_multiple_of":return`Neveljavno število: mora biti večkratnik ${n.divisor}`;case"unrecognized_keys":return`Neprepoznan${n.keys.length>1?"i ključi":" ključ"}: ${y(n.keys,", ")}`;case"invalid_key":return`Neveljaven ključ v ${n.origin}`;case"invalid_union":return"Neveljaven vnos";case"invalid_element":return`Neveljavna vrednost v ${n.origin}`;default:return"Neveljaven vnos"}}};function yg(){return{localeError:bg()}}const $g=()=>{const e={string:{unit:"tecken",verb:"att ha"},file:{unit:"bytes",verb:"att ha"},array:{unit:"objekt",verb:"att innehålla"},set:{unit:"objekt",verb:"att innehålla"}};function t(n){return e[n]??null}const r={regex:"reguljärt uttryck",email:"e-postadress",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO-datum och tid",date:"ISO-datum",time:"ISO-tid",duration:"ISO-varaktighet",ipv4:"IPv4-intervall",ipv6:"IPv6-intervall",cidrv4:"IPv4-spektrum",cidrv6:"IPv6-spektrum",base64:"base64-kodad sträng",base64url:"base64url-kodad sträng",json_string:"JSON-sträng",e164:"E.164-nummer",jwt:"JWT",template_literal:"mall-literal"},i={nan:"NaN",number:"antal",array:"lista"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Ogiltig inmatning: förväntat instanceof ${n.expected}, fick ${s}`:`Ogiltig inmatning: förväntat ${o}, fick ${s}`}case"invalid_value":return n.values.length===1?`Ogiltig inmatning: förväntat ${w(n.values[0])}`:`Ogiltigt val: förväntade en av ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`För stor(t): förväntade ${n.origin??"värdet"} att ha ${o}${n.maximum.toString()} ${a.unit??"element"}`:`För stor(t): förväntat ${n.origin??"värdet"} att ha ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`För lite(t): förväntade ${n.origin??"värdet"} att ha ${o}${n.minimum.toString()} ${a.unit}`:`För lite(t): förväntade ${n.origin??"värdet"} att ha ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ogiltig sträng: måste börja med "${o.prefix}"`:o.format==="ends_with"?`Ogiltig sträng: måste sluta med "${o.suffix}"`:o.format==="includes"?`Ogiltig sträng: måste innehålla "${o.includes}"`:o.format==="regex"?`Ogiltig sträng: måste matcha mönstret "${o.pattern}"`:`Ogiltig(t) ${r[o.format]??n.format}`}case"not_multiple_of":return`Ogiltigt tal: måste vara en multipel av ${n.divisor}`;case"unrecognized_keys":return`${n.keys.length>1?"Okända nycklar":"Okänd nyckel"}: ${y(n.keys,", ")}`;case"invalid_key":return`Ogiltig nyckel i ${n.origin??"värdet"}`;case"invalid_union":return"Ogiltig input";case"invalid_element":return`Ogiltigt värde i ${n.origin??"värdet"}`;default:return"Ogiltig input"}}};function kg(){return{localeError:$g()}}const xg=()=>{const e={string:{unit:"எழுத்துக்கள்",verb:"கொண்டிருக்க வேண்டும்"},file:{unit:"பைட்டுகள்",verb:"கொண்டிருக்க வேண்டும்"},array:{unit:"உறுப்புகள்",verb:"கொண்டிருக்க வேண்டும்"},set:{unit:"உறுப்புகள்",verb:"கொண்டிருக்க வேண்டும்"}};function t(n){return e[n]??null}const r={regex:"உள்ளீடு",email:"மின்னஞ்சல் முகவரி",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO தேதி நேரம்",date:"ISO தேதி",time:"ISO நேரம்",duration:"ISO கால அளவு",ipv4:"IPv4 முகவரி",ipv6:"IPv6 முகவரி",cidrv4:"IPv4 வரம்பு",cidrv6:"IPv6 வரம்பு",base64:"base64-encoded சரம்",base64url:"base64url-encoded சரம்",json_string:"JSON சரம்",e164:"E.164 எண்",jwt:"JWT",template_literal:"input"},i={nan:"NaN",number:"எண்",array:"அணி",null:"வெறுமை"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${n.expected}, பெறப்பட்டது ${s}`:`தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${o}, பெறப்பட்டது ${s}`}case"invalid_value":return n.values.length===1?`தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${w(n.values[0])}`:`தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${y(n.values,"|")} இல் ஒன்று`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`மிக பெரியது: எதிர்பார்க்கப்பட்டது ${n.origin??"மதிப்பு"} ${o}${n.maximum.toString()} ${a.unit??"உறுப்புகள்"} ஆக இருக்க வேண்டும்`:`மிக பெரியது: எதிர்பார்க்கப்பட்டது ${n.origin??"மதிப்பு"} ${o}${n.maximum.toString()} ஆக இருக்க வேண்டும்`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${n.origin} ${o}${n.minimum.toString()} ${a.unit} ஆக இருக்க வேண்டும்`:`மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${n.origin} ${o}${n.minimum.toString()} ஆக இருக்க வேண்டும்`}case"invalid_format":{const o=n;return o.format==="starts_with"?`தவறான சரம்: "${o.prefix}" இல் தொடங்க வேண்டும்`:o.format==="ends_with"?`தவறான சரம்: "${o.suffix}" இல் முடிவடைய வேண்டும்`:o.format==="includes"?`தவறான சரம்: "${o.includes}" ஐ உள்ளடக்க வேண்டும்`:o.format==="regex"?`தவறான சரம்: ${o.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`:`தவறான ${r[o.format]??n.format}`}case"not_multiple_of":return`தவறான எண்: ${n.divisor} இன் பலமாக இருக்க வேண்டும்`;case"unrecognized_keys":return`அடையாளம் தெரியாத விசை${n.keys.length>1?"கள்":""}: ${y(n.keys,", ")}`;case"invalid_key":return`${n.origin} இல் தவறான விசை`;case"invalid_union":return"தவறான உள்ளீடு";case"invalid_element":return`${n.origin} இல் தவறான மதிப்பு`;default:return"தவறான உள்ளீடு"}}};function _g(){return{localeError:xg()}}const wg=()=>{const e={string:{unit:"ตัวอักษร",verb:"ควรมี"},file:{unit:"ไบต์",verb:"ควรมี"},array:{unit:"รายการ",verb:"ควรมี"},set:{unit:"รายการ",verb:"ควรมี"}};function t(n){return e[n]??null}const r={regex:"ข้อมูลที่ป้อน",email:"ที่อยู่อีเมล",url:"URL",emoji:"อิโมจิ",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"วันที่เวลาแบบ ISO",date:"วันที่แบบ ISO",time:"เวลาแบบ ISO",duration:"ช่วงเวลาแบบ ISO",ipv4:"ที่อยู่ IPv4",ipv6:"ที่อยู่ IPv6",cidrv4:"ช่วง IP แบบ IPv4",cidrv6:"ช่วง IP แบบ IPv6",base64:"ข้อความแบบ Base64",base64url:"ข้อความแบบ Base64 สำหรับ URL",json_string:"ข้อความแบบ JSON",e164:"เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",jwt:"โทเคน JWT",template_literal:"ข้อมูลที่ป้อน"},i={nan:"NaN",number:"ตัวเลข",array:"อาร์เรย์ (Array)",null:"ไม่มีค่า (null)"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${n.expected} แต่ได้รับ ${s}`:`ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${o} แต่ได้รับ ${s}`}case"invalid_value":return n.values.length===1?`ค่าไม่ถูกต้อง: ควรเป็น ${w(n.values[0])}`:`ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"ไม่เกิน":"น้อยกว่า",a=t(n.origin);return a?`เกินกำหนด: ${n.origin??"ค่า"} ควรมี${o} ${n.maximum.toString()} ${a.unit??"รายการ"}`:`เกินกำหนด: ${n.origin??"ค่า"} ควรมี${o} ${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?"อย่างน้อย":"มากกว่า",a=t(n.origin);return a?`น้อยกว่ากำหนด: ${n.origin} ควรมี${o} ${n.minimum.toString()} ${a.unit}`:`น้อยกว่ากำหนด: ${n.origin} ควรมี${o} ${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${o.prefix}"`:o.format==="ends_with"?`รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${o.suffix}"`:o.format==="includes"?`รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${o.includes}" อยู่ในข้อความ`:o.format==="regex"?`รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${o.pattern}`:`รูปแบบไม่ถูกต้อง: ${r[o.format]??n.format}`}case"not_multiple_of":return`ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${n.divisor} ได้ลงตัว`;case"unrecognized_keys":return`พบคีย์ที่ไม่รู้จัก: ${y(n.keys,", ")}`;case"invalid_key":return`คีย์ไม่ถูกต้องใน ${n.origin}`;case"invalid_union":return"ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";case"invalid_element":return`ข้อมูลไม่ถูกต้องใน ${n.origin}`;default:return"ข้อมูลไม่ถูกต้อง"}}};function Sg(){return{localeError:wg()}}const zg=()=>{const e={string:{unit:"karakter",verb:"olmalı"},file:{unit:"bayt",verb:"olmalı"},array:{unit:"öğe",verb:"olmalı"},set:{unit:"öğe",verb:"olmalı"}};function t(n){return e[n]??null}const r={regex:"girdi",email:"e-posta adresi",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO tarih ve saat",date:"ISO tarih",time:"ISO saat",duration:"ISO süre",ipv4:"IPv4 adresi",ipv6:"IPv6 adresi",cidrv4:"IPv4 aralığı",cidrv6:"IPv6 aralığı",base64:"base64 ile şifrelenmiş metin",base64url:"base64url ile şifrelenmiş metin",json_string:"JSON dizesi",e164:"E.164 sayısı",jwt:"JWT",template_literal:"Şablon dizesi"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Geçersiz değer: beklenen instanceof ${n.expected}, alınan ${s}`:`Geçersiz değer: beklenen ${o}, alınan ${s}`}case"invalid_value":return n.values.length===1?`Geçersiz değer: beklenen ${w(n.values[0])}`:`Geçersiz seçenek: aşağıdakilerden biri olmalı: ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Çok büyük: beklenen ${n.origin??"değer"} ${o}${n.maximum.toString()} ${a.unit??"öğe"}`:`Çok büyük: beklenen ${n.origin??"değer"} ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Çok küçük: beklenen ${n.origin} ${o}${n.minimum.toString()} ${a.unit}`:`Çok küçük: beklenen ${n.origin} ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Geçersiz metin: "${o.prefix}" ile başlamalı`:o.format==="ends_with"?`Geçersiz metin: "${o.suffix}" ile bitmeli`:o.format==="includes"?`Geçersiz metin: "${o.includes}" içermeli`:o.format==="regex"?`Geçersiz metin: ${o.pattern} desenine uymalı`:`Geçersiz ${r[o.format]??n.format}`}case"not_multiple_of":return`Geçersiz sayı: ${n.divisor} ile tam bölünebilmeli`;case"unrecognized_keys":return`Tanınmayan anahtar${n.keys.length>1?"lar":""}: ${y(n.keys,", ")}`;case"invalid_key":return`${n.origin} içinde geçersiz anahtar`;case"invalid_union":return"Geçersiz değer";case"invalid_element":return`${n.origin} içinde geçersiz değer`;default:return"Geçersiz değer"}}};function Ig(){return{localeError:zg()}}const Eg=()=>{const e={string:{unit:"символів",verb:"матиме"},file:{unit:"байтів",verb:"матиме"},array:{unit:"елементів",verb:"матиме"},set:{unit:"елементів",verb:"матиме"}};function t(n){return e[n]??null}const r={regex:"вхідні дані",email:"адреса електронної пошти",url:"URL",emoji:"емодзі",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"дата та час ISO",date:"дата ISO",time:"час ISO",duration:"тривалість ISO",ipv4:"адреса IPv4",ipv6:"адреса IPv6",cidrv4:"діапазон IPv4",cidrv6:"діапазон IPv6",base64:"рядок у кодуванні base64",base64url:"рядок у кодуванні base64url",json_string:"рядок JSON",e164:"номер E.164",jwt:"JWT",template_literal:"вхідні дані"},i={nan:"NaN",number:"число",array:"масив"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Неправильні вхідні дані: очікується instanceof ${n.expected}, отримано ${s}`:`Неправильні вхідні дані: очікується ${o}, отримано ${s}`}case"invalid_value":return n.values.length===1?`Неправильні вхідні дані: очікується ${w(n.values[0])}`:`Неправильна опція: очікується одне з ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Занадто велике: очікується, що ${n.origin??"значення"} ${a.verb} ${o}${n.maximum.toString()} ${a.unit??"елементів"}`:`Занадто велике: очікується, що ${n.origin??"значення"} буде ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Занадто мале: очікується, що ${n.origin} ${a.verb} ${o}${n.minimum.toString()} ${a.unit}`:`Занадто мале: очікується, що ${n.origin} буде ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Неправильний рядок: повинен починатися з "${o.prefix}"`:o.format==="ends_with"?`Неправильний рядок: повинен закінчуватися на "${o.suffix}"`:o.format==="includes"?`Неправильний рядок: повинен містити "${o.includes}"`:o.format==="regex"?`Неправильний рядок: повинен відповідати шаблону ${o.pattern}`:`Неправильний ${r[o.format]??n.format}`}case"not_multiple_of":return`Неправильне число: повинно бути кратним ${n.divisor}`;case"unrecognized_keys":return`Нерозпізнаний ключ${n.keys.length>1?"і":""}: ${y(n.keys,", ")}`;case"invalid_key":return`Неправильний ключ у ${n.origin}`;case"invalid_union":return"Неправильні вхідні дані";case"invalid_element":return`Неправильне значення у ${n.origin}`;default:return"Неправильні вхідні дані"}}};function iu(){return{localeError:Eg()}}function Dg(){return iu()}const Pg=()=>{const e={string:{unit:"حروف",verb:"ہونا"},file:{unit:"بائٹس",verb:"ہونا"},array:{unit:"آئٹمز",verb:"ہونا"},set:{unit:"آئٹمز",verb:"ہونا"}};function t(n){return e[n]??null}const r={regex:"ان پٹ",email:"ای میل ایڈریس",url:"یو آر ایل",emoji:"ایموجی",uuid:"یو یو آئی ڈی",uuidv4:"یو یو آئی ڈی وی 4",uuidv6:"یو یو آئی ڈی وی 6",nanoid:"نینو آئی ڈی",guid:"جی یو آئی ڈی",cuid:"سی یو آئی ڈی",cuid2:"سی یو آئی ڈی 2",ulid:"یو ایل آئی ڈی",xid:"ایکس آئی ڈی",ksuid:"کے ایس یو آئی ڈی",datetime:"آئی ایس او ڈیٹ ٹائم",date:"آئی ایس او تاریخ",time:"آئی ایس او وقت",duration:"آئی ایس او مدت",ipv4:"آئی پی وی 4 ایڈریس",ipv6:"آئی پی وی 6 ایڈریس",cidrv4:"آئی پی وی 4 رینج",cidrv6:"آئی پی وی 6 رینج",base64:"بیس 64 ان کوڈڈ سٹرنگ",base64url:"بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",json_string:"جے ایس او این سٹرنگ",e164:"ای 164 نمبر",jwt:"جے ڈبلیو ٹی",template_literal:"ان پٹ"},i={nan:"NaN",number:"نمبر",array:"آرے",null:"نل"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`غلط ان پٹ: instanceof ${n.expected} متوقع تھا، ${s} موصول ہوا`:`غلط ان پٹ: ${o} متوقع تھا، ${s} موصول ہوا`}case"invalid_value":return n.values.length===1?`غلط ان پٹ: ${w(n.values[0])} متوقع تھا`:`غلط آپشن: ${y(n.values,"|")} میں سے ایک متوقع تھا`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`بہت بڑا: ${n.origin??"ویلیو"} کے ${o}${n.maximum.toString()} ${a.unit??"عناصر"} ہونے متوقع تھے`:`بہت بڑا: ${n.origin??"ویلیو"} کا ${o}${n.maximum.toString()} ہونا متوقع تھا`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`بہت چھوٹا: ${n.origin} کے ${o}${n.minimum.toString()} ${a.unit} ہونے متوقع تھے`:`بہت چھوٹا: ${n.origin} کا ${o}${n.minimum.toString()} ہونا متوقع تھا`}case"invalid_format":{const o=n;return o.format==="starts_with"?`غلط سٹرنگ: "${o.prefix}" سے شروع ہونا چاہیے`:o.format==="ends_with"?`غلط سٹرنگ: "${o.suffix}" پر ختم ہونا چاہیے`:o.format==="includes"?`غلط سٹرنگ: "${o.includes}" شامل ہونا چاہیے`:o.format==="regex"?`غلط سٹرنگ: پیٹرن ${o.pattern} سے میچ ہونا چاہیے`:`غلط ${r[o.format]??n.format}`}case"not_multiple_of":return`غلط نمبر: ${n.divisor} کا مضاعف ہونا چاہیے`;case"unrecognized_keys":return`غیر تسلیم شدہ کی${n.keys.length>1?"ز":""}: ${y(n.keys,"، ")}`;case"invalid_key":return`${n.origin} میں غلط کی`;case"invalid_union":return"غلط ان پٹ";case"invalid_element":return`${n.origin} میں غلط ویلیو`;default:return"غلط ان پٹ"}}};function jg(){return{localeError:Pg()}}const Og=()=>{const e={string:{unit:"belgi",verb:"bo‘lishi kerak"},file:{unit:"bayt",verb:"bo‘lishi kerak"},array:{unit:"element",verb:"bo‘lishi kerak"},set:{unit:"element",verb:"bo‘lishi kerak"}};function t(n){return e[n]??null}const r={regex:"kirish",email:"elektron pochta manzili",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO sana va vaqti",date:"ISO sana",time:"ISO vaqt",duration:"ISO davomiylik",ipv4:"IPv4 manzil",ipv6:"IPv6 manzil",mac:"MAC manzil",cidrv4:"IPv4 diapazon",cidrv6:"IPv6 diapazon",base64:"base64 kodlangan satr",base64url:"base64url kodlangan satr",json_string:"JSON satr",e164:"E.164 raqam",jwt:"JWT",template_literal:"kirish"},i={nan:"NaN",number:"raqam",array:"massiv"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Noto‘g‘ri kirish: kutilgan instanceof ${n.expected}, qabul qilingan ${s}`:`Noto‘g‘ri kirish: kutilgan ${o}, qabul qilingan ${s}`}case"invalid_value":return n.values.length===1?`Noto‘g‘ri kirish: kutilgan ${w(n.values[0])}`:`Noto‘g‘ri variant: quyidagilardan biri kutilgan ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Juda katta: kutilgan ${n.origin??"qiymat"} ${o}${n.maximum.toString()} ${a.unit} ${a.verb}`:`Juda katta: kutilgan ${n.origin??"qiymat"} ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Juda kichik: kutilgan ${n.origin} ${o}${n.minimum.toString()} ${a.unit} ${a.verb}`:`Juda kichik: kutilgan ${n.origin} ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Noto‘g‘ri satr: "${o.prefix}" bilan boshlanishi kerak`:o.format==="ends_with"?`Noto‘g‘ri satr: "${o.suffix}" bilan tugashi kerak`:o.format==="includes"?`Noto‘g‘ri satr: "${o.includes}" ni o‘z ichiga olishi kerak`:o.format==="regex"?`Noto‘g‘ri satr: ${o.pattern} shabloniga mos kelishi kerak`:`Noto‘g‘ri ${r[o.format]??n.format}`}case"not_multiple_of":return`Noto‘g‘ri raqam: ${n.divisor} ning karralisi bo‘lishi kerak`;case"unrecognized_keys":return`Noma’lum kalit${n.keys.length>1?"lar":""}: ${y(n.keys,", ")}`;case"invalid_key":return`${n.origin} dagi kalit noto‘g‘ri`;case"invalid_union":return"Noto‘g‘ri kirish";case"invalid_element":return`${n.origin} da noto‘g‘ri qiymat`;default:return"Noto‘g‘ri kirish"}}};function Ug(){return{localeError:Og()}}const Ng=()=>{const e={string:{unit:"ký tự",verb:"có"},file:{unit:"byte",verb:"có"},array:{unit:"phần tử",verb:"có"},set:{unit:"phần tử",verb:"có"}};function t(n){return e[n]??null}const r={regex:"đầu vào",email:"địa chỉ email",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ngày giờ ISO",date:"ngày ISO",time:"giờ ISO",duration:"khoảng thời gian ISO",ipv4:"địa chỉ IPv4",ipv6:"địa chỉ IPv6",cidrv4:"dải IPv4",cidrv6:"dải IPv6",base64:"chuỗi mã hóa base64",base64url:"chuỗi mã hóa base64url",json_string:"chuỗi JSON",e164:"số E.164",jwt:"JWT",template_literal:"đầu vào"},i={nan:"NaN",number:"số",array:"mảng"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Đầu vào không hợp lệ: mong đợi instanceof ${n.expected}, nhận được ${s}`:`Đầu vào không hợp lệ: mong đợi ${o}, nhận được ${s}`}case"invalid_value":return n.values.length===1?`Đầu vào không hợp lệ: mong đợi ${w(n.values[0])}`:`Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Quá lớn: mong đợi ${n.origin??"giá trị"} ${a.verb} ${o}${n.maximum.toString()} ${a.unit??"phần tử"}`:`Quá lớn: mong đợi ${n.origin??"giá trị"} ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Quá nhỏ: mong đợi ${n.origin} ${a.verb} ${o}${n.minimum.toString()} ${a.unit}`:`Quá nhỏ: mong đợi ${n.origin} ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Chuỗi không hợp lệ: phải bắt đầu bằng "${o.prefix}"`:o.format==="ends_with"?`Chuỗi không hợp lệ: phải kết thúc bằng "${o.suffix}"`:o.format==="includes"?`Chuỗi không hợp lệ: phải bao gồm "${o.includes}"`:o.format==="regex"?`Chuỗi không hợp lệ: phải khớp với mẫu ${o.pattern}`:`${r[o.format]??n.format} không hợp lệ`}case"not_multiple_of":return`Số không hợp lệ: phải là bội số của ${n.divisor}`;case"unrecognized_keys":return`Khóa không được nhận dạng: ${y(n.keys,", ")}`;case"invalid_key":return`Khóa không hợp lệ trong ${n.origin}`;case"invalid_union":return"Đầu vào không hợp lệ";case"invalid_element":return`Giá trị không hợp lệ trong ${n.origin}`;default:return"Đầu vào không hợp lệ"}}};function Ag(){return{localeError:Ng()}}const Cg=()=>{const e={string:{unit:"字符",verb:"包含"},file:{unit:"字节",verb:"包含"},array:{unit:"项",verb:"包含"},set:{unit:"项",verb:"包含"}};function t(n){return e[n]??null}const r={regex:"输入",email:"电子邮件",url:"URL",emoji:"表情符号",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO日期时间",date:"ISO日期",time:"ISO时间",duration:"ISO时长",ipv4:"IPv4地址",ipv6:"IPv6地址",cidrv4:"IPv4网段",cidrv6:"IPv6网段",base64:"base64编码字符串",base64url:"base64url编码字符串",json_string:"JSON字符串",e164:"E.164号码",jwt:"JWT",template_literal:"输入"},i={nan:"NaN",number:"数字",array:"数组",null:"空值(null)"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`无效输入：期望 instanceof ${n.expected}，实际接收 ${s}`:`无效输入：期望 ${o}，实际接收 ${s}`}case"invalid_value":return n.values.length===1?`无效输入：期望 ${w(n.values[0])}`:`无效选项：期望以下之一 ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`数值过大：期望 ${n.origin??"值"} ${o}${n.maximum.toString()} ${a.unit??"个元素"}`:`数值过大：期望 ${n.origin??"值"} ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`数值过小：期望 ${n.origin} ${o}${n.minimum.toString()} ${a.unit}`:`数值过小：期望 ${n.origin} ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`无效字符串：必须以 "${o.prefix}" 开头`:o.format==="ends_with"?`无效字符串：必须以 "${o.suffix}" 结尾`:o.format==="includes"?`无效字符串：必须包含 "${o.includes}"`:o.format==="regex"?`无效字符串：必须满足正则表达式 ${o.pattern}`:`无效${r[o.format]??n.format}`}case"not_multiple_of":return`无效数字：必须是 ${n.divisor} 的倍数`;case"unrecognized_keys":return`出现未知的键(key): ${y(n.keys,", ")}`;case"invalid_key":return`${n.origin} 中的键(key)无效`;case"invalid_union":return"无效输入";case"invalid_element":return`${n.origin} 中包含无效值(value)`;default:return"无效输入"}}};function Tg(){return{localeError:Cg()}}const Rg=()=>{const e={string:{unit:"字元",verb:"擁有"},file:{unit:"位元組",verb:"擁有"},array:{unit:"項目",verb:"擁有"},set:{unit:"項目",verb:"擁有"}};function t(n){return e[n]??null}const r={regex:"輸入",email:"郵件地址",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO 日期時間",date:"ISO 日期",time:"ISO 時間",duration:"ISO 期間",ipv4:"IPv4 位址",ipv6:"IPv6 位址",cidrv4:"IPv4 範圍",cidrv6:"IPv6 範圍",base64:"base64 編碼字串",base64url:"base64url 編碼字串",json_string:"JSON 字串",e164:"E.164 數值",jwt:"JWT",template_literal:"輸入"},i={nan:"NaN"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`無效的輸入值：預期為 instanceof ${n.expected}，但收到 ${s}`:`無效的輸入值：預期為 ${o}，但收到 ${s}`}case"invalid_value":return n.values.length===1?`無效的輸入值：預期為 ${w(n.values[0])}`:`無效的選項：預期為以下其中之一 ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`數值過大：預期 ${n.origin??"值"} 應為 ${o}${n.maximum.toString()} ${a.unit??"個元素"}`:`數值過大：預期 ${n.origin??"值"} 應為 ${o}${n.maximum.toString()}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`數值過小：預期 ${n.origin} 應為 ${o}${n.minimum.toString()} ${a.unit}`:`數值過小：預期 ${n.origin} 應為 ${o}${n.minimum.toString()}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`無效的字串：必須以 "${o.prefix}" 開頭`:o.format==="ends_with"?`無效的字串：必須以 "${o.suffix}" 結尾`:o.format==="includes"?`無效的字串：必須包含 "${o.includes}"`:o.format==="regex"?`無效的字串：必須符合格式 ${o.pattern}`:`無效的 ${r[o.format]??n.format}`}case"not_multiple_of":return`無效的數字：必須為 ${n.divisor} 的倍數`;case"unrecognized_keys":return`無法識別的鍵值${n.keys.length>1?"們":""}：${y(n.keys,"、")}`;case"invalid_key":return`${n.origin} 中有無效的鍵值`;case"invalid_union":return"無效的輸入值";case"invalid_element":return`${n.origin} 中有無效的值`;default:return"無效的輸入值"}}};function Zg(){return{localeError:Rg()}}const Lg=()=>{const e={string:{unit:"àmi",verb:"ní"},file:{unit:"bytes",verb:"ní"},array:{unit:"nkan",verb:"ní"},set:{unit:"nkan",verb:"ní"}};function t(n){return e[n]??null}const r={regex:"ẹ̀rọ ìbáwọlé",email:"àdírẹ́sì ìmẹ́lì",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"àkókò ISO",date:"ọjọ́ ISO",time:"àkókò ISO",duration:"àkókò tó pé ISO",ipv4:"àdírẹ́sì IPv4",ipv6:"àdírẹ́sì IPv6",cidrv4:"àgbègbè IPv4",cidrv6:"àgbègbè IPv6",base64:"ọ̀rọ̀ tí a kọ́ ní base64",base64url:"ọ̀rọ̀ base64url",json_string:"ọ̀rọ̀ JSON",e164:"nọ́mbà E.164",jwt:"JWT",template_literal:"ẹ̀rọ ìbáwọlé"},i={nan:"NaN",number:"nọ́mbà",array:"akopọ"};return n=>{switch(n.code){case"invalid_type":{const o=i[n.expected]??n.expected,a=S(n.input),s=i[a]??a;return/^[A-Z]/.test(n.expected)?`Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${n.expected}, àmọ̀ a rí ${s}`:`Ìbáwọlé aṣìṣe: a ní láti fi ${o}, àmọ̀ a rí ${s}`}case"invalid_value":return n.values.length===1?`Ìbáwọlé aṣìṣe: a ní láti fi ${w(n.values[0])}`:`Àṣàyàn aṣìṣe: yan ọ̀kan lára ${y(n.values,"|")}`;case"too_big":{const o=n.inclusive?"<=":"<",a=t(n.origin);return a?`Tó pọ̀ jù: a ní láti jẹ́ pé ${n.origin??"iye"} ${a.verb} ${o}${n.maximum} ${a.unit}`:`Tó pọ̀ jù: a ní láti jẹ́ ${o}${n.maximum}`}case"too_small":{const o=n.inclusive?">=":">",a=t(n.origin);return a?`Kéré ju: a ní láti jẹ́ pé ${n.origin} ${a.verb} ${o}${n.minimum} ${a.unit}`:`Kéré ju: a ní láti jẹ́ ${o}${n.minimum}`}case"invalid_format":{const o=n;return o.format==="starts_with"?`Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${o.prefix}"`:o.format==="ends_with"?`Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${o.suffix}"`:o.format==="includes"?`Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${o.includes}"`:o.format==="regex"?`Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${o.pattern}`:`Aṣìṣe: ${r[o.format]??n.format}`}case"not_multiple_of":return`Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${n.divisor}`;case"unrecognized_keys":return`Bọtìnì àìmọ̀: ${y(n.keys,", ")}`;case"invalid_key":return`Bọtìnì aṣìṣe nínú ${n.origin}`;case"invalid_union":return"Ìbáwọlé aṣìṣe";case"invalid_element":return`Iye aṣìṣe nínú ${n.origin}`;default:return"Ìbáwọlé aṣìṣe"}}};function Fg(){return{localeError:Lg()}}const ou=Object.freeze(Object.defineProperty({__proto__:null,ar:ih,az:ah,be:lh,bg:uh,ca:ph,cs:fh,da:gh,de:bh,en:nu,eo:kh,es:_h,fa:Sh,fi:Ih,fr:Dh,frCA:jh,he:Uh,hu:Ah,hy:Th,id:Zh,is:Fh,it:Kh,ja:Jh,ka:Gh,kh:Wh,km:ru,ko:Hh,lt:Yh,mk:tg,ms:rg,nl:og,no:sg,ota:cg,pl:mg,ps:dg,pt:hg,ru:vg,sl:yg,sv:kg,ta:_g,th:Sg,tr:Ig,ua:Dg,uk:iu,ur:jg,uz:Ug,vi:Ag,yo:Fg,zhCN:Tg,zhTW:Zg},Symbol.toStringTag,{value:"Module"}));var Ha;const au=Symbol("ZodOutput"),su=Symbol("ZodInput");class lu{constructor(){this._map=new WeakMap,this._idmap=new Map}add(t,...r){const i=r[0];return this._map.set(t,i),i&&typeof i=="object"&&"id"in i&&this._idmap.set(i.id,t),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(t){const r=this._map.get(t);return r&&typeof r=="object"&&"id"in r&&this._idmap.delete(r.id),this._map.delete(t),this}get(t){const r=t._zod.parent;if(r){const i={...this.get(r)??{}};delete i.id;const n={...i,...this._map.get(t)};return Object.keys(n).length?n:void 0}return this._map.get(t)}has(t){return this._map.has(t)}}function Si(){return new lu}(Ha=globalThis).__zod_globalRegistry??(Ha.__zod_globalRegistry=Si());const ne=globalThis.__zod_globalRegistry;function cu(e,t){return new e({type:"string",...v(t)})}function uu(e,t){return new e({type:"string",coerce:!0,...v(t)})}function zi(e,t){return new e({type:"string",format:"email",check:"string_format",abort:!1,...v(t)})}function rn(e,t){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...v(t)})}function Ii(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...v(t)})}function Ei(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...v(t)})}function Di(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...v(t)})}function Pi(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...v(t)})}function jn(e,t){return new e({type:"string",format:"url",check:"string_format",abort:!1,...v(t)})}function ji(e,t){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...v(t)})}function Oi(e,t){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...v(t)})}function Ui(e,t){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...v(t)})}function Ni(e,t){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...v(t)})}function Ai(e,t){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...v(t)})}function Ci(e,t){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...v(t)})}function Ti(e,t){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...v(t)})}function Ri(e,t){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...v(t)})}function Zi(e,t){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...v(t)})}function du(e,t){return new e({type:"string",format:"mac",check:"string_format",abort:!1,...v(t)})}function Li(e,t){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...v(t)})}function Fi(e,t){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...v(t)})}function Mi(e,t){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...v(t)})}function Ki(e,t){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...v(t)})}function qi(e,t){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...v(t)})}function Ji(e,t){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...v(t)})}const pu={Any:null,Minute:-1,Second:0,Millisecond:3,Microsecond:6};function mu(e,t){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...v(t)})}function fu(e,t){return new e({type:"string",format:"date",check:"string_format",...v(t)})}function hu(e,t){return new e({type:"string",format:"time",check:"string_format",precision:null,...v(t)})}function gu(e,t){return new e({type:"string",format:"duration",check:"string_format",...v(t)})}function vu(e,t){return new e({type:"number",checks:[],...v(t)})}function bu(e,t){return new e({type:"number",coerce:!0,checks:[],...v(t)})}function yu(e,t){return new e({type:"number",check:"number_format",abort:!1,format:"safeint",...v(t)})}function $u(e,t){return new e({type:"number",check:"number_format",abort:!1,format:"float32",...v(t)})}function ku(e,t){return new e({type:"number",check:"number_format",abort:!1,format:"float64",...v(t)})}function xu(e,t){return new e({type:"number",check:"number_format",abort:!1,format:"int32",...v(t)})}function _u(e,t){return new e({type:"number",check:"number_format",abort:!1,format:"uint32",...v(t)})}function wu(e,t){return new e({type:"boolean",...v(t)})}function Su(e,t){return new e({type:"boolean",coerce:!0,...v(t)})}function zu(e,t){return new e({type:"bigint",...v(t)})}function Iu(e,t){return new e({type:"bigint",coerce:!0,...v(t)})}function Eu(e,t){return new e({type:"bigint",check:"bigint_format",abort:!1,format:"int64",...v(t)})}function Du(e,t){return new e({type:"bigint",check:"bigint_format",abort:!1,format:"uint64",...v(t)})}function Pu(e,t){return new e({type:"symbol",...v(t)})}function ju(e,t){return new e({type:"undefined",...v(t)})}function Ou(e,t){return new e({type:"null",...v(t)})}function Uu(e){return new e({type:"any"})}function Nu(e){return new e({type:"unknown"})}function Au(e,t){return new e({type:"never",...v(t)})}function Cu(e,t){return new e({type:"void",...v(t)})}function Tu(e,t){return new e({type:"date",...v(t)})}function Ru(e,t){return new e({type:"date",coerce:!0,...v(t)})}function Zu(e,t){return new e({type:"nan",...v(t)})}function be(e,t){return new gi({check:"less_than",...v(t),value:e,inclusive:!1})}function re(e,t){return new gi({check:"less_than",...v(t),value:e,inclusive:!0})}function ye(e,t){return new vi({check:"greater_than",...v(t),value:e,inclusive:!1})}function H(e,t){return new vi({check:"greater_than",...v(t),value:e,inclusive:!0})}function Bi(e){return ye(0,e)}function Gi(e){return be(0,e)}function Vi(e){return re(0,e)}function Wi(e){return H(0,e)}function Je(e,t){return new _l({check:"multiple_of",...v(t),value:e})}function He(e,t){return new zl({check:"max_size",...v(t),maximum:e})}function $e(e,t){return new Il({check:"min_size",...v(t),minimum:e})}function zt(e,t){return new El({check:"size_equals",...v(t),size:e})}function It(e,t){return new Dl({check:"max_length",...v(t),maximum:e})}function De(e,t){return new Pl({check:"min_length",...v(t),minimum:e})}function Et(e,t){return new jl({check:"length_equals",...v(t),length:e})}function On(e,t){return new Ol({check:"string_format",format:"regex",...v(t),pattern:e})}function Un(e){return new Ul({check:"string_format",format:"lowercase",...v(e)})}function Nn(e){return new Nl({check:"string_format",format:"uppercase",...v(e)})}function An(e,t){return new Al({check:"string_format",format:"includes",...v(t),includes:e})}function Cn(e,t){return new Cl({check:"string_format",format:"starts_with",...v(t),prefix:e})}function Tn(e,t){return new Tl({check:"string_format",format:"ends_with",...v(t),suffix:e})}function Xi(e,t,r){return new Rl({check:"property",property:e,schema:t,...v(r)})}function Rn(e,t){return new Zl({check:"mime_type",mime:e,...v(t)})}function he(e){return new Ll({check:"overwrite",tx:e})}function Zn(e){return he(t=>t.normalize(e))}function Ln(){return he(e=>e.trim())}function Fn(){return he(e=>e.toLowerCase())}function Mn(){return he(e=>e.toUpperCase())}function Kn(){return he(e=>$s(e))}function Lu(e,t,r){return new e({type:"array",element:t,...v(r)})}function Mg(e,t,r){return new e({type:"union",options:t,...v(r)})}function Kg(e,t,r){return new e({type:"union",options:t,inclusive:!1,...v(r)})}function qg(e,t,r,i){return new e({type:"union",options:r,discriminator:t,...v(i)})}function Jg(e,t,r){return new e({type:"intersection",left:t,right:r})}function Bg(e,t,r,i){const n=r instanceof z,o=n?i:r,a=n?r:null;return new e({type:"tuple",items:t,rest:a,...v(o)})}function Gg(e,t,r,i){return new e({type:"record",keyType:t,valueType:r,...v(i)})}function Vg(e,t,r,i){return new e({type:"map",keyType:t,valueType:r,...v(i)})}function Wg(e,t,r){return new e({type:"set",valueType:t,...v(r)})}function Xg(e,t,r){const i=Array.isArray(t)?Object.fromEntries(t.map(n=>[n,n])):t;return new e({type:"enum",entries:i,...v(r)})}function Hg(e,t,r){return new e({type:"enum",entries:t,...v(r)})}function Qg(e,t,r){return new e({type:"literal",values:Array.isArray(t)?t:[t],...v(r)})}function Fu(e,t){return new e({type:"file",...v(t)})}function Yg(e,t){return new e({type:"transform",transform:t})}function ev(e,t){return new e({type:"optional",innerType:t})}function tv(e,t){return new e({type:"nullable",innerType:t})}function nv(e,t,r){return new e({type:"default",innerType:t,get defaultValue(){return typeof r=="function"?r():In(r)}})}function rv(e,t,r){return new e({type:"nonoptional",innerType:t,...v(r)})}function iv(e,t){return new e({type:"success",innerType:t})}function ov(e,t,r){return new e({type:"catch",innerType:t,catchValue:typeof r=="function"?r:()=>r})}function av(e,t,r){return new e({type:"pipe",in:t,out:r})}function sv(e,t){return new e({type:"readonly",innerType:t})}function lv(e,t,r){return new e({type:"template_literal",parts:t,...v(r)})}function cv(e,t){return new e({type:"lazy",getter:t})}function uv(e,t){return new e({type:"promise",innerType:t})}function Mu(e,t,r){const i=v(r);return i.abort??(i.abort=!0),new e({type:"custom",check:"custom",fn:t,...i})}function Ku(e,t,r){return new e({type:"custom",check:"custom",fn:t,...v(r)})}function qu(e){const t=Ju(r=>(r.addIssue=i=>{if(typeof i=="string")r.issues.push(Ke(i,r.value,t._zod.def));else{const n=i;n.fatal&&(n.continue=!1),n.code??(n.code="custom"),n.input??(n.input=r.value),n.inst??(n.inst=t),n.continue??(n.continue=!t._zod.def.abort),r.issues.push(Ke(n))}},e(r.value,r)));return t}function Ju(e,t){const r=new L({check:"custom",...v(t)});return r._zod.check=e,r}function Bu(e){const t=new L({check:"describe"});return t._zod.onattach=[r=>{const i=ne.get(r)??{};ne.add(r,{...i,description:e})}],t._zod.check=()=>{},t}function Gu(e){const t=new L({check:"meta"});return t._zod.onattach=[r=>{const i=ne.get(r)??{};ne.add(r,{...i,...e})}],t._zod.check=()=>{},t}function Vu(e,t){const r=v(t);let i=r.truthy??["true","1","yes","on","y","enabled"],n=r.falsy??["false","0","no","off","n","disabled"];r.case!=="sensitive"&&(i=i.map(p=>typeof p=="string"?p.toLowerCase():p),n=n.map(p=>typeof p=="string"?p.toLowerCase():p));const o=new Set(i),a=new Set(n),s=e.Codec??wi,c=e.Boolean??$i,l=e.String??St,u=new l({type:"string",error:r.error}),d=new c({type:"boolean",error:r.error}),f=new s({type:"pipe",in:u,out:d,transform:((p,b)=>{let g=p;return r.case!=="sensitive"&&(g=g.toLowerCase()),o.has(g)?!0:a.has(g)?!1:(b.issues.push({code:"invalid_value",expected:"stringbool",values:[...o,...a],input:b.value,inst:f,continue:!1}),{})}),reverseTransform:((p,b)=>p===!0?i[0]||"true":n[0]||"false"),error:r.error});return f}function Dt(e,t,r,i={}){const n=v(i),o={...v(i),check:"string_format",type:"string",format:t,fn:typeof r=="function"?r:s=>r.test(s),...n};return r instanceof RegExp&&(o.pattern=r),new e(o)}function Be(e){let t=(e==null?void 0:e.target)??"draft-2020-12";return t==="draft-4"&&(t="draft-04"),t==="draft-7"&&(t="draft-07"),{processors:e.processors??{},metadataRegistry:(e==null?void 0:e.metadata)??ne,target:t,unrepresentable:(e==null?void 0:e.unrepresentable)??"throw",override:(e==null?void 0:e.override)??(()=>{}),io:(e==null?void 0:e.io)??"output",counter:0,seen:new Map,cycles:(e==null?void 0:e.cycles)??"ref",reused:(e==null?void 0:e.reused)??"inline",external:(e==null?void 0:e.external)??void 0}}function N(e,t,r={path:[],schemaPath:[]}){var u,d;var i;const n=e._zod.def,o=t.seen.get(e);if(o)return o.count++,r.schemaPath.includes(e)&&(o.cycle=r.path),o.schema;const a={schema:{},count:1,cycle:void 0,path:r.path};t.seen.set(e,a);const s=(d=(u=e._zod).toJSONSchema)==null?void 0:d.call(u);if(s)a.schema=s;else{const f={...r,schemaPath:[...r.schemaPath,e],path:r.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,a.schema,f);else{const b=a.schema,g=t.processors[n.type];if(!g)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);g(e,t,b,f)}const p=e._zod.parent;p&&(a.ref||(a.ref=p),N(p,t,f),t.seen.get(p).isParent=!0)}const c=t.metadataRegistry.get(e);return c&&Object.assign(a.schema,c),t.io==="input"&&V(e)&&(delete a.schema.examples,delete a.schema.default),t.io==="input"&&a.schema._prefault&&((i=a.schema).default??(i.default=a.schema._prefault)),delete a.schema._prefault,t.seen.get(e).schema}function Ge(e,t){var a,s,c,l;const r=e.seen.get(t);if(!r)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=new Map;for(const u of e.seen.entries()){const d=(a=e.metadataRegistry.get(u[0]))==null?void 0:a.id;if(d){const f=i.get(d);if(f&&f!==u[0])throw new Error(`Duplicate schema id "${d}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);i.set(d,u[0])}}const n=u=>{var g;const d=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){const x=(g=e.external.registry.get(u[0]))==null?void 0:g.id,T=e.external.uri??(B=>B);if(x)return{ref:T(x)};const P=u[1].defId??u[1].schema.id??`schema${e.counter++}`;return u[1].defId=P,{defId:P,ref:`${T("__shared")}#/${d}/${P}`}}if(u[1]===r)return{ref:"#"};const p=`#/${d}/`,b=u[1].schema.id??`__schema${e.counter++}`;return{defId:b,ref:p+b}},o=u=>{if(u[1].schema.$ref)return;const d=u[1],{ref:f,defId:p}=n(u);d.def={...d.schema},p&&(d.defId=p);const b=d.schema;for(const g in b)delete b[g];b.$ref=f};if(e.cycles==="throw")for(const u of e.seen.entries()){const d=u[1];if(d.cycle)throw new Error(`Cycle detected: #/${(s=d.cycle)==null?void 0:s.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const u of e.seen.entries()){const d=u[1];if(t===u[0]){o(u);continue}if(e.external){const p=(c=e.external.registry.get(u[0]))==null?void 0:c.id;if(t!==u[0]&&p){o(u);continue}}if((l=e.metadataRegistry.get(u[0]))==null?void 0:l.id){o(u);continue}if(d.cycle){o(u);continue}if(d.count>1&&e.reused==="ref"){o(u);continue}}}function Ve(e,t){var a,s,c;const r=e.seen.get(t);if(!r)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=l=>{const u=e.seen.get(l);if(u.ref===null)return;const d=u.def??u.schema,f={...d},p=u.ref;if(u.ref=null,p){i(p);const g=e.seen.get(p),x=g.schema;if(x.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(d.allOf=d.allOf??[],d.allOf.push(x)):Object.assign(d,x),Object.assign(d,f),l._zod.parent===p)for(const P in d)P==="$ref"||P==="allOf"||P in f||delete d[P];if(x.$ref&&g.def)for(const P in d)P==="$ref"||P==="allOf"||P in g.def&&JSON.stringify(d[P])===JSON.stringify(g.def[P])&&delete d[P]}const b=l._zod.parent;if(b&&b!==p){i(b);const g=e.seen.get(b);if(g!=null&&g.schema.$ref&&(d.$ref=g.schema.$ref,g.def))for(const x in d)x==="$ref"||x==="allOf"||x in g.def&&JSON.stringify(d[x])===JSON.stringify(g.def[x])&&delete d[x]}e.override({zodSchema:l,jsonSchema:d,path:u.path??[]})};for(const l of[...e.seen.entries()].reverse())i(l[0]);const n={};if(e.target==="draft-2020-12"?n.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?n.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?n.$schema="http://json-schema.org/draft-04/schema#":e.target,(a=e.external)!=null&&a.uri){const l=(s=e.external.registry.get(t))==null?void 0:s.id;if(!l)throw new Error("Schema is missing an `id` property");n.$id=e.external.uri(l)}Object.assign(n,r.def??r.schema);const o=((c=e.external)==null?void 0:c.defs)??{};for(const l of e.seen.entries()){const u=l[1];u.def&&u.defId&&(o[u.defId]=u.def)}e.external||Object.keys(o).length>0&&(e.target==="draft-2020-12"?n.$defs=o:n.definitions=o);try{const l=JSON.parse(JSON.stringify(n));return Object.defineProperty(l,"~standard",{value:{...t["~standard"],jsonSchema:{input:lt(t,"input",e.processors),output:lt(t,"output",e.processors)}},enumerable:!1,writable:!1}),l}catch{throw new Error("Error converting schema to JSON.")}}function V(e,t){const r=t??{seen:new Set};if(r.seen.has(e))return!1;r.seen.add(e);const i=e._zod.def;if(i.type==="transform")return!0;if(i.type==="array")return V(i.element,r);if(i.type==="set")return V(i.valueType,r);if(i.type==="lazy")return V(i.getter(),r);if(i.type==="promise"||i.type==="optional"||i.type==="nonoptional"||i.type==="nullable"||i.type==="readonly"||i.type==="default"||i.type==="prefault")return V(i.innerType,r);if(i.type==="intersection")return V(i.left,r)||V(i.right,r);if(i.type==="record"||i.type==="map")return V(i.keyType,r)||V(i.valueType,r);if(i.type==="pipe")return V(i.in,r)||V(i.out,r);if(i.type==="object"){for(const n in i.shape)if(V(i.shape[n],r))return!0;return!1}if(i.type==="union"){for(const n of i.options)if(V(n,r))return!0;return!1}if(i.type==="tuple"){for(const n of i.items)if(V(n,r))return!0;return!!(i.rest&&V(i.rest,r))}return!1}const Wu=(e,t={})=>r=>{const i=Be({...r,processors:t});return N(e,i),Ge(i,e),Ve(i,e)},lt=(e,t,r={})=>i=>{const{libraryOptions:n,target:o}=i??{},a=Be({...n??{},target:o,io:t,processors:r});return N(e,a),Ge(a,e),Ve(a,e)},dv={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Xu=(e,t,r,i)=>{const n=r;n.type="string";const{minimum:o,maximum:a,format:s,patterns:c,contentEncoding:l}=e._zod.bag;if(typeof o=="number"&&(n.minLength=o),typeof a=="number"&&(n.maxLength=a),s&&(n.format=dv[s]??s,n.format===""&&delete n.format,s==="time"&&delete n.format),l&&(n.contentEncoding=l),c&&c.size>0){const u=[...c];u.length===1?n.pattern=u[0].source:u.length>1&&(n.allOf=[...u.map(d=>({...t.target==="draft-07"||t.target==="draft-04"||t.target==="openapi-3.0"?{type:"string"}:{},pattern:d.source}))])}},Hu=(e,t,r,i)=>{const n=r,{minimum:o,maximum:a,format:s,multipleOf:c,exclusiveMaximum:l,exclusiveMinimum:u}=e._zod.bag;typeof s=="string"&&s.includes("int")?n.type="integer":n.type="number",typeof u=="number"&&(t.target==="draft-04"||t.target==="openapi-3.0"?(n.minimum=u,n.exclusiveMinimum=!0):n.exclusiveMinimum=u),typeof o=="number"&&(n.minimum=o,typeof u=="number"&&t.target!=="draft-04"&&(u>=o?delete n.minimum:delete n.exclusiveMinimum)),typeof l=="number"&&(t.target==="draft-04"||t.target==="openapi-3.0"?(n.maximum=l,n.exclusiveMaximum=!0):n.exclusiveMaximum=l),typeof a=="number"&&(n.maximum=a,typeof l=="number"&&t.target!=="draft-04"&&(l<=a?delete n.maximum:delete n.exclusiveMaximum)),typeof c=="number"&&(n.multipleOf=c)},Qu=(e,t,r,i)=>{r.type="boolean"},Yu=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("BigInt cannot be represented in JSON Schema")},ed=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Symbols cannot be represented in JSON Schema")},td=(e,t,r,i)=>{t.target==="openapi-3.0"?(r.type="string",r.nullable=!0,r.enum=[null]):r.type="null"},nd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Undefined cannot be represented in JSON Schema")},rd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Void cannot be represented in JSON Schema")},id=(e,t,r,i)=>{r.not={}},od=(e,t,r,i)=>{},ad=(e,t,r,i)=>{},sd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Date cannot be represented in JSON Schema")},ld=(e,t,r,i)=>{const n=e._zod.def,o=ei(n.entries);o.every(a=>typeof a=="number")&&(r.type="number"),o.every(a=>typeof a=="string")&&(r.type="string"),r.enum=o},cd=(e,t,r,i)=>{const n=e._zod.def,o=[];for(const a of n.values)if(a===void 0){if(t.unrepresentable==="throw")throw new Error("Literal `undefined` cannot be represented in JSON Schema")}else if(typeof a=="bigint"){if(t.unrepresentable==="throw")throw new Error("BigInt literals cannot be represented in JSON Schema");o.push(Number(a))}else o.push(a);if(o.length!==0)if(o.length===1){const a=o[0];r.type=a===null?"null":typeof a,t.target==="draft-04"||t.target==="openapi-3.0"?r.enum=[a]:r.const=a}else o.every(a=>typeof a=="number")&&(r.type="number"),o.every(a=>typeof a=="string")&&(r.type="string"),o.every(a=>typeof a=="boolean")&&(r.type="boolean"),o.every(a=>a===null)&&(r.type="null"),r.enum=o},ud=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("NaN cannot be represented in JSON Schema")},dd=(e,t,r,i)=>{const n=r,o=e._zod.pattern;if(!o)throw new Error("Pattern not found in template literal");n.type="string",n.pattern=o.source},pd=(e,t,r,i)=>{const n=r,o={type:"string",format:"binary",contentEncoding:"binary"},{minimum:a,maximum:s,mime:c}=e._zod.bag;a!==void 0&&(o.minLength=a),s!==void 0&&(o.maxLength=s),c?c.length===1?(o.contentMediaType=c[0],Object.assign(n,o)):(Object.assign(n,o),n.anyOf=c.map(l=>({contentMediaType:l}))):Object.assign(n,o)},md=(e,t,r,i)=>{r.type="boolean"},fd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},hd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Function types cannot be represented in JSON Schema")},gd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},vd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Map cannot be represented in JSON Schema")},bd=(e,t,r,i)=>{if(t.unrepresentable==="throw")throw new Error("Set cannot be represented in JSON Schema")},yd=(e,t,r,i)=>{const n=r,o=e._zod.def,{minimum:a,maximum:s}=e._zod.bag;typeof a=="number"&&(n.minItems=a),typeof s=="number"&&(n.maxItems=s),n.type="array",n.items=N(o.element,t,{...i,path:[...i.path,"items"]})},$d=(e,t,r,i)=>{var l;const n=r,o=e._zod.def;n.type="object",n.properties={};const a=o.shape;for(const u in a)n.properties[u]=N(a[u],t,{...i,path:[...i.path,"properties",u]});const s=new Set(Object.keys(a)),c=new Set([...s].filter(u=>{const d=o.shape[u]._zod;return t.io==="input"?d.optin===void 0:d.optout===void 0}));c.size>0&&(n.required=Array.from(c)),((l=o.catchall)==null?void 0:l._zod.def.type)==="never"?n.additionalProperties=!1:o.catchall?o.catchall&&(n.additionalProperties=N(o.catchall,t,{...i,path:[...i.path,"additionalProperties"]})):t.io==="output"&&(n.additionalProperties=!1)},Hi=(e,t,r,i)=>{const n=e._zod.def,o=n.inclusive===!1,a=n.options.map((s,c)=>N(s,t,{...i,path:[...i.path,o?"oneOf":"anyOf",c]}));o?r.oneOf=a:r.anyOf=a},kd=(e,t,r,i)=>{const n=e._zod.def,o=N(n.left,t,{...i,path:[...i.path,"allOf",0]}),a=N(n.right,t,{...i,path:[...i.path,"allOf",1]}),s=l=>"allOf"in l&&Object.keys(l).length===1,c=[...s(o)?o.allOf:[o],...s(a)?a.allOf:[a]];r.allOf=c},xd=(e,t,r,i)=>{const n=r,o=e._zod.def;n.type="array";const a=t.target==="draft-2020-12"?"prefixItems":"items",s=t.target==="draft-2020-12"||t.target==="openapi-3.0"?"items":"additionalItems",c=o.items.map((f,p)=>N(f,t,{...i,path:[...i.path,a,p]})),l=o.rest?N(o.rest,t,{...i,path:[...i.path,s,...t.target==="openapi-3.0"?[o.items.length]:[]]}):null;t.target==="draft-2020-12"?(n.prefixItems=c,l&&(n.items=l)):t.target==="openapi-3.0"?(n.items={anyOf:c},l&&n.items.anyOf.push(l),n.minItems=c.length,l||(n.maxItems=c.length)):(n.items=c,l&&(n.additionalItems=l));const{minimum:u,maximum:d}=e._zod.bag;typeof u=="number"&&(n.minItems=u),typeof d=="number"&&(n.maxItems=d)},_d=(e,t,r,i)=>{const n=r,o=e._zod.def;n.type="object";const a=o.keyType,s=a._zod.bag,c=s==null?void 0:s.patterns;if(o.mode==="loose"&&c&&c.size>0){const u=N(o.valueType,t,{...i,path:[...i.path,"patternProperties","*"]});n.patternProperties={};for(const d of c)n.patternProperties[d.source]=u}else(t.target==="draft-07"||t.target==="draft-2020-12")&&(n.propertyNames=N(o.keyType,t,{...i,path:[...i.path,"propertyNames"]})),n.additionalProperties=N(o.valueType,t,{...i,path:[...i.path,"additionalProperties"]});const l=a._zod.values;if(l){const u=[...l].filter(d=>typeof d=="string"||typeof d=="number");u.length>0&&(n.required=u)}},wd=(e,t,r,i)=>{const n=e._zod.def,o=N(n.innerType,t,i),a=t.seen.get(e);t.target==="openapi-3.0"?(a.ref=n.innerType,r.nullable=!0):r.anyOf=[o,{type:"null"}]},Sd=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType},zd=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType,r.default=JSON.parse(JSON.stringify(n.defaultValue))},Id=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType,t.io==="input"&&(r._prefault=JSON.parse(JSON.stringify(n.defaultValue)))},Ed=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType;let a;try{a=n.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}r.default=a},Dd=(e,t,r,i)=>{const n=e._zod.def,o=t.io==="input"?n.in._zod.def.type==="transform"?n.out:n.in:n.out;N(o,t,i);const a=t.seen.get(e);a.ref=o},Pd=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType,r.readOnly=!0},jd=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType},Qi=(e,t,r,i)=>{const n=e._zod.def;N(n.innerType,t,i);const o=t.seen.get(e);o.ref=n.innerType},Od=(e,t,r,i)=>{const n=e._zod.innerType;N(n,t,i);const o=t.seen.get(e);o.ref=n},Br={string:Xu,number:Hu,boolean:Qu,bigint:Yu,symbol:ed,null:td,undefined:nd,void:rd,never:id,any:od,unknown:ad,date:sd,enum:ld,literal:cd,nan:ud,template_literal:dd,file:pd,success:md,custom:fd,function:hd,transform:gd,map:vd,set:bd,array:yd,object:$d,union:Hi,intersection:kd,tuple:xd,record:_d,nullable:wd,nonoptional:Sd,default:zd,prefault:Id,catch:Ed,pipe:Dd,readonly:Pd,promise:jd,optional:Qi,lazy:Od};function Ud(e,t){if("_idmap"in e){const i=e,n=Be({...t,processors:Br}),o={};for(const c of i._idmap.entries()){const[l,u]=c;N(u,n)}const a={},s={registry:i,uri:t==null?void 0:t.uri,defs:o};n.external=s;for(const c of i._idmap.entries()){const[l,u]=c;Ge(n,u),a[l]=Ve(n,u)}if(Object.keys(o).length>0){const c=n.target==="draft-2020-12"?"$defs":"definitions";a.__shared={[c]:o}}return{schemas:a}}const r=Be({...t,processors:Br});return N(e,r),Ge(r,e),Ve(r,e)}class pv{get metadataRegistry(){return this.ctx.metadataRegistry}get target(){return this.ctx.target}get unrepresentable(){return this.ctx.unrepresentable}get override(){return this.ctx.override}get io(){return this.ctx.io}get counter(){return this.ctx.counter}set counter(t){this.ctx.counter=t}get seen(){return this.ctx.seen}constructor(t){let r=(t==null?void 0:t.target)??"draft-2020-12";r==="draft-4"&&(r="draft-04"),r==="draft-7"&&(r="draft-07"),this.ctx=Be({processors:Br,target:r,...(t==null?void 0:t.metadata)&&{metadata:t.metadata},...(t==null?void 0:t.unrepresentable)&&{unrepresentable:t.unrepresentable},...(t==null?void 0:t.override)&&{override:t.override},...(t==null?void 0:t.io)&&{io:t.io}})}process(t,r={path:[],schemaPath:[]}){return N(t,this.ctx,r)}emit(t,r){r&&(r.cycles&&(this.ctx.cycles=r.cycles),r.reused&&(this.ctx.reused=r.reused),r.external&&(this.ctx.external=r.external)),Ge(this.ctx,t);const i=Ve(this.ctx,t),{"~standard":n,...o}=i;return o}}const mv=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"})),fv=Object.freeze(Object.defineProperty({__proto__:null,$ZodAny:kc,$ZodArray:zc,$ZodAsyncError:Ie,$ZodBase64:cc,$ZodBase64URL:dc,$ZodBigInt:ki,$ZodBigIntFormat:vc,$ZodBoolean:$i,$ZodCIDRv4:sc,$ZodCIDRv6:lc,$ZodCUID:Wl,$ZodCUID2:Xl,$ZodCatch:Gc,$ZodCheck:L,$ZodCheckBigIntFormat:Sl,$ZodCheckEndsWith:Tl,$ZodCheckGreaterThan:vi,$ZodCheckIncludes:Al,$ZodCheckLengthEquals:jl,$ZodCheckLessThan:gi,$ZodCheckLowerCase:Ul,$ZodCheckMaxLength:Dl,$ZodCheckMaxSize:zl,$ZodCheckMimeType:Zl,$ZodCheckMinLength:Pl,$ZodCheckMinSize:Il,$ZodCheckMultipleOf:_l,$ZodCheckNumberFormat:wl,$ZodCheckOverwrite:Ll,$ZodCheckProperty:Rl,$ZodCheckRegex:Ol,$ZodCheckSizeEquals:El,$ZodCheckStartsWith:Cl,$ZodCheckStringFormat:wt,$ZodCheckUpperCase:Nl,$ZodCodec:wi,$ZodCustom:tu,$ZodCustomStringFormat:hc,$ZodDate:Sc,$ZodDefault:Kc,$ZodDiscriminatedUnion:Oc,$ZodE164:pc,$ZodEmail:Jl,$ZodEmoji:Gl,$ZodEncodeError:Sn,$ZodEnum:Tc,$ZodError:ni,$ZodExactOptional:Fc,$ZodFile:Zc,$ZodFunction:Qc,$ZodGUID:Kl,$ZodIPv4:ic,$ZodIPv6:oc,$ZodISODate:tc,$ZodISODateTime:ec,$ZodISODuration:rc,$ZodISOTime:nc,$ZodIntersection:Uc,$ZodJWT:fc,$ZodKSUID:Yl,$ZodLazy:eu,$ZodLiteral:Rc,$ZodMAC:ac,$ZodMap:Ac,$ZodNaN:Vc,$ZodNanoID:Vl,$ZodNever:_c,$ZodNonOptional:Jc,$ZodNull:$c,$ZodNullable:Mc,$ZodNumber:yi,$ZodNumberFormat:gc,$ZodObject:Dc,$ZodObjectJIT:Pc,$ZodOptional:_i,$ZodPipe:Wc,$ZodPrefault:qc,$ZodPromise:Yc,$ZodReadonly:Xc,$ZodRealError:Y,$ZodRecord:Nc,$ZodRegistry:lu,$ZodSet:Cc,$ZodString:St,$ZodStringFormat:A,$ZodSuccess:Bc,$ZodSymbol:bc,$ZodTemplateLiteral:Hc,$ZodTransform:Lc,$ZodTuple:xi,$ZodType:z,$ZodULID:Hl,$ZodURL:Bl,$ZodUUID:ql,$ZodUndefined:yc,$ZodUnion:Pn,$ZodUnknown:xc,$ZodVoid:wc,$ZodXID:Ql,$ZodXor:jc,$brand:bs,$constructor:h,$input:su,$output:au,Doc:Fl,JSONSchema:mv,JSONSchemaGenerator:pv,NEVER:vs,TimePrecision:pu,_any:Uu,_array:Lu,_base64:Mi,_base64url:Ki,_bigint:zu,_boolean:wu,_catch:ov,_check:Ju,_cidrv4:Li,_cidrv6:Fi,_coercedBigint:Iu,_coercedBoolean:Su,_coercedDate:Ru,_coercedNumber:bu,_coercedString:uu,_cuid:Ui,_cuid2:Ni,_custom:Mu,_date:Tu,_decode:ai,_decodeAsync:li,_default:nv,_discriminatedUnion:qg,_e164:qi,_email:zi,_emoji:ji,_encode:oi,_encodeAsync:si,_endsWith:Tn,_enum:Xg,_file:Fu,_float32:$u,_float64:ku,_gt:ye,_gte:H,_guid:rn,_includes:An,_int:yu,_int32:xu,_int64:Eu,_intersection:Jg,_ipv4:Ri,_ipv6:Zi,_isoDate:fu,_isoDateTime:mu,_isoDuration:gu,_isoTime:hu,_jwt:Ji,_ksuid:Ti,_lazy:cv,_length:Et,_literal:Qg,_lowercase:Un,_lt:be,_lte:re,_mac:du,_map:Vg,_max:re,_maxLength:It,_maxSize:He,_mime:Rn,_min:H,_minLength:De,_minSize:$e,_multipleOf:Je,_nan:Zu,_nanoid:Oi,_nativeEnum:Hg,_negative:Gi,_never:Au,_nonnegative:Wi,_nonoptional:rv,_nonpositive:Vi,_normalize:Zn,_null:Ou,_nullable:tv,_number:vu,_optional:ev,_overwrite:he,_parse:bt,_parseAsync:yt,_pipe:av,_positive:Bi,_promise:uv,_property:Xi,_readonly:sv,_record:Gg,_refine:Ku,_regex:On,_safeDecode:ui,_safeDecodeAsync:pi,_safeEncode:ci,_safeEncodeAsync:di,_safeParse:$t,_safeParseAsync:kt,_set:Wg,_size:zt,_slugify:Kn,_startsWith:Cn,_string:cu,_stringFormat:Dt,_stringbool:Vu,_success:iv,_superRefine:qu,_symbol:Pu,_templateLiteral:lv,_toLowerCase:Fn,_toUpperCase:Mn,_transform:Yg,_trim:Ln,_tuple:Bg,_uint32:_u,_uint64:Du,_ulid:Ai,_undefined:ju,_union:Mg,_unknown:Nu,_uppercase:Nn,_url:jn,_uuid:Ii,_uuidv4:Ei,_uuidv6:Di,_uuidv7:Pi,_void:Cu,_xid:Ci,_xor:Kg,clone:oe,config:J,createStandardJSONSchemaMethod:lt,createToJSONSchemaMethod:Wu,decode:zf,decodeAsync:Ef,describe:Bu,encode:Sf,encodeAsync:If,extractDefs:Ge,finalize:Ve,flattenError:ri,formatError:ii,globalConfig:Yt,globalRegistry:ne,initializeContext:Be,isValidBase64:bi,isValidBase64URL:uc,isValidJWT:mc,locales:ou,meta:Gu,parse:Kr,parseAsync:qr,prettifyError:Zs,process:N,regexes:hi,registry:Si,safeDecode:Pf,safeDecodeAsync:Of,safeEncode:Df,safeEncodeAsync:jf,safeParse:Ls,safeParseAsync:Fs,toDotPath:Rs,toJSONSchema:Ud,treeifyError:Ts,util:As,version:Ml},Symbol.toStringTag,{value:"Module"})),hv=Object.freeze(Object.defineProperty({__proto__:null,endsWith:Tn,gt:ye,gte:H,includes:An,length:Et,lowercase:Un,lt:be,lte:re,maxLength:It,maxSize:He,mime:Rn,minLength:De,minSize:$e,multipleOf:Je,negative:Gi,nonnegative:Wi,nonpositive:Vi,normalize:Zn,overwrite:he,positive:Bi,property:Xi,regex:On,size:zt,slugify:Kn,startsWith:Cn,toLowerCase:Fn,toUpperCase:Mn,trim:Ln,uppercase:Nn},Symbol.toStringTag,{value:"Module"})),Yi=h("ZodISODateTime",(e,t)=>{ec.init(e,t),C.init(e,t)});function Nd(e){return mu(Yi,e)}const eo=h("ZodISODate",(e,t)=>{tc.init(e,t),C.init(e,t)});function Ad(e){return fu(eo,e)}const to=h("ZodISOTime",(e,t)=>{nc.init(e,t),C.init(e,t)});function Cd(e){return hu(to,e)}const no=h("ZodISODuration",(e,t)=>{rc.init(e,t),C.init(e,t)});function Td(e){return gu(no,e)}const Rd=Object.freeze(Object.defineProperty({__proto__:null,ZodISODate:eo,ZodISODateTime:Yi,ZodISODuration:no,ZodISOTime:to,date:Ad,datetime:Nd,duration:Td,time:Cd},Symbol.toStringTag,{value:"Module"})),Zd=(e,t)=>{ni.init(e,t),e.name="ZodError",Object.defineProperties(e,{format:{value:r=>ii(e,r)},flatten:{value:r=>ri(e,r)},addIssue:{value:r=>{e.issues.push(r),e.message=JSON.stringify(e.issues,en,2)}},addIssues:{value:r=>{e.issues.push(...r),e.message=JSON.stringify(e.issues,en,2)}},isEmpty:{get(){return e.issues.length===0}}})},gv=h("ZodError",Zd),ee=h("ZodError",Zd,{Parent:Error}),Ld=bt(ee),Fd=yt(ee),Md=$t(ee),Kd=kt(ee),qd=oi(ee),Jd=ai(ee),Bd=si(ee),Gd=li(ee),Vd=ci(ee),Wd=ui(ee),Xd=di(ee),Hd=pi(ee),I=h("ZodType",(e,t)=>(z.init(e,t),Object.assign(e["~standard"],{jsonSchema:{input:lt(e,"input"),output:lt(e,"output")}}),e.toJSONSchema=Wu(e,{}),e.def=t,e.type=t.type,Object.defineProperty(e,"_def",{value:t}),e.check=(...r)=>e.clone(pe(t,{checks:[...t.checks??[],...r.map(i=>typeof i=="function"?{_zod:{check:i,def:{check:"custom"},onattach:[]}}:i)]}),{parent:!0}),e.with=e.check,e.clone=(r,i)=>oe(e,r,i),e.brand=()=>e,e.register=((r,i)=>(r.add(e,i),e)),e.parse=(r,i)=>Ld(e,r,i,{callee:e.parse}),e.safeParse=(r,i)=>Md(e,r,i),e.parseAsync=async(r,i)=>Fd(e,r,i,{callee:e.parseAsync}),e.safeParseAsync=async(r,i)=>Kd(e,r,i),e.spa=e.safeParseAsync,e.encode=(r,i)=>qd(e,r,i),e.decode=(r,i)=>Jd(e,r,i),e.encodeAsync=async(r,i)=>Bd(e,r,i),e.decodeAsync=async(r,i)=>Gd(e,r,i),e.safeEncode=(r,i)=>Vd(e,r,i),e.safeDecode=(r,i)=>Wd(e,r,i),e.safeEncodeAsync=async(r,i)=>Xd(e,r,i),e.safeDecodeAsync=async(r,i)=>Hd(e,r,i),e.refine=(r,i)=>e.check(Go(r,i)),e.superRefine=r=>e.check(Vo(r)),e.overwrite=r=>e.check(he(r)),e.optional=()=>ut(e),e.exactOptional=()=>Do(e),e.nullable=()=>dt(e),e.nullish=()=>ut(dt(e)),e.nonoptional=r=>Ao(e,r),e.array=()=>At(e),e.or=r=>dr([e,r]),e.and=r=>yo(e,r),e.transform=r=>pt(e,mr(r)),e.default=r=>Oo(e,r),e.prefault=r=>No(e,r),e.catch=r=>Ro(e,r),e.pipe=r=>pt(e,r),e.readonly=()=>Fo(e),e.describe=r=>{const i=e.clone();return ne.add(i,{description:r}),i},Object.defineProperty(e,"description",{get(){var r;return(r=ne.get(e))==null?void 0:r.description},configurable:!0}),e.meta=(...r)=>{if(r.length===0)return ne.get(e);const i=e.clone();return ne.add(i,r[0]),i},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e.apply=r=>r(e),e)),qn=h("_ZodString",(e,t)=>{St.init(e,t),I.init(e,t),e._zod.processJSONSchema=(i,n,o)=>Xu(e,i,n);const r=e._zod.bag;e.format=r.format??null,e.minLength=r.minimum??null,e.maxLength=r.maximum??null,e.regex=(...i)=>e.check(On(...i)),e.includes=(...i)=>e.check(An(...i)),e.startsWith=(...i)=>e.check(Cn(...i)),e.endsWith=(...i)=>e.check(Tn(...i)),e.min=(...i)=>e.check(De(...i)),e.max=(...i)=>e.check(It(...i)),e.length=(...i)=>e.check(Et(...i)),e.nonempty=(...i)=>e.check(De(1,...i)),e.lowercase=i=>e.check(Un(i)),e.uppercase=i=>e.check(Nn(i)),e.trim=()=>e.check(Ln()),e.normalize=(...i)=>e.check(Zn(...i)),e.toLowerCase=()=>e.check(Fn()),e.toUpperCase=()=>e.check(Mn()),e.slugify=()=>e.check(Kn())}),Pt=h("ZodString",(e,t)=>{St.init(e,t),qn.init(e,t),e.email=r=>e.check(zi(Jn,r)),e.url=r=>e.check(jn(jt,r)),e.jwt=r=>e.check(Ji(ar,r)),e.emoji=r=>e.check(ji(Bn,r)),e.guid=r=>e.check(rn(ct,r)),e.uuid=r=>e.check(Ii(ue,r)),e.uuidv4=r=>e.check(Ei(ue,r)),e.uuidv6=r=>e.check(Di(ue,r)),e.uuidv7=r=>e.check(Pi(ue,r)),e.nanoid=r=>e.check(Oi(Gn,r)),e.guid=r=>e.check(rn(ct,r)),e.cuid=r=>e.check(Ui(Vn,r)),e.cuid2=r=>e.check(Ni(Wn,r)),e.ulid=r=>e.check(Ai(Xn,r)),e.base64=r=>e.check(Mi(rr,r)),e.base64url=r=>e.check(Ki(ir,r)),e.xid=r=>e.check(Ci(Hn,r)),e.ksuid=r=>e.check(Ti(Qn,r)),e.ipv4=r=>e.check(Ri(Yn,r)),e.ipv6=r=>e.check(Zi(er,r)),e.cidrv4=r=>e.check(Li(tr,r)),e.cidrv6=r=>e.check(Fi(nr,r)),e.e164=r=>e.check(qi(or,r)),e.datetime=r=>e.check(Nd(r)),e.date=r=>e.check(Ad(r)),e.time=r=>e.check(Cd(r)),e.duration=r=>e.check(Td(r))});function ve(e){return cu(Pt,e)}const C=h("ZodStringFormat",(e,t)=>{A.init(e,t),qn.init(e,t)}),Jn=h("ZodEmail",(e,t)=>{Jl.init(e,t),C.init(e,t)});function Qd(e){return zi(Jn,e)}const ct=h("ZodGUID",(e,t)=>{Kl.init(e,t),C.init(e,t)});function Yd(e){return rn(ct,e)}const ue=h("ZodUUID",(e,t)=>{ql.init(e,t),C.init(e,t)});function ep(e){return Ii(ue,e)}function tp(e){return Ei(ue,e)}function np(e){return Di(ue,e)}function rp(e){return Pi(ue,e)}const jt=h("ZodURL",(e,t)=>{Bl.init(e,t),C.init(e,t)});function ip(e){return jn(jt,e)}function op(e){return jn(jt,{protocol:/^https?$/,hostname:al,...v(e)})}const Bn=h("ZodEmoji",(e,t)=>{Gl.init(e,t),C.init(e,t)});function ap(e){return ji(Bn,e)}const Gn=h("ZodNanoID",(e,t)=>{Vl.init(e,t),C.init(e,t)});function sp(e){return Oi(Gn,e)}const Vn=h("ZodCUID",(e,t)=>{Wl.init(e,t),C.init(e,t)});function lp(e){return Ui(Vn,e)}const Wn=h("ZodCUID2",(e,t)=>{Xl.init(e,t),C.init(e,t)});function cp(e){return Ni(Wn,e)}const Xn=h("ZodULID",(e,t)=>{Hl.init(e,t),C.init(e,t)});function up(e){return Ai(Xn,e)}const Hn=h("ZodXID",(e,t)=>{Ql.init(e,t),C.init(e,t)});function dp(e){return Ci(Hn,e)}const Qn=h("ZodKSUID",(e,t)=>{Yl.init(e,t),C.init(e,t)});function pp(e){return Ti(Qn,e)}const Yn=h("ZodIPv4",(e,t)=>{ic.init(e,t),C.init(e,t)});function mp(e){return Ri(Yn,e)}const ro=h("ZodMAC",(e,t)=>{ac.init(e,t),C.init(e,t)});function fp(e){return du(ro,e)}const er=h("ZodIPv6",(e,t)=>{oc.init(e,t),C.init(e,t)});function hp(e){return Zi(er,e)}const tr=h("ZodCIDRv4",(e,t)=>{sc.init(e,t),C.init(e,t)});function gp(e){return Li(tr,e)}const nr=h("ZodCIDRv6",(e,t)=>{lc.init(e,t),C.init(e,t)});function vp(e){return Fi(nr,e)}const rr=h("ZodBase64",(e,t)=>{cc.init(e,t),C.init(e,t)});function bp(e){return Mi(rr,e)}const ir=h("ZodBase64URL",(e,t)=>{dc.init(e,t),C.init(e,t)});function yp(e){return Ki(ir,e)}const or=h("ZodE164",(e,t)=>{pc.init(e,t),C.init(e,t)});function $p(e){return qi(or,e)}const ar=h("ZodJWT",(e,t)=>{fc.init(e,t),C.init(e,t)});function kp(e){return Ji(ar,e)}const Qe=h("ZodCustomStringFormat",(e,t)=>{hc.init(e,t),C.init(e,t)});function xp(e,t,r={}){return Dt(Qe,e,t,r)}function _p(e){return Dt(Qe,"hostname",ol,e)}function wp(e){return Dt(Qe,"hex",kl,e)}function Sp(e,t){const r=(t==null?void 0:t.enc)??"hex",i=`${e}_${r}`,n=hi[i];if(!n)throw new Error(`Unrecognized hash format: ${i}`);return Dt(Qe,i,n,t)}const Ot=h("ZodNumber",(e,t)=>{yi.init(e,t),I.init(e,t),e._zod.processJSONSchema=(i,n,o)=>Hu(e,i,n),e.gt=(i,n)=>e.check(ye(i,n)),e.gte=(i,n)=>e.check(H(i,n)),e.min=(i,n)=>e.check(H(i,n)),e.lt=(i,n)=>e.check(be(i,n)),e.lte=(i,n)=>e.check(re(i,n)),e.max=(i,n)=>e.check(re(i,n)),e.int=i=>e.check(on(i)),e.safe=i=>e.check(on(i)),e.positive=i=>e.check(ye(0,i)),e.nonnegative=i=>e.check(H(0,i)),e.negative=i=>e.check(be(0,i)),e.nonpositive=i=>e.check(re(0,i)),e.multipleOf=(i,n)=>e.check(Je(i,n)),e.step=(i,n)=>e.check(Je(i,n)),e.finite=()=>e;const r=e._zod.bag;e.minValue=Math.max(r.minimum??Number.NEGATIVE_INFINITY,r.exclusiveMinimum??Number.NEGATIVE_INFINITY)??null,e.maxValue=Math.min(r.maximum??Number.POSITIVE_INFINITY,r.exclusiveMaximum??Number.POSITIVE_INFINITY)??null,e.isInt=(r.format??"").includes("int")||Number.isSafeInteger(r.multipleOf??.5),e.isFinite=!0,e.format=r.format??null});function io(e){return vu(Ot,e)}const Ne=h("ZodNumberFormat",(e,t)=>{gc.init(e,t),Ot.init(e,t)});function on(e){return yu(Ne,e)}function zp(e){return $u(Ne,e)}function Ip(e){return ku(Ne,e)}function Ep(e){return xu(Ne,e)}function Dp(e){return _u(Ne,e)}const Ut=h("ZodBoolean",(e,t)=>{$i.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Qu(e,r,i)});function sr(e){return wu(Ut,e)}const Nt=h("ZodBigInt",(e,t)=>{ki.init(e,t),I.init(e,t),e._zod.processJSONSchema=(i,n,o)=>Yu(e,i),e.gte=(i,n)=>e.check(H(i,n)),e.min=(i,n)=>e.check(H(i,n)),e.gt=(i,n)=>e.check(ye(i,n)),e.gte=(i,n)=>e.check(H(i,n)),e.min=(i,n)=>e.check(H(i,n)),e.lt=(i,n)=>e.check(be(i,n)),e.lte=(i,n)=>e.check(re(i,n)),e.max=(i,n)=>e.check(re(i,n)),e.positive=i=>e.check(ye(BigInt(0),i)),e.negative=i=>e.check(be(BigInt(0),i)),e.nonpositive=i=>e.check(re(BigInt(0),i)),e.nonnegative=i=>e.check(H(BigInt(0),i)),e.multipleOf=(i,n)=>e.check(Je(i,n));const r=e._zod.bag;e.minValue=r.minimum??null,e.maxValue=r.maximum??null,e.format=r.format??null});function Pp(e){return zu(Nt,e)}const lr=h("ZodBigIntFormat",(e,t)=>{vc.init(e,t),Nt.init(e,t)});function jp(e){return Eu(lr,e)}function Op(e){return Du(lr,e)}const oo=h("ZodSymbol",(e,t)=>{bc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>ed(e,r)});function Up(e){return Pu(oo,e)}const ao=h("ZodUndefined",(e,t)=>{yc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>nd(e,r)});function Np(e){return ju(ao,e)}const so=h("ZodNull",(e,t)=>{$c.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>td(e,r,i)});function lo(e){return Ou(so,e)}const co=h("ZodAny",(e,t)=>{kc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>od()});function Ap(){return Uu(co)}const uo=h("ZodUnknown",(e,t)=>{xc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>ad()});function Pe(){return Nu(uo)}const po=h("ZodNever",(e,t)=>{_c.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>id(e,r,i)});function cr(e){return Au(po,e)}const mo=h("ZodVoid",(e,t)=>{wc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>rd(e,r)});function Cp(e){return Cu(mo,e)}const ur=h("ZodDate",(e,t)=>{Sc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(i,n,o)=>sd(e,i),e.min=(i,n)=>e.check(H(i,n)),e.max=(i,n)=>e.check(re(i,n));const r=e._zod.bag;e.minDate=r.minimum?new Date(r.minimum):null,e.maxDate=r.maximum?new Date(r.maximum):null});function Tp(e){return Tu(ur,e)}const fo=h("ZodArray",(e,t)=>{zc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>yd(e,r,i,n),e.element=t.element,e.min=(r,i)=>e.check(De(r,i)),e.nonempty=r=>e.check(De(1,r)),e.max=(r,i)=>e.check(It(r,i)),e.length=(r,i)=>e.check(Et(r,i)),e.unwrap=()=>e.element});function At(e,t){return Lu(fo,e,t)}function Rp(e){const t=e._zod.def.shape;return pr(Object.keys(t))}const Ct=h("ZodObject",(e,t)=>{Pc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>$d(e,r,i,n),E(e,"shape",()=>t.shape),e.keyof=()=>pr(Object.keys(e._zod.def.shape)),e.catchall=r=>e.clone({...e._zod.def,catchall:r}),e.passthrough=()=>e.clone({...e._zod.def,catchall:Pe()}),e.loose=()=>e.clone({...e._zod.def,catchall:Pe()}),e.strict=()=>e.clone({...e._zod.def,catchall:cr()}),e.strip=()=>e.clone({...e._zod.def,catchall:void 0}),e.extend=r=>Es(e,r),e.safeExtend=r=>Ds(e,r),e.merge=r=>Ps(e,r),e.pick=r=>zs(e,r),e.omit=r=>Is(e,r),e.partial=(...r)=>js(fr,e,r[0]),e.required=(...r)=>Os(hr,e,r[0])});function ho(e,t){const r={type:"object",shape:e??{},...v(t)};return new Ct(r)}function Zp(e,t){return new Ct({type:"object",shape:e,catchall:cr(),...v(t)})}function Lp(e,t){return new Ct({type:"object",shape:e,catchall:Pe(),...v(t)})}const Tt=h("ZodUnion",(e,t)=>{Pn.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Hi(e,r,i,n),e.options=t.options});function dr(e,t){return new Tt({type:"union",options:e,...v(t)})}const go=h("ZodXor",(e,t)=>{Tt.init(e,t),jc.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Hi(e,r,i,n),e.options=t.options});function Fp(e,t){return new go({type:"union",options:e,inclusive:!1,...v(t)})}const vo=h("ZodDiscriminatedUnion",(e,t)=>{Tt.init(e,t),Oc.init(e,t)});function Mp(e,t,r){return new vo({type:"union",options:t,discriminator:e,...v(r)})}const bo=h("ZodIntersection",(e,t)=>{Uc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>kd(e,r,i,n)});function yo(e,t){return new bo({type:"intersection",left:e,right:t})}const $o=h("ZodTuple",(e,t)=>{xi.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>xd(e,r,i,n),e.rest=r=>e.clone({...e._zod.def,rest:r})});function ko(e,t,r){const i=t instanceof z,n=i?r:t,o=i?t:null;return new $o({type:"tuple",items:e,rest:o,...v(n)})}const Rt=h("ZodRecord",(e,t)=>{Nc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>_d(e,r,i,n),e.keyType=t.keyType,e.valueType=t.valueType});function xo(e,t,r){return new Rt({type:"record",keyType:e,valueType:t,...v(r)})}function Kp(e,t,r){const i=oe(e);return i._zod.values=void 0,new Rt({type:"record",keyType:i,valueType:t,...v(r)})}function qp(e,t,r){return new Rt({type:"record",keyType:e,valueType:t,mode:"loose",...v(r)})}const _o=h("ZodMap",(e,t)=>{Ac.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>vd(e,r),e.keyType=t.keyType,e.valueType=t.valueType,e.min=(...r)=>e.check($e(...r)),e.nonempty=r=>e.check($e(1,r)),e.max=(...r)=>e.check(He(...r)),e.size=(...r)=>e.check(zt(...r))});function Jp(e,t,r){return new _o({type:"map",keyType:e,valueType:t,...v(r)})}const wo=h("ZodSet",(e,t)=>{Cc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>bd(e,r),e.min=(...r)=>e.check($e(...r)),e.nonempty=r=>e.check($e(1,r)),e.max=(...r)=>e.check(He(...r)),e.size=(...r)=>e.check(zt(...r))});function Bp(e,t){return new wo({type:"set",valueType:e,...v(t)})}const We=h("ZodEnum",(e,t)=>{Tc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(i,n,o)=>ld(e,i,n),e.enum=t.entries,e.options=Object.values(t.entries);const r=new Set(Object.keys(t.entries));e.extract=(i,n)=>{const o={};for(const a of i)if(r.has(a))o[a]=t.entries[a];else throw new Error(`Key ${a} not found in enum`);return new We({...t,checks:[],...v(n),entries:o})},e.exclude=(i,n)=>{const o={...t.entries};for(const a of i)if(r.has(a))delete o[a];else throw new Error(`Key ${a} not found in enum`);return new We({...t,checks:[],...v(n),entries:o})}});function pr(e,t){const r=Array.isArray(e)?Object.fromEntries(e.map(i=>[i,i])):e;return new We({type:"enum",entries:r,...v(t)})}function Gp(e,t){return new We({type:"enum",entries:e,...v(t)})}const So=h("ZodLiteral",(e,t)=>{Rc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>cd(e,r,i),e.values=new Set(t.values),Object.defineProperty(e,"value",{get(){if(t.values.length>1)throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");return t.values[0]}})});function Vp(e,t){return new So({type:"literal",values:Array.isArray(e)?e:[e],...v(t)})}const zo=h("ZodFile",(e,t)=>{Zc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>pd(e,r,i),e.min=(r,i)=>e.check($e(r,i)),e.max=(r,i)=>e.check(He(r,i)),e.mime=(r,i)=>e.check(Rn(Array.isArray(r)?r:[r],i))});function Wp(e){return Fu(zo,e)}const Io=h("ZodTransform",(e,t)=>{Lc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>gd(e,r),e._zod.parse=(r,i)=>{if(i.direction==="backward")throw new Sn(e.constructor.name);r.addIssue=o=>{if(typeof o=="string")r.issues.push(Ke(o,r.value,t));else{const a=o;a.fatal&&(a.continue=!1),a.code??(a.code="custom"),a.input??(a.input=r.value),a.inst??(a.inst=e),r.issues.push(Ke(a))}};const n=t.transform(r.value,r);return n instanceof Promise?n.then(o=>(r.value=o,r)):(r.value=n,r)}});function mr(e){return new Io({type:"transform",transform:e})}const fr=h("ZodOptional",(e,t)=>{_i.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Qi(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function ut(e){return new fr({type:"optional",innerType:e})}const Eo=h("ZodExactOptional",(e,t)=>{Fc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Qi(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function Do(e){return new Eo({type:"optional",innerType:e})}const Po=h("ZodNullable",(e,t)=>{Mc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>wd(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function dt(e){return new Po({type:"nullable",innerType:e})}function Xp(e){return ut(dt(e))}const jo=h("ZodDefault",(e,t)=>{Kc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>zd(e,r,i,n),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Oo(e,t){return new jo({type:"default",innerType:e,get defaultValue(){return typeof t=="function"?t():In(t)}})}const Uo=h("ZodPrefault",(e,t)=>{qc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Id(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function No(e,t){return new Uo({type:"prefault",innerType:e,get defaultValue(){return typeof t=="function"?t():In(t)}})}const hr=h("ZodNonOptional",(e,t)=>{Jc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Sd(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function Ao(e,t){return new hr({type:"nonoptional",innerType:e,...v(t)})}const Co=h("ZodSuccess",(e,t)=>{Bc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>md(e,r,i),e.unwrap=()=>e._zod.def.innerType});function Hp(e){return new Co({type:"success",innerType:e})}const To=h("ZodCatch",(e,t)=>{Gc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Ed(e,r,i,n),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function Ro(e,t){return new To({type:"catch",innerType:e,catchValue:typeof t=="function"?t:()=>t})}const Zo=h("ZodNaN",(e,t)=>{Vc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>ud(e,r)});function Qp(e){return Zu(Zo,e)}const gr=h("ZodPipe",(e,t)=>{Wc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Dd(e,r,i,n),e.in=t.in,e.out=t.out});function pt(e,t){return new gr({type:"pipe",in:e,out:t})}const vr=h("ZodCodec",(e,t)=>{gr.init(e,t),wi.init(e,t)});function Yp(e,t,r){return new vr({type:"pipe",in:e,out:t,transform:r.decode,reverseTransform:r.encode})}const Lo=h("ZodReadonly",(e,t)=>{Xc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Pd(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function Fo(e){return new Lo({type:"readonly",innerType:e})}const Mo=h("ZodTemplateLiteral",(e,t)=>{Hc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>dd(e,r,i)});function em(e,t){return new Mo({type:"template_literal",parts:e,...v(t)})}const Ko=h("ZodLazy",(e,t)=>{eu.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>Od(e,r,i,n),e.unwrap=()=>e._zod.def.getter()});function qo(e){return new Ko({type:"lazy",getter:e})}const Jo=h("ZodPromise",(e,t)=>{Yc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>jd(e,r,i,n),e.unwrap=()=>e._zod.def.innerType});function tm(e){return new Jo({type:"promise",innerType:e})}const Bo=h("ZodFunction",(e,t)=>{Qc.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>hd(e,r)});function an(e){return new Bo({type:"function",input:Array.isArray(e==null?void 0:e.input)?ko(e==null?void 0:e.input):(e==null?void 0:e.input)??At(Pe()),output:(e==null?void 0:e.output)??Pe()})}const Zt=h("ZodCustom",(e,t)=>{tu.init(e,t),I.init(e,t),e._zod.processJSONSchema=(r,i,n)=>fd(e,r)});function nm(e){const t=new L({check:"custom"});return t._zod.check=e,t}function rm(e,t){return Mu(Zt,e??(()=>!0),t)}function Go(e,t={}){return Ku(Zt,e,t)}function Vo(e){return qu(e)}const im=Bu,om=Gu;function am(e,t={}){const r=new Zt({type:"custom",check:"custom",fn:i=>i instanceof e,abort:!0,...v(t)});return r._zod.bag.Class=e,r._zod.check=i=>{i.value instanceof e||i.issues.push({code:"invalid_type",expected:e.name,input:i.value,inst:r,path:[...r._zod.def.path??[]]})},r}const sm=(...e)=>Vu({Codec:vr,Boolean:Ut,String:Pt},...e);function lm(e){const t=qo(()=>dr([ve(e),io(),sr(),lo(),At(t),xo(ve(),t)]));return t}function cm(e,t){return pt(mr(e),t)}const vv=Object.freeze(Object.defineProperty({__proto__:null,ZodAny:co,ZodArray:fo,ZodBase64:rr,ZodBase64URL:ir,ZodBigInt:Nt,ZodBigIntFormat:lr,ZodBoolean:Ut,ZodCIDRv4:tr,ZodCIDRv6:nr,ZodCUID:Vn,ZodCUID2:Wn,ZodCatch:To,ZodCodec:vr,ZodCustom:Zt,ZodCustomStringFormat:Qe,ZodDate:ur,ZodDefault:jo,ZodDiscriminatedUnion:vo,ZodE164:or,ZodEmail:Jn,ZodEmoji:Bn,ZodEnum:We,ZodExactOptional:Eo,ZodFile:zo,ZodFunction:Bo,ZodGUID:ct,ZodIPv4:Yn,ZodIPv6:er,ZodIntersection:bo,ZodJWT:ar,ZodKSUID:Qn,ZodLazy:Ko,ZodLiteral:So,ZodMAC:ro,ZodMap:_o,ZodNaN:Zo,ZodNanoID:Gn,ZodNever:po,ZodNonOptional:hr,ZodNull:so,ZodNullable:Po,ZodNumber:Ot,ZodNumberFormat:Ne,ZodObject:Ct,ZodOptional:fr,ZodPipe:gr,ZodPrefault:Uo,ZodPromise:Jo,ZodReadonly:Lo,ZodRecord:Rt,ZodSet:wo,ZodString:Pt,ZodStringFormat:C,ZodSuccess:Co,ZodSymbol:oo,ZodTemplateLiteral:Mo,ZodTransform:Io,ZodTuple:$o,ZodType:I,ZodULID:Xn,ZodURL:jt,ZodUUID:ue,ZodUndefined:ao,ZodUnion:Tt,ZodUnknown:uo,ZodVoid:mo,ZodXID:Hn,ZodXor:go,_ZodString:qn,_default:Oo,_function:an,any:Ap,array:At,base64:bp,base64url:yp,bigint:Pp,boolean:sr,catch:Ro,check:nm,cidrv4:gp,cidrv6:vp,codec:Yp,cuid:lp,cuid2:cp,custom:rm,date:Tp,describe:im,discriminatedUnion:Mp,e164:$p,email:Qd,emoji:ap,enum:pr,exactOptional:Do,file:Wp,float32:zp,float64:Ip,function:an,guid:Yd,hash:Sp,hex:wp,hostname:_p,httpUrl:op,instanceof:am,int:on,int32:Ep,int64:jp,intersection:yo,ipv4:mp,ipv6:hp,json:lm,jwt:kp,keyof:Rp,ksuid:pp,lazy:qo,literal:Vp,looseObject:Lp,looseRecord:qp,mac:fp,map:Jp,meta:om,nan:Qp,nanoid:sp,nativeEnum:Gp,never:cr,nonoptional:Ao,null:lo,nullable:dt,nullish:Xp,number:io,object:ho,optional:ut,partialRecord:Kp,pipe:pt,prefault:No,preprocess:cm,promise:tm,readonly:Fo,record:xo,refine:Go,set:Bp,strictObject:Zp,string:ve,stringFormat:xp,stringbool:sm,success:Hp,superRefine:Vo,symbol:Up,templateLiteral:em,transform:mr,tuple:ko,uint32:Dp,uint64:Op,ulid:up,undefined:Np,union:dr,unknown:Pe,url:ip,uuid:ep,uuidv4:tp,uuidv6:np,uuidv7:rp,void:Cp,xid:dp,xor:Fp},Symbol.toStringTag,{value:"Module"})),bv={invalid_type:"invalid_type",too_big:"too_big",too_small:"too_small",invalid_format:"invalid_format",not_multiple_of:"not_multiple_of",unrecognized_keys:"unrecognized_keys",invalid_union:"invalid_union",invalid_key:"invalid_key",invalid_element:"invalid_element",invalid_value:"invalid_value",custom:"custom"};function yv(e){J({customError:e})}function $v(){return J().customError}var Gr;Gr||(Gr={});const $={...vv,...hv,iso:Rd},kv=new Set(["$schema","$ref","$defs","definitions","$id","id","$comment","$anchor","$vocabulary","$dynamicRef","$dynamicAnchor","type","enum","const","anyOf","oneOf","allOf","not","properties","required","additionalProperties","patternProperties","propertyNames","minProperties","maxProperties","items","prefixItems","additionalItems","minItems","maxItems","uniqueItems","contains","minContains","maxContains","minLength","maxLength","pattern","format","minimum","maximum","exclusiveMinimum","exclusiveMaximum","multipleOf","description","default","contentEncoding","contentMediaType","contentSchema","unevaluatedItems","unevaluatedProperties","if","then","else","dependentSchemas","dependentRequired","nullable","readOnly"]);function xv(e,t){const r=e.$schema;return r==="https://json-schema.org/draft/2020-12/schema"?"draft-2020-12":r==="http://json-schema.org/draft-07/schema#"?"draft-7":r==="http://json-schema.org/draft-04/schema#"?"draft-4":t??"draft-2020-12"}function _v(e,t){if(!e.startsWith("#"))throw new Error("External $ref is not supported, only local refs (#/...) are allowed");const r=e.slice(1).split("/").filter(Boolean);if(r.length===0)return t.rootSchema;const i=t.version==="draft-2020-12"?"$defs":"definitions";if(r[0]===i){const n=r[1];if(!n||!t.defs[n])throw new Error(`Reference not found: ${e}`);return t.defs[n]}throw new Error(`Reference not found: ${e}`)}function um(e,t){if(e.not!==void 0){if(typeof e.not=="object"&&Object.keys(e.not).length===0)return $.never();throw new Error("not is not supported in Zod (except { not: {} } for never)")}if(e.unevaluatedItems!==void 0)throw new Error("unevaluatedItems is not supported");if(e.unevaluatedProperties!==void 0)throw new Error("unevaluatedProperties is not supported");if(e.if!==void 0||e.then!==void 0||e.else!==void 0)throw new Error("Conditional schemas (if/then/else) are not supported");if(e.dependentSchemas!==void 0||e.dependentRequired!==void 0)throw new Error("dependentSchemas and dependentRequired are not supported");if(e.$ref){const n=e.$ref;if(t.refs.has(n))return t.refs.get(n);if(t.processing.has(n))return $.lazy(()=>{if(!t.refs.has(n))throw new Error(`Circular reference not resolved: ${n}`);return t.refs.get(n)});t.processing.add(n);const o=_v(n,t),a=K(o,t);return t.refs.set(n,a),t.processing.delete(n),a}if(e.enum!==void 0){const n=e.enum;if(t.version==="openapi-3.0"&&e.nullable===!0&&n.length===1&&n[0]===null)return $.null();if(n.length===0)return $.never();if(n.length===1)return $.literal(n[0]);if(n.every(a=>typeof a=="string"))return $.enum(n);const o=n.map(a=>$.literal(a));return o.length<2?o[0]:$.union([o[0],o[1],...o.slice(2)])}if(e.const!==void 0)return $.literal(e.const);const r=e.type;if(Array.isArray(r)){const n=r.map(o=>{const a={...e,type:o};return um(a,t)});return n.length===0?$.never():n.length===1?n[0]:$.union(n)}if(!r)return $.any();let i;switch(r){case"string":{let n=$.string();if(e.format){const o=e.format;o==="email"?n=n.check($.email()):o==="uri"||o==="uri-reference"?n=n.check($.url()):o==="uuid"||o==="guid"?n=n.check($.uuid()):o==="date-time"?n=n.check($.iso.datetime()):o==="date"?n=n.check($.iso.date()):o==="time"?n=n.check($.iso.time()):o==="duration"?n=n.check($.iso.duration()):o==="ipv4"?n=n.check($.ipv4()):o==="ipv6"?n=n.check($.ipv6()):o==="mac"?n=n.check($.mac()):o==="cidr"?n=n.check($.cidrv4()):o==="cidr-v6"?n=n.check($.cidrv6()):o==="base64"?n=n.check($.base64()):o==="base64url"?n=n.check($.base64url()):o==="e164"?n=n.check($.e164()):o==="jwt"?n=n.check($.jwt()):o==="emoji"?n=n.check($.emoji()):o==="nanoid"?n=n.check($.nanoid()):o==="cuid"?n=n.check($.cuid()):o==="cuid2"?n=n.check($.cuid2()):o==="ulid"?n=n.check($.ulid()):o==="xid"?n=n.check($.xid()):o==="ksuid"&&(n=n.check($.ksuid()))}typeof e.minLength=="number"&&(n=n.min(e.minLength)),typeof e.maxLength=="number"&&(n=n.max(e.maxLength)),e.pattern&&(n=n.regex(new RegExp(e.pattern))),i=n;break}case"number":case"integer":{let n=r==="integer"?$.number().int():$.number();typeof e.minimum=="number"&&(n=n.min(e.minimum)),typeof e.maximum=="number"&&(n=n.max(e.maximum)),typeof e.exclusiveMinimum=="number"?n=n.gt(e.exclusiveMinimum):e.exclusiveMinimum===!0&&typeof e.minimum=="number"&&(n=n.gt(e.minimum)),typeof e.exclusiveMaximum=="number"?n=n.lt(e.exclusiveMaximum):e.exclusiveMaximum===!0&&typeof e.maximum=="number"&&(n=n.lt(e.maximum)),typeof e.multipleOf=="number"&&(n=n.multipleOf(e.multipleOf)),i=n;break}case"boolean":{i=$.boolean();break}case"null":{i=$.null();break}case"object":{const n={},o=e.properties||{},a=new Set(e.required||[]);for(const[c,l]of Object.entries(o)){const u=K(l,t);n[c]=a.has(c)?u:u.optional()}if(e.propertyNames){const c=K(e.propertyNames,t),l=e.additionalProperties&&typeof e.additionalProperties=="object"?K(e.additionalProperties,t):$.any();if(Object.keys(n).length===0){i=$.record(c,l);break}const u=$.object(n).passthrough(),d=$.looseRecord(c,l);i=$.intersection(u,d);break}if(e.patternProperties){const c=e.patternProperties,l=Object.keys(c),u=[];for(const f of l){const p=K(c[f],t),b=$.string().regex(new RegExp(f));u.push($.looseRecord(b,p))}const d=[];if(Object.keys(n).length>0&&d.push($.object(n).passthrough()),d.push(...u),d.length===0)i=$.object({}).passthrough();else if(d.length===1)i=d[0];else{let f=$.intersection(d[0],d[1]);for(let p=2;p<d.length;p++)f=$.intersection(f,d[p]);i=f}break}const s=$.object(n);e.additionalProperties===!1?i=s.strict():typeof e.additionalProperties=="object"?i=s.catchall(K(e.additionalProperties,t)):i=s.passthrough();break}case"array":{const n=e.prefixItems,o=e.items;if(n&&Array.isArray(n)){const a=n.map(c=>K(c,t)),s=o&&typeof o=="object"&&!Array.isArray(o)?K(o,t):void 0;s?i=$.tuple(a).rest(s):i=$.tuple(a),typeof e.minItems=="number"&&(i=i.check($.minLength(e.minItems))),typeof e.maxItems=="number"&&(i=i.check($.maxLength(e.maxItems)))}else if(Array.isArray(o)){const a=o.map(c=>K(c,t)),s=e.additionalItems&&typeof e.additionalItems=="object"?K(e.additionalItems,t):void 0;s?i=$.tuple(a).rest(s):i=$.tuple(a),typeof e.minItems=="number"&&(i=i.check($.minLength(e.minItems))),typeof e.maxItems=="number"&&(i=i.check($.maxLength(e.maxItems)))}else if(o!==void 0){const a=K(o,t);let s=$.array(a);typeof e.minItems=="number"&&(s=s.min(e.minItems)),typeof e.maxItems=="number"&&(s=s.max(e.maxItems)),i=s}else i=$.array($.any());break}default:throw new Error(`Unsupported type: ${r}`)}return e.description&&(i=i.describe(e.description)),e.default!==void 0&&(i=i.default(e.default)),i}function K(e,t){if(typeof e=="boolean")return e?$.any():$.never();let r=um(e,t);const i=e.type||e.enum!==void 0||e.const!==void 0;if(e.anyOf&&Array.isArray(e.anyOf)){const s=e.anyOf.map(l=>K(l,t)),c=$.union(s);r=i?$.intersection(r,c):c}if(e.oneOf&&Array.isArray(e.oneOf)){const s=e.oneOf.map(l=>K(l,t)),c=$.xor(s);r=i?$.intersection(r,c):c}if(e.allOf&&Array.isArray(e.allOf))if(e.allOf.length===0)r=i?r:$.any();else{let s=i?r:K(e.allOf[0],t);const c=i?0:1;for(let l=c;l<e.allOf.length;l++)s=$.intersection(s,K(e.allOf[l],t));r=s}e.nullable===!0&&t.version==="openapi-3.0"&&(r=$.nullable(r)),e.readOnly===!0&&(r=$.readonly(r));const n={},o=["$id","id","$comment","$anchor","$vocabulary","$dynamicRef","$dynamicAnchor"];for(const s of o)s in e&&(n[s]=e[s]);const a=["contentEncoding","contentMediaType","contentSchema"];for(const s of a)s in e&&(n[s]=e[s]);for(const s of Object.keys(e))kv.has(s)||(n[s]=e[s]);return Object.keys(n).length>0&&t.registry.add(r,n),r}function wv(e,t){if(typeof e=="boolean")return e?$.any():$.never();const r=xv(e,t==null?void 0:t.defaultTarget),i=e.$defs||e.definitions||{},n={version:r,defs:i,refs:new Map,processing:new Set,rootSchema:e,registry:(t==null?void 0:t.registry)??ne};return K(e,n)}function Sv(e){return uu(Pt,e)}function dm(e){return bu(Ot,e)}function zv(e){return Su(Ut,e)}function Iv(e){return Iu(Nt,e)}function Ev(e){return Ru(ur,e)}const Dv=Object.freeze(Object.defineProperty({__proto__:null,bigint:Iv,boolean:zv,date:Ev,number:dm,string:Sv},Symbol.toStringTag,{value:"Module"}));J(nu());const Pv=Object.freeze(Object.defineProperty({__proto__:null,$brand:bs,$input:su,$output:au,NEVER:vs,TimePrecision:pu,ZodAny:co,ZodArray:fo,ZodBase64:rr,ZodBase64URL:ir,ZodBigInt:Nt,ZodBigIntFormat:lr,ZodBoolean:Ut,ZodCIDRv4:tr,ZodCIDRv6:nr,ZodCUID:Vn,ZodCUID2:Wn,ZodCatch:To,ZodCodec:vr,ZodCustom:Zt,ZodCustomStringFormat:Qe,ZodDate:ur,ZodDefault:jo,ZodDiscriminatedUnion:vo,ZodE164:or,ZodEmail:Jn,ZodEmoji:Bn,ZodEnum:We,ZodError:gv,ZodExactOptional:Eo,ZodFile:zo,get ZodFirstPartyTypeKind(){return Gr},ZodFunction:Bo,ZodGUID:ct,ZodIPv4:Yn,ZodIPv6:er,ZodISODate:eo,ZodISODateTime:Yi,ZodISODuration:no,ZodISOTime:to,ZodIntersection:bo,ZodIssueCode:bv,ZodJWT:ar,ZodKSUID:Qn,ZodLazy:Ko,ZodLiteral:So,ZodMAC:ro,ZodMap:_o,ZodNaN:Zo,ZodNanoID:Gn,ZodNever:po,ZodNonOptional:hr,ZodNull:so,ZodNullable:Po,ZodNumber:Ot,ZodNumberFormat:Ne,ZodObject:Ct,ZodOptional:fr,ZodPipe:gr,ZodPrefault:Uo,ZodPromise:Jo,ZodReadonly:Lo,ZodRealError:ee,ZodRecord:Rt,ZodSet:wo,ZodString:Pt,ZodStringFormat:C,ZodSuccess:Co,ZodSymbol:oo,ZodTemplateLiteral:Mo,ZodTransform:Io,ZodTuple:$o,ZodType:I,ZodULID:Xn,ZodURL:jt,ZodUUID:ue,ZodUndefined:ao,ZodUnion:Tt,ZodUnknown:uo,ZodVoid:mo,ZodXID:Hn,ZodXor:go,_ZodString:qn,_default:Oo,_function:an,any:Ap,array:At,base64:bp,base64url:yp,bigint:Pp,boolean:sr,catch:Ro,check:nm,cidrv4:gp,cidrv6:vp,clone:oe,codec:Yp,coerce:Dv,config:J,core:fv,cuid:lp,cuid2:cp,custom:rm,date:Tp,decode:Jd,decodeAsync:Gd,describe:im,discriminatedUnion:Mp,e164:$p,email:Qd,emoji:ap,encode:qd,encodeAsync:Bd,endsWith:Tn,enum:pr,exactOptional:Do,file:Wp,flattenError:ri,float32:zp,float64:Ip,formatError:ii,fromJSONSchema:wv,function:an,getErrorMap:$v,globalRegistry:ne,gt:ye,gte:H,guid:Yd,hash:Sp,hex:wp,hostname:_p,httpUrl:op,includes:An,instanceof:am,int:on,int32:Ep,int64:jp,intersection:yo,ipv4:mp,ipv6:hp,iso:Rd,json:lm,jwt:kp,keyof:Rp,ksuid:pp,lazy:qo,length:Et,literal:Vp,locales:ou,looseObject:Lp,looseRecord:qp,lowercase:Un,lt:be,lte:re,mac:fp,map:Jp,maxLength:It,maxSize:He,meta:om,mime:Rn,minLength:De,minSize:$e,multipleOf:Je,nan:Qp,nanoid:sp,nativeEnum:Gp,negative:Gi,never:cr,nonnegative:Wi,nonoptional:Ao,nonpositive:Vi,normalize:Zn,null:lo,nullable:dt,nullish:Xp,number:io,object:ho,optional:ut,overwrite:he,parse:Ld,parseAsync:Fd,partialRecord:Kp,pipe:pt,positive:Bi,prefault:No,preprocess:cm,prettifyError:Zs,promise:tm,property:Xi,readonly:Fo,record:xo,refine:Go,regex:On,regexes:hi,registry:Si,safeDecode:Wd,safeDecodeAsync:Hd,safeEncode:Vd,safeEncodeAsync:Xd,safeParse:Md,safeParseAsync:Kd,set:Bp,setErrorMap:yv,size:zt,slugify:Kn,startsWith:Cn,strictObject:Zp,string:ve,stringFormat:xp,stringbool:sm,success:Hp,superRefine:Vo,symbol:Up,templateLiteral:em,toJSONSchema:Ud,toLowerCase:Fn,toUpperCase:Mn,transform:mr,treeifyError:Ts,trim:Ln,tuple:ko,uint32:Dp,uint64:Op,ulid:up,undefined:Np,union:dr,unknown:Pe,uppercase:Nn,url:ip,util:As,uuid:ep,uuidv4:tp,uuidv6:np,uuidv7:rp,void:Cp,xid:dp,xor:Fp},Symbol.toStringTag,{value:"Module"}));function pm(e,t){const r=k({...t}),i=k({}),n=k({}),o=k(!1),a=k(!1),s=Oe(()=>e.safeParse(r.value).success);function c(p,b){r.value={...r.value,[p]:b},n.value[p]&&u(p)}function l(p){n.value={...n.value,[p]:!0},u(p)}function u(p){const b=e.safeParse(r.value),g={...i.value};if(b.success)delete g[p];else{const x=b.error.issues.find(T=>T.path[0]===p);x?g[p]=x.message:delete g[p]}i.value=g}function d(){n.value=Object.fromEntries(Object.keys(t).map(g=>[g,!0]));const p=e.safeParse(r.value);if(p.success)return i.value={},!0;const b={};for(const g of p.error.issues){const x=g.path[0];b[x]||(b[x]=g.message)}return i.value=b,!1}function f(){r.value={...t},i.value={},n.value={},a.value=!1,o.value=!1}return{values:r,errors:i,touched:n,submitting:o,submitted:a,isValid:s,set:c,touch:l,validate:d,reset:f}}(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","SignupForm"),e.textContent=`.sf-wrap {
  max-width: 560px;
  margin: 0 auto;
}

.sf-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem;
}

.sf-header {
  margin-bottom: 1.75rem;
}

.sf-header h2 {
  margin: 0 0 0.25rem;
}

.sf-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.sf-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.sf-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.sf-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.sf-input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-bg);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
}

.sf-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.sf-field--error .sf-input {
  border-color: var(--color-danger);
}

.sf-field--error .sf-input:focus {
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.12);
}

.sf-err {
  font-size: 0.8rem;
  color: var(--color-danger);
  font-weight: 500;
}

.sf-field--check {
  gap: 0.25rem;
}

.sf-check-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.sf-check-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.sf-btn {
  padding: 0.7rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  margin-top: 0.5rem;
}

.sf-btn--full { width: 100%; }
.sf-btn:hover { background: var(--color-primary-dark); }
.sf-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.sf-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
  gap: 1rem;
}

.sf-check {
  width: 64px;
  height: 64px;
  background: var(--color-success);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
}

.sf-success h3 { margin: 0; font-size: 1.25rem; }
.sf-success p  { margin: 0; color: var(--color-text-muted); }`,document.head.appendChild(e)})();const jv=ho({name:ve().min(2,"Name must be at least 2 characters"),age:dm({invalid_type_error:"Enter a valid age"}).min(18,"Must be at least 18").max(120,"Enter a valid age"),email:ve().email("Enter a valid email address"),password:ve().min(8,"Password must be at least 8 characters"),role:ve().min(1,"Please select a role"),terms:sr().refine(e=>e===!0,"You must accept the terms")}),Ov={name:"",age:"",email:"",password:"",role:"",terms:!1};class br extends _{constructor(){super(...arguments),this.form=pm(jv,Ov)}async submit(){this.form.validate()&&(this.form.submitting.value=!0,await new Promise(t=>setTimeout(t,1200)),this.form.submitting.value=!1,this.form.submitted.value=!0)}reset(){this.form.reset()}setTerms(t){this.form.set("terms",t),this.form.touch("terms")}}br.template=`<div class="sf-wrap">
    <div class="sf-card">

      <div @if="form.submitted.value" class="sf-success">
        <div class="sf-check">✓</div>
        <h3>Account created!</h3>
        <p>Welcome, <strong>{{form.values.value.name}}</strong>. You're all set.</p>
        <button @on:click="reset()" class="sf-btn sf-btn--full">Start over</button>
      </div>

      <div @else>
        <div class="sf-header">
          <h2>Create Account</h2>
          <p class="sf-subtitle">Schema validation powered by <strong>Zod</strong></p>
        </div>

        <form @on:submit.prevent="submit()" class="sf-form">

          <div class="sf-row">
            <div @class="'sf-field' + (form.errors.value.name && form.touched.value.name ? ' sf-field--error' : '')">
              <label>Full Name</label>
              <input type="text" class="sf-input"
                @value="form.values.value.name"
                placeholder="Jane Doe"
                @on:input="form.set('name', $event.target.value)"
                @on:blur="form.touch('name')"
              />
              <span @if="form.errors.value.name && form.touched.value.name" class="sf-err">{{form.errors.value.name}}</span>
            </div>

            <div @class="'sf-field' + (form.errors.value.age && form.touched.value.age ? ' sf-field--error' : '')">
              <label>Age</label>
              <input type="number" class="sf-input"
                @value="form.values.value.age"
                placeholder="25"
                @on:input="form.set('age', $event.target.value)"
                @on:blur="form.touch('age')"
              />
              <span @if="form.errors.value.age && form.touched.value.age" class="sf-err">{{form.errors.value.age}}</span>
            </div>
          </div>

          <div @class="'sf-field' + (form.errors.value.email && form.touched.value.email ? ' sf-field--error' : '')">
            <label>Email</label>
            <input type="email" class="sf-input"
              @value="form.values.value.email"
              placeholder="jane@example.com"
              @on:input="form.set('email', $event.target.value)"
              @on:blur="form.touch('email')"
            />
            <span @if="form.errors.value.email && form.touched.value.email" class="sf-err">{{form.errors.value.email}}</span>
          </div>

          <div @class="'sf-field' + (form.errors.value.password && form.touched.value.password ? ' sf-field--error' : '')">
            <label>Password</label>
            <input type="password" class="sf-input"
              placeholder="Min. 8 characters"
              @on:input="form.set('password', $event.target.value)"
              @on:blur="form.touch('password')"
            />
            <span @if="form.errors.value.password && form.touched.value.password" class="sf-err">{{form.errors.value.password}}</span>
          </div>

          <div @class="'sf-field' + (form.errors.value.role && form.touched.value.role ? ' sf-field--error' : '')">
            <label>Role</label>
            <select class="sf-input"
              @on:change="form.set('role', $event.target.value)"
              @on:blur="form.touch('role')"
            >
              <option value="">Select your role...</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </select>
            <span @if="form.errors.value.role && form.touched.value.role" class="sf-err">{{form.errors.value.role}}</span>
          </div>

          <div @class="'sf-field sf-field--check' + (form.errors.value.terms && form.touched.value.terms ? ' sf-field--error' : '')">
            <label class="sf-check-label">
              <input type="checkbox" @on:change="setTerms($event.target.checked)" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            <span @if="form.errors.value.terms && form.touched.value.terms" class="sf-err">{{form.errors.value.terms}}</span>
          </div>

          <button type="submit" class="sf-btn sf-btn--full" @disabled="form.submitting.value">
            {{form.submitting.value ? 'Creating account...' : 'Create Account'}}
          </button>

        </form>
      </div>

    </div>
  </div>`;br.$imports={Component:_,z:Pv,useForm:pm};function Uv(e,t,r){return Math.max(t,Math.min(r,e))}function Lt(e,t,r,i){return Uv(e+(Math.random()-.5)*t*2,r,i)}let Pr=42,jr=58,Or=1340,Ur=.6,Nr=95;async function Nv(){return Pr=Lt(Pr,6,5,98),Math.round(Pr)}async function Av(){return jr=Lt(jr,3,15,95),Math.round(jr)}async function Cv(){return Or=Lt(Or,150,50,4800),Math.round(Or)}async function Tv(){return Ur=Lt(Ur,.4,0,12),parseFloat(Ur.toFixed(1))}async function Rv(){return Nr=Lt(Nr,30,10,600),Math.round(Nr)}const mt=k(0),Wo=k(0),Xo=k(0),ft=k(0),Ho=k(0),yr=k(0),ht=k([]),mm=Oe(()=>mt.value>80||ft.value>5?"critical":mt.value>60||ft.value>2?"warning":"healthy"),Qa=["Health check passed","Cache hit rate 94%","DB connection pool healthy","Autoscaler: 3 instances running","TLS cert valid for 87 days"];let Zv=0;function Lv(e,t,r,i){let n="info",o;return r>5?(n="error",o=`Error rate critical: ${r}%`):e>80?(n="warn",o=`CPU high: ${e}%`):t>85?(n="warn",o=`Memory pressure: ${t}%`):i>400?(n="warn",o=`Latency spike: ${i}ms`):o=Qa[Math.floor(Math.random()*Qa.length)],{id:++Zv,time:new Date().toLocaleTimeString(),level:n,message:o}}let Xt=null;async function Ya(){const[e,t,r,i,n]=await Promise.all([Nv(),Av(),Cv(),Tv(),Rv()]);Le(()=>{mt.value=e,Wo.value=t,Xo.value=r,ft.value=i,Ho.value=n,yr.value+=2,ht.value=[Lv(e,t,i,n),...ht.value].slice(0,12)})}function fm(){Qo(),yr.value=0,ht.value=[],Ya(),Xt=setInterval(Ya,2e3)}function Qo(){Xt!==null&&(clearInterval(Xt),Xt=null)}(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","Dashboard"),e.textContent=`.db-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.db-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.db-title  { margin: 0 0 0.25rem; }
.db-subtitle {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.db-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.db-uptime {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.db-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.db-badge--healthy  { background: #d1fae5; color: #065f46; }
.db-badge--warning  { background: #fef3c7; color: #92400e; }
.db-badge--critical { background: #fee2e2; color: #991b1b; }

.db-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.db-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.db-card-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.db-card-row {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.db-big-num {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.6s ease;
}

.db-big-num--primary { color: var(--color-primary); }

.db-unit {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.db-bar {
  height: 6px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
  margin-top: auto;
}

.db-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1.2s ease, background 0.6s ease;
}

.db-bar-fill--primary { background: var(--color-primary); }

.db-log {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.db-log-header {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 700;
  font-size: 0.875rem;
}

.db-log-body {
  max-height: 260px;
  overflow-y: auto;
}

.db-event {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
}

.db-event:last-child { border-bottom: none; }

.db-event-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.db-event--info  .db-event-dot { background: var(--color-info); }
.db-event--warn  .db-event-dot { background: var(--color-warning); }
.db-event--error .db-event-dot { background: var(--color-danger); }

.db-event-time {
  font-family: monospace;
  color: var(--color-text-muted);
  flex-shrink: 0;
  font-size: 0.75rem;
}

.db-event-msg { color: var(--color-text); }

.db-event-empty {
  padding: 1.5rem 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}`,document.head.appendChild(e)})();class $r extends _{constructor(){super(...arguments),this.cpu=mt,this.memory=Wo,this.requests=Xo,this.errorRate=ft,this.latency=Ho,this.uptime=yr,this.events=ht,this.status=mm}onMount(){fm()}onDestroy(){Qo()}formatUptime(t){const r=Math.floor(t/3600),i=Math.floor(t%3600/60),n=t%60;return[r,i,n].map(o=>String(o).padStart(2,"0")).join(":")}barColor(t,r,i){return t>=i?"var(--color-danger)":t>=r?"var(--color-warning)":"var(--color-success)"}}$r.template=`<div class="db-wrap">

    <div class="db-header">
      <div>
        <h2 class="db-title">System Dashboard</h2>
        <p class="db-subtitle">Live metrics · 5 independent APIs · updated every 2s</p>
      </div>
      <div class="db-header-right">
        <span class="db-uptime">⬆ {{formatUptime(uptime.value)}}</span>
        <span @class="'db-badge db-badge--' + status.value">{{status.value}}</span>
      </div>
    </div>

    <div class="db-grid">

      <div class="db-card">
        <span class="db-card-label">CPU Usage</span>
        <div class="db-card-row">
          <span class="db-big-num">{{cpu.value}}</span>
          <span class="db-unit">%</span>
        </div>
        <div class="db-bar">
          <div class="db-bar-fill" @style="{ width: cpu.value + '%', background: barColor(cpu.value, 60, 80) }"></div>
        </div>
      </div>

      <div class="db-card">
        <span class="db-card-label">Memory Usage</span>
        <div class="db-card-row">
          <span class="db-big-num">{{memory.value}}</span>
          <span class="db-unit">%</span>
        </div>
        <div class="db-bar">
          <div class="db-bar-fill" @style="{ width: memory.value + '%', background: barColor(memory.value, 70, 85) }"></div>
        </div>
      </div>

      <div class="db-card">
        <span class="db-card-label">Request Rate</span>
        <div class="db-card-row">
          <span class="db-big-num db-big-num--primary">{{requests.value}}</span>
          <span class="db-unit">req/s</span>
        </div>
        <div class="db-bar">
          <div class="db-bar-fill db-bar-fill--primary" @style="{ width: (requests.value / 4800 * 100) + '%' }"></div>
        </div>
      </div>

      <div class="db-card">
        <span class="db-card-label">Error Rate</span>
        <div class="db-card-row">
          <span class="db-big-num" @style="{ color: barColor(errorRate.value, 2, 5) }">{{errorRate.value}}</span>
          <span class="db-unit">%</span>
        </div>
        <div class="db-bar">
          <div class="db-bar-fill" @style="{ width: (errorRate.value / 12 * 100) + '%', background: barColor(errorRate.value, 2, 5) }"></div>
        </div>
      </div>

      <div class="db-card">
        <span class="db-card-label">Avg Latency</span>
        <div class="db-card-row">
          <span class="db-big-num" @style="{ color: barColor(latency.value, 200, 400) }">{{latency.value}}</span>
          <span class="db-unit">ms</span>
        </div>
        <div class="db-bar">
          <div class="db-bar-fill" @style="{ width: (latency.value / 600 * 100) + '%', background: barColor(latency.value, 200, 400) }"></div>
        </div>
      </div>

    </div>

    <div class="db-log">
      <div class="db-log-header">Event Log</div>
      <div class="db-log-body">
        <div @each="event of events.value" @key="event.id" @class="'db-event db-event--' + event.level">
          <div class="db-event-dot"></div>
          <span class="db-event-time">{{event.time}}</span>
          <span class="db-event-msg">{{event.message}}</span>
        </div>
        <div @if="!events.value.length" class="db-event-empty">Waiting for data...</div>
      </div>
    </div>

  </div>`;$r.$imports={Component:_,cpu:mt,memory:Wo,requests:Xo,errorRate:ft,latency:Ho,uptime:yr,events:ht,status:mm,startPolling:fm,stopPolling:Qo};function Yo(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ae=Yo();function hm(e){Ae=e}var we={exec:()=>null};function D(e,t=""){let r=typeof e=="string"?e:e.source,i={replace:(n,o)=>{let a=typeof o=="string"?o:o.source;return a=a.replace(W.caret,"$1"),r=r.replace(n,a),i},getRegex:()=>new RegExp(r,t)};return i}var Fv=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),W={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},Mv=/^(?:[ \t]*(?:\n|$))+/,Kv=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,qv=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ft=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Jv=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ea=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,gm=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,vm=D(gm).replace(/bull/g,ea).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Bv=D(gm).replace(/bull/g,ea).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ta=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Gv=/^[^\n]+/,na=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Vv=D(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",na).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Wv=D(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ea).getRegex(),kr="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ra=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Xv=D("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ra).replace("tag",kr).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),bm=D(ta).replace("hr",Ft).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",kr).getRegex(),Hv=D(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",bm).getRegex(),ia={blockquote:Hv,code:Kv,def:Vv,fences:qv,heading:Jv,hr:Ft,html:Xv,lheading:vm,list:Wv,newline:Mv,paragraph:bm,table:we,text:Gv},es=D("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ft).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",kr).getRegex(),Qv={...ia,lheading:Bv,table:es,paragraph:D(ta).replace("hr",Ft).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",es).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",kr).getRegex()},Yv={...ia,html:D(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ra).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:we,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:D(ta).replace("hr",Ft).replace("heading",` *#{1,6} *[^
]`).replace("lheading",vm).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},eb=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,tb=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ym=/^( {2,}|\\)\n(?!\s*$)/,nb=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,xr=/[\p{P}\p{S}]/u,oa=/[\s\p{P}\p{S}]/u,$m=/[^\s\p{P}\p{S}]/u,rb=D(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,oa).getRegex(),km=/(?!~)[\p{P}\p{S}]/u,ib=/(?!~)[\s\p{P}\p{S}]/u,ob=/(?:[^\s\p{P}\p{S}]|~)/u,xm=/(?![*_])[\p{P}\p{S}]/u,ab=/(?![*_])[\s\p{P}\p{S}]/u,sb=/(?:[^\s\p{P}\p{S}]|[*_])/u,lb=D(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Fv?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),_m=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,cb=D(_m,"u").replace(/punct/g,xr).getRegex(),ub=D(_m,"u").replace(/punct/g,km).getRegex(),wm="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",db=D(wm,"gu").replace(/notPunctSpace/g,$m).replace(/punctSpace/g,oa).replace(/punct/g,xr).getRegex(),pb=D(wm,"gu").replace(/notPunctSpace/g,ob).replace(/punctSpace/g,ib).replace(/punct/g,km).getRegex(),mb=D("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,$m).replace(/punctSpace/g,oa).replace(/punct/g,xr).getRegex(),fb=D(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,xm).getRegex(),hb="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",gb=D(hb,"gu").replace(/notPunctSpace/g,sb).replace(/punctSpace/g,ab).replace(/punct/g,xm).getRegex(),vb=D(/\\(punct)/,"gu").replace(/punct/g,xr).getRegex(),bb=D(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),yb=D(ra).replace("(?:-->|$)","-->").getRegex(),$b=D("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",yb).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),sn=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,kb=D(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",sn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Sm=D(/^!?\[(label)\]\[(ref)\]/).replace("label",sn).replace("ref",na).getRegex(),zm=D(/^!?\[(ref)\](?:\[\])?/).replace("ref",na).getRegex(),xb=D("reflink|nolink(?!\\()","g").replace("reflink",Sm).replace("nolink",zm).getRegex(),ts=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,aa={_backpedal:we,anyPunctuation:vb,autolink:bb,blockSkip:lb,br:ym,code:tb,del:we,delLDelim:we,delRDelim:we,emStrongLDelim:cb,emStrongRDelimAst:db,emStrongRDelimUnd:mb,escape:eb,link:kb,nolink:zm,punctuation:rb,reflink:Sm,reflinkSearch:xb,tag:$b,text:nb,url:we},_b={...aa,link:D(/^!?\[(label)\]\((.*?)\)/).replace("label",sn).getRegex(),reflink:D(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",sn).getRegex()},Vr={...aa,emStrongRDelimAst:pb,emStrongLDelim:ub,delLDelim:fb,delRDelim:gb,url:D(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",ts).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:D(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",ts).getRegex()},wb={...Vr,br:D(ym).replace("{2,}","*").getRegex(),text:D(Vr.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Gt={normal:ia,gfm:Qv,pedantic:Yv},tt={normal:aa,gfm:Vr,breaks:wb,pedantic:_b},Sb={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ns=e=>Sb[e];function ce(e,t){if(t){if(W.escapeTest.test(e))return e.replace(W.escapeReplace,ns)}else if(W.escapeTestNoEncode.test(e))return e.replace(W.escapeReplaceNoEncode,ns);return e}function rs(e){try{e=encodeURI(e).replace(W.percentDecode,"%")}catch{return null}return e}function is(e,t){var o;let r=e.replace(W.findPipe,(a,s,c)=>{let l=!1,u=s;for(;--u>=0&&c[u]==="\\";)l=!l;return l?"|":" |"}),i=r.split(W.splitPipe),n=0;if(i[0].trim()||i.shift(),i.length>0&&!((o=i.at(-1))!=null&&o.trim())&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;n<i.length;n++)i[n]=i[n].trim().replace(W.slashPipe,"|");return i}function nt(e,t,r){let i=e.length;if(i===0)return"";let n=0;for(;n<i&&e.charAt(i-n-1)===t;)n++;return e.slice(0,i-n)}function zb(e,t){if(e.indexOf(t[1])===-1)return-1;let r=0;for(let i=0;i<e.length;i++)if(e[i]==="\\")i++;else if(e[i]===t[0])r++;else if(e[i]===t[1]&&(r--,r<0))return i;return r>0?-2:-1}function Ib(e,t=0){let r=t,i="";for(let n of e)if(n==="	"){let o=4-r%4;i+=" ".repeat(o),r+=o}else i+=n,r++;return i}function os(e,t,r,i,n){let o=t.href,a=t.title||null,s=e[1].replace(n.other.outputLinkReplace,"$1");i.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:r,href:o,title:a,text:s,tokens:i.inlineTokens(s)};return i.state.inLink=!1,c}function Eb(e,t,r){let i=e.match(r.other.indentCodeCompensation);if(i===null)return t;let n=i[1];return t.split(`
`).map(o=>{let a=o.match(r.other.beginningSpace);if(a===null)return o;let[s]=a;return s.length>=n.length?o.slice(n.length):o}).join(`
`)}var ln=class{constructor(e){U(this,"options");U(this,"rules");U(this,"lexer");this.options=e||Ae}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let r=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?r:nt(r,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let r=t[0],i=Eb(r,t[3]||"",this.rules);return{type:"code",raw:r,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let r=t[2].trim();if(this.rules.other.endingHash.test(r)){let i=nt(r,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(r=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:nt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let r=nt(t[0],`
`).split(`
`),i="",n="",o=[];for(;r.length>0;){let a=!1,s=[],c;for(c=0;c<r.length;c++)if(this.rules.other.blockquoteStart.test(r[c]))s.push(r[c]),a=!0;else if(!a)s.push(r[c]);else break;r=r.slice(c);let l=s.join(`
`),u=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${l}`:l,n=n?`${n}
${u}`:u;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,o,!0),this.lexer.state.top=d,r.length===0)break;let f=o.at(-1);if((f==null?void 0:f.type)==="code")break;if((f==null?void 0:f.type)==="blockquote"){let p=f,b=p.raw+`
`+r.join(`
`),g=this.blockquote(b);o[o.length-1]=g,i=i.substring(0,i.length-p.raw.length)+g.raw,n=n.substring(0,n.length-p.text.length)+g.text;break}else if((f==null?void 0:f.type)==="list"){let p=f,b=p.raw+`
`+r.join(`
`),g=this.list(b);o[o.length-1]=g,i=i.substring(0,i.length-f.raw.length)+g.raw,n=n.substring(0,n.length-p.raw.length)+g.raw,r=b.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:n}}}list(e){var r,i;let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),o=n.length>1,a={type:"list",raw:"",ordered:o,start:o?+n.slice(0,-1):"",loose:!1,items:[]};n=o?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=o?n:"[*+-]");let s=this.rules.other.listItemRegex(n),c=!1;for(;e;){let u=!1,d="",f="";if(!(t=s.exec(e))||this.rules.block.hr.test(e))break;d=t[0],e=e.substring(d.length);let p=Ib(t[2].split(`
`,1)[0],t[1].length),b=e.split(`
`,1)[0],g=!p.trim(),x=0;if(this.options.pedantic?(x=2,f=p.trimStart()):g?x=t[1].length+1:(x=p.search(this.rules.other.nonSpaceChar),x=x>4?1:x,f=p.slice(x),x+=t[1].length),g&&this.rules.other.blankLine.test(b)&&(d+=b+`
`,e=e.substring(b.length+1),u=!0),!u){let T=this.rules.other.nextBulletRegex(x),P=this.rules.other.hrRegex(x),B=this.rules.other.fencesBeginRegex(x),M=this.rules.other.headingBeginRegex(x),Z=this.rules.other.htmlBeginRegex(x),F=this.rules.other.blockquoteBeginRegex(x);for(;e;){let G=e.split(`
`,1)[0],X;if(b=G,this.options.pedantic?(b=b.replace(this.rules.other.listReplaceNesting,"  "),X=b):X=b.replace(this.rules.other.tabCharGlobal,"    "),B.test(b)||M.test(b)||Z.test(b)||F.test(b)||T.test(b)||P.test(b))break;if(X.search(this.rules.other.nonSpaceChar)>=x||!b.trim())f+=`
`+X.slice(x);else{if(g||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||B.test(p)||M.test(p)||P.test(p))break;f+=`
`+b}g=!b.trim(),d+=G+`
`,e=e.substring(G.length+1),p=X.slice(x)}}a.loose||(c?a.loose=!0:this.rules.other.doubleBlankLine.test(d)&&(c=!0)),a.items.push({type:"list_item",raw:d,task:!!this.options.gfm&&this.rules.other.listIsTask.test(f),loose:!1,text:f,tokens:[]}),a.raw+=d}let l=a.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let u of a.items){if(this.lexer.state.top=!1,u.tokens=this.lexer.blockTokens(u.text,[]),u.task){if(u.text=u.text.replace(this.rules.other.listReplaceTask,""),((r=u.tokens[0])==null?void 0:r.type)==="text"||((i=u.tokens[0])==null?void 0:i.type)==="paragraph"){u.tokens[0].raw=u.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),u.tokens[0].text=u.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let f=this.lexer.inlineQueue.length-1;f>=0;f--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)){this.lexer.inlineQueue[f].src=this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask,"");break}}let d=this.rules.other.listTaskCheckbox.exec(u.raw);if(d){let f={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};u.checked=f.checked,a.loose?u.tokens[0]&&["paragraph","text"].includes(u.tokens[0].type)&&"tokens"in u.tokens[0]&&u.tokens[0].tokens?(u.tokens[0].raw=f.raw+u.tokens[0].raw,u.tokens[0].text=f.raw+u.tokens[0].text,u.tokens[0].tokens.unshift(f)):u.tokens.unshift({type:"paragraph",raw:f.raw,text:f.raw,tokens:[f]}):u.tokens.unshift(f)}}if(!a.loose){let d=u.tokens.filter(p=>p.type==="space"),f=d.length>0&&d.some(p=>this.rules.other.anyLine.test(p.raw));a.loose=f}}if(a.loose)for(let u of a.items){u.loose=!0;for(let d of u.tokens)d.type==="text"&&(d.type="paragraph")}return a}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let r=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:r,raw:t[0],href:i,title:n}}}table(e){var a;let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let r=is(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=(a=t[3])!=null&&a.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(r.length===i.length){for(let s of i)this.rules.other.tableAlignRight.test(s)?o.align.push("right"):this.rules.other.tableAlignCenter.test(s)?o.align.push("center"):this.rules.other.tableAlignLeft.test(s)?o.align.push("left"):o.align.push(null);for(let s=0;s<r.length;s++)o.header.push({text:r[s],tokens:this.lexer.inline(r[s]),header:!0,align:o.align[s]});for(let s of n)o.rows.push(is(s,o.header.length).map((c,l)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:o.align[l]})));return o}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let r=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:r,tokens:this.lexer.inline(r)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let r=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let o=nt(r.slice(0,-1),"\\");if((r.length-o.length)%2===0)return}else{let o=zb(t[2],"()");if(o===-2)return;if(o>-1){let a=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let i=t[2],n="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],n=o[3])}else n=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?i=i.slice(1):i=i.slice(1,-1)),os(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let r;if((r=this.rules.inline.reflink.exec(e))||(r=this.rules.inline.nolink.exec(e))){let i=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=t[i.toLowerCase()];if(!n){let o=r[0].charAt(0);return{type:"text",raw:o,text:o}}return os(r,n,r[0],this.lexer,this.rules)}}emStrong(e,t,r=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!(!i||i[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...i[0]].length-1,o,a,s=n,c=0,l=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+n);(i=l.exec(t))!=null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o)continue;if(a=[...o].length,i[3]||i[4]){s+=a;continue}else if((i[5]||i[6])&&n%3&&!((n+a)%3)){c+=a;continue}if(s-=a,s>0)continue;a=Math.min(a,a+s+c);let u=[...i[0]][0].length,d=e.slice(0,n+i.index+u+a);if(Math.min(n,a)%2){let p=d.slice(1,-1);return{type:"em",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}let f=d.slice(2,-2);return{type:"strong",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let r=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return i&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:t[0],text:r}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,r=""){let i=this.rules.inline.delLDelim.exec(e);if(i&&(!i[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...i[0]].length-1,o,a,s=n,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(i=c.exec(t))!=null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o||(a=[...o].length,a!==n))continue;if(i[3]||i[4]){s+=a;continue}if(s-=a,s>0)continue;a=Math.min(a,a+s);let l=[...i[0]][0].length,u=e.slice(0,n+i.index+l+a),d=u.slice(n,-n);return{type:"del",raw:u,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let r,i;return t[2]==="@"?(r=t[1],i="mailto:"+r):(r=t[1],i=r),{type:"link",raw:t[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}url(e){var r;let t;if(t=this.rules.inline.url.exec(e)){let i,n;if(t[2]==="@")i=t[0],n="mailto:"+i;else{let o;do o=t[0],t[0]=((r=this.rules.inline._backpedal.exec(t[0]))==null?void 0:r[0])??"";while(o!==t[0]);i=t[0],t[1]==="www."?n="http://"+t[0]:n=t[0]}return{type:"link",raw:t[0],text:i,href:n,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let r=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:r}}}},ae=class Wr{constructor(t){U(this,"tokens");U(this,"options");U(this,"state");U(this,"inlineQueue");U(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Ae,this.options.tokenizer=this.options.tokenizer||new ln,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:W,block:Gt.normal,inline:tt.normal};this.options.pedantic?(r.block=Gt.pedantic,r.inline=tt.pedantic):this.options.gfm&&(r.block=Gt.gfm,this.options.breaks?r.inline=tt.breaks:r.inline=tt.gfm),this.tokenizer.rules=r}static get rules(){return{block:Gt,inline:tt}}static lex(t,r){return new Wr(r).lex(t)}static lexInline(t,r){return new Wr(r).inlineTokens(t)}lex(t){t=t.replace(W.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let i=this.inlineQueue[r];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,r=[],i=!1){var n,o,a;for(this.options.pedantic&&(t=t.replace(W.tabCharGlobal,"    ").replace(W.spaceLine,""));t;){let s;if((o=(n=this.options.extensions)==null?void 0:n.block)!=null&&o.some(l=>(s=l.call({lexer:this},t,r))?(t=t.substring(s.raw.length),r.push(s),!0):!1))continue;if(s=this.tokenizer.space(t)){t=t.substring(s.raw.length);let l=r.at(-1);s.raw.length===1&&l!==void 0?l.raw+=`
`:r.push(s);continue}if(s=this.tokenizer.code(t)){t=t.substring(s.raw.length);let l=r.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=(l.raw.endsWith(`
`)?"":`
`)+s.raw,l.text+=`
`+s.text,this.inlineQueue.at(-1).src=l.text):r.push(s);continue}if(s=this.tokenizer.fences(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.heading(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.hr(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.blockquote(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.list(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.html(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.def(t)){t=t.substring(s.raw.length);let l=r.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=(l.raw.endsWith(`
`)?"":`
`)+s.raw,l.text+=`
`+s.raw,this.inlineQueue.at(-1).src=l.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title},r.push(s));continue}if(s=this.tokenizer.table(t)){t=t.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.lheading(t)){t=t.substring(s.raw.length),r.push(s);continue}let c=t;if((a=this.options.extensions)!=null&&a.startBlock){let l=1/0,u=t.slice(1),d;this.options.extensions.startBlock.forEach(f=>{d=f.call({lexer:this},u),typeof d=="number"&&d>=0&&(l=Math.min(l,d))}),l<1/0&&l>=0&&(c=t.substring(0,l+1))}if(this.state.top&&(s=this.tokenizer.paragraph(c))){let l=r.at(-1);i&&(l==null?void 0:l.type)==="paragraph"?(l.raw+=(l.raw.endsWith(`
`)?"":`
`)+s.raw,l.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):r.push(s),i=c.length!==t.length,t=t.substring(s.raw.length);continue}if(s=this.tokenizer.text(t)){t=t.substring(s.raw.length);let l=r.at(-1);(l==null?void 0:l.type)==="text"?(l.raw+=(l.raw.endsWith(`
`)?"":`
`)+s.raw,l.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):r.push(s);continue}if(t){let l="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return this.state.top=!0,r}inline(t,r=[]){return this.inlineQueue.push({src:t,tokens:r}),r}inlineTokens(t,r=[]){var c,l,u,d,f;let i=t,n=null;if(this.tokens.links){let p=Object.keys(this.tokens.links);if(p.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)p.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,n.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let o;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)o=n[2]?n[2].length:0,i=i.slice(0,n.index+o)+"["+"a".repeat(n[0].length-o-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=((l=(c=this.options.hooks)==null?void 0:c.emStrongMask)==null?void 0:l.call({lexer:this},i))??i;let a=!1,s="";for(;t;){a||(s=""),a=!1;let p;if((d=(u=this.options.extensions)==null?void 0:u.inline)!=null&&d.some(g=>(p=g.call({lexer:this},t,r))?(t=t.substring(p.raw.length),r.push(p),!0):!1))continue;if(p=this.tokenizer.escape(t)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.tag(t)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.link(t)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(p.raw.length);let g=r.at(-1);p.type==="text"&&(g==null?void 0:g.type)==="text"?(g.raw+=p.raw,g.text+=p.text):r.push(p);continue}if(p=this.tokenizer.emStrong(t,i,s)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.codespan(t)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.br(t)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.del(t,i,s)){t=t.substring(p.raw.length),r.push(p);continue}if(p=this.tokenizer.autolink(t)){t=t.substring(p.raw.length),r.push(p);continue}if(!this.state.inLink&&(p=this.tokenizer.url(t))){t=t.substring(p.raw.length),r.push(p);continue}let b=t;if((f=this.options.extensions)!=null&&f.startInline){let g=1/0,x=t.slice(1),T;this.options.extensions.startInline.forEach(P=>{T=P.call({lexer:this},x),typeof T=="number"&&T>=0&&(g=Math.min(g,T))}),g<1/0&&g>=0&&(b=t.substring(0,g+1))}if(p=this.tokenizer.inlineText(b)){t=t.substring(p.raw.length),p.raw.slice(-1)!=="_"&&(s=p.raw.slice(-1)),a=!0;let g=r.at(-1);(g==null?void 0:g.type)==="text"?(g.raw+=p.raw,g.text+=p.text):r.push(p);continue}if(t){let g="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(g);break}else throw new Error(g)}}return r}},cn=class{constructor(e){U(this,"options");U(this,"parser");this.options=e||Ae}space(e){return""}code({text:e,lang:t,escaped:r}){var o;let i=(o=(t||"").match(W.notSpaceStart))==null?void 0:o[0],n=e.replace(W.endingNewline,"")+`
`;return i?'<pre><code class="language-'+ce(i)+'">'+(r?n:ce(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:ce(n,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,r=e.start,i="";for(let a=0;a<e.items.length;a++){let s=e.items[a];i+=this.listitem(s)}let n=t?"ol":"ul",o=t&&r!==1?' start="'+r+'"':"";return"<"+n+o+`>
`+i+"</"+n+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",r="";for(let n=0;n<e.header.length;n++)r+=this.tablecell(e.header[n]);t+=this.tablerow({text:r});let i="";for(let n=0;n<e.rows.length;n++){let o=e.rows[n];r="";for(let a=0;a<o.length;a++)r+=this.tablecell(o[a]);i+=this.tablerow({text:r})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),r=e.header?"th":"td";return(e.align?`<${r} align="${e.align}">`:`<${r}>`)+t+`</${r}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ce(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:r}){let i=this.parser.parseInline(r),n=rs(e);if(n===null)return i;e=n;let o='<a href="'+e+'"';return t&&(o+=' title="'+ce(t)+'"'),o+=">"+i+"</a>",o}image({href:e,title:t,text:r,tokens:i}){i&&(r=this.parser.parseInline(i,this.parser.textRenderer));let n=rs(e);if(n===null)return ce(r);e=n;let o=`<img src="${e}" alt="${ce(r)}"`;return t&&(o+=` title="${ce(t)}"`),o+=">",o}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ce(e.text)}},sa=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},se=class Xr{constructor(t){U(this,"options");U(this,"renderer");U(this,"textRenderer");this.options=t||Ae,this.options.renderer=this.options.renderer||new cn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new sa}static parse(t,r){return new Xr(r).parse(t)}static parseInline(t,r){return new Xr(r).parseInline(t)}parse(t){var i,n;let r="";for(let o=0;o<t.length;o++){let a=t[o];if((n=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&n[a.type]){let c=a,l=this.options.extensions.renderers[c.type].call({parser:this},c);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(c.type)){r+=l||"";continue}}let s=a;switch(s.type){case"space":{r+=this.renderer.space(s);break}case"hr":{r+=this.renderer.hr(s);break}case"heading":{r+=this.renderer.heading(s);break}case"code":{r+=this.renderer.code(s);break}case"table":{r+=this.renderer.table(s);break}case"blockquote":{r+=this.renderer.blockquote(s);break}case"list":{r+=this.renderer.list(s);break}case"checkbox":{r+=this.renderer.checkbox(s);break}case"html":{r+=this.renderer.html(s);break}case"def":{r+=this.renderer.def(s);break}case"paragraph":{r+=this.renderer.paragraph(s);break}case"text":{r+=this.renderer.text(s);break}default:{let c='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return r}parseInline(t,r=this.renderer){var n,o;let i="";for(let a=0;a<t.length;a++){let s=t[a];if((o=(n=this.options.extensions)==null?void 0:n.renderers)!=null&&o[s.type]){let l=this.options.extensions.renderers[s.type].call({parser:this},s);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){i+=l||"";continue}}let c=s;switch(c.type){case"escape":{i+=r.text(c);break}case"html":{i+=r.html(c);break}case"link":{i+=r.link(c);break}case"image":{i+=r.image(c);break}case"checkbox":{i+=r.checkbox(c);break}case"strong":{i+=r.strong(c);break}case"em":{i+=r.em(c);break}case"codespan":{i+=r.codespan(c);break}case"br":{i+=r.br(c);break}case"del":{i+=r.del(c);break}case"text":{i+=r.text(c);break}default:{let l='Token with "'+c.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return i}},Vt,it=(Vt=class{constructor(e){U(this,"options");U(this,"block");this.options=e||Ae}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?ae.lex:ae.lexInline}provideParser(){return this.block?se.parse:se.parseInline}},U(Vt,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),U(Vt,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Vt),Db=class{constructor(...e){U(this,"defaults",Yo());U(this,"options",this.setOptions);U(this,"parse",this.parseMarkdown(!0));U(this,"parseInline",this.parseMarkdown(!1));U(this,"Parser",se);U(this,"Renderer",cn);U(this,"TextRenderer",sa);U(this,"Lexer",ae);U(this,"Tokenizer",ln);U(this,"Hooks",it);this.use(...e)}walkTokens(e,t){var i,n;let r=[];for(let o of e)switch(r=r.concat(t.call(this,o)),o.type){case"table":{let a=o;for(let s of a.header)r=r.concat(this.walkTokens(s.tokens,t));for(let s of a.rows)for(let c of s)r=r.concat(this.walkTokens(c.tokens,t));break}case"list":{let a=o;r=r.concat(this.walkTokens(a.items,t));break}default:{let a=o;(n=(i=this.defaults.extensions)==null?void 0:i.childTokens)!=null&&n[a.type]?this.defaults.extensions.childTokens[a.type].forEach(s=>{let c=a[s].flat(1/0);r=r.concat(this.walkTokens(c,t))}):a.tokens&&(r=r.concat(this.walkTokens(a.tokens,t)))}}return r}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(r=>{let i={...r};if(i.async=this.defaults.async||i.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let o=t.renderers[n.name];o?t.renderers[n.name]=function(...a){let s=n.renderer.apply(this,a);return s===!1&&(s=o.apply(this,a)),s}:t.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=t[n.level];o?o.unshift(n.tokenizer):t[n.level]=[n.tokenizer],n.start&&(n.level==="block"?t.startBlock?t.startBlock.push(n.start):t.startBlock=[n.start]:n.level==="inline"&&(t.startInline?t.startInline.push(n.start):t.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(t.childTokens[n.name]=n.childTokens)}),i.extensions=t),r.renderer){let n=this.defaults.renderer||new cn(this.defaults);for(let o in r.renderer){if(!(o in n))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let a=o,s=r.renderer[a],c=n[a];n[a]=(...l)=>{let u=s.apply(n,l);return u===!1&&(u=c.apply(n,l)),u||""}}i.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new ln(this.defaults);for(let o in r.tokenizer){if(!(o in n))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let a=o,s=r.tokenizer[a],c=n[a];n[a]=(...l)=>{let u=s.apply(n,l);return u===!1&&(u=c.apply(n,l)),u}}i.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new it;for(let o in r.hooks){if(!(o in n))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let a=o,s=r.hooks[a],c=n[a];it.passThroughHooks.has(o)?n[a]=l=>{if(this.defaults.async&&it.passThroughHooksRespectAsync.has(o))return(async()=>{let d=await s.call(n,l);return c.call(n,d)})();let u=s.call(n,l);return c.call(n,u)}:n[a]=(...l)=>{if(this.defaults.async)return(async()=>{let d=await s.apply(n,l);return d===!1&&(d=await c.apply(n,l)),d})();let u=s.apply(n,l);return u===!1&&(u=c.apply(n,l)),u}}i.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,o=r.walkTokens;i.walkTokens=function(a){let s=[];return s.push(o.call(this,a)),n&&(s=s.concat(n.call(this,a))),s}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return ae.lex(e,t??this.defaults)}parser(e,t){return se.parse(e,t??this.defaults)}parseMarkdown(e){return(t,r)=>{let i={...r},n={...this.defaults,...i},o=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&i.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=e),n.async)return(async()=>{let a=n.hooks?await n.hooks.preprocess(t):t,s=await(n.hooks?await n.hooks.provideLexer():e?ae.lex:ae.lexInline)(a,n),c=n.hooks?await n.hooks.processAllTokens(s):s;n.walkTokens&&await Promise.all(this.walkTokens(c,n.walkTokens));let l=await(n.hooks?await n.hooks.provideParser():e?se.parse:se.parseInline)(c,n);return n.hooks?await n.hooks.postprocess(l):l})().catch(o);try{n.hooks&&(t=n.hooks.preprocess(t));let a=(n.hooks?n.hooks.provideLexer():e?ae.lex:ae.lexInline)(t,n);n.hooks&&(a=n.hooks.processAllTokens(a)),n.walkTokens&&this.walkTokens(a,n.walkTokens);let s=(n.hooks?n.hooks.provideParser():e?se.parse:se.parseInline)(a,n);return n.hooks&&(s=n.hooks.postprocess(s)),s}catch(a){return o(a)}}}onError(e,t){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let i="<p>An error occurred:</p><pre>"+ce(r.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(r);throw r}}},je=new Db;function O(e,t){return je.parse(e,t)}O.options=O.setOptions=function(e){return je.setOptions(e),O.defaults=je.defaults,hm(O.defaults),O};O.getDefaults=Yo;O.defaults=Ae;O.use=function(...e){return je.use(...e),O.defaults=je.defaults,hm(O.defaults),O};O.walkTokens=function(e,t){return je.walkTokens(e,t)};O.parseInline=je.parseInline;O.Parser=se;O.parser=se.parse;O.Renderer=cn;O.TextRenderer=sa;O.Lexer=ae;O.lexer=ae.lex;O.Tokenizer=ln;O.Hooks=it;O.parse=O;O.options;O.setOptions;O.use;O.walkTokens;O.parseInline;se.parse;ae.lex;(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","MarkdownEditor"),e.textContent=`.md-wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem);
  gap: 1rem;
}

.md-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-shrink: 0;
}

.md-title { margin: 0; }

.md-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.md-panes {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.md-divider {
  background: var(--color-border);
}

.md-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.md-pane-label {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.md-editor {
  flex: 1;
  padding: 1.25rem;
  border: none;
  outline: none;
  resize: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-text);
  background: var(--color-bg);
  min-height: 0;
}

.md-preview {
  flex: 1;
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  min-height: 0;
}

/* Prose styles for rendered markdown */
.prose { line-height: 1.7; color: var(--color-text); }
.prose h1, .prose h2, .prose h3 { margin: 1.25rem 0 0.5rem; color: #0f172a; line-height: 1.3; }
.prose h1 { font-size: 1.6rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.4rem; }
.prose h2 { font-size: 1.25rem; }
.prose h3 { font-size: 1rem; }
.prose p  { margin: 0.75rem 0; }
.prose ul, .prose ol { margin: 0.75rem 0; padding-left: 1.5rem; }
.prose li { margin: 0.25rem 0; }
.prose a  { color: var(--color-primary); text-decoration: underline; }
.prose strong { font-weight: 700; }
.prose em { font-style: italic; }
.prose code {
  background: #f1f5f9;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875em;
}
.prose pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
}
.prose pre code { background: none; padding: 0; color: inherit; font-size: 0.85rem; }
.prose blockquote {
  border-left: 3px solid var(--color-primary);
  margin: 1rem 0;
  padding: 0.25rem 1rem;
  color: var(--color-text-muted);
  background: #f8fafc;
  border-radius: 0 6px 6px 0;
}
.prose hr { border: none; border-top: 1px solid var(--color-border); margin: 1.5rem 0; }`,document.head.appendChild(e)})();const Pb=`# Welcome to Kasper Markdown Editor

Write **Markdown** on the left, see the *live preview* on the right.

## Features

- Reactive preview powered by [kasper-js](https://kasperjs.top) signals
- Parsed by [marked](https://marked.js.org) — zero dependencies
- Word and character count update as you type

## Code

Inline \`code\` and fenced blocks work too:

\`\`\`ts
const greeting = signal('hello');
effect(() => console.log(greeting.value));
greeting.value = 'world'; // logs: world
\`\`\`

> Signals are just values. No magic, no ceremony.

---

Start editing to see changes instantly.
`;class _r extends _{constructor(){super(...arguments),this.source=k(Pb),this.wordCount=this.computed(()=>this.source.value.trim()===""?0:this.source.value.trim().split(/\s+/).length),this.charCount=this.computed(()=>this.source.value.length)}onMount(){this.effect(()=>{this.previewEl.innerHTML=O(this.source.value)})}}_r.template=`<div class="md-wrap">

    <div class="md-header">
      <h2 class="md-title">Markdown Editor</h2>
      <div class="md-stats">
        <span>{{wordCount.value}} words</span>
        <span>{{charCount.value}} chars</span>
      </div>
    </div>

    <div class="md-panes">

      <div class="md-pane">
        <div class="md-pane-label">Markdown</div>
        <textarea class="md-editor"
          @on:input="source.value = $event.target.value"
          placeholder="Start writing..."
        >{{source.value}}</textarea>
      </div>

      <div class="md-divider"></div>

      <div class="md-pane">
        <div class="md-pane-label">Preview</div>
        <div class="md-preview prose" @ref="previewEl"></div>
      </div>

    </div>

  </div>`;_r.$imports={Component:_,signal:k,marked:O};const Xe=k([]);let jb=0;function Hr(e,t="info",r=4e3){const i=++jb;Xe.value=[...Xe.value,{id:i,message:e,type:t}],setTimeout(()=>la(i),r)}function la(e){Xe.value=Xe.value.filter(t=>t.id!==e)}(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","ToastContainer"),e.textContent=`.tc-wrap {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
  pointer-events: none;
}

.tc-toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  min-width: 280px;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
  pointer-events: all;
  animation: tc-slide-in 0.2s ease;
  border-left: 3px solid transparent;
}

@keyframes tc-slide-in {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

.tc-toast--info    { background: #eff6ff; border-color: var(--color-info);    }
.tc-toast--success { background: #f0fdf4; border-color: var(--color-success); }
.tc-toast--warning { background: #fffbeb; border-color: var(--color-warning); }
.tc-toast--error   { background: #fff1f2; border-color: var(--color-danger);  }

.tc-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
  font-weight: 700;
}

.tc-toast--info    .tc-icon { color: var(--color-info);    }
.tc-toast--success .tc-icon { color: var(--color-success); }
.tc-toast--warning .tc-icon { color: var(--color-warning); }
.tc-toast--error   .tc-icon { color: var(--color-danger);  }

.tc-message {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.4;
}

.tc-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  padding: 0.25rem;
  line-height: 1;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.tc-close:hover { opacity: 1; }`,document.head.appendChild(e)})();class wr extends _{constructor(){super(...arguments),this.toasts=Xe,this.removeToast=la}icon(t){return{info:"ℹ",success:"✓",warning:"⚠",error:"✕"}[t]??"ℹ"}}wr.template=`<div class="tc-wrap">
    <div @each="toast of toasts.value" @key="toast.id" @class="'tc-toast tc-toast--' + toast.type">
      <span class="tc-icon">{{icon(toast.type)}}</span>
      <span class="tc-message">{{toast.message}}</span>
      <button @on:click="removeToast(toast.id)" class="tc-close">✕</button>
    </div>
  </div>`;wr.$imports={Component:_,toasts:Xe,removeToast:la};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","ToastPage"),e.textContent=`.tp-wrap {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tp-header h2 { margin: 0 0 0.25rem; }

.tp-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}

.tp-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tp-section-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tp-form {
  display: flex;
  gap: 0.5rem;
}

.tp-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.tp-input:focus { border-color: var(--color-primary); }

.tp-select {
  padding: 0.625rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  background: var(--color-bg);
  cursor: pointer;
}

.tp-quick {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tp-btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
}

.tp-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.tp-btn--primary { background: var(--color-primary);  color: white; }
.tp-btn--success { background: var(--color-success);  color: white; }
.tp-btn--error   { background: var(--color-danger);   color: white; }
.tp-btn--warning { background: var(--color-warning);  color: white; }
.tp-btn--info    { background: var(--color-info);     color: white; }`,document.head.appendChild(e)})();class Sr extends _{constructor(){super(...arguments),this.message=k(""),this.type=k("info")}send(){const t=this.message.value.trim();t&&(Hr(t,this.type.value),this.message.value="",this.inputEl.focus())}quick(t,r){Hr(r,t)}}Sr.template=`<div class="tp-wrap">
    <div class="tp-header">
      <h2>Global Notifications</h2>
      <p class="tp-subtitle">Toasts are driven by a global signal. They appear from any page — try navigating away and firing one.</p>
    </div>

    <div class="tp-card">
      <h3 class="tp-section-title">Send a toast</h3>
      <form @on:submit.prevent="send()" class="tp-form">
        <input
          type="text"
          class="tp-input"
          @value="message.value"
          @on:input="message.value = $event.target.value"
          placeholder="Type your message..."
          @ref="inputEl"
        />
        <select class="tp-select" @on:change="type.value = $event.target.value">
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <button type="submit" class="tp-btn tp-btn--primary" @disabled="!message.value.trim()">
          Send
        </button>
      </form>
    </div>

    <div class="tp-card">
      <h3 class="tp-section-title">Quick fire</h3>
      <div class="tp-quick">
        <button @on:click="quick('success', '✓ Changes saved successfully')"    class="tp-btn tp-btn--success">Success</button>
        <button @on:click="quick('error',   '✕ Failed to connect to server')"   class="tp-btn tp-btn--error">Error</button>
        <button @on:click="quick('warning', '⚠ Session expires in 5 minutes')" class="tp-btn tp-btn--warning">Warning</button>
        <button @on:click="quick('info',    'ℹ New version available')"         class="tp-btn tp-btn--info">Info</button>
      </div>
    </div>

  </div>`;Sr.$imports={Component:_,signal:k,addToast:Hr};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","App"),e.textContent=`:root {
  /* Semantic Colors */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-success: #10b981;
  --color-danger: #f43f5e;
  --color-warning: #f59e0b;
  --color-info: #0ea5e9;

  /* Grays */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;

  --radius: 12px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1);
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
}

h1, h2, h3 {
  color: #0f172a;
  letter-spacing: -0.025em;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  min-width: 0;
  padding: 2rem;
  box-sizing: border-box;
  overflow-y: auto;
}`,document.head.appendChild(e)})();class ca extends _{constructor(){super(...arguments),this.currentPath=k(window.location.pathname)}navigate(t){un(t),this.currentPath.value=t}}ca.template=`<div class="app-shell">
    <ui-sidebar @:onNavigate="navigate" @:currentPath="currentPath"></ui-sidebar>

    <main class="app-main">
      <router>
        <route @path="/" @component="Home" />
        <route @path="/todo" @component="TodoApp" />
        <route @path="/counter" @component="CounterExample" />
        <route @path="/kanban" @component="KanbanBoard" />
        <route @path="/game" @component="GameOfLife" />
        <route @path="/products" @component="ProductCatalog" />
        <route @path="/table" @component="DataTable" />
        <route @path="/cart" @component="CartPage" />
        <route @path="/form" @component="SignupForm" />
        <route @path="/dashboard" @component="Dashboard" />
        <route @path="/markdown" @component="MarkdownEditor" />
        <route @path="/toast" @component="ToastPage" />
        <route @path="/tree" @component="TreeView" />
        <route @path="/hex" @component="HexExplorer" />
        <route @path="/wizard" @component="WizardPage" />
      </router>
    </main>
    <toast-container></toast-container>
  </div>`;ca.$imports={Component:_,navigate:un,signal:k,UISidebar:dn,Home:pn,TodoApp:mn,CounterExample:hn,KanbanBoard:gn,GameOfLife:vn,ProductCatalog:yn,DataTable:$n,CartPage:wn,SignupForm:br,Dashboard:$r,MarkdownEditor:_r,ToastContainer:wr,ToastPage:Sr};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","KanbanColumn"),e.textContent=`.column {
  background: #f1f5f9;
  border-radius: var(--radius);
  width: 300px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}
.column-header {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.column-header h3 { margin: 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); font-weight: 700; }
.count { background: white; border: 1px solid var(--color-border); border-radius: 6px; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; color: var(--color-text); }
.column-tasks {
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.empty-state {
  text-align: center;
  color: var(--color-text-muted);
  padding: 3rem 0;
  font-style: italic;
  font-size: 0.875rem;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  margin: 0.5rem;
}`,document.head.appendChild(e)})();class ua extends _{constructor(){super(...arguments),this.tasks=this.computed(()=>{var i;const t=((i=this.args.allTasks)==null?void 0:i.value)??[],r=this.args.status;return t.filter(n=>n&&n.status===r)})}onMount(){console.log("KanbanColumn:",this.args.title)}onDrop(t){const r=t.dataTransfer.getData("task-id");this.args.onMoveTask(r,this.args.status)}}ua.template=`<div 
    class="column" 
    @on:dragover.prevent="" 
    @on:drop="onDrop($event)"
  >
    <div class="column-header">
      <h3>{{ args.title }}</h3>
      <span class="count">{{ tasks.value.length }}</span>
    </div>
    <div class="column-tasks">
      <task-card @each="task of tasks.value" @:task="task" @key="task.id"></task-card>
      <div @if="!tasks.value.length" class="empty-state">No tasks</div>
    </div>
  </div>`;ua.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","TaskCard"),e.textContent=`.task-card-wrapper {
  cursor: grab;
  display: block;
}
.task-card-wrapper:active {
  cursor: grabbing;
}
.desc {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  white-space: pre-wrap;
}`,document.head.appendChild(e)})();class da extends _{onMount(){console.log("TaskCard:",this.args.task.title)}onDragStart(t){t.dataTransfer.setData("task-id",this.args.task.id),t.dataTransfer.effectAllowed="move"}}da.template=`<div 
    class="task-card-wrapper" 
    draggable="true" 
    @on:dragstart="onDragStart($event)"
  >
    <ui-card>
      <div @slot="header">{{ args.task.title }}</div>
      <p class="desc" @if="args.task.description">{{ args.task.description }}</p>
    </ui-card>
  </div>`;da.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","AddTaskDialog"),e.textContent=`.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.9rem; }
.form-group input, .form-group textarea {
  width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;
}
.form-group textarea { min-height: 80px; resize: vertical; }`,document.head.appendChild(e)})();class pa extends _{constructor(){super(...arguments),this.title=k(""),this.description=k("")}handleSubmit(){const t=this.title.value.trim();t&&(this.args.onAdd({title:t,description:this.description.value}),this.title.value="",this.description.value="",this.args.onClose())}}pa.template=`<ui-dialog @:isOpen="args.isOpen" @:onClose="args.onClose" @:title="'Add New Task'">
    <div class="form-group">
      <label>Title</label>
      <input 
        type="text" 
        @value="title.value" 
        @on:input="title.value = $event.target.value" 
        placeholder="Enter task title"
      />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea 
        @value="description.value" 
        @on:input="description.value = $event.target.value" 
        placeholder="Enter details"
      ></textarea>
    </div>
    
    <ui-button @slot="footer" @:onClick="args.onClose" @:variant="'secondary'">Cancel</ui-button>
    <ui-button @slot="footer" @:onClick="handleSubmit" @:variant="'primary'">Create Task</ui-button>
  </ui-dialog>`;pa.$imports={Component:_,signal:k};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","Card"),e.textContent=`.card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 0.75rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 1px solid var(--color-border);
}
.card:hover {
  box-shadow: var(--shadow-lg);
  border-color: #cbd5e1;
}
/* Hide header/footer if they don't contain anything (basic support) */
.card-header:empty, .card-footer:empty { display: none; }

.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  color: #0f172a;
}
.card-body {
  padding: 1.25rem;
}
.card-footer {
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border-top: 1px solid var(--color-border);
}`,document.head.appendChild(e)})();class ma extends _{}ma.template=`<div class="card">
    <!-- Removed @if to prevent $slots undefined error during teardown -->
    <div class="card-header">
      <slot @name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div class="card-footer">
      <slot @name="footer" />
    </div>
  </div>`;ma.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","Dialog"),e.textContent=`.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}
.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h2 { margin: 0; font-size: 1.25rem; }
.close-btn { 
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; 
}
.modal-body { padding: 1rem; }
.modal-footer { 
  padding: 1rem; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 0.75rem;
}
/* Hide footer if empty */
.modal-footer:empty { display: none; }`,document.head.appendChild(e)})();class fa extends _{}fa.template=`<div class="modal-overlay" @if="args.isOpen.value" @on:click.self="args.onClose()">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ args.title ?? 'Dialog' }}</h2>
        <button class="close-btn" @on:click="args.onClose()">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <!-- Removed @if to prevent $slots undefined error during teardown -->
      <div class="modal-footer">
        <slot @name="footer" />
      </div>
    </div>
  </div>`;fa.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","UIButton"),e.textContent=`.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  gap: 0.5rem;
  width: auto;
  min-width: fit-content;
}

.btn:active { transform: scale(0.97); }

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }

.btn-secondary { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }
.btn-secondary:hover:not(:disabled) { background: #e2e8f0; }

.btn-success { background: var(--color-success); color: white; }
.btn-success:hover:not(:disabled) { filter: brightness(1.1); }

.btn-danger { background: var(--color-danger); color: white; }
.btn-danger:hover:not(:disabled) { filter: brightness(1.1); }

.btn-outline { background: transparent; border-color: var(--color-border); color: var(--color-text-muted); }
.btn-outline:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }`,document.head.appendChild(e)})();class ha extends _{get variantClass(){return`btn-${this.args.variant??"primary"}`}}ha.template=`<button 
    @class="'btn ' + variantClass + (args.class ? ' ' + args.class : '')" 
    @type="args.type ?? 'button'"
    @on:click="args.onClick ? args.onClick($event) : null"
    @disabled="args.disabled"
  >
    <slot />
  </button>`;ha.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","UIContent"),e.textContent=`.ui-content-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.ui-content {
  width: 100%;
  max-width: var(--max-content-width, 1280px);
  padding: 2rem;
  box-sizing: border-box;
}`,document.head.appendChild(e)})();class ga extends _{}ga.template=`<div class="ui-content-wrapper">
    <div class="ui-content">
      <slot />
    </div>
  </div>`;ga.$imports={Component:_};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","ProductForm"),e.textContent=`.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-group.wide { grid-column: span 2; }
.form-group label { display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.85rem; color: #475569; }
.form-group input, .form-group textarea {
  width: 100%; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 8px; box-sizing: border-box;
  font-family: inherit; font-size: 0.9rem;
}
.form-group textarea { min-height: 80px; resize: vertical; }`,document.head.appendChild(e)})();class va extends _{constructor(){super(...arguments),this.name=k(""),this.description=k(""),this.price=k(""),this.department=k(""),this.company=k("")}get productData(){const t=this.args.product;return t&&typeof t=="object"&&"value"in t?t.value:t}get formTitle(){return this.productData?"Edit Product":"Add Product"}get submitLabel(){return this.productData?"Save Changes":"Create Product"}onMount(){const t=this.productData;t&&(this.name.value=t.name??"",this.description.value=t.description??"",this.price.value=t.price??"",this.department.value=t.department??"",this.company.value=t.company??"")}handleSubmit(){this.args.onSubmit({name:this.name.value,description:this.description.value,price:this.price.value,department:this.department.value,company:this.company.value})}}va.template=`<ui-dialog @:isOpen="args.isOpen" @:onClose="args.onClose" @:title="formTitle">
    <div class="form-grid">
      <div class="form-group">
        <label>Product Name</label>
        <input type="text" @value="name.value" @on:input="name.value = $event.target.value" placeholder="e.g. Steel Chair" />
      </div>
      <div class="form-group">
        <label>Price</label>
        <input type="number" step="0.01" @value="price.value" @on:input="price.value = $event.target.value" placeholder="0.00" />
      </div>
      <div class="form-group wide">
        <label>Description</label>
        <textarea @value="description.value" @on:input="description.value = $event.target.value" placeholder="Details..."></textarea>
      </div>
      <div class="form-group">
        <label>Department</label>
        <input type="text" @value="department.value" @on:input="department.value = $event.target.value" />
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" @value="company.value" @on:input="company.value = $event.target.value" />
      </div>
    </div>
    
    <ui-button @slot="footer" @:onClick="args.onClose" @:variant="'secondary'">Cancel</ui-button>
    <ui-button @slot="footer" @:onClick="handleSubmit" @:variant="'primary'">{{ submitLabel }}</ui-button>
  </ui-dialog>`;va.$imports={Component:_,signal:k};const Fe=k(null),Im=[{id:"kasper-js",name:"kasper-js",type:"folder",children:[{id:"src",name:"src",type:"folder",children:[{id:"transpiler",name:"transpiler.ts",type:"file"},{id:"component",name:"component.ts",type:"file"},{id:"signal",name:"signal.ts",type:"file"},{id:"scheduler",name:"scheduler.ts",type:"file"},{id:"boundary",name:"boundary.ts",type:"file"},{id:"router",name:"router.ts",type:"file"},{id:"parser",name:"parser",type:"folder",children:[{id:"template-parser",name:"template-parser.ts",type:"file"},{id:"expression-parser",name:"expression-parser.ts",type:"file"},{id:"scanner",name:"scanner.ts",type:"file"}]}]},{id:"demos",name:"demos",type:"folder",children:[{id:"demos-src",name:"src",type:"folder",children:[{id:"app-kasper",name:"App.kasper",type:"file"},{id:"main-ts",name:"main.ts",type:"file"}]},{id:"demos-index",name:"index.html",type:"file"},{id:"demos-pkg",name:"package.json",type:"file"}]},{id:"spec",name:"spec",type:"folder",children:[{id:"transpiler-spec",name:"transpiler.spec.ts",type:"file"},{id:"edge-cases-spec",name:"edge-cases.spec.ts",type:"file"},{id:"signal-spec",name:"signal.spec.ts",type:"file"},{id:"boundary-spec",name:"boundary.spec.ts",type:"file"}]},{id:"readme",name:"README.md",type:"file"},{id:"pkg",name:"package.json",type:"file"},{id:"tsconfig",name:"tsconfig.json",type:"file"}]}];(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","TreeView"),e.textContent=`.tv-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.tv-header h2 { margin: 0 0 0.25rem; }

.tv-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.tv-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  min-height: 500px;
}

.tv-sidebar {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tv-sidebar-title {
  padding: 0.75rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.tv-tree {
  padding: 0.5rem;
  overflow-y: auto;
  flex: 1;
}

.tv-detail {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.tv-file-card {
  text-align: center;
  width: 100%;
  max-width: 360px;
}

.tv-file-icon {
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.tv-file-name {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
}

.tv-file-meta {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.tv-children-list {
  text-align: left;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.tv-children-label {
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.tv-child-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.85rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.tv-child-row:last-child { border-bottom: none; }

.tv-empty {
  text-align: center;
  color: var(--color-text-muted);
}

.tv-empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.75rem;
  opacity: 0.4;
}

.tv-empty p {
  margin: 0;
  font-size: 0.875rem;
}`,document.head.appendChild(e)})();class ba extends _{constructor(){super(...arguments),this.selected=Fe,this.treeData=Im}}ba.template=`<div class="tv-wrap">
    <div class="tv-header">
      <h2>File Explorer</h2>
      <p class="tv-subtitle">Recursive components — each node renders itself for its children, no depth limit.</p>
    </div>

    <div class="tv-layout">
      <aside class="tv-sidebar">
        <div class="tv-sidebar-title">Explorer</div>
        <div class="tv-tree">
          <tree-node
            @each="node of treeData"
            @key="node.id"
            @:item="node"
          ></tree-node>
        </div>
      </aside>

      <div class="tv-detail">
        <div @if="selected.value" class="tv-file-card">
          <div class="tv-file-icon">{{ selected.value.type === 'folder' ? '📁' : '📄' }}</div>
          <h3 class="tv-file-name">{{ selected.value.name }}</h3>
          <p class="tv-file-meta">{{ selected.value.type === 'folder' ? 'Directory' : 'File' }}</p>
          <div @if="selected.value.type === 'folder' && selected.value.children" class="tv-children-list">
            <p class="tv-children-label">Contents</p>
            <div @each="child of selected.value.children" class="tv-child-row">
              <span>{{ child.type === 'folder' ? '📁' : '📄' }}</span>
              <span>{{ child.name }}</span>
            </div>
          </div>
        </div>
        <div @else class="tv-empty">
          <span class="tv-empty-icon">📂</span>
          <p>Select a file or folder to inspect</p>
        </div>
      </div>
    </div>
  </div>`;ba.$imports={Component:_,selectedNode:Fe,treeData:Im};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","TreeNode"),e.textContent=`.tn-node {
  user-select: none;
}

.tn-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.625rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;
}

.tn-row:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.tn-row--selected {
  background: #eef2ff;
  color: var(--color-primary);
  font-weight: 600;
}

.tn-toggle {
  font-size: 0.65rem;
  width: 12px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.tn-toggle--hidden {
  visibility: hidden;
}

.tn-icon {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.tn-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.tn-children {
  margin-left: 1rem;
  border-left: 1px solid var(--color-border);
  margin-bottom: 0.125rem;
}`,document.head.appendChild(e)})();class ya extends _{constructor(){super(...arguments),this.isOpen=k(!1),this.isSelected=this.computed(()=>Fe.value!==null&&Fe.value.id===this.args.item.id)}handleClick(){Fe.value=this.args.item,this.args.item.type==="folder"&&(this.isOpen.value=!this.isOpen.value)}}ya.template=`<div class="tn-node">
    <div @class="'tn-row' + (isSelected.value ? ' tn-row--selected' : '')" @on:click="handleClick()">
      <span @class="'tn-toggle' + (args.item.type === 'file' ? ' tn-toggle--hidden' : '')">
        {{ isOpen.value ? '▾' : '▸' }}
      </span>
      <span class="tn-icon">{{ args.item.type === 'folder' ? '📁' : '📄' }}</span>
      <span class="tn-name">{{ args.item.name }}</span>
    </div>
    <div @if="isOpen.value && args.item.children" class="tn-children">
      <tree-node
        @each="child of args.item.children"
        @key="child.id"
        @:item="child"
      ></tree-node>
    </div>
  </div>`;ya.$imports={Component:_,signal:k,computed:Oe,selectedNode:Fe};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","HexExplorer"),e.textContent=`.hx-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hx-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.hx-header h2 { margin: 0 0 0.25rem; }

.hx-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.hx-stats {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.hx-stat {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  text-align: center;
}

.hx-stat-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 0.2rem;
}

.hx-stat-value {
  font-size: 0.875rem;
  font-weight: 700;
  font-family: monospace;
  color: var(--color-primary);
}

.hx-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.hx-col-header {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 32px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  font-family: monospace;
}

.hx-index-cell {
  width: 56px;
  flex-shrink: 0;
  margin-right: 0.5rem;
}

.hx-col-label {
  flex: 1;
  text-align: center;
}

.hx-scroll {
  height: 500px;
  overflow-y: scroll;
  position: relative;
}

.hx-phantom {
  width: 100%;
  pointer-events: none;
}

.hx-viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  padding: 0 1rem;
}

.hx-row {
  display: flex;
  align-items: center;
  height: 32px;
  border-bottom: 1px solid var(--color-border);
  font-family: monospace;
  font-size: 0.75rem;
}

.hx-index {
  width: 56px;
  flex-shrink: 0;
  margin-right: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.65rem;
  text-align: right;
  padding-right: 0.5rem;
  border-right: 1px solid var(--color-border);
}

.hx-cell {
  flex: 1;
  text-align: center;
  color: var(--color-text-muted);
  padding: 0 2px;
}

.hx-cell--hi {
  color: var(--color-primary);
  font-weight: 700;
}

.hx-scroll::-webkit-scrollbar { width: 8px; }
.hx-scroll::-webkit-scrollbar-track { background: var(--color-bg); }
.hx-scroll::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 8px; }
.hx-scroll::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }`,document.head.appendChild(e)})();class $a extends _{constructor(){super(...arguments),this.rowHeight=32,this.totalRows=5e3,this.visibleCount=30,this.totalHeight=5e3*32,this.columns=["0","1","2","3","4","5","6","7","8","9"],this.offsetY=k(0),this.visibleRows=k([])}onMount(){this.update(0)}onScroll(t){this.update(t.target.scrollTop)}update(t){const r=Math.floor(t/this.rowHeight),i=Math.min(this.totalRows,r+this.visibleCount),n=[];for(let o=r;o<i;o++)n.push({index:o,cells:Array.from({length:10},()=>({value:(Math.random()*255|0).toString(16).padStart(2,"0").toUpperCase(),highlight:Math.random()>.95}))});this.visibleRows.value=n,this.offsetY.value=r*this.rowHeight}}$a.template=`<div class="hx-wrap">
    <div class="hx-header">
      <div>
        <h2>Hex Explorer</h2>
        <p class="hx-subtitle">Virtual scroll — 5,000 rows, 50,000 cells. Only ~30 rows are in the DOM at any time.</p>
      </div>
      <div class="hx-stats">
        <div class="hx-stat">
          <span class="hx-stat-label">Rows</span>
          <span class="hx-stat-value">5,000</span>
        </div>
        <div class="hx-stat">
          <span class="hx-stat-label">Cells</span>
          <span class="hx-stat-value">50,000</span>
        </div>
        <div class="hx-stat">
          <span class="hx-stat-label">Offset</span>
          <span class="hx-stat-value">{{ offsetY.value }}px</span>
        </div>
      </div>
    </div>

    <div class="hx-card">
      <div class="hx-col-header">
        <div class="hx-index-cell"></div>
        <div @each="col of columns" class="hx-col-label">+{{ col }}</div>
      </div>

      <div class="hx-scroll" @ref="scrollEl" @on:scroll="onScroll($event)">
        <div class="hx-phantom" @style="'height: ' + totalHeight + 'px'">
          <div class="hx-viewport" @style="'transform: translateY(' + offsetY.value + 'px)'">
            <div @each="row of visibleRows.value" @key="row.index" class="hx-row">
              <div class="hx-index">{{ row.index }}</div>
              <div @each="cell of row.cells" @class="'hx-cell' + (cell.highlight ? ' hx-cell--hi' : '')">
                {{ cell.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;$a.$imports={Component:_,signal:k};(function(){if(typeof document>"u")return;const e=document.createElement("style");e.setAttribute("data-kasper","WizardPage"),e.textContent=`.wz-wrap {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.wz-header h2 { margin: 0 0 0.25rem; }

.wz-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.wz-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

/* Progress */
.wz-progress {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.wz-progress-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  margin-bottom: 1rem;
}

.wz-progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.wz-steps {
  display: flex;
  gap: 0;
}

.wz-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.wz-step-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}

.wz-step--active .wz-step-dot {
  background: var(--color-primary);
  color: white;
}

.wz-step--done .wz-step-dot {
  background: var(--color-success);
  color: white;
}

.wz-step--active .wz-step-label,
.wz-step--done .wz-step-label {
  color: var(--color-text);
  font-weight: 600;
}

/* Pane */
.wz-pane {
  padding: 1.75rem 1.5rem;
  min-height: 260px;
}

.wz-pane h3 { margin: 0 0 0.25rem; font-size: 1.1rem; }

.wz-pane-desc {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

/* Fields */
.wz-fields { display: flex; flex-direction: column; gap: 1rem; }

.wz-field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
  color: var(--color-text);
}

.wz-field input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.wz-field input:focus { border-color: var(--color-primary); }

/* Plans */
.wz-plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.wz-plan {
  border: 2px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.wz-plan:hover { border-color: var(--color-primary); }

.wz-plan--selected {
  border-color: var(--color-primary);
  background: #eef2ff;
}

.wz-plan-icon { font-size: 1.5rem; margin-bottom: 0.4rem; }
.wz-plan-name { font-weight: 700; font-size: 0.875rem; margin-bottom: 0.2rem; }
.wz-plan-price { font-size: 0.75rem; color: var(--color-text-muted); }

/* Features */
.wz-features { display: flex; flex-direction: column; gap: 0.5rem; }

.wz-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.wz-feature:hover { border-color: var(--color-primary); }

.wz-feature input[type="checkbox"] { margin-top: 2px; cursor: pointer; }

.wz-feature-info { display: flex; flex-direction: column; gap: 0.15rem; }
.wz-feature-name { font-size: 0.875rem; font-weight: 600; }
.wz-feature-desc { font-size: 0.775rem; color: var(--color-text-muted); }

/* Summary */
.wz-summary {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.wz-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--color-border);
}

.wz-summary-row:last-child { border-bottom: none; }
.wz-summary-row span { color: var(--color-text-muted); }

/* Done */
.wz-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
}

.wz-done-icon { font-size: 3rem; }
.wz-done h3 { margin: 0; }
.wz-done p { margin: 0; color: var(--color-text-muted); }

/* Footer */
.wz-footer {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.wz-spacer { flex: 1; }

.wz-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s, background 0.15s;
}

.wz-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.wz-btn--primary { background: var(--color-primary); color: white; }
.wz-btn--primary:hover:not(:disabled) { background: var(--color-primary-dark); }
.wz-btn--ghost { background: transparent; color: var(--color-text-muted); }
.wz-btn--ghost:hover { background: var(--color-border); }`,document.head.appendChild(e)})();class ka extends _{constructor(){super(...arguments),this.steps=["Details","Plan","Features","Review"],this.step=k(0),this.plans=[{id:"free",name:"Free",price:"$0 / mo",icon:"🌱"},{id:"pro",name:"Pro",price:"$12 / mo",icon:"⚡"},{id:"enterprise",name:"Enterprise",price:"Custom",icon:"🏢"}],this.features=[{id:"analytics",name:"Analytics",desc:"Usage reports and insights"},{id:"api",name:"API Access",desc:"REST and GraphQL endpoints"},{id:"collab",name:"Collaboration",desc:"Invite team members"},{id:"sso",name:"SSO",desc:"Single sign-on integration"}],this.form=k({name:"",email:"",plan:"free",selectedFeatures:[]}),this.canAdvance=this.computed(()=>this.step.value===0?this.form.value.name.trim().length>0&&this.form.value.email.includes("@"):!0)}set(t,r){this.form.value={...this.form.value,[t]:r}}toggleFeature(t,r){const i=this.form.value.selectedFeatures;this.form.value={...this.form.value,selectedFeatures:r?[...i,t]:i.filter(n=>n!==t)}}planLabel(){var t;return((t=this.plans.find(r=>r.id===this.form.value.plan))==null?void 0:t.name)??""}restart(){this.step.value=0,this.form.value={name:"",email:"",plan:"free",selectedFeatures:[]}}}ka.template=`<div class="wz-wrap">
    <div class="wz-header">
      <h2>Setup Wizard</h2>
      <p class="wz-subtitle">Multi-step flow with progress tracking, per-step validation, and a summary screen.</p>
    </div>

    <div class="wz-card">

      <!-- Progress -->
      <div class="wz-progress">
        <div class="wz-progress-bar">
          <div class="wz-progress-fill" @style="'width: ' + ((step.value + 1) / steps.length * 100) + '%'"></div>
        </div>
        <div class="wz-steps">
          <div @each="s with i of steps" @class="'wz-step' + (i < step.value ? ' wz-step--done' : '') + (i === step.value ? ' wz-step--active' : '')">
            <div class="wz-step-dot">{{ i < step.value ? '✓' : i + 1 }}</div>
            <span class="wz-step-label">{{ s }}</span>
          </div>
        </div>
      </div>

      <!-- Step 1: Identity -->
      <div @if="step.value === 0" class="wz-pane">
        <h3>Your details</h3>
        <p class="wz-pane-desc">Let's start with the basics.</p>
        <div class="wz-fields">
          <div class="wz-field">
            <label>Full name</label>
            <input type="text" @value="form.value.name" @on:input="set('name', $event.target.value)" placeholder="Jane Smith" />
          </div>
          <div class="wz-field">
            <label>Email</label>
            <input type="email" @value="form.value.email" @on:input="set('email', $event.target.value)" placeholder="jane@example.com" />
          </div>
        </div>
      </div>

      <!-- Step 2: Plan -->
      <div @elseif="step.value === 1" class="wz-pane">
        <h3>Choose a plan</h3>
        <p class="wz-pane-desc">You can change this later.</p>
        <div class="wz-plans">
          <div @each="plan of plans" @on:click="set('plan', plan.id)" @class="'wz-plan' + (form.value.plan === plan.id ? ' wz-plan--selected' : '')">
            <div class="wz-plan-icon">{{ plan.icon }}</div>
            <div class="wz-plan-name">{{ plan.name }}</div>
            <div class="wz-plan-price">{{ plan.price }}</div>
          </div>
        </div>
      </div>

      <!-- Step 3: Features -->
      <div @elseif="step.value === 2" class="wz-pane">
        <h3>Features</h3>
        <p class="wz-pane-desc">Select the features you need.</p>
        <div class="wz-features">
          <label @each="feat of features" class="wz-feature">
            <input type="checkbox" @on:change="toggleFeature(feat.id, $event.target.checked)" />
            <div class="wz-feature-info">
              <span class="wz-feature-name">{{ feat.name }}</span>
              <span class="wz-feature-desc">{{ feat.desc }}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Step 4: Summary -->
      <div @elseif="step.value === 3" class="wz-pane">
        <h3>Review & confirm</h3>
        <p class="wz-pane-desc">Everything look right?</p>
        <div class="wz-summary">
          <div class="wz-summary-row">
            <span>Name</span>
            <strong>{{ form.value.name }}</strong>
          </div>
          <div class="wz-summary-row">
            <span>Email</span>
            <strong>{{ form.value.email }}</strong>
          </div>
          <div class="wz-summary-row">
            <span>Plan</span>
            <strong>{{ planLabel() }}</strong>
          </div>
          <div class="wz-summary-row">
            <span>Features</span>
            <strong>{{ form.value.selectedFeatures.length || 'None' }}</strong>
          </div>
        </div>
      </div>

      <!-- Done -->
      <div @else class="wz-pane wz-done">
        <div class="wz-done-icon">🎉</div>
        <h3>All set, {{ form.value.name }}!</h3>
        <p>Your <strong>{{ planLabel() }}</strong> workspace is ready.</p>
        <button class="wz-btn wz-btn--primary" @on:click="restart()">Start over</button>
      </div>

      <!-- Footer -->
      <div @if="step.value <= 3" class="wz-footer">
        <button @if="step.value > 0" class="wz-btn wz-btn--ghost" @on:click="step.value--">Back</button>
        <div class="wz-spacer"></div>
        <button
          @if="step.value < 3"
          class="wz-btn wz-btn--primary"
          @disabled="!canAdvance.value"
          @on:click="step.value++"
        >Next</button>
        <button @if="step.value === 3" class="wz-btn wz-btn--primary" @on:click="step.value++">Finish</button>
      </div>

    </div>
  </div>`;ka.$imports={Component:_,signal:k,computed:Oe};of({root:document.body,entry:"app",registry:{app:{component:ca},home:{component:pn},"todo-app":{component:mn},"counter-example":{component:hn},"display-counter":{component:fn},"kanban-board":{component:gn},"kanban-column":{component:ua},"task-card":{component:da},"add-task-dialog":{component:pa},"ui-card":{component:ma},"ui-dialog":{component:fa},"ui-button":{component:ha},"ui-sidebar":{component:dn},"ui-content":{component:ga},"game-of-life":{component:vn},"data-table":{component:$n},"cart-page":{component:wn},"cart-product-grid":{component:xn},"cart-panel":{component:_n},"product-catalog":{component:yn},"signup-form":{component:br},dashboard:{component:$r},"markdown-editor":{component:_r},"toast-container":{component:wr},"toast-page":{component:Sr},"product-form":{component:va},"tree-view":{component:ba},"tree-node":{component:ya},"hex-explorer":{component:$a},"wizard-page":{component:ka}}});
