(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();const v={ROOT_ELEMENT_NOT_FOUND:"K001-1",ENTRY_COMPONENT_NOT_FOUND:"K001-2",UNTERMINATED_COMMENT:"K002-1",UNTERMINATED_STRING:"K002-2",UNEXPECTED_CHARACTER:"K002-3",UNEXPECTED_EOF:"K003-1",UNEXPECTED_CLOSING_TAG:"K003-2",EXPECTED_TAG_NAME:"K003-3",EXPECTED_CLOSING_BRACKET:"K003-4",EXPECTED_CLOSING_TAG:"K003-5",BLANK_ATTRIBUTE_NAME:"K003-6",MISPLACED_CONDITIONAL:"K003-7",DUPLICATE_IF:"K003-8",MULTIPLE_STRUCTURAL_DIRECTIVES:"K003-9",UNEXPECTED_TOKEN:"K004-1",INVALID_LVALUE:"K004-2",EXPECTED_EXPRESSION:"K004-3",INVALID_DICTIONARY_KEY:"K004-4",INVALID_POSTFIX_LVALUE:"K005-1",UNKNOWN_BINARY_OPERATOR:"K005-2",INVALID_PREFIX_RVALUE:"K005-3",UNKNOWN_UNARY_OPERATOR:"K005-4",NOT_A_FUNCTION:"K005-5",NOT_A_CLASS:"K005-6",CIRCULAR_COMPUTED:"K006-1",RUNTIME_ERROR:"K007-1",MISSING_REQUIRED_ATTR:"K007-2"},Ft={"K001-1":n=>`Root element not found: ${n.root}`,"K001-2":n=>`Entry component <${n.tag}> not found in registry.`,"K002-1":()=>'Unterminated comment, expecting closing "*/"',"K002-2":n=>`Unterminated string, expecting closing ${n.quote}`,"K002-3":n=>`Unexpected character '${n.char}'`,"K003-1":n=>`Unexpected end of file. ${n.eofError}`,"K003-2":()=>"Unexpected closing tag","K003-3":()=>"Expected a tag name","K003-4":()=>"Expected closing tag >","K003-5":n=>`Expected </${n.name}>`,"K003-6":()=>"Blank attribute name","K003-7":n=>`@${n.name} must be preceded by an @if or @elseif block.`,"K003-8":()=>"Multiple conditional directives (@if, @elseif, @else) on the same element are not allowed.","K003-9":()=>"Multiple structural directives (@if, @each) on the same element are not allowed. Nest them or use <void> instead.","K004-1":n=>`${n.message}, unexpected token "${n.token}"`,"K004-2":()=>"Invalid l-value, is not an assigning target.","K004-3":n=>`Expected expression, unexpected token "${n.token}"`,"K004-4":n=>`String, Number or Identifier expected as a Key of Dictionary {, unexpected token ${n.token}`,"K005-1":n=>`Invalid left-hand side in postfix operation: ${n.entity}`,"K005-2":n=>`Unknown binary operator ${n.operator}`,"K005-3":n=>`Invalid right-hand side expression in prefix operation: ${n.right}`,"K005-4":n=>`Unknown unary operator ${n.operator}`,"K005-5":n=>`${n.callee} is not a function`,"K005-6":n=>`'${n.clazz}' is not a class. 'new' statement must be used with classes.`,"K006-1":()=>"Circular dependency detected in computed signal","K007-1":n=>n.message,"K007-2":n=>n.message};class $ extends Error{constructor(t,e={},s,i,a){const o=!(typeof process<"u"),c=Ft[t],m=c?c(e):typeof e=="string"?e:"Unknown error",l=s!==void 0?` (${s}:${i})`:"",h=a?`
  at <${a}>`:"",g=o?`

See: https://kasperjs.top/reference/errors#${t.toLowerCase().replace(".","")}`:"";super(`[${t}] ${m}${l}${h}${g}`),this.code=t,this.args=e,this.line=s,this.col=i,this.tagName=a,this.name="KasperError"}}let z=null;const Q=[];let ct=!1;const lt=new Set,Kt=[];class qt{constructor(t){this.subscribers=new Set,this.watchers=new Set,this._value=t}get value(){return z&&(this.subscribers.add(z.fn),z.deps.add(this)),this._value}set value(t){if(this._value!==t){const e=this._value;if(this._value=t,ct){for(const s of this.subscribers)lt.add(s);for(const s of this.watchers)Kt.push(()=>s(t,e))}else{const s=Array.from(this.subscribers);for(const i of s)i();for(const i of this.watchers)try{i(t,e)}catch(a){console.error("Watcher error:",a)}}}}onChange(t,e){var s;if((s=e==null?void 0:e.signal)!=null&&s.aborted)return()=>{};this.watchers.add(t);const i=()=>this.watchers.delete(t);return e!=null&&e.signal&&e.signal.addEventListener("abort",i,{once:!0}),i}unsubscribe(t){this.subscribers.delete(t)}toString(){return String(this.value)}peek(){return this._value}}class Qt extends qt{constructor(t,e){super(void 0),this.computing=!1,this.fn=t;const s=pt(()=>{if(this.computing)throw new $(v.CIRCULAR_COMPUTED);this.computing=!0;try{super.value=this.fn()}finally{this.computing=!1}},e);e!=null&&e.signal&&e.signal.addEventListener("abort",s,{once:!0})}get value(){return super.value}set value(t){}}function pt(n,t){var e;if((e=t==null?void 0:t.signal)!=null&&e.aborted)return()=>{};const s={fn:()=>{s.deps.forEach(a=>a.unsubscribe(s.fn)),s.deps.clear(),Q.push(s),z=s;try{n()}finally{Q.pop(),z=Q[Q.length-1]||null}},deps:new Set};s.fn();const i=()=>{s.deps.forEach(a=>a.unsubscribe(s.fn)),s.deps.clear()};return i.run=s.fn,t!=null&&t.signal&&t.signal.addEventListener("abort",i,{once:!0}),i}function f(n){return new qt(n)}function P(n){ct=!0;try{n()}finally{ct=!1;const t=Array.from(lt);lt.clear();const e=Kt.splice(0);for(const s of t)s();for(const s of e)try{s()}catch(i){console.error("Watcher error:",i)}}}function Xt(n,t){return new Qt(n,t)}class d{constructor(t){if(this.args={},this.$abortController=new AbortController,!t){this.args={};return}t.args&&(this.args=t.args),t.ref&&(this.ref=t.ref),t.transpiler&&(this.transpiler=t.transpiler)}effect(t){pt(t,{signal:this.$abortController.signal})}watch(t,e){t.onChange(e,{signal:this.$abortController.signal})}computed(t){return Xt(t,{signal:this.$abortController.signal})}onMount(){}onRender(){}onChanges(){}onDestroy(){}render(){var t;(t=this.$render)==null||t.call(this)}}class E{constructor(){}}class At extends E{constructor(t,e,s){super(),this.params=t,this.body=e,this.line=s}accept(t){return t.visitArrowFunctionExpr(this)}toString(){return"Expr.ArrowFunction"}}class Wt extends E{constructor(t,e,s){super(),this.name=t,this.value=e,this.line=s}accept(t){return t.visitAssignExpr(this)}toString(){return"Expr.Assign"}}class O extends E{constructor(t,e,s,i){super(),this.left=t,this.operator=e,this.right=s,this.line=i}accept(t){return t.visitBinaryExpr(this)}toString(){return"Expr.Binary"}}class ut extends E{constructor(t,e,s,i,a=!1){super(),this.callee=t,this.paren=e,this.args=s,this.line=i,this.optional=a}accept(t){return t.visitCallExpr(this)}toString(){return"Expr.Call"}}class Ht extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitDebugExpr(this)}toString(){return"Expr.Debug"}}class St extends E{constructor(t,e){super(),this.properties=t,this.line=e}accept(t){return t.visitDictionaryExpr(this)}toString(){return"Expr.Dictionary"}}class Yt extends E{constructor(t,e,s,i){super(),this.name=t,this.key=e,this.iterable=s,this.line=i}accept(t){return t.visitEachExpr(this)}toString(){return"Expr.Each"}}class R extends E{constructor(t,e,s,i){super(),this.entity=t,this.key=e,this.type=s,this.line=i}accept(t){return t.visitGetExpr(this)}toString(){return"Expr.Get"}}class Zt extends E{constructor(t,e){super(),this.expression=t,this.line=e}accept(t){return t.visitGroupingExpr(this)}toString(){return"Expr.Grouping"}}class at extends E{constructor(t,e){super(),this.name=t,this.line=e}accept(t){return t.visitKeyExpr(this)}toString(){return"Expr.Key"}}class Nt extends E{constructor(t,e,s,i){super(),this.left=t,this.operator=e,this.right=s,this.line=i}accept(t){return t.visitLogicalExpr(this)}toString(){return"Expr.Logical"}}class Pt extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitListExpr(this)}toString(){return"Expr.List"}}class I extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitLiteralExpr(this)}toString(){return"Expr.Literal"}}class Dt extends E{constructor(t,e,s){super(),this.clazz=t,this.args=e,this.line=s}accept(t){return t.visitNewExpr(this)}toString(){return"Expr.New"}}class Jt extends E{constructor(t,e,s){super(),this.left=t,this.right=e,this.line=s}accept(t){return t.visitNullCoalescingExpr(this)}toString(){return"Expr.NullCoalescing"}}class Rt extends E{constructor(t,e,s){super(),this.entity=t,this.increment=e,this.line=s}accept(t){return t.visitPostfixExpr(this)}toString(){return"Expr.Postfix"}}let j=class extends E{constructor(t,e,s,i){super(),this.entity=t,this.key=e,this.value=s,this.line=i}accept(t){return t.visitSetExpr(this)}toString(){return"Expr.Set"}};class Tt extends E{constructor(t,e,s){super(),this.left=t,this.right=e,this.line=s}accept(t){return t.visitPipelineExpr(this)}toString(){return"Expr.Pipeline"}}class K extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitSpreadExpr(this)}toString(){return"Expr.Spread"}}class te extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitTemplateExpr(this)}toString(){return"Expr.Template"}}class ee extends E{constructor(t,e,s,i){super(),this.condition=t,this.thenExpr=e,this.elseExpr=s,this.line=i}accept(t){return t.visitTernaryExpr(this)}toString(){return"Expr.Ternary"}}class ne extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitTypeofExpr(this)}toString(){return"Expr.Typeof"}}class se extends E{constructor(t,e,s){super(),this.operator=t,this.right=e,this.line=s}accept(t){return t.visitUnaryExpr(this)}toString(){return"Expr.Unary"}}class U extends E{constructor(t,e){super(),this.name=t,this.line=e}accept(t){return t.visitVariableExpr(this)}toString(){return"Expr.Variable"}}class ie extends E{constructor(t,e){super(),this.value=t,this.line=e}accept(t){return t.visitVoidExpr(this)}toString(){return"Expr.Void"}}var r=(n=>(n[n.Eof=0]="Eof",n[n.Panic=1]="Panic",n[n.Ampersand=2]="Ampersand",n[n.AtSign=3]="AtSign",n[n.Caret=4]="Caret",n[n.Comma=5]="Comma",n[n.Dollar=6]="Dollar",n[n.Dot=7]="Dot",n[n.Hash=8]="Hash",n[n.LeftBrace=9]="LeftBrace",n[n.LeftBracket=10]="LeftBracket",n[n.LeftParen=11]="LeftParen",n[n.Percent=12]="Percent",n[n.Pipe=13]="Pipe",n[n.RightBrace=14]="RightBrace",n[n.RightBracket=15]="RightBracket",n[n.RightParen=16]="RightParen",n[n.Semicolon=17]="Semicolon",n[n.Slash=18]="Slash",n[n.Star=19]="Star",n[n.Arrow=20]="Arrow",n[n.Bang=21]="Bang",n[n.BangEqual=22]="BangEqual",n[n.BangEqualEqual=23]="BangEqualEqual",n[n.Colon=24]="Colon",n[n.Equal=25]="Equal",n[n.EqualEqual=26]="EqualEqual",n[n.EqualEqualEqual=27]="EqualEqualEqual",n[n.Greater=28]="Greater",n[n.GreaterEqual=29]="GreaterEqual",n[n.Less=30]="Less",n[n.LessEqual=31]="LessEqual",n[n.Minus=32]="Minus",n[n.MinusEqual=33]="MinusEqual",n[n.MinusMinus=34]="MinusMinus",n[n.PercentEqual=35]="PercentEqual",n[n.Plus=36]="Plus",n[n.PlusEqual=37]="PlusEqual",n[n.PlusPlus=38]="PlusPlus",n[n.Question=39]="Question",n[n.QuestionDot=40]="QuestionDot",n[n.QuestionQuestion=41]="QuestionQuestion",n[n.SlashEqual=42]="SlashEqual",n[n.StarEqual=43]="StarEqual",n[n.DotDot=44]="DotDot",n[n.DotDotDot=45]="DotDotDot",n[n.LessEqualGreater=46]="LessEqualGreater",n[n.Identifier=47]="Identifier",n[n.Template=48]="Template",n[n.String=49]="String",n[n.Number=50]="Number",n[n.LeftShift=51]="LeftShift",n[n.RightShift=52]="RightShift",n[n.Pipeline=53]="Pipeline",n[n.Tilde=54]="Tilde",n[n.And=55]="And",n[n.Const=56]="Const",n[n.Debug=57]="Debug",n[n.False=58]="False",n[n.In=59]="In",n[n.Instanceof=60]="Instanceof",n[n.New=61]="New",n[n.Null=62]="Null",n[n.Undefined=63]="Undefined",n[n.Of=64]="Of",n[n.Or=65]="Or",n[n.True=66]="True",n[n.Typeof=67]="Typeof",n[n.Void=68]="Void",n[n.With=69]="With",n))(r||{});class $t{constructor(t,e,s,i,a){this.name=r[t],this.type=t,this.lexeme=e,this.literal=s,this.line=i,this.col=a}toString(){return`[(${this.line}):"${this.lexeme}"]`}}const Lt=[" ",`
`,"	","\r"],re=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];class Mt{parse(t){this.current=0,this.tokens=t;const e=[];for(;!this.eof();)e.push(this.expression());return e}match(...t){for(const e of t)if(this.check(e))return this.advance(),!0;return!1}advance(){return this.eof()||this.current++,this.previous()}peek(){return this.tokens[this.current]}previous(){return this.tokens[this.current-1]}check(t){return this.peek().type===t}eof(){return this.check(r.Eof)}consume(t,e){return this.check(t)?this.advance():this.error(v.UNEXPECTED_TOKEN,this.peek(),{message:e,token:this.peek().lexeme})}error(t,e,s={}){throw new $(t,s,e.line,e.col)}synchronize(){do{if(this.check(r.Semicolon)||this.check(r.RightBrace)){this.advance();return}this.advance()}while(!this.eof())}foreach(t){this.current=0,this.tokens=t;const e=this.consume(r.Identifier,'Expected an identifier inside "each" statement');let s=null;this.match(r.With)&&(s=this.consume(r.Identifier,'Expected a "key" identifier after "with" keyword in foreach statement')),this.consume(r.Of,'Expected "of" keyword inside foreach statement');const i=this.expression();return new Yt(e,s,i,e.line)}expression(){const t=this.assignment();if(this.match(r.Semicolon))for(;this.match(r.Semicolon););return t}assignment(){const t=this.pipeline();if(this.match(r.Equal,r.PlusEqual,r.MinusEqual,r.StarEqual,r.SlashEqual)){const e=this.previous();let s=this.assignment();if(t instanceof U){const i=t.name;return e.type!==r.Equal&&(s=new O(new U(i,i.line),e,s,e.line)),new Wt(i,s,i.line)}else if(t instanceof R)return e.type!==r.Equal&&(s=new O(new R(t.entity,t.key,t.type,t.line),e,s,e.line)),new j(t.entity,t.key,s,t.line);this.error(v.INVALID_LVALUE,e)}return t}pipeline(){let t=this.ternary();for(;this.match(r.Pipeline);){const e=this.ternary();t=new Tt(t,e,t.line)}return t}ternary(){const t=this.nullCoalescing();if(this.match(r.Question)){const e=this.ternary();this.consume(r.Colon,'Expected ":" after ternary ? expression');const s=this.ternary();return new ee(t,e,s,t.line)}return t}nullCoalescing(){const t=this.logicalOr();if(this.match(r.QuestionQuestion)){const e=this.nullCoalescing();return new Jt(t,e,t.line)}return t}logicalOr(){let t=this.logicalAnd();for(;this.match(r.Or);){const e=this.previous(),s=this.logicalAnd();t=new Nt(t,e,s,e.line)}return t}logicalAnd(){let t=this.equality();for(;this.match(r.And);){const e=this.previous(),s=this.equality();t=new Nt(t,e,s,e.line)}return t}equality(){let t=this.shift();for(;this.match(r.BangEqual,r.BangEqualEqual,r.EqualEqual,r.EqualEqualEqual,r.Greater,r.GreaterEqual,r.Less,r.LessEqual,r.Instanceof,r.In);){const e=this.previous(),s=this.shift();t=new O(t,e,s,e.line)}return t}shift(){let t=this.addition();for(;this.match(r.LeftShift,r.RightShift);){const e=this.previous(),s=this.addition();t=new O(t,e,s,e.line)}return t}addition(){let t=this.modulus();for(;this.match(r.Minus,r.Plus);){const e=this.previous(),s=this.modulus();t=new O(t,e,s,e.line)}return t}modulus(){let t=this.multiplication();for(;this.match(r.Percent);){const e=this.previous(),s=this.multiplication();t=new O(t,e,s,e.line)}return t}multiplication(){let t=this.typeof();for(;this.match(r.Slash,r.Star);){const e=this.previous(),s=this.typeof();t=new O(t,e,s,e.line)}return t}typeof(){if(this.match(r.Typeof)){const t=this.previous(),e=this.typeof();return new ne(e,t.line)}return this.unary()}unary(){if(this.match(r.Minus,r.Bang,r.Tilde,r.Dollar,r.PlusPlus,r.MinusMinus)){const t=this.previous(),e=this.unary();return new se(t,e,t.line)}return this.newKeyword()}newKeyword(){if(this.match(r.New)){const t=this.previous(),e=this.call();return e instanceof ut?new Dt(e.callee,e.args,t.line):new Dt(e,[],t.line)}return this.postfix()}postfix(){const t=this.call();return this.match(r.PlusPlus)?new Rt(t,1,t.line):this.match(r.MinusMinus)?new Rt(t,-1,t.line):t}call(){let t=this.primary(),e;do{if(e=!1,this.match(r.LeftParen)){e=!0;do t=this.finishCall(t,this.previous(),!1);while(this.match(r.LeftParen))}if(this.match(r.Dot,r.QuestionDot)){e=!0;const s=this.previous();s.type===r.QuestionDot&&this.match(r.LeftBracket)?t=this.bracketGet(t,s):s.type===r.QuestionDot&&this.match(r.LeftParen)?t=this.finishCall(t,this.previous(),!0):t=this.dotGet(t,s)}this.match(r.LeftBracket)&&(e=!0,t=this.bracketGet(t,this.previous()))}while(e);return t}tokenAt(t){var e;return(e=this.tokens[this.current+t])==null?void 0:e.type}isArrowParams(){var t,e,s,i,a,o;let c=this.current+1;if(((t=this.tokens[c])==null?void 0:t.type)===r.RightParen)return((e=this.tokens[c+1])==null?void 0:e.type)===r.Arrow;for(;c<this.tokens.length;){if(((s=this.tokens[c])==null?void 0:s.type)!==r.Identifier)return!1;if(c++,((i=this.tokens[c])==null?void 0:i.type)===r.RightParen)return((a=this.tokens[c+1])==null?void 0:a.type)===r.Arrow;if(((o=this.tokens[c])==null?void 0:o.type)!==r.Comma)return!1;c++}return!1}finishCall(t,e,s){const i=[];if(!this.check(r.RightParen))do this.match(r.DotDotDot)?i.push(new K(this.expression(),this.previous().line)):i.push(this.expression());while(this.match(r.Comma));const a=this.consume(r.RightParen,'Expected ")" after arguments');return new ut(t,a,i,a.line,s)}dotGet(t,e){const s=this.consume(r.Identifier,"Expect property name after '.'"),i=new at(s,s.line);return new R(t,i,e.type,s.line)}bracketGet(t,e){let s=null;return this.check(r.RightBracket)||(s=this.expression()),this.consume(r.RightBracket,'Expected "]" after an index'),new R(t,s,e.type,e.line)}primary(){if(this.match(r.False))return new I(!1,this.previous().line);if(this.match(r.True))return new I(!0,this.previous().line);if(this.match(r.Null))return new I(null,this.previous().line);if(this.match(r.Undefined))return new I(void 0,this.previous().line);if(this.match(r.Number)||this.match(r.String))return new I(this.previous().literal,this.previous().line);if(this.match(r.Template))return new te(this.previous().literal,this.previous().line);if(this.check(r.Identifier)&&this.tokenAt(1)===r.Arrow){const t=this.advance();this.advance();const e=this.expression();return new At([t],e,t.line)}if(this.match(r.Identifier)){const t=this.previous();return new U(t,t.line)}if(this.check(r.LeftParen)&&this.isArrowParams()){this.advance();const t=[];if(!this.check(r.RightParen))do t.push(this.consume(r.Identifier,"Expected parameter name"));while(this.match(r.Comma));this.consume(r.RightParen,'Expected ")"'),this.consume(r.Arrow,'Expected "=>"');const e=this.expression();return new At(t,e,this.previous().line)}if(this.match(r.LeftParen)){const t=this.expression();return this.consume(r.RightParen,'Expected ")" after expression'),new Zt(t,t.line)}if(this.match(r.LeftBrace))return this.dictionary();if(this.match(r.LeftBracket))return this.list();if(this.match(r.Void)){const t=this.expression();return new ie(t,this.previous().line)}if(this.match(r.Debug)){const t=this.expression();return new Ht(t,this.previous().line)}throw this.error(v.EXPECTED_EXPRESSION,this.peek(),{token:this.peek().lexeme})}dictionary(){const t=this.previous();if(this.match(r.RightBrace))return new St([],this.previous().line);const e=[];do if(this.match(r.DotDotDot))e.push(new K(this.expression(),this.previous().line));else if(this.match(r.String,r.Identifier,r.Number)){const s=this.previous();if(this.match(r.Colon)){const i=this.expression();e.push(new j(null,new at(s,s.line),i,s.line))}else{const i=new U(s,s.line);e.push(new j(null,new at(s,s.line),i,s.line))}}else this.error(v.INVALID_DICTIONARY_KEY,this.peek(),{token:this.peek().lexeme});while(this.match(r.Comma));return this.consume(r.RightBrace,'Expected "}" after object literal'),new St(e,t.line)}list(){const t=[],e=this.previous();if(this.match(r.RightBracket))return new Pt([],this.previous().line);do this.match(r.DotDotDot)?t.push(new K(this.expression(),this.previous().line)):t.push(this.expression());while(this.match(r.Comma));return this.consume(r.RightBracket,'Expected "]" after array declaration'),new Pt(t,e.line)}}function M(n){return n>="0"&&n<="9"}function Ut(n){return n>="a"&&n<="z"||n>="A"&&n<="Z"||n==="$"||n==="_"}function ae(n){return Ut(n)||M(n)}function oe(n){return n.charAt(0).toUpperCase()+n.substring(1).toLowerCase()}function ce(n){return r[n]>=r.And}class Bt{scan(t){for(this.source=t,this.tokens=[],this.current=0,this.start=0,this.line=1,this.col=1;!this.eof();)this.start=this.current,this.getToken();return this.tokens.push(new $t(r.Eof,"",null,this.line,0)),this.tokens}eof(){return this.current>=this.source.length}advance(){return this.peek()===`
`&&(this.line++,this.col=0),this.current++,this.col++,this.source.charAt(this.current-1)}addToken(t,e){const s=this.source.substring(this.start,this.current);this.tokens.push(new $t(t,s,e,this.line,this.col))}match(t){return this.eof()||this.source.charAt(this.current)!==t?!1:(this.current++,!0)}peek(){return this.eof()?"\0":this.source.charAt(this.current)}peekNext(){return this.current+1>=this.source.length?"\0":this.source.charAt(this.current+1)}comment(){for(;this.peek()!==`
`&&!this.eof();)this.advance()}multilineComment(){for(;!this.eof()&&!(this.peek()==="*"&&this.peekNext()==="/");)this.advance();this.eof()?this.error(v.UNTERMINATED_COMMENT):(this.advance(),this.advance())}string(t){for(;this.peek()!==t&&!this.eof();)this.advance();if(this.eof()){this.error(v.UNTERMINATED_STRING,{quote:t});return}this.advance();const e=this.source.substring(this.start+1,this.current-1);this.addToken(t!=="`"?r.String:r.Template,e)}number(){for(;M(this.peek());)this.advance();for(this.peek()==="."&&M(this.peekNext())&&this.advance();M(this.peek());)this.advance();for(this.peek().toLowerCase()==="e"&&(this.advance(),(this.peek()==="-"||this.peek()==="+")&&this.advance());M(this.peek());)this.advance();const t=this.source.substring(this.start,this.current);this.addToken(r.Number,Number(t))}identifier(){for(;ae(this.peek());)this.advance();const t=this.source.substring(this.start,this.current),e=oe(t);ce(e)?this.addToken(r[e],t):this.addToken(r.Identifier,t)}getToken(){const t=this.advance();switch(t){case"(":this.addToken(r.LeftParen,null);break;case")":this.addToken(r.RightParen,null);break;case"[":this.addToken(r.LeftBracket,null);break;case"]":this.addToken(r.RightBracket,null);break;case"{":this.addToken(r.LeftBrace,null);break;case"}":this.addToken(r.RightBrace,null);break;case",":this.addToken(r.Comma,null);break;case";":this.addToken(r.Semicolon,null);break;case"~":this.addToken(r.Tilde,null);break;case"^":this.addToken(r.Caret,null);break;case"#":this.addToken(r.Hash,null);break;case":":this.addToken(this.match("=")?r.Arrow:r.Colon,null);break;case"*":this.addToken(this.match("=")?r.StarEqual:r.Star,null);break;case"%":this.addToken(this.match("=")?r.PercentEqual:r.Percent,null);break;case"|":this.addToken(this.match("|")?r.Or:this.match(">")?r.Pipeline:r.Pipe,null);break;case"&":this.addToken(this.match("&")?r.And:r.Ampersand,null);break;case">":this.addToken(this.match(">")?r.RightShift:this.match("=")?r.GreaterEqual:r.Greater,null);break;case"!":this.addToken(this.match("=")?this.match("=")?r.BangEqualEqual:r.BangEqual:r.Bang,null);break;case"?":this.addToken(this.match("?")?r.QuestionQuestion:this.match(".")?r.QuestionDot:r.Question,null);break;case"=":if(this.match("=")){this.addToken(this.match("=")?r.EqualEqualEqual:r.EqualEqual,null);break}this.addToken(this.match(">")?r.Arrow:r.Equal,null);break;case"+":this.addToken(this.match("+")?r.PlusPlus:this.match("=")?r.PlusEqual:r.Plus,null);break;case"-":this.addToken(this.match("-")?r.MinusMinus:this.match("=")?r.MinusEqual:r.Minus,null);break;case"<":this.addToken(this.match("<")?r.LeftShift:this.match("=")?this.match(">")?r.LessEqualGreater:r.LessEqual:r.Less,null);break;case".":this.match(".")?this.match(".")?this.addToken(r.DotDotDot,null):this.addToken(r.DotDot,null):this.addToken(r.Dot,null);break;case"/":this.match("/")?this.comment():this.match("*")?this.multilineComment():this.addToken(this.match("=")?r.SlashEqual:r.Slash,null);break;case"'":case'"':case"`":this.string(t);break;case`
`:case" ":case"\r":case"	":break;default:M(t)?this.number():Ut(t)?this.identifier():this.error(v.UNEXPECTED_CHARACTER,{char:t});break}}error(t,e={}){throw new $(t,e,this.line,this.col)}}class y{constructor(t,e){this.parent=t||null,this.values=e||{}}init(t){this.values=t||{}}set(t,e){this.values[t]=e}get(t){var e,s;if(typeof this.values[t]<"u")return this.values[t];const i=(s=(e=this.values)==null?void 0:e.constructor)==null?void 0:s.$imports;return i&&typeof i[t]<"u"?i[t]:this.parent!==null?this.parent.get(t):window[t]}}class le{constructor(){this.scope=new y,this.scanner=new Bt,this.parser=new Mt}evaluate(t){return t.result=t.accept(this)}visitPipelineExpr(t){const e=this.evaluate(t.left);if(t.right instanceof ut){const i=this.evaluate(t.right.callee),a=[e];for(const o of t.right.args)o instanceof K?a.push(...this.evaluate(o.value)):a.push(this.evaluate(o));return t.right.callee instanceof R?i.apply(t.right.callee.entity.result,a):i(...a)}return this.evaluate(t.right)(e)}visitArrowFunctionExpr(t){const e=this.scope;return(...s)=>{const i=this.scope;this.scope=new y(e);for(let a=0;a<t.params.length;a++)this.scope.set(t.params[a].lexeme,s[a]);try{return this.evaluate(t.body)}finally{this.scope=i}}}error(t,e={},s,i){throw new $(t,e,s,i)}visitVariableExpr(t){return this.scope.get(t.name.lexeme)}visitAssignExpr(t){const e=this.evaluate(t.value);return this.scope.set(t.name.lexeme,e),e}visitKeyExpr(t){return t.name.literal}visitGetExpr(t){const e=this.evaluate(t.entity),s=this.evaluate(t.key);if(!(!e&&t.type===r.QuestionDot))return e[s]}visitSetExpr(t){const e=this.evaluate(t.entity),s=this.evaluate(t.key),i=this.evaluate(t.value);return e[s]=i,i}visitPostfixExpr(t){const e=this.evaluate(t.entity),s=e+t.increment;if(t.entity instanceof U)this.scope.set(t.entity.name.lexeme,s);else if(t.entity instanceof R){const i=new j(t.entity.entity,t.entity.key,new I(s,t.line),t.line);this.evaluate(i)}else this.error(v.INVALID_POSTFIX_LVALUE,{entity:t.entity},t.line);return e}visitListExpr(t){const e=[];for(const s of t.value)s instanceof K?e.push(...this.evaluate(s.value)):e.push(this.evaluate(s));return e}visitSpreadExpr(t){return this.evaluate(t.value)}templateParse(t){const e=this.scanner.scan(t),s=this.parser.parse(e);let i="";for(const a of s)i+=this.evaluate(a).toString();return i}visitTemplateExpr(t){return t.value.replace(/\{\{([\s\S]+?)\}\}/g,(s,i)=>this.templateParse(i))}visitBinaryExpr(t){const e=this.evaluate(t.left),s=this.evaluate(t.right);switch(t.operator.type){case r.Minus:case r.MinusEqual:return e-s;case r.Slash:case r.SlashEqual:return e/s;case r.Star:case r.StarEqual:return e*s;case r.Percent:case r.PercentEqual:return e%s;case r.Plus:case r.PlusEqual:return e+s;case r.Pipe:return e|s;case r.Caret:return e^s;case r.Greater:return e>s;case r.GreaterEqual:return e>=s;case r.Less:return e<s;case r.LessEqual:return e<=s;case r.EqualEqual:case r.EqualEqualEqual:return e===s;case r.BangEqual:case r.BangEqualEqual:return e!==s;case r.Instanceof:return e instanceof s;case r.In:return e in s;case r.LeftShift:return e<<s;case r.RightShift:return e>>s;default:return this.error(v.UNKNOWN_BINARY_OPERATOR,{operator:t.operator},t.line),null}}visitLogicalExpr(t){const e=this.evaluate(t.left);if(t.operator.type===r.Or){if(e)return e}else if(!e)return e;return this.evaluate(t.right)}visitTernaryExpr(t){return this.evaluate(t.condition)?this.evaluate(t.thenExpr):this.evaluate(t.elseExpr)}visitNullCoalescingExpr(t){const e=this.evaluate(t.left);return e??this.evaluate(t.right)}visitGroupingExpr(t){return this.evaluate(t.expression)}visitLiteralExpr(t){return t.value}visitUnaryExpr(t){const e=this.evaluate(t.right);switch(t.operator.type){case r.Minus:return-e;case r.Bang:return!e;case r.Tilde:return~e;case r.PlusPlus:case r.MinusMinus:{const s=Number(e)+(t.operator.type===r.PlusPlus?1:-1);if(t.right instanceof U)this.scope.set(t.right.name.lexeme,s);else if(t.right instanceof R){const i=new j(t.right.entity,t.right.key,new I(s,t.line),t.line);this.evaluate(i)}else this.error(v.INVALID_PREFIX_RVALUE,{right:t.right},t.line);return s}default:return this.error(v.UNKNOWN_UNARY_OPERATOR,{operator:t.operator},t.line),null}}visitCallExpr(t){const e=this.evaluate(t.callee);if(e==null&&t.optional)return;typeof e!="function"&&this.error(v.NOT_A_FUNCTION,{callee:e},t.line);const s=[];for(const i of t.args)i instanceof K?s.push(...this.evaluate(i.value)):s.push(this.evaluate(i));return t.callee instanceof R?e.apply(t.callee.entity.result,s):e(...s)}visitNewExpr(t){const e=this.evaluate(t.clazz);typeof e!="function"&&this.error(v.NOT_A_CLASS,{clazz:e},t.line);const s=[];for(const i of t.args)s.push(this.evaluate(i));return new e(...s)}visitDictionaryExpr(t){const e={};for(const s of t.properties)if(s instanceof K)Object.assign(e,this.evaluate(s.value));else{const i=this.evaluate(s.key),a=this.evaluate(s.value);e[i]=a}return e}visitTypeofExpr(t){return typeof this.evaluate(t.value)}visitEachExpr(t){return[t.name.lexeme,t.key?t.key.lexeme:null,this.evaluate(t.iterable)]}visitVoidExpr(t){return this.evaluate(t.value),""}visitDebugExpr(t){const e=this.evaluate(t.value);return console.log(e),""}}class F{}class _t extends F{constructor(t,e,s,i,a=0){super(),this.type="element",this.name=t,this.attributes=e,this.children=s,this.self=i,this.line=a}accept(t,e){return t.visitElementKNode(this,e)}toString(){return"KNode.Element"}}class ue extends F{constructor(t,e,s=0){super(),this.type="attribute",this.name=t,this.value=e,this.line=s}accept(t,e){return t.visitAttributeKNode(this,e)}toString(){return"KNode.Attribute"}}class he extends F{constructor(t,e=0){super(),this.type="text",this.value=t,this.line=e}accept(t,e){return t.visitTextKNode(this,e)}toString(){return"KNode.Text"}}let de=class extends F{constructor(t,e=0){super(),this.type="comment",this.value=t,this.line=e}accept(t,e){return t.visitCommentKNode(this,e)}toString(){return"KNode.Comment"}};class pe extends F{constructor(t,e=0){super(),this.type="doctype",this.value=t,this.line=e}accept(t,e){return t.visitDoctypeKNode(this,e)}toString(){return"KNode.Doctype"}}class Gt{parse(t){for(this.current=0,this.line=1,this.col=1,this.source=t,this.nodes=[];!this.eof();){const e=this.node();e!==null&&this.nodes.push(e)}return this.source="",this.nodes}match(...t){for(const e of t)if(this.check(e))return this.current+=e.length,!0;return!1}advance(t=""){this.eof()||(this.check(`
`)&&(this.line+=1,this.col=0),this.eof()?this.error(v.UNEXPECTED_EOF,{eofError:t}):this.current++)}peek(...t){for(const e of t)if(this.check(e))return!0;return!1}check(t){return this.source.slice(this.current,this.current+t.length)===t}eof(){return this.current>this.source.length}error(t,e={}){throw new $(t,e,this.line,this.col)}node(){this.whitespace();let t;return this.match("</")&&this.error(v.UNEXPECTED_CLOSING_TAG),this.match("<!--")?t=this.comment():this.match("<!doctype")||this.match("<!DOCTYPE")?t=this.doctype():this.match("<")?t=this.element():t=this.text(),this.whitespace(),t}comment(){const t=this.current;do this.advance("Expected comment closing '-->'");while(!this.match("-->"));const e=this.source.slice(t,this.current-3);return new de(e,this.line)}doctype(){const t=this.current;do this.advance("Expected closing doctype");while(!this.match(">"));const e=this.source.slice(t,this.current-1).trim();return new pe(e,this.line)}element(){const t=this.line,e=this.identifier("/",">");e||this.error(v.EXPECTED_TAG_NAME);const s=this.attributes();if(this.match("/>")||re.includes(e)&&this.match(">"))return new _t(e,s,[],!0,this.line);this.match(">")||this.error(v.EXPECTED_CLOSING_BRACKET);let i=[];return this.whitespace(),this.peek("</")||(i=this.children(e)),this.close(e),new _t(e,s,i,!1,t)}close(t){this.match("</")||this.error(v.EXPECTED_CLOSING_TAG,{name:t}),this.match(`${t}`)||this.error(v.EXPECTED_CLOSING_TAG,{name:t}),this.whitespace(),this.match(">")||this.error(v.EXPECTED_CLOSING_TAG,{name:t})}children(t){const e=[];do{this.eof()&&this.error(v.EXPECTED_CLOSING_TAG,{name:t});const s=this.node();s!==null&&e.push(s)}while(!this.peek("</"));return e}attributes(){const t=[];for(;!this.peek(">","/>")&&!this.eof();){this.whitespace();const e=this.line,s=this.identifier("=",">","/>");s||this.error(v.BLANK_ATTRIBUTE_NAME),this.whitespace();let i="";this.match("=")&&(this.whitespace(),this.match("'")?i=this.decodeEntities(this.string("'")):this.match('"')?i=this.decodeEntities(this.string('"')):i=this.decodeEntities(this.identifier(">","/>"))),this.whitespace(),t.push(new ue(s,i,e))}return t}text(){const t=this.current,e=this.line;let s=0;for(;!this.eof();){if(this.match("{{")){s++;continue}if(s>0&&this.match("}}")){s--;continue}if(s===0&&this.peek("<"))break;this.advance()}const i=this.source.slice(t,this.current).trim();return i?new he(this.decodeEntities(i),e):null}decodeEntities(t){return t.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&")}whitespace(){let t=0;for(;this.peek(...Lt)&&!this.eof();)t+=1,this.advance();return t}identifier(...t){this.whitespace();const e=this.current;for(;!this.peek(...Lt,...t);)this.advance(`Expected closing ${t}`);const s=this.current;return this.whitespace(),this.source.slice(e,s).trim()}string(t){const e=this.current;for(;!this.match(t);)this.advance(`Expected closing ${t}`);return this.source.slice(e,this.current-1)}}function B(n){history.pushState(null,"",n),window.dispatchEvent(new PopStateEvent("popstate"))}function fe(n,t){if(n==="*")return{};const e=n.split("/").filter(Boolean),s=t.split("/").filter(Boolean);if(e.length!==s.length)return null;const i={};for(let a=0;a<e.length;a++)if(e[a].startsWith(":"))i[e[a].slice(1)]=s[a];else if(e[a]!==s[a])return null;return i}class Ot extends d{constructor(){super(...arguments),this.routes=[]}setRoutes(t){this.routes=t}onMount(){window.addEventListener("popstate",()=>this._navigate(),{signal:this.$abortController.signal}),this._navigate()}async _navigate(){const t=window.location.pathname;for(const e of this.routes){const s=fe(e.path,t);if(s!==null){if(e.guard&&!await e.guard())return;this._mount(e.component,s);return}}}_mount(t,e){const s=this.ref;!s||!this.transpiler||this.transpiler.mountComponent(t,s,e)}}class ot{constructor(t,e="boundary"){this.start=document.createComment(`${e}-start`),this.end=document.createComment(`${e}-end`),t.appendChild(this.start),t.appendChild(this.end)}clear(){var t;let e=this.start.nextSibling;for(;e&&e!==this.end;){const s=e;e=e.nextSibling,(t=s.parentNode)==null||t.removeChild(s)}}insert(t){var e;(e=this.end.parentNode)==null||e.insertBefore(t,this.end)}nodes(){const t=[];let e=this.start.nextSibling;for(;e&&e!==this.end;)t.push(e),e=e.nextSibling;return t}get parent(){return this.start.parentNode}}const V=new Map,me=[];let ht=!1,X=!0;function ge(){ht=!1;for(const[t,e]of V.entries())try{typeof t.onChanges=="function"&&t.onChanges();for(const s of e)s();typeof t.onRender=="function"&&t.onRender()}catch(s){console.error("[Kasper] Error during component update:",s)}V.clear();const n=me.splice(0);for(const t of n)try{t()}catch(e){console.error("[Kasper] Error in nextTick callback:",e)}}function q(n,t){if(!X){t();return}V.has(n)||V.set(n,[]),V.get(n).push(t),ht||(ht=!0,queueMicrotask(ge))}function G(n){const t=X;X=!1;try{n()}finally{X=t}}const It={esc:["Escape","Esc"],escape:["Escape","Esc"],space:[" ","Spacebar"],up:["ArrowUp","Up"],down:["ArrowDown","Down"],left:["ArrowLeft","Left"],right:["ArrowRight","Right"],del:["Delete","Del"],delete:["Delete","Del"],ins:["Insert"],dot:["."],comma:[","],slash:["/"],backslash:["\\"],plus:["+"],minus:["-"],equal:["="]};class ve{constructor(t){this.scanner=new Bt,this.parser=new Mt,this.interpreter=new le,this.registry={},this.mode="development",this.isRendering=!1,this.registry.router={component:Ot,nodes:[]},t&&t.registry&&(this.registry={...this.registry,...t.registry})}evaluate(t,e){if(t.type==="element"){const s=t,i=this.findAttr(s,["@elseif","@else"]);if(i){const a=i.name.startsWith("@")?i.name.slice(1):i.name;this.error(v.MISPLACED_CONDITIONAL,{name:a},s.name)}}t.accept(this,e)}bindMethods(t){var e;if(!t||typeof t!="object")return;let s=Object.getPrototypeOf(t);for(;s&&s!==Object.prototype;){for(const i of Object.getOwnPropertyNames(s))(e=Object.getOwnPropertyDescriptor(s,i))!=null&&e.get||typeof t[i]=="function"&&i!=="constructor"&&!Object.prototype.hasOwnProperty.call(t,i)&&(t[i]=t[i].bind(t));s=Object.getPrototypeOf(s)}}scopedEffect(t){const e=this.interpreter.scope;return pt(()=>{const s=this.interpreter.scope;this.interpreter.scope=e;try{t()}finally{this.interpreter.scope=s}})}execute(t,e){const s=this.scanner.scan(t),i=this.parser.parse(s),a=this.interpreter.scope;e&&(this.interpreter.scope=e);const o=i.map(c=>this.interpreter.evaluate(c));return this.interpreter.scope=a,o&&o.length?o[o.length-1]:void 0}transpile(t,e,s){this.isRendering=!0;try{return this.destroy(s),s.innerHTML="",this.bindMethods(e),this.interpreter.scope.init(e),this.interpreter.scope.set("$instance",e),G(()=>{this.createSiblings(t,s),this.triggerRender()}),s}finally{this.isRendering=!1}}visitElementKNode(t,e){this.createElement(t,e)}visitTextKNode(t,e){try{const s=document.createTextNode("");e&&(e.insert&&typeof e.insert=="function"?e.insert(s):e.appendChild(s));const i=this.scopedEffect(()=>{const a=this.evaluateTemplateString(t.value),o=this.interpreter.scope.get("$instance");o?q(o,()=>{s.textContent=a}):s.textContent=a});this.trackEffect(s,i)}catch(s){this.error(v.RUNTIME_ERROR,{message:s.message||`${s}`},"text node")}}visitAttributeKNode(t,e){const s=document.createAttribute(t.name),i=this.scopedEffect(()=>{s.value=this.evaluateTemplateString(t.value)});this.trackEffect(s,i),e&&e.setAttributeNode(s)}visitCommentKNode(t,e){const s=new Comment(t.value);e&&(e.insert&&typeof e.insert=="function"?e.insert(s):e.appendChild(s))}trackEffect(t,e){t.$kasperEffects||(t.$kasperEffects=[]),t.$kasperEffects.push(e)}findAttr(t,e){if(!t||!t.attributes||!t.attributes.length)return null;const s=t.attributes.find(i=>e.includes(i.name));return s||null}doIf(t,e){const s=new ot(e,"if"),i=()=>{const o=this.interpreter.scope.get("$instance"),c=o?new y(this.interpreter.scope):this.interpreter.scope,m=this.interpreter.scope;this.interpreter.scope=c;const l=[];if(l.push(!!this.execute(t[0][1].value)),!l[0]){for(const g of t.slice(1))if(this.findAttr(g[0],["@elseif"])){const u=!!this.execute(g[1].value);if(l.push(u),u)break}else if(this.findAttr(g[0],["@else"])){l.push(!0);break}}this.interpreter.scope=m;const h=()=>{s.nodes().forEach(u=>this.destroyNode(u)),s.clear();const g=this.interpreter.scope;this.interpreter.scope=c;try{if(l[0]){t[0][0].accept(this,s);return}for(let u=1;u<l.length;u++)if(l[u]){t[u][0].accept(this,s);return}}finally{this.interpreter.scope=g}};o?q(o,h):h()};s.start.$kasperRefresh=i;const a=this.scopedEffect(i);this.trackEffect(s,a)}doEach(t,e,s){const i=this.findAttr(e,["@key"]);i?this.doEachKeyed(t,e,s,i):this.doEachUnkeyed(t,e,s)}doEachUnkeyed(t,e,s){const i=new ot(s,"each"),a=this.interpreter.scope,o=()=>{const m=this.scanner.scan(t.value),[l,h,g]=this.interpreter.evaluate(this.parser.foreach(m)),u=this.interpreter.scope.get("$instance"),p=()=>{i.nodes().forEach(x=>this.destroyNode(x)),i.clear();let b=0;for(const x of g){const k={[l]:x};h&&(k[h]=b),this.interpreter.scope=new y(a,k),this.createElement(e,i),b+=1}this.interpreter.scope=a};u?q(u,p):p()};i.start.$kasperRefresh=o;const c=this.scopedEffect(o);this.trackEffect(i,c)}triggerRefresh(t){var e;t.$kasperRefresh&&t.$kasperRefresh(),t.$kasperEffects&&t.$kasperEffects.forEach(s=>{typeof s.run=="function"&&s.run()}),(e=t.childNodes)==null||e.forEach(s=>this.triggerRefresh(s))}doEachKeyed(t,e,s,i){const a=new ot(s,"each"),o=this.interpreter.scope,c=new Map,m=()=>{const h=this.scanner.scan(t.value),[g,u,p]=this.interpreter.evaluate(this.parser.foreach(h)),b=this.interpreter.scope.get("$instance"),x=[],k=new Set;let S=0;for(const D of p){const L={[g]:D};u&&(L[u]=S),this.interpreter.scope=new y(o,L);const w=this.execute(i.value);this.mode==="development"&&k.has(w)&&console.warn(`[Kasper] Duplicate key detected in @each: "${w}". Keys must be unique to ensure correct reconciliation.`),k.add(w),x.push({item:D,idx:S,key:w}),S++}const C=()=>{var D;const L=new Set(x.map(w=>w.key));for(const[w,N]of c)L.has(w)||(this.destroyNode(N),(D=N.parentNode)==null||D.removeChild(N),c.delete(w));for(const{item:w,idx:N,key:it}of x){const Ct={[g]:w};if(u&&(Ct[u]=N),this.interpreter.scope=new y(o,Ct),c.has(it)){const _=c.get(it);a.insert(_);const rt=_.$kasperScope;rt&&(rt.set(g,w),u&&rt.set(u,N),this.triggerRefresh(_))}else{const _=this.createElement(e,a);_&&(c.set(it,_),_.$kasperScope=this.interpreter.scope)}}this.interpreter.scope=o};b?q(b,C):C()};a.start.$kasperRefresh=m;const l=this.scopedEffect(m);this.trackEffect(a,l)}createSiblings(t,e){let s=0;const i=this.interpreter.scope;let a=null;for(;s<t.length;){const o=t[s++];if(o.type==="element"){const c=o,m=this.findAttr(c,["@let"]);m&&(a||(a=new y(i),this.interpreter.scope=a),this.execute(m.value));const l=this.findAttr(c,["@if"]),h=this.findAttr(c,["@elseif"]),g=this.findAttr(c,["@else"]),u=this.findAttr(c,["@each"]);if(this.mode==="development"&&[l,h,g,u].filter(b=>b).length>1&&this.error(v.MULTIPLE_STRUCTURAL_DIRECTIVES,{},c.name),u){this.doEach(u,c,e);continue}if(l){const p=[[c,l]];for(;s<t.length;){const b=this.findAttr(t[s],["@else","@elseif"]);if(b)p.push([t[s],b]),s+=1;else break}this.doIf(p,e);continue}}this.evaluate(o,e)}this.interpreter.scope=i}createElement(t,e){var s;try{if(t.name==="slot"){const l=this.findAttr(t,["@name"]),h=l?l.value:"default",g=this.interpreter.scope.get("$slots");if(g&&g[h]){const u=this.interpreter.scope;g[h].scope&&(this.interpreter.scope=g[h].scope),this.createSiblings(g[h],e),this.interpreter.scope=u}return}const i=t.name==="void",a=!!this.registry[t.name],o=i?e:document.createElement(t.name),c=this.interpreter.scope;if(o&&o!==e&&this.interpreter.scope.set("$ref",o),a){let l={};const h=t.attributes.filter(p=>p.name.startsWith("@:")),g=this.createComponentArgs(h),u={default:[]};u.default.scope=this.interpreter.scope;for(const p of t.children){if(p.type==="element"){const b=this.findAttr(p,["@slot"]);if(b){const x=b.value;u[x]||(u[x]=[],u[x].scope=this.interpreter.scope),u[x].push(p);continue}}u.default.push(p)}if((s=this.registry[t.name])!=null&&s.component){l=new this.registry[t.name].component({args:g,ref:o,transpiler:this}),this.bindMethods(l),o.$kasperInstance=l;const p=this.registry[t.name].nodes;if(l.$render=()=>{this.isRendering=!0;try{this.destroy(o),o.innerHTML="";const b=new y(c,l);b.set("$instance",l),l.$slots=u;const x=this.interpreter.scope;this.interpreter.scope=b,G(()=>{this.createSiblings(p,o),typeof l.onRender=="function"&&l.onRender()}),this.interpreter.scope=x}finally{this.isRendering=!1}},t.name==="router"&&l instanceof Ot){const b=new y(c,l);l.setRoutes(this.extractRoutes(t.children,void 0,b))}typeof l.onMount=="function"&&l.onMount()}return l.$slots=u,this.interpreter.scope=new y(c,l),this.interpreter.scope.set("$instance",l),G(()=>{this.createSiblings(this.registry[t.name].nodes,o),l&&typeof l.onRender=="function"&&l.onRender()}),this.interpreter.scope=c,e&&(e.insert&&typeof e.insert=="function"?e.insert(o):e.appendChild(o)),o}if(!i){const l=t.attributes.filter(u=>u.name.startsWith("@on:"));for(const u of l)this.createEventListener(o,u);const h=t.attributes.filter(u=>!u.name.startsWith("@"));for(const u of h)this.evaluate(u,o);const g=t.attributes.filter(u=>{const p=u.name;return p.startsWith("@")&&!["@if","@elseif","@else","@each","@let","@key","@ref"].includes(p)&&!p.startsWith("@on:")&&!p.startsWith("@:")});for(const u of g){const p=u.name.slice(1);if(p==="class"){let b="";const x=this.scopedEffect(()=>{const k=this.execute(u.value),S=this.interpreter.scope.get("$instance"),C=()=>{const L=(o.getAttribute("class")||"").split(" ").filter(N=>N!==b&&N!=="").join(" "),w=L?`${L} ${k}`:k;o.setAttribute("class",w),b=k};S?q(S,C):C()});this.trackEffect(o,x)}else{const b=this.scopedEffect(()=>{const x=this.execute(u.value),k=this.interpreter.scope.get("$instance"),S=()=>{if(x===!1||x===null||x===void 0)p!=="style"&&o.removeAttribute(p);else if(p==="style"){const C=o.getAttribute("style"),D=C&&!C.includes(x)?`${C.endsWith(";")?C:C+";"} ${x}`:x;o.setAttribute("style",D)}else o.setAttribute(p,x)};k?q(k,S):S()});this.trackEffect(o,b)}}}e&&!i&&(e.insert&&typeof e.insert=="function"?e.insert(o):e.appendChild(o));const m=this.findAttr(t,["@ref"]);if(m&&!i){const l=m.value.trim(),h=this.interpreter.scope.get("$instance");h?h[l]=o:this.interpreter.scope.set(l,o)}return t.self||(this.createSiblings(t.children,o),this.interpreter.scope=c),o}catch(i){this.error(v.RUNTIME_ERROR,{message:i.message||`${i}`},t.name)}}createComponentArgs(t){if(!t.length)return{};const e={};for(const s of t){const i=s.name.split(":")[1];e[i]=this.execute(s.value)}return e}createEventListener(t,e){const[s,...i]=e.name.split(":")[1].split("."),a=new y(this.interpreter.scope),o=this.interpreter.scope.get("$instance"),c={};o&&o.$abortController&&(c.signal=o.$abortController.signal),i.includes("once")&&(c.once=!0),i.includes("passive")&&(c.passive=!0),i.includes("capture")&&(c.capture=!0);const m=["prevent","stop","once","passive","capture","ctrl","shift","alt","meta"],l=i.filter(h=>!m.includes(h.toLowerCase()));t.addEventListener(s,h=>{l.length>0&&!l.some(u=>{var p;const b=u.toLowerCase();return!!(It[b]&&It[b].includes(h.key)||b===((p=h.key)==null?void 0:p.toLowerCase()))})||i.includes("ctrl")&&!h.ctrlKey||i.includes("shift")&&!h.shiftKey||i.includes("alt")&&!h.altKey||i.includes("meta")&&!h.metaKey||(i.includes("prevent")&&h.preventDefault(),i.includes("stop")&&h.stopPropagation(),a.set("$event",h),this.execute(e.value,a))},c)}evaluateTemplateString(t){return t&&(/\{\{.+\}\}/ms.test(t)?t.replace(/\{\{([\s\S]+?)\}\}/g,(s,i)=>this.evaluateExpression(i)):t)}evaluateExpression(t){const e=this.scanner.scan(t),s=this.parser.parse(e);let i="";for(const a of s)i+=`${this.interpreter.evaluate(a)}`;return i}destroyNode(t){var e;if(t.$kasperInstance){const s=t.$kasperInstance;s.onDestroy&&s.onDestroy(),s.$abortController&&s.$abortController.abort()}if(t.$kasperEffects&&(t.$kasperEffects.forEach(s=>s()),t.$kasperEffects=[]),t.attributes)for(let s=0;s<t.attributes.length;s++){const i=t.attributes[s];i.$kasperEffects&&(i.$kasperEffects.forEach(a=>a()),i.$kasperEffects=[])}(e=t.childNodes)==null||e.forEach(s=>this.destroyNode(s))}destroy(t){t.childNodes.forEach(e=>this.destroyNode(e))}mountComponent(t,e,s={}){this.destroy(e),e.innerHTML="";const i=t.template;if(!i)return;const a=new Gt().parse(i),o=document.createElement("div");e.appendChild(o);const c=new t({args:{params:s},ref:o,transpiler:this});this.bindMethods(c),o.$kasperInstance=c;const m=a;c.$render=()=>{this.isRendering=!0;try{this.destroy(o),o.innerHTML="";const g=new y(null,c);g.set("$instance",c);const u=this.interpreter.scope;this.interpreter.scope=g,G(()=>{this.createSiblings(m,o),typeof c.onRender=="function"&&c.onRender()}),this.interpreter.scope=u}finally{this.isRendering=!1}},typeof c.onMount=="function"&&c.onMount();const l=new y(null,c);l.set("$instance",c);const h=this.interpreter.scope;this.interpreter.scope=l,G(()=>{this.createSiblings(a,o),typeof c.onRender=="function"&&c.onRender()}),this.interpreter.scope=h,typeof c.onRender=="function"&&c.onRender()}extractRoutes(t,e,s){const i=[],a=s?this.interpreter.scope:void 0;s&&(this.interpreter.scope=s);for(const o of t){if(o.type!=="element")continue;const c=o;if(c.name==="route"){const m=this.findAttr(c,["@path"]),l=this.findAttr(c,["@component"]),h=this.findAttr(c,["@guard"]);(!m||!l)&&this.error(v.MISSING_REQUIRED_ATTR,{message:"<route> requires @path and @component attributes."},c.name);const g=m.value,u=this.execute(l.value),p=h?this.execute(h.value):e;i.push({path:g,component:u,guard:p})}else if(c.name==="guard"){const m=this.findAttr(c,["@check"]);if(m||this.error(v.MISSING_REQUIRED_ATTR,{message:"<guard> requires @check attribute."},c.name),!m)continue;const l=this.execute(m.value);i.push(...this.extractRoutes(c.children,l))}}return s&&(this.interpreter.scope=a),i}triggerRender(){if(this.isRendering)return;const t=this.interpreter.scope.get("$instance");t&&typeof t.onRender=="function"&&t.onRender()}visitDoctypeKNode(t){}error(t,e,s){let i=e;throw typeof e=="string"&&(i={message:e.includes("Runtime Error")?e.replace("Runtime Error: ",""):e}),new $(t,i,void 0,void 0,s)}}function be(n,t,e){const s=document.createElement(t),i=new e[t].component({ref:s,transpiler:n,args:{}});return{node:s,instance:i,nodes:e[t].nodes}}function Ee(n,t){const e={...n};for(const s of Object.keys(n)){const i=n[s];if(i.nodes||(i.nodes=[]),i.nodes.length>0)continue;if(i.selector){const o=document.querySelector(i.selector);if(o){i.template=o,i.nodes=t.parse(o.innerHTML);continue}}if(typeof i.template=="string"){i.nodes=t.parse(i.template);continue}const a=i.component.template;a&&(i.nodes=t.parse(a))}return e}function xe(n){const t=new Gt,e=typeof n.root=="string"?document.querySelector(n.root):n.root;if(!e)throw new $(v.ROOT_ELEMENT_NOT_FOUND,{root:n.root});const s=n.entry||"kasper-app";if(!n.registry[s])throw new $(v.ENTRY_COMPONENT_NOT_FOUND,{tag:s});const i=Ee(n.registry,t),a=new ve({registry:i});n.mode?a.mode=n.mode:a.mode="development";const{node:o,instance:c,nodes:m}=be(a,s,i);return e&&(e.innerHTML="",e.appendChild(o)),typeof c.onMount=="function"&&c.onMount(),a.transpile(m,c,o),typeof c.onRender=="function"&&c.onRender(),c}(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","Home"),n.textContent=`.home {
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
}`,document.head.appendChild(n)})();class Y extends d{navigate(t){B(t)}}Y.template=`<div class="home">
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
  </div>`;Y.$imports={Component:d,navigate:B};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","TodoApp"),n.textContent=`.todo-app {
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
  }`,document.head.appendChild(n)})();class Z extends d{constructor(){super(...arguments),this.newTodo=f(""),this.todos=f([]),this.remaining=this.computed(()=>this.todos.value.filter(t=>!t.done.value).length)}addTodo(){const t=this.newTodo.value.trim();t&&(this.todos.value=[...this.todos.value,{id:Date.now(),text:t,done:f(!1)}],this.newTodo.value="")}removeTodo(t){this.todos.value=this.todos.value.filter(e=>e.id!==t)}clearCompleted(){this.todos.value=this.todos.value.filter(t=>!t.done.value)}}Z.template=`<div class="todo-app">
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
  </div>`;Z.$imports={Component:d,signal:f};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","DisplayCounter"),n.textContent=`.display-box {
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
}`,document.head.appendChild(n)})();class J extends d{constructor(){super(...arguments),this.displayValue=this.computed(()=>{const t=this.args.value;return t&&typeof t=="object"&&"value"in t?t.value:t}),this.message=this.computed(()=>{const t=this.displayValue.value;return t===0?"Zero":t>0?"Positive":"Negative"})}}J.template=`<div class="display-box">
    <strong>{{args.label}}</strong>
    <p>Value: {{displayValue.value}}</p>
    <p class="status">{{message.value}}</p>
  </div>`;J.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","CounterExample"),n.textContent=`.counter-example {
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
}`,document.head.appendChild(n)})();class T extends d{constructor(){super(...arguments),this.count=f(0)}increment(){this.count.value++}decrement(){this.count.value--}}T.template=`<div class="counter-example">
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
  </div>`;T.$imports={Component:d,signal:f,DisplayCounter:J};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","KanbanBoard"),n.textContent=`.kanban-page {
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
}`,document.head.appendChild(n)})();class tt extends d{constructor(){super(...arguments),this.isDialogOpen=f(!1),this.tasks=f([{id:"1",title:"Learn Kasper.js",description:"Read the documentation and build a demo.",status:"todo"},{id:"2",title:"Setup Project",description:"Initialize the vite project with kasper plugin.",status:"done"}])}addTask(t){const e={id:Date.now().toString(),...t,status:"todo"};this.tasks.value=[...this.tasks.value,e]}moveTask(t,e){this.tasks.value=this.tasks.value.map(s=>s.id===t?{...s,status:e}:s)}closeDialog(){this.isDialogOpen.value=!1}}tt.template=`<div class="kanban-page">
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
  </div>`;tt.$imports={Component:d,signal:f};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","GameOfLife"),n.textContent=`.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}
.game-header { text-align: center; }
.controls { display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: center; flex-wrap: wrap; }
.stats { margin-top: 0.5rem; font-size: 0.9rem; color: #666; font-family: monospace; }

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

.cell {
  background: white;
  cursor: pointer;
}
.cell.alive { background: #2c3e50; }
.cell:hover { background: #ecf0f1; }
.cell.alive:hover { background: #34495e; }`,document.head.appendChild(n)})();class et extends d{constructor(){super(...arguments),this.rows=50,this.cols=50,this.grid=f(new Array(2500).fill(!1)),this.isPlaying=f(!1),this.generation=f(0),this.timer=null}onMount(){this.randomize()}onDestroy(){this.stop()}togglePlay(){this.isPlaying.value?this.stop():this.start()}start(){this.isPlaying.value=!0,this.timer=setInterval(()=>this.nextGeneration(),100)}stop(){this.isPlaying.value=!1,this.timer&&clearInterval(this.timer)}toggleCell(t){const e=[...this.grid.value];e[t]=!e[t],this.grid.value=e}randomize(){P(()=>{this.grid.value=this.grid.value.map(()=>Math.random()>.8),this.generation.value=0})}clear(){P(()=>{this.grid.value=new Array(this.rows*this.cols).fill(!1),this.generation.value=0,this.stop()})}nextGeneration(){const t=this.grid.value,e=new Array(this.rows*this.cols);let s=!1;for(let i=0;i<this.rows;i++)for(let a=0;a<this.cols;a++){const o=i*this.cols+a,c=this.countNeighbors(i,a),m=t[o];m&&(c<2||c>3)?(e[o]=!1,s=!0):!m&&c===3?(e[o]=!0,s=!0):e[o]=m}s?P(()=>{this.grid.value=e,this.generation.value++}):this.stop()}countNeighbors(t,e){let s=0;for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++){if(i===0&&a===0)continue;const o=t+i,c=e+a;o>=0&&o<this.rows&&c>=0&&c<this.cols&&this.grid.value[o*this.cols+c]&&s++}return s}}et.template=`<div class="game-container">
    <div class="game-header">
      <h1>Conway's Game of Life</h1>
      <div class="controls">
        <ui-button @:onClick="togglePlay" @:variant="isPlaying.value ? 'danger' : 'success'">
          {{ isPlaying.value ? 'Stop' : 'Start' }}
        </ui-button>
        <ui-button @:onClick="nextGeneration" @:variant="'primary'">Next Gen</ui-button>
        <ui-button @:onClick="randomize" @:variant="'secondary'">Randomize</ui-button>
        <ui-button @:onClick="clear" @:variant="'outline'">Clear</ui-button>
      </div>
      <p class="stats">Generation: {{ generation.value }} | Grid: 50x50</p>
    </div>

    <div class="grid">
      <div 
        @each="cell with i of grid.value" 
        @class="'cell ' + (cell ? 'alive' : 'dead')"
        @on:click="toggleCell(i)"
      ></div>
    </div>
  </div>`;et.$imports={Component:d,signal:f,batch:P};const nt="https://69b23f3de06ef68ddd946d85.mockapi.io/products",A=f([]),W=f(!1),H=f(null);async function dt(){W.value=!0,H.value=null;try{const n=await fetch(nt);if(!n.ok)throw new Error("Failed to fetch products");A.value=await n.json()}catch(n){H.value=n.message}finally{W.value=!1}}async function zt(n){try{const e=await(await fetch(nt,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();A.value=[e,...A.value]}catch(t){console.error("Add failed:",t)}}async function jt(n,t){try{const e=await fetch(`${nt}/${n}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error("Update failed");const s=await e.json();A.value=A.value.map(i=>i.id===n?s:i)}catch(e){console.error("Update failed:",e)}}async function Vt(n){try{await fetch(`${nt}/${n}`,{method:"DELETE"}),A.value=A.value.filter(t=>t.id!==n)}catch(t){console.error("Delete failed:",t)}}(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","ProductCatalog"),n.textContent=`.catalog-page { padding: 1rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem; }

.filters-bar { display: flex; gap: 1rem; margin-bottom: 2rem; background: white; padding: 1rem; border-radius: var(--radius); border: 1px solid var(--color-border); }
.search-input { flex: 1; padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit; }
.sort-select { padding: 0.6rem; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit; background: white; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

.card-title { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.price-tag { color: var(--color-primary); font-weight: 800; }
.product-desc { font-size: 0.9rem; color: #475569; margin: 0; line-height: 1.6; min-height: 3em; }
.product-meta { display: flex; gap: 1rem; margin-top: 1rem; font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; }

.card-actions { display: flex; gap: 0.5rem; width: 100%; justify-content: flex-end; }

.loading-state, .error-state { text-align: center; padding: 4rem; color: var(--color-text-muted); }
.spinner { width: 32px; height: 32px; border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.text-muted { color: var(--color-text-muted); font-size: 0.9rem; }`,document.head.appendChild(n)})();class st extends d{constructor(){super(...arguments),this.searchQuery=f(""),this.sortBy=f("newest"),this.isAddOpen=f(!1),this.isEditOpen=f(!1),this.isConfirmOpen=f(!1),this.editingProduct=f(null),this.productToDelete=f(null),this.isLoading=W,this.error=H,this.filteredProducts=this.computed(()=>{let t=[...A.value];if(this.searchQuery.value){const e=this.searchQuery.value.toLowerCase();t=t.filter(s=>s.name.toLowerCase().includes(e)||s.department.toLowerCase().includes(e))}switch(this.sortBy.value){case"price-low":t.sort((e,s)=>Number(e.price)-Number(s.price));break;case"price-high":t.sort((e,s)=>Number(s.price)-Number(e.price));break;case"name":t.sort((e,s)=>e.name.localeCompare(s.name));break;default:t.sort((e,s)=>s.id.localeCompare(e.id))}return t})}onMount(){A.value.length===0&&dt()}fetchProducts(){dt()}async handleAdd(t){await zt(t),this.isAddOpen.value=!1}handleEdit(t){P(()=>{this.editingProduct.value=t,this.isEditOpen.value=!0})}closeEdit(){P(()=>{this.isEditOpen.value=!1,this.editingProduct.value=null})}async handleUpdate(t){this.editingProduct.value&&(await jt(this.editingProduct.value.id,t),this.closeEdit())}confirmDelete(t){P(()=>{this.productToDelete.value=t,this.isConfirmOpen.value=!0})}async executeDelete(){if(this.productToDelete.value){const t=this.productToDelete.value.id;P(()=>{this.isConfirmOpen.value=!1,this.productToDelete.value=null}),await Vt(t)}}}st.template=`<div class="catalog-page">
    <div class="page-header">
      <div>
        <h1>Product Catalog</h1>
        <p class="subtitle">Showing {{ filteredProducts.value.length }} products</p>
      </div>
      <ui-button @:onClick="() => isAddOpen.value = true" @:variant="'success'">+ Add Product</ui-button>
    </div>

    <div class="filters-bar">
      <input 
        type="text" 
        placeholder="Search products..." 
        @value="searchQuery.value" 
        @on:input="searchQuery.value = $event.target.value"
        class="search-input"
      />
      <select @on:change="sortBy.value = $event.target.value" class="sort-select">
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
            <ui-button @:onClick="() => handleEdit(p)" @:variant="'outline'">Edit</ui-button>
            <ui-button @:onClick="() => confirmDelete(p)" @:variant="'danger'">Delete</ui-button>
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
        <ui-button @:onClick="() => isConfirmOpen.value = false" @:variant="'secondary'">Cancel</ui-button>
        <ui-button @:onClick="executeDelete" @:variant="'danger'">Delete Product</ui-button>
      </div>
    </ui-dialog>
  </div>`;st.$imports={Component:d,signal:f,batch:P,products:A,isLoading:W,error:H,fetchProducts:dt,addProduct:zt,updateProduct:jt,deleteProduct:Vt};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","App"),n.textContent=`:root {
  /* Semantic Colors */
  --color-primary: #6366f1;       /* Indigo 500 */
  --color-primary-dark: #4f46e5;
  --color-success: #10b981;       /* Emerald 500 */
  --color-danger: #f43f5e;        /* Rose 500 */
  --color-warning: #f59e0b;       /* Amber 500 */
  --color-info: #0ea5e9;          /* Sky 500 */
  
  /* Grays */
  --color-bg: #f8fafc;            /* Slate 50 */
  --color-surface: #ffffff;
  --color-text: #1e293b;          /* Slate 800 */
  --color-text-muted: #64748b;    /* Slate 500 */
  --color-border: #e2e8f0;        /* Slate 200 */
  
  --max-content-width: 1280px;
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
}`,document.head.appendChild(n)})();class ft extends d{navigate(t){B(t)}}ft.template=`<ui-navbar @:onNavigate="navigate"></ui-navbar>

  <ui-content>
    <router>
      <route @path="/" @component="Home" />
      <route @path="/todo" @component="TodoApp" />
      <route @path="/counter" @component="CounterExample" />
      <route @path="/kanban" @component="KanbanBoard" />
      <route @path="/game" @component="GameOfLife" />
      <route @path="/products" @component="ProductCatalog" />
    </router>
  </ui-content>`;ft.$imports={Component:d,navigate:B,Home:Y,TodoApp:Z,CounterExample:T,KanbanBoard:tt,GameOfLife:et,ProductCatalog:st};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","KanbanColumn"),n.textContent=`.column {
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
}`,document.head.appendChild(n)})();class mt extends d{constructor(){super(...arguments),this.tasks=this.computed(()=>{var s;const t=((s=this.args.allTasks)==null?void 0:s.value)??[],e=this.args.status;return t.filter(i=>i&&i.status===e)})}onMount(){console.log("KanbanColumn:",this.args.title)}onDrop(t){const e=t.dataTransfer.getData("task-id");this.args.onMoveTask(e,this.args.status)}}mt.template=`<div 
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
  </div>`;mt.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","TaskCard"),n.textContent=`.task-card-wrapper {
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
}`,document.head.appendChild(n)})();class gt extends d{onMount(){console.log("TaskCard:",this.args.task.title)}onDragStart(t){t.dataTransfer.setData("task-id",this.args.task.id),t.dataTransfer.effectAllowed="move"}}gt.template=`<div 
    class="task-card-wrapper" 
    draggable="true" 
    @on:dragstart="onDragStart($event)"
  >
    <ui-card>
      <div @slot="header">{{ args.task.title }}</div>
      <p class="desc" @if="args.task.description">{{ args.task.description }}</p>
    </ui-card>
  </div>`;gt.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","AddTaskDialog"),n.textContent=`.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.9rem; }
.form-group input, .form-group textarea {
  width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;
}
.form-group textarea { min-height: 80px; resize: vertical; }`,document.head.appendChild(n)})();class vt extends d{constructor(){super(...arguments),this.title=f(""),this.description=f("")}handleSubmit(){const t=this.title.value.trim();t&&(this.args.onAdd({title:t,description:this.description.value}),this.title.value="",this.description.value="",this.args.onClose())}}vt.template=`<ui-dialog @:isOpen="args.isOpen" @:onClose="args.onClose" @:title="'Add New Task'">
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
  </ui-dialog>`;vt.$imports={Component:d,signal:f};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","Card"),n.textContent=`.card {
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
}`,document.head.appendChild(n)})();class bt extends d{}bt.template=`<div class="card">
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
  </div>`;bt.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","Dialog"),n.textContent=`.modal-overlay {
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
.modal-footer:empty { display: none; }`,document.head.appendChild(n)})();class Et extends d{}Et.template=`<div class="modal-overlay" @if="args.isOpen.value" @on:click.self="args.onClose()">
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
  </div>`;Et.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","UIButton"),n.textContent=`.btn {
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
.btn-outline:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }`,document.head.appendChild(n)})();class xt extends d{get variantClass(){return`btn-${this.args.variant??"primary"}`}}xt.template=`<button 
    @class="'btn ' + variantClass + (args.class ? ' ' + args.class : '')" 
    @type="args.type ?? 'button'"
    @on:click="args.onClick ? args.onClick($event) : null"
    @disabled="args.disabled"
  >
    <slot />
  </button>`;xt.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","UINavbar"),n.textContent=`.ui-navbar {
  background: white;
  border-bottom: 1px solid var(--color-border);
  padding: 0.75rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.8);
}
.ui-navbar-inner {
  width: 100%;
  max-width: var(--max-content-width, 1280px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  box-sizing: border-box;
}
.logo {
  font-weight: 800;
  font-size: 1.25rem;
  color: #0f172a;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-links a {
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: var(--color-primary);
}`,document.head.appendChild(n)})();class wt extends d{navigate(t){this.args.onNavigate?this.args.onNavigate(t):B(t)}}wt.template=`<nav class="ui-navbar">
    <div class="ui-navbar-inner">
      <a @on:click.prevent="args.onNavigate('/')" href="/" class="logo">
        <span class="logo-icon">👻</span> Kasper Demos
      </a>
      <div class="nav-links">
        <a @on:click.prevent="args.onNavigate('/')" href="/">Home</a>
        <a @on:click.prevent="args.onNavigate('/todo')" href="/todo">Todo</a>
        <a @on:click.prevent="navigate('/counter')" href="/counter">Counter</a>
        <a @on:click.prevent="navigate('/kanban')" href="/kanban">Kanban</a>
        <a @on:click.prevent="navigate('/game')" href="/game">Game</a>
        <a @on:click.prevent="navigate('/products')" href="/products">Products</a>
      </div>
    </div>
  </nav>`;wt.$imports={Component:d,navigate:B};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","UIContent"),n.textContent=`.ui-content-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.ui-content {
  width: 100%;
  max-width: var(--max-content-width, 1280px);
  padding: 2rem;
  box-sizing: border-box;
}`,document.head.appendChild(n)})();class yt extends d{}yt.template=`<div class="ui-content-wrapper">
    <div class="ui-content">
      <slot />
    </div>
  </div>`;yt.$imports={Component:d};(function(){if(typeof document>"u")return;const n=document.createElement("style");n.setAttribute("data-kasper","ProductForm"),n.textContent=`.form-grid {
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
.form-group textarea { min-height: 80px; resize: vertical; }`,document.head.appendChild(n)})();class kt extends d{constructor(){super(...arguments),this.name=f(""),this.description=f(""),this.price=f(""),this.department=f(""),this.company=f("")}get productData(){const t=this.args.product;return t&&typeof t=="object"&&"value"in t?t.value:t}get formTitle(){return this.productData?"Edit Product":"Add Product"}get submitLabel(){return this.productData?"Save Changes":"Create Product"}onMount(){const t=this.productData;t&&(this.name.value=t.name??"",this.description.value=t.description??"",this.price.value=t.price??"",this.department.value=t.department??"",this.company.value=t.company??"")}handleSubmit(){this.args.onSubmit({name:this.name.value,description:this.description.value,price:this.price.value,department:this.department.value,company:this.company.value})}}kt.template=`<ui-dialog @:isOpen="args.isOpen" @:onClose="args.onClose" @:title="formTitle">
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
  </ui-dialog>`;kt.$imports={Component:d,signal:f};xe({root:document.querySelector("#app"),entry:"app",registry:{app:{component:ft},home:{component:Y},"todo-app":{component:Z},"counter-example":{component:T},"display-counter":{component:J},"kanban-board":{component:tt},"kanban-column":{component:mt},"task-card":{component:gt},"add-task-dialog":{component:vt},"ui-card":{component:bt},"ui-dialog":{component:Et},"ui-button":{component:xt},"ui-navbar":{component:wt},"ui-content":{component:yt},"game-of-life":{component:et},"product-catalog":{component:st},"product-form":{component:kt}}});
