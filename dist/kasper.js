/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/kasper.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/kasper.ts":
/*!***********************!*\
  !*** ./src/kasper.ts ***!
  \***********************/
/*! exports provided: execute, transpile, parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "execute", function() { return execute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transpile", function() { return transpile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony import */ var _template_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-parser */ "./src/template-parser.ts");
/* harmony import */ var _transpiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transpiler */ "./src/transpiler.ts");
/* harmony import */ var _types_demo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types/demo */ "./src/types/demo.ts");
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./viewer */ "./src/viewer.ts");




function execute(source) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"]();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
        return JSON.stringify(parser.errors);
    }
    const result = JSON.stringify(nodes);
    return result;
}
function transpile(source) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"]();
    const nodes = parser.parse(source);
    const transpiler = new _transpiler__WEBPACK_IMPORTED_MODULE_1__["Transpiler"]();
    const result = transpiler.transpile(nodes);
    return result;
}
function parse(source) {
    const parser = new _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"]();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
        return JSON.stringify(parser.errors);
    }
    return JSON.stringify(nodes);
}
if (typeof window !== "undefined") {
    (window || {}).kasper = {
        demoSourceCode: _types_demo__WEBPACK_IMPORTED_MODULE_2__["DemoSource"],
        execute,
        parse,
        transpile,
    };
}
if (typeof exports !== "undefined") {
    exports.kasper = {
        TemplateParser: _template_parser__WEBPACK_IMPORTED_MODULE_0__["TemplateParser"],
        Transpiler: _transpiler__WEBPACK_IMPORTED_MODULE_1__["Transpiler"],
        Viewer: _viewer__WEBPACK_IMPORTED_MODULE_3__["Viewer"],
        execute,
        parse,
        transpile,
    };
}


/***/ }),

/***/ "./src/template-parser.ts":
/*!********************************!*\
  !*** ./src/template-parser.ts ***!
  \********************************/
/*! exports provided: TemplateParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemplateParser", function() { return TemplateParser; });
/* harmony import */ var _types_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/error */ "./src/types/error.ts");
/* harmony import */ var _types_nodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/nodes */ "./src/types/nodes.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



class TemplateParser {
    parse(source) {
        this.current = 0;
        this.line = 1;
        this.col = 1;
        this.source = source;
        this.errors = [];
        this.nodes = [];
        while (!this.eof()) {
            try {
                const node = this.node();
                if (node === null) {
                    continue;
                }
                this.nodes.push(node);
            }
            catch (e) {
                if (e instanceof _types_error__WEBPACK_IMPORTED_MODULE_0__["KasperError"]) {
                    this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
                }
                else {
                    this.errors.push(`${e}`);
                    if (this.errors.length > 10) {
                        this.errors.push("Parse Error limit exceeded");
                        return this.nodes;
                    }
                }
                break;
            }
        }
        this.source = "";
        return this.nodes;
    }
    match(...chars) {
        for (const char of chars) {
            if (this.check(char)) {
                this.current += char.length;
                return true;
            }
        }
        return false;
    }
    advance(eofError = "") {
        if (!this.eof()) {
            if (this.check("\n")) {
                this.line += 1;
                this.col = 0;
            }
            this.col += 1;
            this.current++;
        }
        else {
            this.error(`Unexpected end of file. ${eofError}`);
        }
    }
    peek(...chars) {
        for (const char of chars) {
            if (this.check(char)) {
                return true;
            }
        }
        return false;
    }
    check(char) {
        return this.source.slice(this.current, this.current + char.length) === char;
    }
    eof() {
        return this.current > this.source.length;
    }
    error(message) {
        throw new _types_error__WEBPACK_IMPORTED_MODULE_0__["KasperError"](message, this.line, this.col);
    }
    node() {
        this.whitespace();
        let node;
        if (this.match("</")) {
            this.error("Unexpected closing tag");
        }
        if (this.match("<!--")) {
            node = this.comment();
        }
        else if (this.match("<!doctype") || this.match("<!DOCTYPE")) {
            node = this.doctype();
        }
        else if (this.match("<")) {
            node = this.element();
        }
        else {
            node = this.text();
        }
        this.whitespace();
        return node;
    }
    comment() {
        const start = this.current;
        do {
            this.advance("Expected comment closing '-->'");
        } while (!this.match(`-->`));
        const comment = this.source.slice(start, this.current - 3);
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Comment"](comment, this.line);
    }
    doctype() {
        const start = this.current;
        do {
            this.advance("Expected closing doctype");
        } while (!this.match(`>`));
        const doctype = this.source.slice(start, this.current - 1).trim();
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Doctype"](doctype, this.line);
    }
    element() {
        const line = this.line;
        const name = this.identifier("/", ">");
        if (!name) {
            this.error("Expected a tag name");
        }
        const attributes = this.attributes();
        if (this.match("/>") ||
            (_utils__WEBPACK_IMPORTED_MODULE_2__["SelfClosingTags"].includes(name) && this.match(">"))) {
            return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, [], true, this.line);
        }
        if (!this.match(">")) {
            this.error("Expected closing tag");
        }
        let children = [];
        this.whitespace();
        if (!this.peek("</")) {
            children = this.children(name);
        }
        this.close(name);
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, children, false, line);
    }
    close(name) {
        if (!this.match("</")) {
            this.error(`Expected </${name}>`);
        }
        if (!this.match(`${name}`)) {
            this.error(`Expected </${name}>`);
        }
        this.whitespace();
        if (!this.match(">")) {
            this.error(`Expected </${name}>`);
        }
    }
    children(parent) {
        const children = [];
        do {
            if (this.eof()) {
                this.error(`Expected </${parent}>`);
            }
            const node = this.node();
            if (node === null) {
                continue;
            }
            children.push(node);
        } while (!this.peek(`</`));
        return children;
    }
    attributes() {
        const attributes = [];
        while (!this.peek(">", "/>") && !this.eof()) {
            this.whitespace();
            const line = this.line;
            const name = this.identifier("=", ">", "/>");
            if (!name) {
                this.error("Blank attribute name");
            }
            this.whitespace();
            let value = "";
            if (this.match("=")) {
                this.whitespace();
                if (this.match("'")) {
                    value = this.string("'");
                }
                else if (this.match('"')) {
                    value = this.string('"');
                }
                else {
                    value = this.identifier(">", "/>");
                }
            }
            this.whitespace();
            attributes.push(new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Attribute"](name, value, line));
        }
        return attributes;
    }
    text() {
        const start = this.current;
        const line = this.line;
        while (!this.peek("<") && !this.eof()) {
            this.advance();
        }
        const text = this.source.slice(start, this.current).trim();
        if (!text) {
            return null;
        }
        return new _types_nodes__WEBPACK_IMPORTED_MODULE_1__["Text"](text, line);
    }
    whitespace() {
        let count = 0;
        while (this.peek(..._utils__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"]) && !this.eof()) {
            count += 1;
            this.advance();
        }
        return count;
    }
    identifier(...closing) {
        this.whitespace();
        const start = this.current;
        while (!this.peek(..._utils__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"], ...closing)) {
            this.advance(`Expected closing ${closing}`);
        }
        const end = this.current;
        this.whitespace();
        return this.source.slice(start, end).trim();
    }
    string(closing) {
        const start = this.current;
        while (!this.match(closing)) {
            this.advance(`Expected closing ${closing}`);
        }
        return this.source.slice(start, this.current - 1);
    }
}


/***/ }),

/***/ "./src/transpiler.ts":
/*!***************************!*\
  !*** ./src/transpiler.ts ***!
  \***************************/
/*! exports provided: Transpiler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transpiler", function() { return Transpiler; });
class Transpiler {
    constructor() {
        this.errors = [];
    }
    evaluate(node) {
        return node.accept(this);
    }
    transpile(nodes) {
        this.errors = [];
        const result = [];
        for (const node of nodes) {
            try {
                result.push(this.evaluate(node));
            }
            catch (e) {
                console.error(`${e}`);
                this.errors.push(`${e}`);
                if (this.errors.length > 100) {
                    this.errors.push("Error limit exceeded");
                    return result;
                }
            }
        }
        return result;
    }
    visitElementNode(node) {
        const element = document.createElement(node.name);
        const attrs = node.attributes.map((attr) => this.evaluate(attr));
        for (const attr of attrs) {
            element.setAttributeNode(attr);
        }
        if (node.self) {
            return element;
        }
        const children = node.children.map((elm) => this.evaluate(elm));
        for (const child of children) {
            element.append(child);
        }
        return element;
    }
    visitAttributeNode(node) {
        const attr = document.createAttribute(node.name);
        if (node.value) {
            attr.value = node.value;
        }
        return attr;
    }
    visitTextNode(node) {
        return document.createTextNode(node.value);
    }
    visitCommentNode(node) {
        return new Comment(node.value);
    }
    visitDoctypeNode(node) {
        return document.implementation.createDocumentType("html", "", "");
    }
    error(message) {
        throw new Error(`Runtime Error => ${message}`);
    }
}


/***/ }),

/***/ "./src/types/demo.ts":
/*!***************************!*\
  !*** ./src/types/demo.ts ***!
  \***************************/
/*! exports provided: DemoSource1, DemoSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoSource1", function() { return DemoSource1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoSource", function() { return DemoSource; });
const DemoSource1 = `
<body    >
<div         class="block w-full flex" id="block"></div>
<img       src="http://url.image.com" border  =  0 />
<div class='b-nana'></div>
<input type=checkbox value =    something />
</body>
`;
const DemoSource = `
<div id="top" role="document">
  <header>
    <h1>HTML5 Test Page</h1>
    <p>This is a test page filled with common HTML elements to be used to provide visual feedback whilst building CSS systems and frameworks.</p>
  </header>
  <nav>
    <ul>
      <li>
        <a href="#embedded">Embedded content</a>
        <ul>
          <li><a href="#embedded__images">Images</a></li>
          <li><a href="#embedded__bgimages">Background images</a></li>
          <li><a href="#embedded__audio">Audio</a></li>
          <li><a href="#embedded__video">Video</a></li>
          <li><a href="#embedded__canvas">Canvas</a></li>
          <li><a href="#embedded__meter">Meter</a></li>
          <li><a href="#embedded__progress">Progress</a></li>
          <li><a href="#embedded__svg">Inline SVG</a></li>
          <li><a href="#embedded__iframe">IFrames</a></li>
          <li><a href="#embedded__embed">Embed</a></li>
          <li><a href="#embedded__object">Object</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</div>
`;


/***/ }),

/***/ "./src/types/error.ts":
/*!****************************!*\
  !*** ./src/types/error.ts ***!
  \****************************/
/*! exports provided: KasperError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KasperError", function() { return KasperError; });
class KasperError {
    constructor(value, line, col) {
        this.line = line;
        this.col = col;
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
}


/***/ }),

/***/ "./src/types/nodes.ts":
/*!****************************!*\
  !*** ./src/types/nodes.ts ***!
  \****************************/
/*! exports provided: Node, Element, Attribute, Text, Comment, Doctype */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Node", function() { return Node; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Element", function() { return Element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return Attribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Comment", function() { return Comment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Doctype", function() { return Doctype; });
class Node {
}
class Element extends Node {
    constructor(name, attributes, children, self, line = 0) {
        super();
        this.type = 'element';
        this.name = name;
        this.attributes = attributes;
        this.children = children;
        this.self = self;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitElementNode(this);
    }
    toString() {
        return 'Node.Element';
    }
}
class Attribute extends Node {
    constructor(name, value, line = 0) {
        super();
        this.type = 'attribute';
        this.name = name;
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitAttributeNode(this);
    }
    toString() {
        return 'Node.Attribute';
    }
}
class Text extends Node {
    constructor(value, line = 0) {
        super();
        this.type = 'text';
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitTextNode(this);
    }
    toString() {
        return 'Node.Text';
    }
}
class Comment extends Node {
    constructor(value, line = 0) {
        super();
        this.type = 'comment';
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitCommentNode(this);
    }
    toString() {
        return 'Node.Comment';
    }
}
class Doctype extends Node {
    constructor(value, line = 0) {
        super();
        this.type = 'doctype';
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitDoctypeNode(this);
    }
    toString() {
        return 'Node.Doctype';
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: isDigit, isAlpha, isAlphaNumeric, capitalize, WhiteSpaces, SelfClosingTags */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDigit", function() { return isDigit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAlpha", function() { return isAlpha; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAlphaNumeric", function() { return isAlphaNumeric; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhiteSpaces", function() { return WhiteSpaces; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelfClosingTags", function() { return SelfClosingTags; });
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function isAlpha(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}
function isAlphaNumeric(char) {
    return isAlpha(char) || isDigit(char);
}
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}
const WhiteSpaces = [" ", "\n", "\t", "\r"];
const SelfClosingTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];


/***/ }),

/***/ "./src/viewer.ts":
/*!***********************!*\
  !*** ./src/viewer.ts ***!
  \***********************/
/*! exports provided: Viewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Viewer", function() { return Viewer; });
class Viewer {
    constructor() {
        this.errors = [];
    }
    evaluate(node) {
        return node.accept(this);
    }
    transpile(nodes) {
        this.errors = [];
        const result = [];
        for (const node of nodes) {
            try {
                result.push(this.evaluate(node));
            }
            catch (e) {
                console.error(`${e}`);
                this.errors.push(`${e}`);
                if (this.errors.length > 100) {
                    this.errors.push("Error limit exceeded");
                    return result;
                }
            }
        }
        return result;
    }
    visitElementNode(node) {
        let attrs = node.attributes.map((attr) => this.evaluate(attr)).join(" ");
        if (attrs.length) {
            attrs = " " + attrs;
        }
        if (node.self) {
            return `<${node.name}${attrs}/>`;
        }
        const children = node.children.map((elm) => this.evaluate(elm)).join("");
        return `<${node.name}${attrs}>${children}</${node.name}>`;
    }
    visitAttributeNode(node) {
        if (node.value) {
            return `${node.name}="${node.value}"`;
        }
        return node.name;
    }
    visitTextNode(node) {
        return node.value;
    }
    visitCommentNode(node) {
        return `<!-- ${node.value} -->`;
    }
    visitDoctypeNode(node) {
        return `<!doctype ${node.value}>`;
    }
    error(message) {
        throw new Error(`Runtime Error => ${message}`);
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2thc3Blci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGUtcGFyc2VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9kZW1vLnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy9lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMvbm9kZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy92aWV3ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW1EO0FBQ1Q7QUFDQTtBQUNSO0FBRTNCLFNBQVMs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QUssRUFBRTtZQUNkLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztTQUN2QztRQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRU0sYUFBYSxDQUFDLElBQWdCO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsSUFBbUI7UUFDekMsT0FBTyxRQUFRLElBQUksQ0FBQyxLQUFLLE1BQU0sQ0FBQztJQUNsQyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsSUFBbUI7UUFDekMsT0FBTyxhQUFhLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUNwQyxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQWU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0YiLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMva2FzcGVyLnRzXCIpO1xuIiwiaW1wb3J0IHsgVGVtcGxhdGVQYXJzZXIgfSBmcm9tIFwiLi90ZW1wbGF0ZS1wYXJzZXJcIjtcbmltcG9ydCB7IFRyYW5zcGlsZXIgfSBmcm9tIFwiLi90cmFuc3BpbGVyXCI7XG5pbXBvcnQgeyBEZW1vU291cmNlIH0gZnJvbSBcIi4vdHlwZXMvZGVtb1wiO1xuaW1wb3J0IHsgVmlld2VyIH0gZnJvbSBcIi4vdmlld2VyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGlmIChwYXJzZXIuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJzZXIuZXJyb3JzKTtcbiAgfVxuICBjb25zdCByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShub2Rlcyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3BpbGUoc291cmNlOiBzdHJpbmcpOiBOb2RlW10ge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgVGVtcGxhdGVQYXJzZXIoKTtcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcbiAgY29uc3QgdHJhbnNwaWxlciA9IG5ldyBUcmFuc3BpbGVyKCk7XG4gIGNvbnN0IHJlc3VsdCA9IHRyYW5zcGlsZXIudHJhbnNwaWxlKG5vZGVzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XG4gIGlmIChwYXJzZXIuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJzZXIuZXJyb3JzKTtcbiAgfVxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAoKHdpbmRvdyBhcyBhbnkpIHx8IHt9KS5rYXNwZXIgPSB7XG4gICAgZGVtb1NvdXJjZUNvZGU6IERlbW9Tb3VyY2UsXG4gICAgZXhlY3V0ZSxcbiAgICBwYXJzZSxcbiAgICB0cmFuc3BpbGUsXG4gIH07XG59XG5cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBleHBvcnRzLmthc3BlciA9IHtcbiAgICBUZW1wbGF0ZVBhcnNlcixcbiAgICBUcmFuc3BpbGVyLFxuICAgIFZpZXdlcixcbiAgICBleGVjdXRlLFxuICAgIHBhcnNlLFxuICAgIHRyYW5zcGlsZSxcbiAgfTtcbn1cbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vdHlwZXMvZXJyb3JcIjtcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vdHlwZXMvbm9kZXNcIjtcbmltcG9ydCB7IFNlbGZDbG9zaW5nVGFncywgV2hpdGVTcGFjZXMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIge1xuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcbiAgcHVibGljIGVycm9yczogc3RyaW5nW107XG4gIHB1YmxpYyBub2RlczogTm9kZS5Ob2RlW107XG5cbiAgcHVibGljIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogTm9kZS5Ob2RlW10ge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gICAgdGhpcy5saW5lID0gMTtcbiAgICB0aGlzLmNvbCA9IDE7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICB0aGlzLm5vZGVzID0gW107XG5cbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgS2FzcGVyRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGBQYXJzZSBFcnJvciAoJHtlLmxpbmV9OiR7ZS5jb2x9KSA9PiAke2UudmFsdWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAxMCkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIlBhcnNlIEVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XG4gIH1cblxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlKGVvZkVycm9yOiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVvZigpKSB7XG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcbiAgICAgICAgdGhpcy5jb2wgPSAwO1xuICAgICAgfVxuICAgICAgdGhpcy5jb2wgKz0gMTtcbiAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGVuZCBvZiBmaWxlLiAke2VvZkVycm9yfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVlayguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcbiAgfVxuXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPiB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xuICB9XG5cbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuTm9kZSB7XG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgbGV0IG5vZGU6IE5vZGUuTm9kZTtcblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcbiAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XG4gICAgICBub2RlID0gdGhpcy5kb2N0eXBlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5Ob2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcbiAgICBjb25zdCBjb21tZW50ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDMpO1xuICAgIHJldHVybiBuZXcgTm9kZS5Db21tZW50KGNvbW1lbnQsIHRoaXMubGluZSk7XG4gIH1cblxuICBwcml2YXRlIGRvY3R5cGUoKTogTm9kZS5Ob2RlIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICBkbyB7XG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYD5gKSk7XG4gICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLk5vZGUge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRydWUsIHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgZmFsc2UsIGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8L1wiKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWF0Y2goYCR7bmFtZX1gKSkge1xuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xuICAgIH1cbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGlsZHJlbihwYXJlbnQ6IHN0cmluZyk6IE5vZGUuTm9kZVtdIHtcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCbGFuayBhdHRyaWJ1dGUgbmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZyhcIidcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoJ1wiJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgbGluZSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLk5vZGUge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmxpbmU7XG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI8XCIpICYmICF0aGlzLmVvZigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0ZXh0LCBsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgd2hpdGVzcGFjZSgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgcHJpdmF0ZSBpZGVudGlmaWVyKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMucGVlayguLi5XaGl0ZVNwYWNlcywgLi4uY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2luZykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIEtOb2RlIGZyb20gXCJAa2FzcGVyL3R5cGVzL25vZGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNwaWxlciBpbXBsZW1lbnRzIEtOb2RlLk5vZGVWaXNpdG9yPE5vZGU+IHtcclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIGV2YWx1YXRlKG5vZGU6IEtOb2RlLk5vZGUpOiBOb2RlIHtcclxuICAgIHJldHVybiBub2RlLmFjY2VwdCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0cmFuc3BpbGUobm9kZXM6IEtOb2RlLk5vZGVbXSk6IE5vZGVbXSB7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmV2YWx1YXRlKG5vZGUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1gKTtcclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwMCkge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRFbGVtZW50Tm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogTm9kZSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlLm5hbWUpO1xyXG5cclxuICAgIGNvbnN0IGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzLm1hcCgoYXR0cikgPT4gdGhpcy5ldmFsdWF0ZShhdHRyKSk7XHJcbiAgICBmb3IgKGNvbnN0IGF0dHIgb2YgYXR0cnMpIHtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIgYXMgQXR0cik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSk7XHJcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZU5vZGUobm9kZTogS05vZGUuQXR0cmlidXRlKTogTm9kZSB7XHJcbiAgICBjb25zdCBhdHRyID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5vZGUubmFtZSk7XHJcbiAgICBpZiAobm9kZS52YWx1ZSkge1xyXG4gICAgICBhdHRyLnZhbHVlID0gbm9kZS52YWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBhdHRyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0VGV4dE5vZGUobm9kZTogS05vZGUuVGV4dCk6IE5vZGUge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5vZGUudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudE5vZGUobm9kZTogS05vZGUuQ29tbWVudCk6IE5vZGUge1xyXG4gICAgcmV0dXJuIG5ldyBDb21tZW50KG5vZGUudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0RG9jdHlwZU5vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IE5vZGUge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50VHlwZShcImh0bWxcIiwgXCJcIiwgXCJcIik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3QgRGVtb1NvdXJjZTEgPSBgXG48Ym9keSAgICA+XG48ZGl2ICAgICAgICAgY2xhc3M9XCJibG9jayB3LWZ1bGwgZmxleFwiIGlkPVwiYmxvY2tcIj48L2Rpdj5cbjxpbWcgICAgICAgc3JjPVwiaHR0cDovL3VybC5pbWFnZS5jb21cIiBib3JkZXIgID0gIDAgLz5cbjxkaXYgY2xhc3M9J2ItbmFuYSc+PC9kaXY+XG48aW5wdXQgdHlwZT1jaGVja2JveCB2YWx1ZSA9ICAgIHNvbWV0aGluZyAvPlxuPC9ib2R5PlxuYDtcbmV4cG9ydCBjb25zdCBEZW1vU291cmNlID0gYFxuPGRpdiBpZD1cInRvcFwiIHJvbGU9XCJkb2N1bWVudFwiPlxuICA8aGVhZGVyPlxuICAgIDxoMT5IVE1MNSBUZXN0IFBhZ2U8L2gxPlxuICAgIDxwPlRoaXMgaXMgYSB0ZXN0IHBhZ2UgZmlsbGVkIHdpdGggY29tbW9uIEhUTUwgZWxlbWVudHMgdG8gYmUgdXNlZCB0byBwcm92aWRlIHZpc3VhbCBmZWVkYmFjayB3aGlsc3QgYnVpbGRpbmcgQ1NTIHN5c3RlbXMgYW5kIGZyYW1ld29ya3MuPC9wPlxuICA8L2hlYWRlcj5cbiAgPG5hdj5cbiAgICA8dWw+XG4gICAgICA8bGk+XG4gICAgICAgIDxhIGhyZWY9XCIjZW1iZWRkZWRcIj5FbWJlZGRlZCBjb250ZW50PC9hPlxuICAgICAgICA8dWw+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2ltYWdlc1wiPkltYWdlczwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19iZ2ltYWdlc1wiPkJhY2tncm91bmQgaW1hZ2VzPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2F1ZGlvXCI+QXVkaW88L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fdmlkZW9cIj5WaWRlbzwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19jYW52YXNcIj5DYW52YXM8L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fbWV0ZXJcIj5NZXRlcjwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19wcm9ncmVzc1wiPlByb2dyZXNzPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX3N2Z1wiPklubGluZSBTVkc8L2E+PC9saT5cbiAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9faWZyYW1lXCI+SUZyYW1lczwvYT48L2xpPlxuICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19lbWJlZFwiPkVtYmVkPC9hPjwvbGk+XG4gICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX29iamVjdFwiPk9iamVjdDwvYT48L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICA8L25hdj5cbjwvZGl2PlxuYDtcbiIsImV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciB7XG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICBwdWJsaWMgY29sOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlcikge1xuICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50Tm9kZShub2RlOiBFbGVtZW50KTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZU5vZGUobm9kZTogQXR0cmlidXRlKTogUjtcbiAgICB2aXNpdFRleHROb2RlKG5vZGU6IFRleHQpOiBSO1xuICAgIHZpc2l0Q29tbWVudE5vZGUobm9kZTogQ29tbWVudCk6IFI7XG4gICAgdmlzaXREb2N0eXBlTm9kZShub2RlOiBEb2N0eXBlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBOb2RlW107XG4gICAgcHVibGljIHNlbGY6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IE5vZGVbXSwgY2hpbGRyZW46IE5vZGVbXSwgc2VsZjogYm9vbGVhbiwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5zZWxmID0gc2VsZjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudE5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZU5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHROb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudE5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlTm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFyID49IFwiMFwiICYmIGNoYXIgPD0gXCI5XCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgY29uc3QgV2hpdGVTcGFjZXMgPSBbXCIgXCIsIFwiXFxuXCIsIFwiXFx0XCIsIFwiXFxyXCJdIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xuICBcImFyZWFcIixcbiAgXCJiYXNlXCIsXG4gIFwiYnJcIixcbiAgXCJjb2xcIixcbiAgXCJlbWJlZFwiLFxuICBcImhyXCIsXG4gIFwiaW1nXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJsaW5rXCIsXG4gIFwibWV0YVwiLFxuICBcInBhcmFtXCIsXG4gIFwic291cmNlXCIsXG4gIFwidHJhY2tcIixcbiAgXCJ3YnJcIixcbl07XG4iLCJpbXBvcnQgKiBhcyBLTm9kZSBmcm9tIFwiQGthc3Blci90eXBlcy9ub2Rlc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdlciBpbXBsZW1lbnRzIEtOb2RlLk5vZGVWaXNpdG9yPHN0cmluZz4ge1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgZXZhbHVhdGUobm9kZTogS05vZGUuTm9kZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbm9kZS5hY2NlcHQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdHJhbnNwaWxlKG5vZGVzOiBLTm9kZS5Ob2RlW10pOiBzdHJpbmdbXSB7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmV2YWx1YXRlKG5vZGUpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZX1gKTtcclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGAke2V9YCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwMCkge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcIkVycm9yIGxpbWl0IGV4Y2VlZGVkXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRFbGVtZW50Tm9kZShub2RlOiBLTm9kZS5FbGVtZW50KTogc3RyaW5nIHtcclxuICAgIGxldCBhdHRycyA9IG5vZGUuYXR0cmlidXRlcy5tYXAoKGF0dHIpID0+IHRoaXMuZXZhbHVhdGUoYXR0cikpLmpvaW4oXCIgXCIpO1xyXG4gICAgaWYgKGF0dHJzLmxlbmd0aCkge1xyXG4gICAgICBhdHRycyA9IFwiIFwiICsgYXR0cnM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vZGUuc2VsZikge1xyXG4gICAgICByZXR1cm4gYDwke25vZGUubmFtZX0ke2F0dHJzfS8+YDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4ubWFwKChlbG0pID0+IHRoaXMuZXZhbHVhdGUoZWxtKSkuam9pbihcIlwiKTtcclxuICAgIHJldHVybiBgPCR7bm9kZS5uYW1lfSR7YXR0cnN9PiR7Y2hpbGRyZW59PC8ke25vZGUubmFtZX0+YDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB2aXNpdEF0dHJpYnV0ZU5vZGUobm9kZTogS05vZGUuQXR0cmlidXRlKTogc3RyaW5nIHtcclxuICAgIGlmIChub2RlLnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBgJHtub2RlLm5hbWV9PVwiJHtub2RlLnZhbHVlfVwiYDtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLm5hbWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdmlzaXRUZXh0Tm9kZShub2RlOiBLTm9kZS5UZXh0KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBub2RlLnZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0Q29tbWVudE5vZGUobm9kZTogS05vZGUuQ29tbWVudCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhLS0gJHtub2RlLnZhbHVlfSAtLT5gO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZpc2l0RG9jdHlwZU5vZGUobm9kZTogS05vZGUuRG9jdHlwZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYDwhZG9jdHlwZSAke25vZGUudmFsdWV9PmA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJ1bnRpbWUgRXJyb3IgPT4gJHttZXNzYWdlfWApO1xyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9